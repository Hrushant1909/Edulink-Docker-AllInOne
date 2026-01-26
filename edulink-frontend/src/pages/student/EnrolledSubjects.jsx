import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { EmptyState } from '../../components/EmptyState'
import { subjectService } from '../../services/subjectService'
import { FileText, BookOpen, MessageSquare } from 'lucide-react'

export const EnrolledSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrolledSubjects()
  }, [])

  const fetchEnrolledSubjects = async () => {
    try {
      const response = await subjectService.getEnrolledSubjects()
      setSubjects(response.data || [])
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
            <h1 className="text-3xl font-bold">My Enrollments</h1>
            <p className="text-muted-foreground">Subjects you are enrolled in</p>
          </div>
          <Link to="/student/subjects">
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Browse More
            </Button>
          </Link>
        </div>

        {subjects.length === 0 ? (
          <EmptyState message="You haven't enrolled in any subjects yet" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.standard}</TableCell>
                      <TableCell className="space-x-2">
                        <Link to={`/student/subjects/${subject.id}/materials`}>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Materials
                          </Button>
                        </Link>
                        <Link to={`/student/subjects/${subject.id}/chat`}>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

