// User types
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  apps: string[];
  createdAt: string;
  updatedAt: string;
  addedBy: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserInput {
  username: string;
  password: string;
  role: 'admin' | 'user';
  apps?: string[];
}

// Application types
export interface Application {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  admin: string;
}

export interface CreateApplicationInput {
  name: string;
}

// Log types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface Log {
  id: string;
  level: LogLevel;
  pid: string;
  hostname: string;
  ts: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  appId: string;
}

export interface LogFilters {
  appId?: string;
  level?: LogLevel;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
}
