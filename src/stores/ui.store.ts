import { create } from 'zustand';

interface UIStore {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Genre filter
  selectedGenreId: number | null;
  setSelectedGenreId: (id: number | null) => void;

  // Mobile nav
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedGenreId: null,
  setSelectedGenreId: (id) => set({ selectedGenreId: id }),

  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
}));
