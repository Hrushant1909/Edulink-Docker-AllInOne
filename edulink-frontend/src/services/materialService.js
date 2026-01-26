import api from './api'

export const materialService = {
  // Teacher endpoints
  uploadMaterial: async (subjectId, title, file) => {
    const formData = new FormData()
    formData.append('subjectId', subjectId)
    formData.append('title', title)
    formData.append('file', file)

    const response = await api.post('/api/teacher/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getTeacherMaterials: async (subjectId) => {
    const response = await api.get(`/api/teacher/materials/${subjectId}`)
    return response.data
  },

  // Student endpoints
  getStudentMaterials: async (subjectId) => {
    const response = await api.get(`/api/student/materials/${subjectId}`)
    return response.data
  },

  downloadMaterial: async (materialId) => {
    const response = await api.get(`/api/student/materials/download/${materialId}`, {
      responseType: 'blob',
    })
    return response.data
  },
}

