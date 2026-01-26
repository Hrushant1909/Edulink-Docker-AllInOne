# EduLink Frontend

A modern, production-ready React frontend for the EduLink learning management system.

## Features

- 🎨 Modern UI with Dark/Light mode support
- 🔐 Complete authentication system (Login, Signup, Protected Routes)
- 👨‍🏫 Teacher Dashboard (Create subjects, upload materials)
- 👨‍🎓 Student Dashboard (Browse subjects, enroll, download materials)
- 👨‍💼 Admin Dashboard (Manage teachers, view statistics)
- 📱 Fully responsive design
- ⚡ Built with Vite for fast development
- 🎯 TypeScript-free (Pure JSX)

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8075` (or configure in `.env`)

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Create environment file:**

```bash
cp .env.example .env
```

3. **Configure environment variables:**

Edit `.env` and set your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:8075
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   ├── layout/         # Layout components (Navbar, Sidebar, DashboardLayout)
│   └── ...             # Other components (ErrorBoundary, LoadingSpinner, etc.)
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── teacher/        # Teacher pages
│   ├── student/        # Student pages
│   └── ...             # Auth and landing pages
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx # Theme (dark/light mode)
├── services/           # API service functions
│   ├── api.js         # Axios instance with interceptors
│   ├── authService.js
│   ├── adminService.js
│   ├── subjectService.js
│   └── materialService.js
├── utils/              # Utility functions
│   └── cn.js          # Class name utility (Tailwind merge)
└── App.jsx            # Main app component with routing
```

## Authentication

The app uses JWT tokens stored in localStorage. The authentication flow:

1. User logs in → receives JWT token
2. Token is stored in localStorage
3. Token is automatically attached to API requests via axios interceptor
4. On 401 errors, user is automatically logged out and redirected to login

## User Roles

- **ADMIN**: Can view dashboard stats and approve/reject teacher registrations
- **TEACHER**: Can create subjects, upload materials, manage their classes
- **STUDENT**: Can browse subjects, enroll using enrollment keys, download materials

## API Integration

All API calls are made through service functions in the `services/` directory. The base API client (`services/api.js`) includes:

- Automatic token attachment
- Error handling
- Auto-logout on 401

## Theme System

The app supports dark and light modes. The theme preference is stored in localStorage and persists across sessions. Users can toggle the theme using the theme toggle button in the navbar.

## Protected Routes

Routes are protected using the `ProtectedRoute` component, which:
- Checks if user is authenticated
- Validates user role (if `allowedRoles` prop is provided)
- Redirects to login if not authenticated
- Shows loading spinner while checking auth state

## Contributing

1. All components must be in `.jsx` format (no TypeScript)
2. Use Tailwind CSS for styling (no inline styles)
3. Follow the existing folder structure
4. Use the provided UI components from `components/ui/`
5. Handle loading and error states appropriately

## License

MIT
