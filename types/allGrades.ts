// src/types/allGrades.ts

export interface AcademicYear {
  id: number
  label: string
}

export interface Student {
  id: number
  full_name: string
}

/**
 * grades_data ichidagi har bir fan
 */
export interface AllGradesSubject {
  subject: string

  quarter1: number | null
  quarter2: number | null
  quarter3: number | null
  quarter4: number | null

  yearly: number | null
  exam: number | null
  final: number | null
  percentage: number | null

  // faqat ayrim fanlarda keladi
  quarter1_average?: number
  quarter2_average?: number
  quarter3_average?: number
  quarter4_average?: number
}

/**
 * /api/web/all-grades response
 */
export interface AllGradesResponse {
  academic_year: AcademicYear
  grades_data: AllGradesSubject[]
  academic_years: AcademicYear[]
  student: Student
}
