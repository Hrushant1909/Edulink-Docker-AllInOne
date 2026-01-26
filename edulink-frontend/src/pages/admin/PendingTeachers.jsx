import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { EmptyState } from '../../components/EmptyState'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'
import { Check, X } from 'lucide-react'

export const PendingTeachers = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await adminService.getPendingTeachers()
      setTeachers(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch pending teachers')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    const teacher = teachers.find(t => t.id === id)
    const teacherName = teacher?.name || 'Teacher'
    
    if (!window.confirm('Are you sure you want to approve this teacher?')) {
      return
    }
    
    try {
      const response = await adminService.approveTeacher(id)
      toast.success(
        `Teacher approved successfully! An approval email has been sent to ${teacherName}.`,
        {
          duration: 5000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
        }
      )
      fetchTeachers()
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to approve teacher'
      toast.error(errorMsg)
      console.error('Error approving teacher:', error)
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this teacher?')) {
      return
    }
    
    try {
      const response = await adminService.rejectTeacher(id)
      toast.success(response.message || 'Teacher rejected')
      fetchTeachers()
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to reject teacher'
      toast.error(errorMsg)
      console.error('Error rejecting teacher:', error)
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
        <div>
          <h1 className="text-3xl font-bold">Pending Teachers</h1>
          <p className="text-muted-foreground">Review and approve teacher registrations</p>
        </div>

        {teachers.length === 0 ? (
          <EmptyState message="No pending teachers" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.id}</TableCell>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          {teacher.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(teacher.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(teacher.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
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

