// src/types/finalGrades.ts

export interface AcademicYear {
  id: number;
  label: string;
}

export interface GradeData {
  subject: string;
  quarter1: number | null;
  quarter1_average?: number | null;
  quarter2: number | null;
  quarter2_average?: number | null;
  quarter3: number | null;
  quarter3_average?: number | null;
  quarter4: number | null;
  quarter4_average?: number | null;
  exam: number | null;
  yearly: number | null;
  final: number | null;
  percentage: number | null;
}

export interface Student {
  id: number;
  full_name: string;
}

export interface FinalGradesResponse {
  academic_year: AcademicYear;
  academic_years: AcademicYear[];
  grades_data: GradeData[];
  student: Student;
}
