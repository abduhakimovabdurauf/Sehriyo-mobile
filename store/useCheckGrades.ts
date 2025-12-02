// src/store/useCheckGrades.ts
import { create } from "zustand";
import Constants from "expo-constants";
import { useGradebookDayStore } from "./useGradebookDayStore";
import { useAuthStore } from "./useAuthStore";
import { router } from "expo-router";
// import { NATIVE_API_URL } from '@env';

interface CheckGradesState {
  data: any | null;
  loading: boolean;
  error: string | null;
  checkGrades: (
    token: string,
    grade_ids: number[],
    childId: number,
    selectedDate: string
  ) => Promise<void>;
}

export const useCheckGradeStore = create<CheckGradesState>((set) => ({
  data: null,
  loading: false,
  error: null,

  checkGrades: async (token, grade_ids, childId, selectedDate) => {
    set({ loading: true, error: null });

    try {
      const baseUrl = process.env.NATIVE_API_URL || "https://dev.sehriyo.uz";

      const endpoint = `${baseUrl}/api/web/check-grades`;

      const { clearAuth } = useAuthStore.getState();

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ grade_ids }),
      });

      const result = await response.json();

      // 401 → token muddati o‘tgan
      if (response.status === 401) {
        clearAuth();
        router.replace("/login"); // RN uchun mos
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Не удалось подтвердить оценки");
      }

      // store ichiga yozamiz
      set({ data: result });

      // mavjud kun ma’lumotlarini tozalaymiz
      useGradebookDayStore.setState({ data: null });

      // yangilangan ma’lumotni qayta chaqiramiz
      await useGradebookDayStore
        .getState()
        .fetchGradebookDay(Number(childId), String(selectedDate));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
