import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { subjectService } from '../../services/subjectService'
import { BookOpen, GraduationCap } from 'lucide-react'

export const StudentDashboard = () => {
  const [enrolledSubjects, setEnrolledSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrolledSubjects()
  }, [])

  const fetchEnrolledSubjects = async () => {
    try {
      const response = await subjectService.getEnrolledSubjects()
      setEnrolledSubjects(response.data || [])
    } catch (error) {
      console.error('Error fetching enrolled subjects:', error)
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">Your enrolled subjects and materials</p>
          </div>
          <Link to="/student/subjects">
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Subjects
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enrolledSubjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle>{subject.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Standard: {subject.standard}
                </p>
                <Link to={`/student/subjects/${subject.id}/materials`}>
                  <Button variant="outline" className="w-full">
                    View Materials
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {enrolledSubjects.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No enrolled subjects yet</p>
              <Link to="/student/subjects">
                <Button>Browse Subjects</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

