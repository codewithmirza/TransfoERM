import type { DateRange } from '@/types/hr';

export interface EmployeeData {
  performance: any[];
  attendance: any[];
  projects: any[];
}

export async function fetchEmployeeData(employeeId: string, period: DateRange): Promise<EmployeeData> {
  // TODO: Implement actual data fetching from API
  return {
    performance: [],
    attendance: [],
    projects: []
  };
} 