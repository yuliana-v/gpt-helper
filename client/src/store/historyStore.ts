import { create } from 'zustand';
import type { HistoryType, DateRangeParams } from '../types/api';

interface HistoryUIState {
  // UI state
  selectedType: HistoryType | null;
  dateRange: DateRangeParams;
  searchQuery: string;
  isSearchOpen: boolean;
  selectedEntryId: string | null;
  
  // Actions
  setSelectedType: (type: HistoryType | null) => void;
  setDateRange: (range: Partial<DateRangeParams>) => void;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  setSelectedEntryId: (id: string | null) => void;
  resetFilters: () => void;
}

const initialState = {
  selectedType: null,
  dateRange: {},
  searchQuery: '',
  isSearchOpen: false,
  selectedEntryId: null,
} as const;

export const useHistoryStore = create<HistoryUIState>((set) => ({
  ...initialState,

  setSelectedType: (type: HistoryType | null) => set({ selectedType: type }),
  
  setDateRange: (range: Partial<DateRangeParams>) => set((state: HistoryUIState) => ({
    dateRange: { ...state.dateRange, ...range }
  })),
  
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  setIsSearchOpen: (isOpen: boolean) => set({ isSearchOpen: isOpen }),
  
  setSelectedEntryId: (id: string | null) => set({ selectedEntryId: id }),
  
  resetFilters: () => set({
    selectedType: null,
    dateRange: {},
    searchQuery: '',
    isSearchOpen: false,
  }),
})); 