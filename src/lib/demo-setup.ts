import { assignUserRole, getAllUsersWithRoles } from '@/lib/role-assignment'
import { UserRole } from '@/types'

/**
 * Demo account configurations for Smart India Hackathon
 */
export const demoAccounts = [
  {
    email: 'admin@ecolearning.dev',
    role: 'admin' as UserRole,
    description: 'Platform Administrator - Full system access'
  },
  {
    email: 'teacher@ecolearning.dev',
    role: 'teacher' as UserRole,
    description: 'Environmental Science Teacher - Content creator and student manager'
  },
  {
    email: 'ngo@ecolearning.dev',
    role: 'ngo' as UserRole,
    description: 'Green Earth NGO - Campaign launcher and impact tracker'
  },
  {
    email: 'student@ecolearning.dev',
    role: 'student' as UserRole,
    description: 'Student Learner - Interactive learning and eco-actions'
  }
]

/**
 * Quick setup instructions for hackathon demo
 */
export const demoInstructions = `
🎯 SMART INDIA HACKATHON - DEMO SETUP GUIDE

1. **Create Test Accounts:**
   - Go to your sign-up page
   - Create accounts with the following emails:
     • admin@ecolearning.dev (choose Administrator role)
     • teacher@ecolearning.dev (choose Teacher role)  
     • ngo@ecolearning.dev (choose NGO Member role)
     • student@ecolearning.dev (choose Student role)

2. **Demo Flow:**
   - Start with Student account → Show learning journey
   - Switch to Teacher account → Show content creation
   - Switch to NGO account → Show campaign management  
   - End with Admin account → Show user management

3. **Key Features to Highlight:**
   - Role-based dashboards and permissions
   - Multi-stakeholder collaboration platform
   - Environmental impact tracking
   - Gamification and engagement features
   - Scalable user management system

4. **Demo Scenarios:**
   - Scenario 1: Student completes environmental lesson
   - Scenario 2: Teacher creates new sustainability content
   - Scenario 3: NGO launches tree-planting campaign
   - Scenario 4: Admin monitors platform-wide impact

This showcases a complete ecosystem for environmental education!
`

/**
 * Check if demo accounts need setup
 */
export async function checkDemoAccountsSetup(): Promise<{
  setupRequired: boolean
  existingAccounts: string[]
  missingRoles: UserRole[]
}> {
  try {
    const allUsers = await getAllUsersWithRoles(100, 0)
    const existingRoles = new Set(allUsers.map(u => u.role))
    const requiredRoles: UserRole[] = ['admin', 'teacher', 'ngo', 'student']
    const missingRoles = requiredRoles.filter(role => !existingRoles.has(role))
    
    return {
      setupRequired: missingRoles.length > 0,
      existingAccounts: allUsers.map(u => `${u.email} (${u.role})`),
      missingRoles
    }
  } catch (error) {
    console.error('Error checking demo accounts:', error)
    return {
      setupRequired: true,
      existingAccounts: [],
      missingRoles: ['admin', 'teacher', 'ngo', 'student']
    }
  }
}

/**
 * Generate demo data for presentations
 */
export const demoData = {
  students: [
    { name: 'Alex Johnson', points: 1420, level: 3, badges: 12 },
    { name: 'Sarah Wilson', points: 1250, level: 3, badges: 10 },
    { name: 'Mike Chen', points: 980, level: 2, badges: 8 },
    { name: 'Emma Davis', points: 850, level: 2, badges: 7 },
    { name: 'David Kim', points: 720, level: 2, badges: 6 }
  ],
  teachers: [
    { name: 'Dr. Maya Patel', lessons: 15, students: 45, avgScore: 87 },
    { name: 'Prof. John Smith', lessons: 12, students: 38, avgScore: 84 },
    { name: 'Ms. Lisa Wong', lessons: 10, students: 32, avgScore: 89 }
  ],
  ngos: [
    { 
      name: 'Green Earth Foundation', 
      campaigns: 5, 
      schools: 12, 
      impact: { trees: 500, waste: 1200, water: 5000 }
    },
    { 
      name: 'EcoWarriors Collective', 
      campaigns: 3, 
      schools: 8, 
      impact: { trees: 300, waste: 800, water: 3200 }
    }
  ],
  platformStats: {
    totalUsers: 2145,
    schools: 48,
    lessons: 156,
    campaigns: 23,
    ecoPointsEarned: 150000,
    environmentalImpact: {
      co2Reduced: 2450, // kg
      wasteReduced: 1890, // kg  
      waterSaved: 15600, // liters
      treesPlanted: 1250
    }
  }
}

/**
 * Role-based demo scenarios for presentation
 */
export const demoScenarios = {
  student: {
    title: "Student Learning Journey",
    steps: [
      "Login as student → View personalized dashboard",
      "Complete 'Climate Change Basics' lesson → Earn 50 eco-points",
      "Take sustainability quiz → Earn 'Eco Explorer' badge",
      "Submit tree-planting task with photo proof",
      "Check leaderboard ranking and compare with classmates"
    ],
    highlights: ["Gamification", "Interactive Learning", "Progress Tracking"]
  },
  teacher: {
    title: "Teacher Content Management",
    steps: [
      "Login as teacher → View class overview dashboard",
      "Create new lesson on 'Renewable Energy'",
      "Assign eco-task to students: 'Home Energy Audit'",
      "Review student submissions and provide feedback",
      "Generate class performance report"
    ],
    highlights: ["Content Creation", "Student Monitoring", "Assessment Tools"]
  },
  ngo: {
    title: "NGO Campaign Management", 
    steps: [
      "Login as NGO → View impact dashboard",
      "Launch 'School Garden Initiative' campaign",
      "Connect with 5 partner schools",
      "Track campaign progress and environmental impact",
      "Generate impact report for stakeholders"
    ],
    highlights: ["Campaign Tools", "School Partnerships", "Impact Tracking"]
  },
  admin: {
    title: "Platform Administration",
    steps: [
      "Login as admin → View system overview",
      "Monitor user activity and engagement metrics",
      "Review and approve new lesson content",
      "Manage user roles and permissions",
      "Generate platform-wide analytics report"
    ],
    highlights: ["User Management", "System Analytics", "Content Moderation"]
  }
}

/**
 * Hackathon presentation talking points
 */
export const presentationTalkingPoints = [
  {
    section: "Problem Statement",
    points: [
      "Environmental education lacks engagement and real-world impact",
      "Schools need better tools to teach sustainability",
      "NGOs struggle to connect with educational institutions",
      "No unified platform for tracking environmental learning outcomes"
    ]
  },
  {
    section: "Solution Overview",
    points: [
      "Multi-stakeholder platform connecting students, teachers, NGOs, and admins",
      "Gamified learning experience with points, badges, and leaderboards",
      "Real-world environmental tasks with proof submission",
      "Comprehensive analytics and impact tracking",
      "Role-based access control for security and personalization"
    ]
  },
  {
    section: "Technical Innovation",
    points: [
      "Enterprise-grade role-based authentication system",
      "Scalable architecture supporting multiple schools and organizations",
      "Real-time progress tracking and analytics dashboard",
      "Secure API endpoints with comprehensive permission checking",
      "Modern web technologies (Next.js 15, React 19, TypeScript)"
    ]
  },
  {
    section: "Impact & Scale",
    points: [
      "Can serve hundreds of schools and thousands of students",
      "Measurable environmental impact through tracked activities",
      "Strengthens school-NGO partnerships for sustainability",
      "Creates data-driven insights for environmental education",
      "Promotes behavior change through gamification"
    ]
  }
]
