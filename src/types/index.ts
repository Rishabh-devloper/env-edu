export type UserRole = 'student' | 'teacher' | 'ngo' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  schoolId?: string
  ngoId?: string
  ecoPoints: number
  level: number
  badges: Badge[]
  createdAt: Date
  updatedAt: Date
}

export interface School {
  id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  teachers: User[]
  students: User[]
  createdAt: Date
}

export interface NGO {
  id: string
  name: string
  description: string
  website?: string
  contactEmail: string
  members: User[]
  createdAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  pointsRequired: number
  category: 'eco_action' | 'knowledge' | 'leadership' | 'community'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  type: 'video' | 'infographic' | 'interactive' | 'text'
  mediaUrl?: string
  duration: number // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  ecoPoints: number
  prerequisites: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  questions: QuizQuestion[]
  timeLimit: number // in minutes
  passingScore: number // percentage
  ecoPoints: number
  createdAt: Date
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  ecoPoints: number
}

export interface Task {
  id: string
  title: string
  description: string
  instructions: string
  ecoPoints: number
  deadline: Date
  proofType: 'photo' | 'video' | 'document'
  assignedBy: string // teacher/ngo id
  assignedTo: string[] // student ids
  submissions: TaskSubmission[]
  status: 'active' | 'completed' | 'expired'
  createdAt: Date
}

export interface TaskSubmission {
  id: string
  taskId: string
  studentId: string
  proofUrl: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  feedback?: string
  submittedAt: Date
  reviewedAt?: Date
}

export interface Leaderboard {
  id: string
  type: 'class' | 'school' | 'global' | 'ngo'
  scope: string // class id, school id, or 'global'
  entries: LeaderboardEntry[]
  period: 'daily' | 'weekly' | 'monthly' | 'all_time'
  updatedAt: Date
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  ecoPoints: number
  level: number
  badges: number
  rank: number
  avatar?: string
}

export interface Certificate {
  id: string
  userId: string
  type: 'completion' | 'achievement' | 'participation'
  title: string
  description: string
  issuedAt: Date
  validUntil?: Date
  certificateUrl: string
}
