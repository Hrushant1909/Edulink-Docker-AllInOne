import api from './api'

export const adminService = {
  getPendingTeachers: async () => {
    const response = await api.get('/api/admin/teachers/pending')
    return response.data
  },

  approveTeacher: async (id) => {
    const response = await api.put(`/api/admin/teacher/approve/${id}`)
    return response.data
  },

  rejectTeacher: async (id) => {
    const response = await api.put(`/api/admin/teacher/reject/${id}`)
    return response.data
  },

  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard/stats')
    return response.data
  },
}

