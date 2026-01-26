import { useAuth } from '../context/AuthContext'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { User } from 'lucide-react'

export const Profile = () => {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>User Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <p className="text-lg">{user.email}</p>
                </div>
                {user.name && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Name:</span>
                    <p className="text-lg">{user.name}</p>
                  </div>
                )}
                {user.role && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Role:</span>
                    <p className="text-lg">{user.role}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No user information available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

