# Neon DB + Drizzle ORM Setup Guide

## Overview

This project uses [Neon DB](https://neon.tech) (PostgreSQL) with [Drizzle ORM](https://orm.drizzle.team) for database operations. This document explains how the integration works and how to use it in your development workflow.

## Setup Steps

### 1. Dependencies

The following dependencies are already installed in this project:

```bash
# Core dependencies
npm install drizzle-orm @neondatabase/serverless

# Development dependencies
npm install -D drizzle-kit
```

### 2. Environment Variables

Create a `.env` file in the root of your project with your Neon database connection string:

```
DATABASE_URL=postgresql://username:password@your-neon-db-host/dbname
```

You can get this connection string from your Neon dashboard after creating a project.

### 3. Drizzle Configuration

The project already includes a `drizzle.config.ts` file configured for Neon:

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  strict: true,
  verbose: true,
} satisfies Config
```

### 4. Database Client

The database client is set up in `src/db/index.ts`:

```typescript
import 'server-only'
import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })
export type DbClient = typeof db
```

## Database Schema

The database schema is defined in `src/db/schema/index.ts`. It includes tables for:

- Users
- Lessons
- User Progress
- Completed Lessons
- Points Log

Each table has TypeScript types generated for type-safe operations.

## Server Actions

The project uses Next.js server actions for database operations. These are located in the `src/db/actions/` directory:

- `progress.ts` - Manage user progress, points, and completed lessons
- `lessons.ts` - CRUD operations for lessons
- `users.ts` - User management operations
- `badges.ts` - Badge management
- `analytics.ts` - User activity tracking and analytics

## Migrations

To manage database schema changes, use the following commands:

```bash
# Generate migrations based on schema changes
npm run db:generate

# Apply migrations to your database
npm run db:migrate

# View your database with Drizzle Studio
npm run db:studio
```

## Usage Example

A complete usage example is available at `src/app/examples/db-usage.tsx`. This demonstrates:

- Fetching lessons
- Getting user progress
- Adding points
- Displaying user stats

## Best Practices

1. **Use Server Actions**: Always use server actions for database operations to keep your database logic on the server.

2. **Type Safety**: Leverage the generated TypeScript types for type-safe database operations.

3. **Transactions**: Use transactions for operations that need to update multiple tables atomically.

4. **Error Handling**: Always handle database errors gracefully in your components.

5. **Environment Variables**: Never hardcode database credentials. Always use environment variables.

## Troubleshooting

- **Connection Issues**: Ensure your Neon database is active and the connection string is correct.

- **Migration Errors**: If migrations fail, check the Drizzle logs for details. You may need to manually fix conflicts.

- **Type Errors**: If you get TypeScript errors, ensure your schema types are up to date with your actual schema.

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)