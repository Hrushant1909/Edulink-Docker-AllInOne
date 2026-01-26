import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    return response.data
  },

  teacherSignup: async (userData) => {
    const response = await api.post('/api/auth/teacher/signup', userData)
    return response.data
  },

  studentSignup: async (userData) => {
    const response = await api.post('/api/auth/student/signup', userData)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email })
    return response.data
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/api/auth/verify-otp', { email, otp })
    return response.data
  },

  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post('/api/auth/reset-password', {
      email,
      otp,
      newPassword,
    })
    return response.data
  },
}

