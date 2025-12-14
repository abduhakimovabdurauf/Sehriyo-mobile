// src/store/useAcademicYears.ts
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
interface GradebookDayState {
  academicYears: data;
  academicYearLoading: boolean;
  error: string | null;
  fetchAcademicYears: (token: string) => Promise<void>;
}

export interface AcademicYear {
  id: number;
  name: string;
  start: string;
  end: string;
  label: string;
}

export interface data {
  data: AcademicYear[];
}

export const useAcademicYearsStore = create<GradebookDayState>((set) => ({
  academicYears: {
    data: [],
  },
  academicYearLoading: false,
  error: null,

  fetchAcademicYears: async (token) => {
    set({ academicYearLoading: true, error: null });
    try {
      const { clearAuth } = useAuthStore.getState();

      const baseUrl = process.env.EXPO_PUBLIC_API_URL || '';

      let endpoint = `${baseUrl}/api/academic-years`;

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
        throw new Error('Failed to fetch academicYears');
      }

      const result = await response.json();
      if (Array.isArray(result.dates)) {
        result.dates.sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());
      }
      set({ academicYears: result });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ academicYearLoading: false });
    }
  },
}));
