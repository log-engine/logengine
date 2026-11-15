# LogEngine Admin Dashboard

Admin dashboard for managing LogEngine - a self-hosted centralized logging platform.

## Features

- **Authentication System**: Secure login with JWT-like tokens
- **Role-Based Access Control (RBAC)**: Admin and User roles with different permissions
- **Applications Management**: Create and manage applications, view API keys
- **Users Management**: Create users, assign roles, and manage application access (Admin only)
- **Log Explorer**: Advanced log filtering and search with pagination
- **Dashboard**: Real-time statistics and recent activity

## Prerequisites

- Node.js 18+ (Note: React Router 7 requires Node 20+, but works with 18 with warnings)
- Backend server running on port 8080 (default)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```bash
VITE_API_URL=http://localhost:8080
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── admin/       # Admin-specific components (Header, Sidebar)
│   └── ProtectedRoute.tsx
├── contexts/        # React contexts
│   └── AuthContext.tsx
├── layouts/         # Layout components
│   └── AdminLayout.tsx
├── lib/            # Utilities and configurations
│   └── axios.ts    # Axios instance with interceptors
├── pages/          # Page components
│   ├── Applications.tsx
│   ├── Dashboard.tsx
│   ├── LogExplorer.tsx
│   ├── Login.tsx
│   └── Users.tsx
├── services/       # API service layer
│   ├── authService.ts
│   ├── applicationService.ts
│   ├── logService.ts
│   └── userService.ts
└── types/          # TypeScript type definitions
    └── index.ts
```

## Default Credentials

The default admin credentials are set in the backend `.env` file:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
```

**⚠️ Change these credentials in production!**

## User Roles

### Admin
- Full access to all features
- Can create and manage users
- Can create applications
- Can view all logs and statistics

### User
- Can view assigned applications
- Can view logs from assigned applications
- Cannot create users or applications

## API Endpoints Used

- `POST /api/login` - User authentication
- `GET /users` - List all users (Admin only)
- `POST /users` - Create new user (Admin only)
- `GET /applications` - List applications
- `POST /applications` - Create application (Admin only)
- `GET /logs` - Get logs with filters
- `GET /logs/stats` - Get log statistics

## Features Overview

### Dashboard
- Total users count (Admin only)
- Total applications count
- Logs today count
- Error logs count
- Logs by level breakdown
- Recent logs preview

### Applications Page
- List all applications
- View API keys with copy-to-clipboard functionality
- Create new applications (Admin only)

### Users Page (Admin Only)
- List all users with roles
- Create new users
- Assign roles (admin/user)
- Assign applications to users

### Log Explorer
- Filter by application
- Filter by log level (debug, info, warn, error, fatal)
- Filter by date range (start/end date)
- Full-text search in log messages
- Pagination
- Expandable log details

## Technology Stack

- **React 19** - UI library
- **React Router 7** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **TypeScript** - Type safety
- **date-fns** - Date formatting
- **Font Awesome** - Icons

## Development Notes

- All API requests include an `Authorization: Bearer <token>` header
- Token is stored in localStorage
- Automatic redirect to login on 401 responses
- Token expires after 2 hours
- CORS should be properly configured on the backend

## Troubleshooting

### Build Errors
Make sure `index.html` exists at the project root.

### API Connection Issues
Check that:
1. Backend server is running on the correct port
2. `VITE_API_URL` in `.env` points to the correct backend URL
3. CORS is properly configured on the backend

### Authentication Issues
- Clear localStorage if experiencing login issues: `localStorage.clear()`
- Check that the backend is properly configured with database and RabbitMQ

## License

This project is part of LogEngine - see the main repository for license information.
