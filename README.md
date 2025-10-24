# Backoffice Application

A full-featured backoffice application built with Angular 19 and Node.js/Express, featuring user management, company management, approval workflows, and role-based access control.

## Features

### Frontend (Angular 19)
- 🎨 Material Design UI with responsive layout
- 👥 User and Company management with CRUD operations
- 📝 Modal-based forms for creating/editing entities
- ✅ Approval workflow system (pending/approved/rejected)
- 🔐 Complete authentication system (login, register, forgot password)
- 👮 Role-based access control (Admin, Manager, Developer, Viewer)
- 🔑 Password reset functionality
- 📜 Timeline-based history drawer showing all changes
- 🎯 Standalone components architecture

### Backend (Node.js/Express)
- 🚀 RESTful API with Express
- 💾 SQLite database with Sequelize ORM
- 🔒 JWT-based authentication with bcrypt password hashing
- 🛡️ Role-based authorization middleware
- 📊 Approval workflow with change tracking
- 🔄 CRUD endpoints for Users and Companies
- 📝 Change history tracking per entity
- 🌱 Database seeding scripts for test users

## Technology Stack

**Frontend:**
- Angular 19
- Angular Material
- RxJS
- TypeScript

**Backend:**
- Node.js
- Express.js
- SQLite
- Sequelize ORM
- JWT (jsonwebtoken)
- bcrypt.js

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ElizaJoao/backoffice-test.git
cd backoffice-test
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Create Test Users (Database Setup)

```bash
# Still in the backend directory
npm run create-admins
```

This will create the following test users:

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@example.com | admin123 | Admin | Full access (create, edit, delete) |
| manager@example.com | manager123 | Manager | View and edit (no delete) |
| developer@example.com | dev123 | Developer | View and edit (no delete) |
| viewer@example.com | viewer123 | Viewer | Read-only access |

### 5. Start the Backend Server

```bash
# In the backend directory
npm run dev
```

The backend server will start on `http://localhost:3000`

### 6. Start the Frontend Application

```bash
# In the root directory (open a new terminal)
npm start
```

The application will open automatically at `http://localhost:4200`

## Usage

### Login
1. Navigate to `http://localhost:4200`
2. You'll be redirected to the login page
3. Use one of the test credentials above to login
4. Experience different permissions based on the role

### Features by Role

**Admin:**
- Create, edit, and delete users and companies
- Reset passwords for any user
- Approve/reject change requests
- View full history

**Manager/Developer:**
- Create and edit users and companies
- View all data
- Cannot delete entities
- Cannot reset passwords

**Viewer:**
- View-only access
- No create, edit, or delete permissions
- Can see all lists and details

### Forgot Password
If you forget your password:
1. Click "Reset password" on the login page
2. Enter your email and new password
3. Confirm the new password
4. Login with your new credentials

## Project Structure

```
backoffice-app/
├── src/                          # Frontend source code
│   ├── app/
│   │   ├── core/                # Core services, guards, interceptors
│   │   │   ├── guards/          # Auth guard
│   │   │   ├── interceptors/    # HTTP interceptor for JWT
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   └── services/        # API services
│   │   ├── features/            # Feature modules
│   │   │   ├── auth/           # Login, register, forgot password
│   │   │   ├── users/          # User management
│   │   │   ├── companies/      # Company management
│   │   │   └── approvals/      # Approval workflow
│   │   └── shared/             # Shared components
│   └── environments/           # Environment configuration
├── backend/                     # Backend source code
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth middleware
│   │   ├── models/            # Sequelize models
│   │   ├── routes/            # API routes
│   │   ├── database.js        # Database configuration
│   │   ├── server.js          # Express server setup
│   │   ├── seedUsers.js       # Update existing users script
│   │   └── createAdminUsers.js # Create test users script
│   └── database.sqlite        # SQLite database (auto-generated)
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Reset password by email
- `POST /api/auth/change-password` - Change own password (authenticated)
- `POST /api/auth/reset-password` - Admin reset user password
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/history` - Get user change history
- `POST /api/users` - Create user (requires edit permission)
- `PUT /api/users/:id` - Update user (requires edit permission)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `GET /api/companies/:id/history` - Get company change history
- `POST /api/companies` - Create company (requires edit permission)
- `PUT /api/companies/:id` - Update company (requires edit permission)
- `DELETE /api/companies/:id` - Delete company (Admin only)

### Approvals
- `GET /api/approvals/pending` - Get pending changes
- `GET /api/approvals/history` - Get all change history
- `POST /api/approvals/:id/approve` - Approve change (requires edit permission)
- `POST /api/approvals/:id/reject` - Reject change (requires edit permission)

## Security Features

- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens for session management (24-hour expiration)
- ✅ HTTP-only authentication flow
- ✅ Protected routes with authentication middleware
- ✅ Role-based authorization
- ✅ Password validation (minimum 6 characters)
- ✅ Email validation

## Development

### Frontend Development Server
```bash
npm start
```
Navigate to `http://localhost:4200`. The app will automatically reload if you change any source files.

### Backend Development Server
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

### Database Scripts

**Create test users:**
```bash
cd backend
npm run create-admins
```

**Update existing users with passwords:**
```bash
cd backend
npm run seed
```

**Reset database (Windows):**
```bash
cd backend
./resetDatabase.bat
```
This will stop Node processes and delete the database file.

## Troubleshooting

### Backend Issues

**Database locked error:**
- Stop the backend server
- Run `resetDatabase.bat` (Windows) or manually delete `backend/database.sqlite`
- Run `npm run create-admins` again

**Port already in use:**
- Change the port in `backend/src/server.js` (default: 3000)
- Update `src/environments/environment.ts` to match the new port

### Frontend Issues

**Can't access after login:**
- Make sure the backend is running on port 3000
- Check browser console for CORS errors
- Verify JWT token is being set in localStorage

**Login fails with 401:**
- Ensure you created the test users with `npm run create-admins`
- Verify the database exists in `backend/database.sqlite`

## License

This project is for demonstration purposes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Generated with Claude Code

## Acknowledgments

- Angular Material for the UI components
- Express.js for the backend framework
- Sequelize for database ORM
