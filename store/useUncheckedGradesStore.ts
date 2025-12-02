// src/store/useUncheckedGradesStore.ts
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
// import { useRouter } from 'expo-router';
import { router } from 'expo-router';

interface UncheckedGradesResponse {
  data: any[];
}

interface UncheckedGradesState {
  unCheckedStoreData: UncheckedGradesResponse | null;
  loading: boolean;
  error: string | null;
  yearId: string;
  setYearId: (yearId: string) => void;
  fetchUncheckedGrades: (token: string, childId: number) => Promise<void>;
}

export const useUncheckedGradesStore = create<UncheckedGradesState>((set) => ({
  unCheckedStoreData: null,
  loading: false,
  error: null,
  yearId: '7',

  setYearId: (yearId) => set({ yearId }),

  fetchUncheckedGrades: async (token, childId) => {
    // const router = useRouter();
    set({ loading: true, error: null });

    try {
      const { user, role, clearAuth } = useAuthStore.getState();
      if (!user) throw new Error('User not found');

      const baseUrl = process.env.NATIVE_API_URL || 'https://dev.sehriyo.uz';
      let endpoint = '';

      if (role === 'parent') {
        endpoint = `${baseUrl}/api/unchecked-grades?student_id=${childId}`;
      } else if (role === 'student') {
        endpoint = `${baseUrl}/api/unchecked-grades?student_id=${user.id}`;
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
        // router.push('/login');
        router.replace('/login')
        // window.location='/login'
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch unchecked grades');
      }

      const result = await response.json();
      set({ unCheckedStoreData: result });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
