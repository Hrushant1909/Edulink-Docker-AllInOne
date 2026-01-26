import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  Settings,
} from 'lucide-react'

export const Sidebar = () => {
  const location = useLocation()
  const { getUserRole } = useAuth()
  const role = getUserRole()

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/teachers', label: 'Pending Teachers', icon: Users },
  ]

  const teacherLinks = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/teacher/subjects', label: 'My Subjects', icon: BookOpen },
  ]

  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/subjects', label: 'Browse Subjects', icon: BookOpen },
    { path: '/student/enrolled', label: 'My Enrollments', icon: GraduationCap },
  ]

  const links = role === 'ADMIN' 
    ? adminLinks 
    : role === 'TEACHER' 
    ? teacherLinks 
    : studentLinks

  return (
    <aside className="w-64 border-r bg-card min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.path
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

