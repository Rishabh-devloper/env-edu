# EcoLearning Platform - Application Flowchart

## Overview
This flowchart illustrates the complete architecture and user flows of the EcoLearning Platform, an environmental sustainability education platform built with Next.js 15, React 19, TypeScript, and Clerk authentication.

## Main Application Flow

```mermaid
graph TD
    A[User visits app] --> B{Authenticated?}
    
    B -->|No| C[Landing Page]
    C --> D[Sign In/Sign Up]
    D --> E[Clerk Authentication]
    E --> F[Role Assignment]
    F --> G{User Role}
    
    B -->|Yes| G
    
    G -->|Student| H[Student Dashboard]
    G -->|Teacher| I[Teacher Dashboard]
    G -->|NGO| J[NGO Dashboard]
    G -->|Admin| K[Admin Dashboard]
    
    H --> L[Learning Modules]
    L --> M[Interactive Lessons]
    M --> N[Video/Infographic/Interactive Content]
    N --> O[Quiz System]
    O --> P[Gamification System]
    P --> Q[Eco-Points & Badges]
    Q --> R[Leaderboards]
    
    H --> S[Task System]
    S --> T[Real-world Assignments]
    T --> U[Upload Proof]
    U --> V[Teacher Review]
    V --> W[Approval/Feedback]
    
    I --> X[Content Management]
    X --> Y[Create Lessons]
    Y --> Z[Assign Tasks]
    Z --> AA[Monitor Progress]
    AA --> BB[Review Submissions]
    
    J --> CC[Campaign Management]
    CC --> DD[School Partnerships]
    DD --> EE[Impact Tracking]
    
    K --> FF[System Management]
    FF --> GG[User Management]
    GG --> HH[Analytics Dashboard]
    HH --> II[Content Moderation]
```

## Detailed Module Breakdown

### 1. Authentication & Authorization Flow

```mermaid
graph TD
    A[User Access] --> B[Middleware Check]
    B --> C{Route Type}
    
    C -->|Public| D[Allow Access]
    C -->|Protected| E{Authenticated?}
    
    E -->|No| F[Redirect to Sign-in]
    E -->|Yes| G[Get User Role]
    
    G --> H{Role Access Check}
    H -->|Allowed| I[Allow Access]
    H -->|Denied| J[Redirect to Role Dashboard]
    
    I --> K[Set Headers]
    K --> L[Continue to Route]
```

### 2. Student Learning Flow

```mermaid
graph TD
    A[Student Dashboard] --> B[Browse Lessons]
    B --> C[Select Lesson]
    C --> D{Prerequisites Met?}
    
    D -->|No| E[Show Required Lessons]
    D -->|Yes| F[Start Lesson]
    
    F --> G[Consume Content]
    G --> H{Content Type}
    
    H -->|Video| I[Watch Video]
    H -->|Infographic| J[View Infographic]
    H -->|Interactive| K[Interactive Content]
    
    I --> L[Take Quiz]
    J --> L
    K --> L
    
    L --> M{Quiz Score}
    M -->|Pass| N[Award Eco-Points]
    M -->|Fail| O[Retry Option]
    
    N --> P[Update Progress]
    P --> Q[Check Achievements]
    Q --> R[Award Badges]
    R --> S[Update Leaderboard]
```

### 3. Task Management Flow

```mermaid
graph TD
    A[Teacher Creates Task] --> B[Define Task Details]
    B --> C[Set Deadline]
    C --> D[Assign to Students]
    D --> E[Task Published]
    
    E --> F[Student Receives Task]
    F --> G[Complete Real-world Activity]
    G --> H[Upload Proof]
    H --> I{Proof Type}
    
    I -->|Photo| J[Photo Upload]
    I -->|Video| K[Video Upload]
    I -->|Document| L[Document Upload]
    
    J --> M[Submission Created]
    K --> M
    L --> M
    
    M --> N[Teacher Notification]
    N --> O[Teacher Review]
    O --> P{Approval Status}
    
    P -->|Approved| Q[Award Points]
    P -->|Rejected| R[Provide Feedback]
    
    Q --> S[Update Student Progress]
    R --> T[Student Resubmission]
```

### 4. Gamification System

```mermaid
graph TD
    A[User Action] --> B{Action Type}
    
    B -->|Lesson Complete| C[Award Lesson Points]
    B -->|Quiz Pass| D[Award Quiz Points]
    B -->|Task Complete| E[Award Task Points]
    B -->|Community Action| F[Award Community Points]
    
    C --> G[Add to Total Points]
    D --> G
    E --> G
    F --> G
    
    G --> H[Check Level Progression]
    H --> I{Level Up?}
    
    I -->|Yes| J[Increase Level]
    I -->|No| K[Update Progress Bar]
    
    J --> L[Check Badge Eligibility]
    K --> L
    
    L --> M{Badge Earned?}
    M -->|Yes| N[Award Badge]
    M -->|No| O[Update Profile]
    
    N --> P[Update Leaderboards]
    O --> P
    
    P --> Q{Leaderboard Type}
    Q -->|Class| R[Update Class Ranking]
    Q -->|School| S[Update School Ranking]
    Q -->|Global| T[Update Global Ranking]
```

### 5. Database Schema Relations

```mermaid
erDiagram
    USER {
        string id PK
        string email
        string firstName
        string lastName
        string role
        string schoolId FK
        string ngoId FK
        int ecoPoints
        int level
        datetime createdAt
    }
    
    SCHOOL {
        string id PK
        string name
        string address
        string city
        datetime createdAt
    }
    
    NGO {
        string id PK
        string name
        string description
        string website
        string contactEmail
        datetime createdAt
    }
    
    LESSON {
        string id PK
        string title
        string description
        string content
        string type
        string mediaUrl
        int duration
        string difficulty
        int ecoPoints
        datetime createdAt
    }
    
    QUIZ {
        string id PK
        string lessonId FK
        string title
        int timeLimit
        int passingScore
        int ecoPoints
        datetime createdAt
    }
    
    TASK {
        string id PK
        string title
        string description
        int ecoPoints
        datetime deadline
        string proofType
        string assignedBy FK
        string status
        datetime createdAt
    }
    
    BADGE {
        string id PK
        string name
        string description
        string icon
        int pointsRequired
        string category
        string rarity
    }
    
    TASK_SUBMISSION {
        string id PK
        string taskId FK
        string studentId FK
        string proofUrl
        string description
        string status
        string feedback
        datetime submittedAt
    }
    
    LEADERBOARD {
        string id PK
        string type
        string scope
        string period
        datetime updatedAt
    }
    
    USER_BADGE {
        string userId FK
        string badgeId FK
        datetime earnedAt
    }
    
    USER ||--o{ TASK_SUBMISSION : submits
    USER ||--o{ USER_BADGE : earns
    SCHOOL ||--o{ USER : contains
    NGO ||--o{ USER : contains
    LESSON ||--o{ QUIZ : has
    TASK ||--o{ TASK_SUBMISSION : receives
    BADGE ||--o{ USER_BADGE : awarded
```

## API Endpoints Structure

```mermaid
graph TD
    A[API Routes] --> B[/api/lessons]
    A --> C[/api/quizzes]
    A --> D[/api/tasks]
    A --> E[/api/badges]
    A --> F[/api/leaderboard]
    A --> G[/api/progress]
    
    B --> H[GET - Fetch Lessons]
    B --> I[POST - Create Lesson]
    
    C --> J[GET - Fetch Quizzes]
    C --> K[POST - Submit Quiz]
    
    D --> L[GET - Fetch Tasks]
    D --> M[POST - Create Task]
    D --> N[PUT - Update Submission]
    
    E --> O[GET - User Badges]
    E --> P[POST - Award Badge]
    
    F --> Q[GET - Leaderboard Data]
    
    G --> R[GET - User Progress]
    G --> S[POST - Update Progress]
```

## Technology Stack Integration

```mermaid
graph TD
    A[Frontend - Next.js 15 + React 19] --> B[Authentication - Clerk]
    A --> C[Styling - Tailwind CSS]
    A --> D[Icons - Lucide React]
    
    B --> E[Role-based Access Control]
    E --> F[Middleware Protection]
    
    A --> G[API Routes - Next.js]
    G --> H[Database - Neon PostgreSQL]
    H --> I[ORM - Drizzle]
    
    J[State Management] --> K[React Hooks]
    J --> L[Context API]
    
    M[File Structure] --> N[App Router]
    N --> O[Role-based Pages]
    O --> P[Student Pages]
    O --> Q[Teacher Pages]
    O --> R[NGO Pages]
    O --> S[Admin Pages]
```

## Key Features Integration

```mermaid
graph TD
    A[EcoLearning Platform] --> B[6 Core Modules]
    
    B --> C[Authentication Module]
    C --> C1[Multi-role Support]
    C --> C2[Session Management]
    C --> C3[Role-based Dashboards]
    
    B --> D[Content Module]
    D --> D1[Interactive Lessons]
    D --> D2[Quiz System]
    D --> D3[Progress Tracking]
    
    B --> E[Gamification Module]
    E --> E1[Eco-Points System]
    E --> E2[Badge System]
    E --> E3[Leaderboards]
    
    B --> F[Task Module]
    F --> F1[Real-world Assignments]
    F --> F2[Proof Upload]
    F --> F3[Teacher Review]
    
    B --> G[Tracking Module]
    G --> G1[Student Progress]
    G --> G2[Class Analytics]
    G --> G3[Performance Metrics]
    
    B --> H[Reward Module]
    H --> H1[Certificate Generation]
    H --> H2[Badge Allocation]
    H --> H3[Digital Rewards]
```

## Deployment & Performance

```mermaid
graph TD
    A[Development] --> B[Next.js 15 with Turbopack]
    B --> C[Local Development Server]
    
    D[Production Build] --> E[Next.js Build Process]
    E --> F[Code Splitting]
    F --> G[Image Optimization]
    G --> H[CSS Optimization]
    
    I[Deployment] --> J[Vercel - Recommended]
    I --> K[Netlify - Alternative]
    I --> L[AWS - Full-stack]
    I --> M[Docker - Containerized]
    
    N[Performance Features] --> O[Automatic Route Splitting]
    N --> P[React 19 Enhancements]
    N --> Q[Tailwind CSS Optimization]
```

---

## Summary

The EcoLearning Platform is a comprehensive environmental education system that:

1. **Supports Multiple User Roles**: Students, Teachers, NGOs, and Administrators
2. **Provides Interactive Learning**: Through lessons, quizzes, and real-world tasks
3. **Implements Gamification**: With eco-points, badges, and leaderboards
4. **Ensures Security**: Through Clerk authentication and role-based access control
5. **Tracks Progress**: With detailed analytics and monitoring systems
6. **Encourages Real Action**: Through task assignments and proof submissions

The platform uses modern web technologies (Next.js 15, React 19, TypeScript) and integrates with secure authentication (Clerk) and database services (Neon PostgreSQL) to provide a scalable, performant solution for environmental education.
