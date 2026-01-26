import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/layout/Navbar'

// Pages
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { ForgotPassword } from './pages/ForgotPassword'
import { VerifyOTP } from './pages/VerifyOTP'
import { ResetPassword } from './pages/ResetPassword'
import { Profile } from './pages/Profile'
import { About } from './pages/About'
import { Contact } from './pages/Contact'

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { PendingTeachers } from './pages/admin/PendingTeachers'

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard'
import { SubjectList } from './pages/teacher/SubjectList'
import { SubjectCreate } from './pages/teacher/SubjectCreate'
import { SubjectView } from './pages/teacher/SubjectView'
import { MaterialList } from './pages/teacher/MaterialList'
import { MaterialUpload } from './pages/teacher/MaterialUpload'

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard'
import { SubjectBrowse } from './pages/student/SubjectBrowse'
import { EnrolledSubjects } from './pages/student/EnrolledSubjects'
import { MaterialList as StudentMaterialList } from './pages/student/MaterialList'
import { SubjectChat } from './pages/chat/SubjectChat'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                {/* Public Routes with Global Navbar */}
                <Route element={
                  <>
                    <Navbar />
                    <Outlet />
                  </>
                }>
                  <Route path="/" element={<Landing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Route>


                {/* Protected Routes - Admin */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/teachers"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <PendingTeachers />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes - Teacher */}
                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['TEACHER']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/subjects"
                  element={
                    <ProtectedRoute allowedRoles={['TEACHER']}>
                      <SubjectList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/subjects/create"
                  element={
                    <ProtectedRoute allowedRoles={['TEACHER']}>
                      <SubjectCreate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/subjects/:id"
                  element={
                    <ProtectedRoute allowedRoles={['TEACHER']}>
                      <SubjectView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/subjects/:subjectId/materials"
                  element={
                    <ProtectedRoute allowedRoles={['TEACHER']}>
                      <MaterialList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/subjects/:subjectId/chat"
                  element={
                    <ProtectedRoute allowedRoles={['TEACHER']}>
                      <SubjectChat mode="teacher" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/subjects/:subjectId/materials/upload"
                  element={
                    <ProtectedRoute allowedRoles={['TEACHER']}>
                      <MaterialUpload />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes - Student */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/subjects"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <SubjectBrowse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/enrolled"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <EnrolledSubjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/subjects/:subjectId/materials"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentMaterialList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/subjects/:subjectId/chat"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <SubjectChat mode="student" />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Route - Profile */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

