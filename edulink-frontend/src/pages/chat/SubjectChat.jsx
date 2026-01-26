import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { chatService } from '../../services/chatService'
import { subjectService } from '../../services/subjectService'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import { Circle, MessageSquare, Users } from 'lucide-react'
import SockJS from 'sockjs-client/dist/sockjs'
import { Client } from '@stomp/stompjs'

const POLL_INTERVAL_MS = 15000

export const SubjectChat = ({ mode }) => {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const { getUserRole } = useAuth()
  const [subject, setSubject] = useState(null)
  const [loadingSubject, setLoadingSubject] = useState(true)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [participants, setParticipants] = useState(null)
  const [loadingParticipants, setLoadingParticipants] = useState(true)
  const messagesEndRef = useRef(null)
  const pollingRef = useRef(null)
  const stompClientRef = useRef(null)

  const numericSubjectId = useMemo(() => parseInt(subjectId, 10), [subjectId])

  const userRole = getUserRole()

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (mode === 'teacher') {
          const response = await subjectService.getTeacherSubjects()
          const found = response.data?.find((s) => s.id === numericSubjectId)
          setSubject(found || null)
        } else {
          const response = await subjectService.getEnrolledSubjects()
          const found = response.data?.find((s) => s.id === numericSubjectId)
          setSubject(found || null)
        }
      } catch (error) {
        console.error('Error fetching subject for chat:', error)
      } finally {
        setLoadingSubject(false)
      }
    }

    fetchSubject()
  }, [mode, numericSubjectId])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingMessages(true)
        setLoadingParticipants(true)

        await Promise.all([
          chatService.pingPresence(numericSubjectId).catch(() => {}),
          (async () => {
            const res = await chatService.getMessages(numericSubjectId)
            setMessages(res.data || [])
          })(),
          (async () => {
            const res = await chatService.getParticipants(numericSubjectId)
            setParticipants(res.data || null)
          })(),
        ])
      } catch (error) {
        console.error('Error loading chat:', error)
      } finally {
        setLoadingMessages(false)
        setLoadingParticipants(false)
      }
    }

    fetchInitialData()
  }, [numericSubjectId])

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
    scrollToBottom()
  }, [messages])

  // Lightweight polling just to keep presence fresh in DB and recover if WS misses something
  useEffect(() => {
    const startPolling = () => {
      if (pollingRef.current) return

      pollingRef.current = setInterval(async () => {
        try {
          await chatService.pingPresence(numericSubjectId).catch(() => {})
          const participantsRes = await chatService.getParticipants(numericSubjectId)
          setParticipants(participantsRes.data || null)
        } catch (error) {
          console.error('Error polling presence:', error)
        }
      }, POLL_INTERVAL_MS)
    }

    startPolling()

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [numericSubjectId])

  // WebSocket (STOMP) connection for real-time messages and presence updates
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8075'
    // SockJS expects an http/https URL; it will handle the WebSocket upgrade internally
    const wsUrl = `${baseUrl}/ws`

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: () => {},
      reconnectDelay: 5000,
    })

    client.onConnect = () => {
      // Subscribe to chat messages
      client.subscribe(`/topic/chat.${numericSubjectId}`, (message) => {
        try {
          const body = JSON.parse(message.body)
          if (!body || !body.id) return

          setMessages((prev) => {
            // Avoid duplicates (we may already have this from REST)
            if (prev.some((m) => m.id === body.id)) {
              return prev
            }
            return [...prev, body]
          })
        } catch (e) {
          console.error('Error parsing chat message from WebSocket:', e)
        }
      })

      // Subscribe to presence updates
      client.subscribe(`/topic/presence.${numericSubjectId}`, (message) => {
        try {
          const presence = JSON.parse(message.body)
          if (!presence || !presence.userId) return

          setParticipants((prev) => {
            if (!prev) return prev

            const existing = prev.participants || []
            const updatedList = [...existing]

            const idx = updatedList.findIndex((p) => p.userId === presence.userId)
            if (idx >= 0) {
              updatedList[idx] = {
                ...updatedList[idx],
                online: presence.online,
              }
            } else {
              // If not in list yet, add a minimal entry; full list will be refreshed periodically
              updatedList.push({
                userId: presence.userId,
                name: presence.userName,
                role: presence.role,
                online: presence.online,
              })
            }

            const onlineStudents = updatedList.filter(
              (p) => p.role === 'STUDENT' && p.online
            ).length

            return {
              ...prev,
              participants: updatedList,
              onlineStudents,
            }
          })
        } catch (e) {
          console.error('Error parsing presence update from WebSocket:', e)
        }
      })

      // Initial presence broadcast for this user
      client.publish({
        destination: '/app/presence.update',
        body: JSON.stringify({ subjectId: numericSubjectId }),
      })
    }

    client.activate()
    stompClientRef.current = client

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate()
        stompClientRef.current = null
      }
    }
  }, [numericSubjectId])

  const handleSend = async (e) => {
    e?.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || sending) return

    try {
      setSending(true)

      // Prefer WebSocket for real-time messaging if connected
      const client = stompClientRef.current
      if (client && client.connected) {
        client.publish({
          destination: '/app/chat.send',
          body: JSON.stringify({
            subjectId: numericSubjectId,
            content: trimmed,
          }),
        })
        setInput('')
      } else {
        // Fallback to REST API
        const res = await chatService.sendMessage(numericSubjectId, trimmed)
        const message = res.data
        if (message) {
          setMessages((prev) => [...prev, message])
          setInput('')
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const title = subject
    ? `${subject.name} - Group Chat`
    : mode === 'teacher'
      ? 'Subject Chat'
      : 'Class Chat'

  const backHref =
    mode === 'teacher' ? `/teacher/subjects/${subjectId}` : `/student/subjects/${subjectId}/materials`

  const totalStudents = participants?.totalStudents ?? 0
  const onlineStudents = participants?.onlineStudents ?? 0

  const sortedParticipants = useMemo(() => {
    if (!participants?.participants) return []
    return [...participants.participants].sort((a, b) => {
      if (a.role === b.role) return a.name.localeCompare(b.name)
      if (a.role === 'TEACHER') return -1
      if (b.role === 'TEACHER') return 1
      return a.name.localeCompare(b.name)
    })
  }, [participants])

  const showLayout = userRole === 'TEACHER' || userRole === 'STUDENT'

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask doubts and discuss with your {mode === 'teacher' ? 'students' : 'teacher and classmates'}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => navigate(backHref)}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] min-h-[70vh]">
        <Card className="flex flex-col min-h-[50vh]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold">Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-2">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <LoadingSpinner size="md" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn('flex w-full', msg.own ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm',
                        msg.own
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium text-xs opacity-90">
                          {msg.senderName || (msg.own ? 'You' : 'Unknown')}
                          {msg.senderRole === 'TEACHER' ? ' (Teacher)' : ''}
                        </span>
                        {msg.createdAt && (
                          <span className="text-[10px] opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap break-words text-[13px]">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="mt-2 flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                disabled={sending}
              />
              <Button type="submit" disabled={sending || !input.trim()}>
                {sending ? <LoadingSpinner size="sm" /> : 'Send'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="flex flex-col min-h-[50vh]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">Group Members</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">
                {totalStudents} students • {onlineStudents} online
              </span>
            </div>
            {subject && (
              <p className="mt-1 text-xs text-muted-foreground">
                Subject: <span className="font-medium">{subject.name}</span> ({subject.standard})
              </p>
            )}
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pt-0">
            {loadingParticipants ? (
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner size="md" />
              </div>
            ) : !sortedParticipants.length ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No members found.
              </div>
            ) : (
              <div className="space-y-2 max-h-full overflow-y-auto pr-1 py-2">
                {sortedParticipants.map((p) => (
                  <div
                    key={p.userId}
                    className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-xs"
                  >
                    <div>
                      <div className="font-medium">
                        {p.name || 'Unknown'}{' '}
                        {p.role === 'TEACHER' && (
                          <span className="ml-1 rounded bg-primary/10 px-1.5 py-[1px] text-[10px] font-semibold text-primary">
                            Teacher
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground capitalize">{p.role?.toLowerCase()}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Circle
                        className={cn(
                          'h-3 w-3',
                          p.online ? 'text-emerald-500 fill-emerald-500/20' : 'text-muted-foreground'
                        )}
                      />
                      <span className="text-[11px] text-muted-foreground">
                        {p.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (!showLayout) {
    return content
  }

  return <DashboardLayout>{content}</DashboardLayout>
}


