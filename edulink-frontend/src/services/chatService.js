import api from './api'

export const chatService = {
  async getMessages(subjectId, afterId) {
    const params = {}
    if (afterId) {
      params.afterId = afterId
    }
    const response = await api.get(`/api/chat/subjects/${subjectId}/messages`, { params })
    return response.data
  },

  async sendMessage(subjectId, content) {
    const response = await api.post(`/api/chat/subjects/${subjectId}/messages`, { content })
    return response.data
  },

  async pingPresence(subjectId) {
    const response = await api.post(`/api/chat/subjects/${subjectId}/presence/ping`)
    return response.data
  },

  async getParticipants(subjectId) {
    const response = await api.get(`/api/chat/subjects/${subjectId}/participants`)
    return response.data
  },
}


