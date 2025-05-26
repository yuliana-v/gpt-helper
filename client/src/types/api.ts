import type { HistoryEntry } from '../../../server/src/db/models/HistoryModel';

// Common types
export type HistoryType = 'comment' | 'test' | 'analysis';
export type ModelType = 'phi' | 'codellama' | 'mistral';

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

// Query keys
export const queryKeys = {
  history: {
    all: ['history'] as const,
    lists: () => [...queryKeys.history.all, 'list'] as const,
    list: (filters: Partial<DateRangeParams>) => [...queryKeys.history.lists(), filters] as const,
    search: (query: string) => [...queryKeys.history.lists(), 'search', query] as const,
    byType: (type: HistoryType) => [...queryKeys.history.lists(), 'type', type] as const,
    byId: (id: string) => [...queryKeys.history.all, 'detail', id] as const,
  },
} as const; 