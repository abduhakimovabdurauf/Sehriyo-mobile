// src/store/useFinalGrades.ts
import { create } from 'zustand';
import { FinalGradesResponse } from '../types/finalGrades';
import { useAuthStore } from './useAuthStore';
interface FinalGradesState {
  data: FinalGradesResponse | null;
  loading: boolean;
  error: string | null;
  yearId: string;
  setYearId: (yearId: string) => void;
  fetchFinalGrades: (token: string, childId: number, yearId: string) => Promise<void>;
}

export const useFinalGradesStore = create<FinalGradesState>((set) => ({
  data: null,
  loading: false,
  error: null,
  yearId: '',

  setYearId: (yearId) => set({ yearId }),

  fetchFinalGrades: async (token, childId, yearId) => {
    set({ loading: true, error: null });
    try {
      const { clearAuth, user, role } = useAuthStore.getState();
      let userId = user?.id;
      let userRole= role;
      const baseUrl = process.env.EXPO_PUBLIC_API_URL || '';
      let endpoint = '';

      if (userRole === 'parent') {
        endpoint = `${baseUrl}/api/web/groups/finals?student_id=${childId}&academic_year_id=${yearId}`;
      } else if (userRole === 'student') {
        endpoint = `${baseUrl}/api/web/groups/finals?student_id=${userId}&academic_year_id=${yearId}`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (response.status === 401) {
        clearAuth();
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      set({ data: result });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
