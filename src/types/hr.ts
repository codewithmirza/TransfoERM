export type PerformanceRating = 1 | 2 | 3 | 4 | 5

export interface BasePerformanceReview {
  id: string
  employeeId: string
  reviewerId: string
  date: string
  rating: PerformanceRating
  comments: string
  goals: ReviewGoal[]
  nextReviewDate?: string
  metadata?: Record<string, any>
}

export interface ReviewGoal {
  id: string
  description: string
  targetDate: Date
  status: 'not_started' | 'in_progress' | 'completed'
  metrics?: {
    target: number
    current: number
    unit: string
  }
}

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  startDate: string
  status: 'active' | 'inactive' | 'on_leave'
  manager?: string
  salary?: number
  skills?: string[]
  metadata?: Record<string, any>
}

export interface Department {
  id: string
  name: string
  headCount: number
  budget: number
  manager: string
  location?: string
  metadata?: Record<string, any>
}

export interface LeaveRequest {
  id: string
  employeeId: string
  startDate: string
  endDate: string
  type: 'vacation' | 'sick' | 'personal' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  approvedBy?: string
  metadata?: Record<string, any>
}

export interface PayrollData {
  employeeId: string
  period: string
  baseSalary: number
  deductions: number
  bonus?: number
  total: number
  metadata?: Record<string, any>
} 