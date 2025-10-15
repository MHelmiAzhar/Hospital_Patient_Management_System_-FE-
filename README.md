# Appointment Management System - Frontend

Frontend application for Appointment Management System built with React, Vite, and TailwindCSS.

## 🚀 Features

### Admin Dashboard

- Manage patients (create, read, update, delete)
- Manage doctors (create, read, update, delete)
- Manage appointments (create, read, update, delete)
- View all users in the system
- Filter appointments by date and status

### Doctor Dashboard

- View appointments with patients
- Approve or reject appointment requests
- Filter appointments by date and status
- Pagination support

### Patient Dashboard

- View appointment history
- Create new appointments
- Edit scheduled/rejected appointments
- Delete appointments
- Filter by date and status

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **React Router v7** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **TailwindCSS 4** - Styling
- **Lucide React** - Icons
- **React Secure Storage** - Secure local storage

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see `be` folder)

## 🔧 Installation

1. Navigate to the frontend directory:

```bash
cd fe
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (if needed):
   Create a `.env` file in the `fe` directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SECURE_LOCAL_STORAGE_HASH_KEY=your_secret_key
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
fe/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── features/          # Feature-based modules
│   │   ├── auth/          # Authentication (login, register)
│   │   │   ├── api/       # Auth API calls
│   │   │   ├── components/# Auth components
│   │   │   ├── hooks/     # Auth custom hooks
│   │   │   ├── pages/     # Auth pages
│   │   │   └── utils/     # Auth utilities (schemas)
│   │   ├── landingAdmin/  # Admin dashboard
│   │   │   ├── api/       # Admin API calls
│   │   │   ├── components/# Admin components
│   │   │   ├── hooks/     # Admin custom hooks
│   │   │   ├── pages/     # Admin pages
│   │   │   └── utils/     # Admin utilities
│   │   ├── landingDoctor/ # Doctor dashboard
│   │   └── landingPatient/# Patient dashboard
│   ├── shared/            # Shared resources
│   │   ├── api/           # Shared API utilities
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Shared custom hooks
│   │   ├── pages/         # Shared pages
│   │   └── utils/         # Utilities (axios config)
│   ├── index.css          # Global styles
│   ├── main.jsx           # App entry point
│   └── router.jsx         # Route definitions
├── .gitignore
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies
├── README.md              # This file
└── vite.config.js         # Vite configuration
```

## 🔐 User Roles

### Admin

- Full access to manage patients, doctors, and appointments
- Can view all system users

### Doctor

- View appointments
- Approve/Reject appointment requests
- Cannot edit patient information

### Patient

- View own appointment history
- Create new appointments
- Edit/Delete own appointments (only scheduled/rejected)

## 🎯 Key Features Implementation

### Protected Routes

Routes are protected based on user roles using `ProtectedRoute` component.

### State Management

- **TanStack Query** for server state (appointments, patients, doctors)
- **React Secure Storage** for authentication tokens

### Form Validation

- **React Hook Form** for form state management
- **Zod** schemas for validation rules

### API Integration

- Centralized Axios instance with interceptors
- Automatic token injection for authenticated requests
- Error handling with custom error classes

## 🌐 Available Routes

### Public Routes

- `/` - Landing page
- `/login-admin` - Admin login
- `/login-doctor` - Doctor login
- `/login-patient` - Patient login
- `register-patient` - Patient registration

### Protected Routes (Admin)

- `/dashboard-admin` - Admin dashboard
- `/dashboard-admin/create/patient` - Create patient
- `/dashboard-admin/edit/:id/patient` - Edit patient
- `/dashboard-admin/create/doctor` - Create doctor
- `/dashboard-admin/edit/:id/doctor` - Edit doctor
- `/dashboard-admin/create/:id/appointment` - Create appointment
- `/dashboard-admin/edit/:id/appointment` - Edit appointment

### Protected Routes (Doctor)

- `/dashboard-doctor` - Doctor dashboard

### Protected Routes (Patient)

- `/dashboard-patient` - Patient dashboard

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, you can specify a different port:

```bash
npm run dev -- --port 3000
```

### API Connection Issues

Make sure the backend server is running and the API URL is correctly configured.

### Build Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development Guidelines

### Code Style

- Follow ESLint rules
- Use functional components with hooks
- Organize code by feature, not by type
- Keep components small and focused

### Naming Conventions

- Components: PascalCase (e.g., `AppointmentTable.jsx`)
- Hooks: camelCase with "use" prefix (e.g., `useGetAllAppointments.js`)
- API functions: camelCase (e.g., `getAllAppointments.js`)
- Utils: camelCase (e.g., `axios.js`)

### State Management

- Use TanStack Query for server state
- Use React hooks (useState, useReducer) for local state
- Avoid prop drilling - use context when needed

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Test your changes
5. Submit a pull request

## 📄 License

Private - Siloam Hospital Interview Project

## 👥 Authors

- Frontend Developer - Appointment Management System

## 📞 Support

For issues and questions, please contact the development team.
