import api from './api'

export const subjectService = {
  // Teacher endpoints
  createSubject: async (subjectData) => {
    const response = await api.post('/api/teacher/subject/create', subjectData)
    return response.data
  },

  getTeacherSubjects: async () => {
    const response = await api.get('/api/teacher/subjects')
    return response.data
  },

  // Student endpoints
  getSubjectsByStandard: async (standard) => {
    const response = await api.get(`/api/student/subjects/${standard}`)
    return response.data
  },

  enrollStudent: async (subjectId, enrollmentKey) => {
    const response = await api.post('/api/student/subjects/enroll', null, {
      params: { subjectId, enrollmentKey },
    })
    return response.data
  },

  getEnrolledSubjects: async () => {
    const response = await api.get('/api/student/subjects/enrolled')
    return response.data
  },
}

