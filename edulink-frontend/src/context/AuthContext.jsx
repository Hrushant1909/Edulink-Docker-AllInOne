import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { decodeJWT } from '../utils/jwt'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    
    if (token) {
      try {
        const decoded = decodeJWT(token)
        if (decoded && decoded.sub && decoded.role) {
          const userData = {
            email: decoded.sub, // JWT uses 'sub' for email
            role: decoded.role, // Direct role claim from backend
            name: decoded.name || null,
          }
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } else {
          // Token invalid or expired, clear it
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email)
      const response = await authService.login(email, password)
      console.log('Login response:', response)
      
      if (response && response.message === 'Login successful' && response.data) {
        const token = response.data
        localStorage.setItem('token', token)
        
        // Decode JWT token to get user info
        const decoded = decodeJWT(token)
        if (!decoded || !decoded.sub || !decoded.role) {
          console.error('Invalid token structure:', decoded)
          toast.error('Invalid token received from server')
          return { success: false, error: 'Invalid token' }
        }
        
        const userData = {
          email: decoded.sub, // Backend uses 'sub' for email
          role: decoded.role, // Backend uses 'role' claim
          name: decoded.name || null,
        }
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        
        toast.success('Login successful!')
        return { success: true }
      } else {
        const errorMsg = response?.message || 'Login failed'
        console.error('Login failed:', errorMsg, response)
        
        // Handle specific backend error messages
        if (errorMsg.includes('pending admin approval') || errorMsg.includes('pending approval')) {
          // Show a prominent warning for pending teacher
          toast.error('⏳ Account Pending Approval', {
            duration: 5000,
            style: {
              background: '#f59e0b',
              color: '#fff',
            },
            icon: '⚠️',
          })
          return { success: false, error: errorMsg, pendingApproval: true }
        } else if (errorMsg.includes('Invalid credentials') || errorMsg.includes('Invalid')) {
          toast.error('Invalid email or password. Please check your credentials.')
        } else {
          toast.error(errorMsg)
        }
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.'
      
      // Check if it's a pending teacher error (403 status)
      if (error.response?.status === 403 && message.includes('pending')) {
        toast.error('⏳ Account Pending Approval', {
          duration: 5000,
          style: {
            background: '#f59e0b',
            color: '#fff',
          },
          icon: '⚠️',
        })
        return { success: false, error: message, pendingApproval: true }
      }
      
      // Handle 401 Unauthorized specifically
      if (error.response?.status === 401) {
        toast.error('Invalid email or password. Please check your credentials.')
      } else {
        toast.error(message)
      }
      
      return { success: false, error: message }
    }
  }

  const signup = async (userData, role) => {
    try {
      const response = role === 'TEACHER' 
        ? await authService.teacherSignup({ ...userData, role: 'TEACHER' })
        : await authService.studentSignup({ ...userData, role: 'STUDENT' })
      
      if (response.message) {
        // Don't show toast for teacher signup here - handled in Signup.jsx with custom message
        if (role !== 'TEACHER') {
          toast.success(response.message || 'Signup successful!')
        }
        return { success: true }
      } else {
        toast.error(response.message || 'Signup failed')
        return { success: false, error: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    toast.success('Logged out successfully')
  }

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token')
  }

  const getUserRole = () => {
    if (user?.role) {
      return user.role
    }
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        return userData.role
      } catch (error) {
        return null
      }
    }
    // Try to decode from token
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = decodeJWT(token)
      return decoded?.role || null
    }
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated,
        getUserRole,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

