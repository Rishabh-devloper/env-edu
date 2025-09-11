# Role-Based Authentication Setup Guide

This guide explains how to set up and use the comprehensive role-based authentication system in your EcoLearning platform for the Smart India Hackathon.

## 🎯 Overview

The platform supports four distinct user roles:
- **Students**: Access learning content, take quizzes, submit tasks
- **Teachers**: Create content, manage students, review submissions
- **NGOs**: Launch campaigns, track impact, connect with schools
- **Admins**: Full system access, user management, analytics

## 🔧 Setup Steps

### 1. Clerk Configuration

#### In Clerk Dashboard:
1. Go to your Clerk dashboard (https://dashboard.clerk.com)
2. Navigate to **Users & Authentication** → **Private Metadata**
3. Enable private metadata to store user roles
4. Configure sign-up/sign-in flows as needed

#### Role Assignment in Clerk:
```javascript
// You can set roles via Clerk dashboard or programmatically
{
  "role": "student" // or "teacher", "ngo", "admin"
}
```

### 2. Environment Variables

Ensure your `.env.local` includes:
```bash
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (Required)
DATABASE_URL=postgresql://user:pass@host/db

# Clerk Navigation URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Initial Admin User Setup

To create your first admin user:

#### Option A: Clerk Dashboard
1. Go to your Clerk dashboard
2. Find your user in the Users section
3. Click on the user
4. In Private Metadata, add: `{ "role": "admin" }`

#### Option B: Programmatic Assignment
```typescript
import { assignUserRole } from '@/lib/role-assignment'

// Assign admin role to a user (run this once)
await assignUserRole('user_id_here', 'admin')
```

## 🛡️ How Role-Based Authentication Works

### Middleware Protection
The `src/middleware.ts` automatically:
- Redirects unauthenticated users to sign-in
- Routes users to appropriate dashboards based on roles
- Prevents unauthorized access to role-specific routes
- Passes user role information to API routes

### Route Protection Structure
```
/student/*     → Students only (+ Teachers for monitoring)
/teacher/*     → Teachers and Admins
/ngo/*         → NGOs and Admins  
/admin/*       → Admins only
/learning/*    → Students only
/gamification/* → Students only
```

### API Route Protection
All API routes are protected using the `authenticateAPI()` function:

```typescript
import { authenticateAPI, hasRoleAccess, AuthErrors } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  // Authenticate user
  const user = await authenticateAPI()
  if (!user) {
    return AuthErrors.UNAUTHORIZED()
  }

  // Check role permissions
  if (!hasRoleAccess(user.role, ['teacher', 'admin'])) {
    return AuthErrors.FORBIDDEN(['teacher', 'admin'], user.role)
  }

  // Your API logic here...
}
```

## 📱 Frontend Usage

### Using Role Hooks
```typescript
import { useUserRole } from '@/lib/auth'

function MyComponent() {
  const { role, isStudent, isTeacher, isNGO, isAdmin } = useUserRole()
  
  if (isAdmin) {
    return <AdminPanel />
  }
  
  if (isTeacher) {
    return <TeacherPanel />
  }
  
  return <StudentPanel />
}
```

### Conditional Rendering
```typescript
{isTeacher && (
  <button>Create Lesson</button>
)}

{hasRoleAccess(role, ['teacher', 'admin']) && (
  <AdminOnlyComponent />
)}
```

### Dashboard Redirects
Users are automatically redirected to their role-specific dashboard:
- Students → `/student/dashboard`
- Teachers → `/teacher/dashboard`
- NGOs → `/ngo/dashboard`
- Admins → `/admin/dashboard`

## 🔐 Permission System

### Role Hierarchy
```
Admin (4)    → Can access everything
NGO (3)      → Can access NGO features + student content
Teacher (2)  → Can access teaching features + student content  
Student (1)  → Can only access student features
```

### Permission Checking
```typescript
// Check specific roles
hasRoleAccess('teacher', ['teacher', 'admin']) // true
hasRoleAccess('student', ['teacher', 'admin']) // false

// Check hierarchy (admin can access teacher features)
hasRoleAccess('admin', 'teacher') // true
hasRoleAccess('student', 'teacher') // false
```

## 👥 Admin User Management

### API Endpoints for Admin

#### Get All Users
```bash
GET /api/admin/users?limit=50&offset=0&role=student
Authorization: Bearer <admin-user-token>
```

#### Assign Role to User
```bash
PUT /api/admin/users
Content-Type: application/json
Authorization: Bearer <admin-user-token>

{
  "userId": "user_123",
  "role": "teacher"
}
```

#### Batch Role Assignment
```bash
POST /api/admin/users
Content-Type: application/json
Authorization: Bearer <admin-user-token>

{
  "assignments": [
    { "userId": "user_1", "role": "teacher" },
    { "userId": "user_2", "role": "ngo" }
  ]
}
```

## 🎮 Demo Scenarios for Smart India Hackathon

### Scenario 1: School Setup
1. Create admin account
2. Add teachers using admin panel
3. Teachers create student accounts
4. Students access learning content

### Scenario 2: NGO Partnership
1. Admin creates NGO accounts
2. NGOs launch environmental campaigns
3. Schools participate in campaigns
4. Track impact across platform

### Scenario 3: Multi-School Network
1. Multiple schools with their own teachers
2. Shared content library
3. Inter-school competitions
4. Centralized analytics for admins

## 🚀 Testing Role-Based Access

### Test User Accounts
Create test accounts with different roles:

```bash
# Test as different roles
test-admin@ecolearning.dev    → Admin
test-teacher@ecolearning.dev  → Teacher  
test-ngo@ecolearning.dev      → NGO
test-student@ecolearning.dev  → Student
```

### Test Scenarios
1. **Student Access**: Can only access student features, redirected from admin routes
2. **Teacher Access**: Can access teaching tools, view student progress
3. **NGO Access**: Can launch campaigns, view school partnerships
4. **Admin Access**: Can manage all users, access all features

## 🔒 Security Features

### Protection Mechanisms
- **Route-level protection**: Middleware blocks unauthorized access
- **API-level protection**: Every API call validates user role
- **Component-level protection**: Frontend components check permissions
- **Database-level protection**: Server actions validate user permissions

### Security Best Practices
- Roles stored in Clerk's secure metadata system
- No client-side role manipulation possible
- All permissions validated server-side
- Automatic session management via Clerk

## 📊 Monitoring & Analytics

### Admin Dashboard Features
- User role distribution charts
- System activity monitoring
- Content approval workflows
- Platform engagement metrics

### Role-Based Analytics
- Student progress tracking
- Teacher content creation stats
- NGO campaign impact metrics
- System-wide performance monitoring

## 🎯 Smart India Hackathon Integration

### Problem Statement Alignment
This role-based system supports:
- **Educational Institution Management**: Teachers manage students
- **NGO Partnerships**: NGOs collaborate with schools
- **Scalable Architecture**: Handles multiple schools and organizations
- **Impact Tracking**: Comprehensive analytics for all stakeholders

### Demo Highlights
- **Multi-stakeholder Platform**: Shows collaboration between schools, NGOs
- **Scalable User Management**: Admin can manage hundreds of users
- **Real-time Role Switching**: Demonstrate different user experiences
- **Comprehensive Security**: Enterprise-level access control

## 🛠️ Troubleshooting

### Common Issues

#### Role Not Updating
- Check Clerk dashboard for metadata changes
- Verify user signs out and back in
- Ensure middleware is running correctly

#### Access Denied Errors
- Verify user has correct role assigned
- Check API route protection logic
- Confirm role hierarchy settings

#### Database Connection Issues
- Ensure DATABASE_URL format is correct (no quotes/semicolons)
- Verify Neon database is active
- Check network connectivity

### Debug Commands
```bash
# Check user roles via API
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/admin/users

# Test role assignment
npm run dev # Start server and check middleware logs
```

This comprehensive role-based authentication system provides enterprise-level security and user management perfect for the Smart India Hackathon demonstration!
