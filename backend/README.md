# Backoffice Backend Server

This is the backend server for the Backoffice Application with approval workflow system.

## Features

- RESTful API for Users and Companies
- Approval workflow system for all CRUD operations
- SQLite database for data persistence
- Pending changes tracking

## Getting Started

### Installation

```bash
npm install
```

### First Time Setup

If you have an old database, delete it to ensure proper schema:

```bash
# On Windows (PowerShell)
Remove-Item database.sqlite -ErrorAction SilentlyContinue

# On macOS/Linux
rm -f database.sqlite
```

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

The database will be automatically created with the proper schema including timestamps.

## API Endpoints

### Users
- `GET /api/users` - Get all approved users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/roles` - Get available roles
- `POST /api/users` - Create user (creates pending change)
- `PUT /api/users/:id` - Update user (creates pending change)
- `DELETE /api/users/:id` - Delete user (creates pending change)

### Companies
- `GET /api/companies` - Get all approved companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create company (creates pending change)
- `PUT /api/companies/:id` - Update company (creates pending change)
- `DELETE /api/companies/:id` - Delete company (creates pending change)

### Approvals
- `GET /api/approvals/pending` - Get all pending changes
- `GET /api/approvals/history` - Get approval history
- `POST /api/approvals/:id/approve` - Approve a pending change
- `POST /api/approvals/:id/reject` - Reject a pending change

### Health Check
- `GET /api/health` - Server health check

## Database

The application uses SQLite for data persistence. The database file is automatically created at `backend/database.sqlite`.

### Models

1. **Users** - Store user information with approval status
2. **Companies** - Store company information with approval status
3. **PendingChanges** - Track all pending changes for approval workflow

## Approval Workflow

All create, update, and delete operations create a pending change record instead of directly modifying data. These changes must be approved through the approvals interface before being applied to the actual data.
