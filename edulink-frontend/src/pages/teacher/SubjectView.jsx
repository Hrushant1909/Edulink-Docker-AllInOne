import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { subjectService } from '../../services/subjectService'
import { BookOpen, FileText, MessageSquare } from 'lucide-react'

export const SubjectView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubject()
  }, [id])

  const fetchSubject = async () => {
    try {
      const response = await subjectService.getTeacherSubjects()
      const found = response.data?.find((s) => s.id === parseInt(id))
      setSubject(found)
    } catch (error) {
      console.error('Error fetching subject:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!subject) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Subject not found</p>
            <Button onClick={() => navigate('/teacher/subjects')} className="mt-4">
              Back to Subjects
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <p className="text-muted-foreground">Subject details and materials</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/teacher/subjects/${id}/materials`)}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Materials
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Subject Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <p className="text-lg">{subject.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Standard:</span>
                <p className="text-lg">{subject.standard}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Enrollment Key:</span>
                <p className="text-lg">
                  <code className="px-2 py-1 bg-muted rounded">{subject.enrollmentKey}</code>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={() => navigate(`/teacher/subjects/${id}/materials/upload`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/teacher/subjects/${id}/chat`)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Chat
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/teacher/subjects')}
              >
                Back to Subjects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

