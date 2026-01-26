import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { materialService } from '../../services/materialService'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload } from 'lucide-react'

export const MaterialUpload = () => {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    file: null,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }))
    } else {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter material title')
      return
    }
    if (!formData.file) {
      toast.error('Please select a file')
      return
    }
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    if (formData.file.size > maxSize) {
      toast.error('File size exceeds 50MB limit')
      return
    }

    setLoading(true)

    try {
      const response = await materialService.uploadMaterial(
        subjectId,
        formData.title,
        formData.file
      )
      toast.success(response.message || 'Material uploaded successfully')
      navigate(`/teacher/subjects/${subjectId}/materials`)
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to upload material'
      toast.error(errorMsg)
      console.error('Error uploading material:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Upload Material</h1>
            <p className="text-muted-foreground">Add a new study material</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/teacher/subjects/${subjectId}/materials`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Material Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Chapter 1 Notes, Assignment 1"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  onChange={handleChange}
                  required
                  disabled={loading}
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX, TXT, PPT, PPTX (Max 50MB)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/teacher/subjects/${subjectId}/materials`)}
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

