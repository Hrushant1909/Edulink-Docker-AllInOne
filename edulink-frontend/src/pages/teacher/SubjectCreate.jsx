import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { subjectService } from '../../services/subjectService'
import toast from 'react-hot-toast'

export const SubjectCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    standard: '',
    enrollmentKey: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter subject name')
      return
    }
    if (!formData.standard.trim()) {
      toast.error('Please enter standard')
      return
    }
    if (!formData.enrollmentKey.trim()) {
      toast.error('Please enter enrollment key')
      return
    }
    
    setLoading(true)

    try {
      const response = await subjectService.createSubject(formData)
      toast.success(response.message || 'Subject created successfully')
      navigate('/teacher/subjects')
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create subject'
      toast.error(errorMsg)
      console.error('Error creating subject:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Subject</h1>
          <p className="text-muted-foreground">Add a new subject for your students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Mathematics, Science"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standard">Standard</Label>
                <Input
                  id="standard"
                  name="standard"
                  type="text"
                  placeholder="e.g., 8th, 9th, 10th"
                  value={formData.standard}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentKey">Enrollment Key</Label>
                <Input
                  id="enrollmentKey"
                  name="enrollmentKey"
                  type="text"
                  placeholder="Unique key for student enrollment"
                  value={formData.enrollmentKey}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Students will need this key to enroll in your subject
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Create Subject'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/teacher/subjects')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

