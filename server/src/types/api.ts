import { HistoryEntry } from '../db/models/HistoryModel';

// Common types
export type HistoryType = 'comment' | 'test' | 'analysis';
export type ModelType = 'gpt-3.5-turbo' | 'gpt-4' | 'claude-2';

// Request types
export interface DateRangeParams {
  from?: string;
  to?: string;
}

export interface SearchParams extends DateRangeParams {
  q: string;
}

export interface HistoryTypeParams extends DateRangeParams {
  type: HistoryType;
}

export interface HistoryIdParams {
  id: string;
}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    status: number;
    details?: unknown;
  };
}

// API Response types
export type HistoryResponse = PaginatedResponse<HistoryEntry>;
export type HistoryEntryResponse = HistoryEntry;
export type SearchResponse = PaginatedResponse<HistoryEntry>;

// Request validation types
export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Type guards
export function isValidHistoryType(type: string): type is HistoryType {
  return ['comment', 'test', 'analysis'].includes(type);
}

export function isValidModelType(type: string): type is ModelType {
  return ['gpt-3.5-turbo', 'gpt-4', 'claude-2'].includes(type);
}

export function isValidDateString(date: string): boolean {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

// Type utilities
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T; 