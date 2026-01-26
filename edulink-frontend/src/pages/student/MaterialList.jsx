import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { EmptyState } from '../../components/EmptyState'
import { materialService } from '../../services/materialService'
import toast from 'react-hot-toast'
import { Download, ArrowLeft, FileText } from 'lucide-react'

export const MaterialList = () => {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    if (subjectId) {
      fetchMaterials()
    }
  }, [subjectId])

  const fetchMaterials = async () => {
    try {
      const response = await materialService.getStudentMaterials(subjectId)
      setMaterials(response.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch materials')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (materialId, title, fileType) => {
    setDownloading(materialId)
    try {
      const blob = await materialService.downloadMaterial(materialId)
      
      // Create filename from title and file type
      const extension = fileType || 'pdf'
      const fileName = title 
        ? `${title.replace(/[^a-z0-9]/gi, '_')}.${extension}`
        : `material_${materialId}.${extension}`
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Download started')
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to download material'
      toast.error(errorMsg)
      console.error('Error downloading material:', error)
    } finally {
      setDownloading(null)
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Materials</h1>
            <p className="text-muted-foreground">Download study materials for this subject</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/student/enrolled')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {materials.length === 0 ? (
          <EmptyState message="No materials available for this subject" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Available Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{material.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{material.fileType || 'N/A'}</TableCell>
                      <TableCell>{formatDate(material.uploadDate)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(material.id, material.title, material.fileType)}
                          disabled={downloading === material.id}
                        >
                          {downloading === material.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </>
                          )}
                        </Button>
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

