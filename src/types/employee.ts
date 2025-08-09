// API Response wrapper
export interface ApiResponse<T> {
  error: string | null;
  data: T | null;
  code: number;
  state: string | null;
}

// Employee from API
export interface Employee {
  id: number;
  lastName: string;
  firstName: string;
  poste: string;
  department: string;
  email: string;
  salary: number;
  hireDate: string; // LocalDateTime format: '2024-04-27T10:15:30'
  hiringDate: string; // LocalDateTime format: '2024-04-27T10:15:30'
  enabled: boolean;
  createdAt: string; // LocalDateTime format: '2024-04-01T09:00:00'
  updatedAt: string; // LocalDateTime format: '2024-04-20T14:30:00'
}

// Form data for creating/updating employees
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  poste: string;
  department: string;
  email: string;
  hiringDate: string;
  enabled: boolean;
}

// Login request/response
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  fullName: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
  role: string;
}

export interface EmployeeFilters {
  search: string;
  poste: string | 'all';
  status: 'all' | 'enabled' | 'disabled';
}
