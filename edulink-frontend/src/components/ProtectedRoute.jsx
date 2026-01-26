import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from './LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { useNavigate } from 'react-router-dom'

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, getUserRole } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0) {
    const userRole = getUserRole()
    if (!userRole) {
      // Role not found, redirect to login
      return <Navigate to="/login" replace />
    }
    
    // Normalize role comparison (handle case sensitivity)
    const normalizedUserRole = userRole.toUpperCase()
    const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase())
    
    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      // User doesn't have required role, show access denied
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return children
}

