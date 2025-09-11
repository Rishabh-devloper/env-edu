# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

EcoLearning Platform is a comprehensive environmental sustainability education platform built with Next.js 15, React 19, TypeScript, and Clerk authentication. It features role-based access (Students, Teachers, NGOs, Admins), gamification systems, interactive lessons, and real-world environmental tasks.

## Essential Development Commands

### Development Server
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Database Operations (Drizzle + Neon)
```bash
# Generate database migrations from schema changes
npm run db:generate

# Apply pending migrations to database
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Common Development Workflows
```bash
# Full reset after schema changes
npm run db:generate && npm run db:migrate

# Check database connection and view data
npm run db:studio
```

## Architecture Overview

### Database Architecture (PostgreSQL + Drizzle ORM)
- **Primary Database**: Neon PostgreSQL with Drizzle ORM
- **Schema Location**: `src/db/schema/index.ts`
- **Database Client**: `src/db/index.ts` (server-only)
- **Server Actions**: `src/db/actions/` (progress, lessons, users, badges, analytics, quizzes)

**Key Tables**:
- `users` - Clerk user linkage and profiles
- `lessons` - Content catalog with metadata
- `userProgress` - Points, levels, badges, streaks
- `userCompletedLessons` - Lesson completion tracking
- `quizzes` & `quizAttempts` - Assessment system
- `pointsLog` - Audit trail for eco-points

### Authentication & Authorization
- **Provider**: Clerk with role-based access control
- **Middleware**: `src/middleware.ts` handles route protection
- **Roles**: student, teacher, ngo, admin
- **Context**: PointsProvider wraps the app for gamification state

### Application Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # REST API routes
│   ├── (student|teacher|ngo)/  # Role-based page groups
│   ├── dashboard/         # Main dashboard
│   ├── learning/          # Learning modules
│   ├── tasks/             # Environmental tasks
│   └── gamification/      # Points, badges, leaderboards
├── components/            # Reusable UI components
├── contexts/              # React contexts (PointsContext)
├── db/                    # Database layer
│   ├── schema/           # Drizzle schema definitions
│   └── actions/          # Server actions for DB operations
├── lib/                   # Utilities and configurations
└── types/                 # TypeScript type definitions
```

### API Architecture
All database operations use Next.js Server Actions located in `src/db/actions/`:
- **progress.ts** - User progress, points, completed lessons
- **lessons.ts** - CRUD operations for lessons
- **users.ts** - User management operations  
- **badges.ts** - Badge management
- **analytics.ts** - User activity tracking
- **quizzes.ts** - Quiz and assessment operations

## Environment Setup Requirements

### Required Environment Variables (.env.local)
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Clerk Navigation URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

**Important**: DATABASE_URL should NOT be wrapped in quotes or end with semicolons.

## Key Development Patterns

### Database Operations
- Always use Server Actions from `src/db/actions/` for database operations
- Database client (`src/db/index.ts`) is server-only - never import in client components
- Use Drizzle's type-safe operations with inferred types from schema
- All tables use varchar primary keys for Clerk compatibility

### Authentication Flow
- Clerk handles all authentication
- `middleware.ts` protects routes automatically
- Role-based access implemented through Clerk metadata
- User profiles stored in local database linked by Clerk user ID

### Gamification System
- Points awarded through `pointsLog` table for audit trail
- Progress tracked in `userProgress` table with levels, badges, streaks
- Leaderboards calculated dynamically from progress data
- Badge system uses JSON arrays in progress table

### Component Architecture
- Role-based components in respective directories
- Shared components in `src/components/`
- PointsProvider context manages gamification state
- Server Actions handle all data mutations

## Troubleshooting Common Issues

### Database Connection Errors
- Verify DATABASE_URL format (no quotes, no trailing semicolon)
- Ensure Neon database is active
- Check migration status with `npm run db:studio`

### Authentication Issues
- Verify Clerk keys in .env.local
- Check middleware configuration for protected routes
- Ensure user role is properly set in Clerk dashboard

### Build Issues
- Run `npm run lint` to check for TypeScript/ESLint errors
- Verify all imports resolve correctly
- Check for server-only imports in client components

## Project-Specific Notes

### Turbopack Usage
This project uses Turbopack for faster development builds. All npm scripts include `--turbopack` flag for optimal performance.

### Role-Based Access
- Students: lessons, quizzes, tasks, progress tracking
- Teachers: content creation, student monitoring, task review
- NGOs: campaign management, community impact tracking
- Admins: full system access, analytics, content moderation

### Gamification Features
- Eco-points system with audit logging
- Badge progression (Eco Action, Knowledge, Leadership, Community)
- Multi-level leaderboards (class, school, global)
- Streak tracking for engagement

### Database Migrations
Always generate migrations after schema changes and apply them before deploying. The schema supports complex gamification features and role-based content management.
