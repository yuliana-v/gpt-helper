import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './axios';
import {
  queryKeys
} from '../types/api';
import type {
  HistoryResponse,
  HistoryEntryResponse,
  SearchResponse,
  SearchParams,
  DateRangeParams,
  HistoryType,
} from '../types/api';

// History list query
export function useHistoryList(params?: Partial<DateRangeParams>) {
  return useQuery<HistoryResponse>({
    queryKey: queryKeys.history.list(params ?? {}),
    queryFn: async () => {
      const { data } = await api.get<HistoryResponse>('/history', { params });
      return data;
    },
  });
}

// History search query
export function useHistorySearch(params: SearchParams) {
  return useQuery<SearchResponse>({
    queryKey: queryKeys.history.search(params.q),
    queryFn: async () => {
      const { data } = await api.get<SearchResponse>('/history/search', { params });
      return data;
    },
    enabled: params.q.length >= 2,
  });
}

// History by type query
export function useHistoryByType(type: HistoryType, params?: Partial<DateRangeParams>) {
  return useQuery<HistoryResponse>({
    queryKey: queryKeys.history.byType(type),
    queryFn: async () => {
      const { data } = await api.get<HistoryResponse>(`/history/${type}`, { params });
      return data;
    },
  });
}

// History entry by ID query
export function useHistoryEntry(id: string) {
  return useQuery<HistoryEntryResponse>({
    queryKey: queryKeys.history.byId(id),
    queryFn: async () => {
      const { data } = await api.get<HistoryEntryResponse>(`/history/entry/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// Prefetch history entries
export function usePrefetchHistory() {
  const queryClient = useQueryClient();

  return {
    prefetchHistoryList: (params?: Partial<DateRangeParams>) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.history.list(params ?? {}),
        queryFn: async () => {
          const { data } = await api.get<HistoryResponse>('/history', { params });
          return data;
        },
      }),

    prefetchHistoryByType: (type: HistoryType, params?: Partial<DateRangeParams>) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.history.byType(type),
        queryFn: async () => {
          const { data } = await api.get<HistoryResponse>(`/history/${type}`, { params });
          return data;
        },
      }),
  };
} 