// src/store/useGradebookStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './useAuthStore';

interface GradebookState {
  data: any | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  selectedDate: string | null;
  fetchGradebook: (token: string, date?: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
  goToPreviousDate: () => void;
  goToNextDate: () => void;
  can_acquainted: boolean;
  setCanAcquainted: (value: boolean) => void;
}

export const useGradebookStore = create<GradebookState>()(
  persist(
    (set, get) => ({
      data: null,
      loading: false,
      loadingMore: false,
      error: null,
      selectedDate: null,
      can_acquainted: true,

      setCanAcquainted: (value) => set({ can_acquainted: value }),

      setSelectedDate: (date: string) => set({ selectedDate: date }),

      fetchGradebook: async (token, date) => {
        const isLoadMore = !!date;
        set(isLoadMore ? { loadingMore: true, error: null } : { loading: true, error: null });

        try {
          const baseUrl = process.env.VITE_API_BASE_URL || 'https://dev.sehriyo.uz';
          let endpoint = `${baseUrl}/api/web/diary`;

          if (date) {
            endpoint += `?date=${date}`;
          }

          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
          });

          if (response.status === 401) {
            useAuthStore.getState().logout(); // navigationni komponentda qilish
            return;
          }

          if (!response.ok) throw new Error('Failed to fetch data');

          const result = await response.json();

          set((state) => {
            const existingDates = state.data?.dates || [];
            const newDates = result.dates || [];

            const mergedDates = [...existingDates, ...newDates].filter(
              (date, index, self) => self.indexOf(date) === index
            );

            return {
              data: state.data ? { ...result, dates: mergedDates } : result,
              selectedDate: date ? date : mergedDates[0] || null,
            };
          });
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set(isLoadMore ? { loadingMore: false } : { loading: false });
        }
      },

      goToPreviousDate: async () => {
        const { data, selectedDate, fetchGradebook } = get();
        if (!data?.dates || !selectedDate) return;

        const currentIndex = data.dates.indexOf(selectedDate);

        if (currentIndex > 0) {
          set({ selectedDate: data.dates[currentIndex - 1] });
        } else {
          const firstDate = new Date(data.dates[0]);
          const lastFriday = new Date(firstDate);
          lastFriday.setDate(firstDate.getDate() - 3);

          const token = useAuthStore.getState().token;
          if (token) await fetchGradebook(token, lastFriday.toISOString().split('T')[0]);

          const newData = get().data;
          if (newData?.dates?.length) {
            set({ selectedDate: newData.dates[newData.dates.length - 1] });
          }
        }
      },

      goToNextDate: async () => {
        const { data, selectedDate, fetchGradebook } = get();
        if (!data?.dates || !selectedDate) return;

        const currentIndex = data.dates.indexOf(selectedDate);

        if (currentIndex < data.dates.length - 1) {
          set({ selectedDate: data.dates[currentIndex + 1] });
        } else {
          const lastDate = new Date(data.dates[data.dates.length - 1]);
          const nextMonday = new Date(lastDate);
          nextMonday.setDate(lastDate.getDate() + 3);

          const token = useAuthStore.getState().token;
          if (token) await fetchGradebook(token, nextMonday.toISOString().split('T')[0]);

          const newData = get().data;
          if (newData?.dates?.length) {
            set({ selectedDate: newData.dates[0] });
          }
        }
      },
    }),
    {
      name: 'gradebook-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedDate: state.selectedDate }),
    }
  )
);
