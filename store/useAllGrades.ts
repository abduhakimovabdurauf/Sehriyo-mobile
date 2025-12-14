// src/store/useAllGrades.ts
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import type { AllGradesResponse, AllGradesSubject } from "@/types/allGrades";

interface AllGradesState {
  data: AllGradesResponse | null;
  subjects: AllGradesSubject[] | null;
  academicYears: { id: number; label: string }[] | null;

  loading: boolean;
  error: string | null;

  yearId: string;
  quarterId: number;

  setYearId: (yearId: string) => void;
  setQuarterId: (quarterId: number) => void;

  fetchAllGrades: (
    token: string,
    childId: number,
    yearId: string,
    quarterId: number
  ) => Promise<void>;
}

export const useAllGradesStore = create<AllGradesState>((set) => ({
  data: null,
  subjects: null,
  academicYears: null,

  loading: false,
  error: null,

  yearId: "",
  quarterId: 1,

  setYearId: (yearId) => set({ yearId }),
  setQuarterId: (quarterId) => set({ quarterId }),

  fetchAllGrades: async (token, childId, yearId, quarterId) => {
    set({ loading: true, error: null });

    try {
      const { clearAuth, user, role } = useAuthStore.getState();
      const baseUrl = process.env.EXPO_PUBLIC_API_URL || "";

      const studentId = role === "parent" ? childId : user?.id;

      const endpoint = `${baseUrl}/api/web/all-grades?academic_year_id=${yearId}&quarter=${quarterId}&student_id=${studentId}`;

      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const text = await response.text();
      console.log("RAW RESPONSE:", text);

      if (response.status === 401) {
        clearAuth();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch grades, status: ${response.status}`);
      }

      const result: AllGradesResponse = JSON.parse(text);
      console.log("All Grades Parsed Response:", result);

      set({
        data: result,
        subjects: result.grades_data,
        academicYears: result.academic_years,
      });
    } catch (err: any) {
      set({ error: err.message });
      console.log("error", err);
    } finally {
      set({ loading: false });
    }
  },
}));
