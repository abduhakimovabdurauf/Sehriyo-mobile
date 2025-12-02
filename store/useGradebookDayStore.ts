// src/store/useGradebookDayStore.ts
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
// import { NATIVE_API_URL } from '@env';

interface GradebookDayState {
  data: any | null;
  loading: boolean;
  error: string | null;
  fetchGradebookDay: (childId: number | null, date: string) => Promise<void>;
}

export const useGradebookDayStore = create<GradebookDayState>((set, get) => ({
  data: null,
  loading: false,
  error: null,

  fetchGradebookDay: async (childId, selectedDate) => {
    const { token, user, role, clearAuth } = useAuthStore.getState();

    if (!token) {
      set({ error: 'Token not found' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const baseUrl = process.env.NATIVE_API_URL || 'https://dev.sehriyo.uz';
      let endpoint = '';

      if (role === 'parent') {
        if (!childId) {
          set({ error: 'childId is required for parent role' });
          set({ loading: false });
          return;
        }
        endpoint = `${baseUrl}/api/web/diary/${childId}?date=${selectedDate}`;
      } else if (role === 'student') {
        if (!user?.id) {
          set({ error: 'User ID not found' });
          set({ loading: false });
          return;
        }
        endpoint = `${baseUrl}/api/web/diary/${user.id}?date=${selectedDate}`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        clearAuth();
        // React Native da navigation orqali login sahifaga o'tish kerak
        set({ error: 'Unauthorized' });
        set({ loading: false });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      if (Array.isArray(result.dates)) {
        result.dates.sort(
          (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime()
        );
      }

      set({ data: result });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
