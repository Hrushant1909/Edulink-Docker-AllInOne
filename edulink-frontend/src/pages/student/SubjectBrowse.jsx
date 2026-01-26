import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Modal } from '../../components/ui/Modal'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { EmptyState } from '../../components/EmptyState'
import { subjectService } from '../../services/subjectService'
import toast from 'react-hot-toast'
import { BookOpen, GraduationCap } from 'lucide-react'

export const SubjectBrowse = () => {
  const { user } = useAuth()
  const [standard, setStandard] = useState('')
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [enrollModal, setEnrollModal] = useState({ open: false, subject: null })
  const [enrollmentKey, setEnrollmentKey] = useState('')
  const [enrolling, setEnrolling] = useState(false)

  const handleSearch = async () => {
    if (!standard.trim()) {
      toast.error('Please enter a standard')
      return
    }

    setLoading(true)
    try {
      const response = await subjectService.getSubjectsByStandard(standard)
      setSubjects(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch subjects')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!enrollmentKey.trim()) {
      toast.error('Please enter enrollment key')
      return
    }

    setEnrolling(true)
    try {
      const response = await subjectService.enrollStudent(
        enrollModal.subject.id,
        enrollmentKey
      )
      
      // Check response message for specific errors
      if (response.message) {
        if (response.message.includes('Invalid enrollment key')) {
          toast.error('Invalid enrollment key. Please check and try again.')
        } else if (response.message.includes('already enrolled')) {
          toast.error('You are already enrolled in this subject!')
        } else {
          toast.success(response.message)
        }
      } else {
        toast.success('Enrolled successfully')
      }
      
      setEnrollModal({ open: false, subject: null })
      setEnrollmentKey('')
      // Refresh the list
      if (standard) {
        handleSearch()
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to enroll'
      toast.error(errorMsg)
      console.error('Error enrolling:', error)
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browse Subjects</h1>
          <p className="text-muted-foreground">Search and enroll in subjects</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="standard">Standard</Label>
                <Input
                  id="standard"
                  type="text"
                  placeholder="e.g., 8th, 9th, 10th"
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <LoadingSpinner size="sm" /> : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {subjects.length === 0 && !loading ? (
          <EmptyState message="No subjects found. Try searching with a different standard." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>{subject.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Standard: {subject.standard}
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => setEnrollModal({ open: true, subject })}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Enroll
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={enrollModal.open}
          onClose={() => {
            setEnrollModal({ open: false, subject: null })
            setEnrollmentKey('')
          }}
          title={`Enroll in ${enrollModal.subject?.name}`}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enrollmentKey">Enrollment Key</Label>
              <Input
                id="enrollmentKey"
                type="text"
                placeholder="Enter enrollment key"
                value={enrollmentKey}
                onChange={(e) => setEnrollmentKey(e.target.value)}
                disabled={enrolling}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? <LoadingSpinner size="sm" /> : 'Enroll'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEnrollModal({ open: false, subject: null })
                  setEnrollmentKey('')
                }}
                disabled={enrolling}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

