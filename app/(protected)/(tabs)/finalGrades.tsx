import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useFinalGradesStore } from "@/store/useFinalGrades";
import { useAuthStore } from "@/store/useAuthStore";
import { useChildrenStore } from "@/store/useChildrenStore";
import { useAcademicYearsStore } from "@/store/useAcademicYears";
import { SubjectGradeCard } from "@/components/SubjectGradeCard";
const FinalGradesScreen = () => {
  const { data, yearId, setYearId, fetchFinalGrades, loading, error } =
    useFinalGradesStore();

  const { token, user, role } = useAuthStore();
  const { selectedChild } = useChildrenStore();
  const { academicYears, fetchAcademicYears, academicYearLoading } =
    useAcademicYearsStore();

  const lastRequestRef = useRef<string>("");

  const subjects = data?.grades_data || [];

  useEffect(() => {
    if (token) {
      fetchAcademicYears(token);
    }
  }, [token]);
  
  useEffect(() => {
    if (!academicYearLoading && academicYears?.data?.length) {
      const latestYear = academicYears.data.slice().reverse()[0];
      if (latestYear?.id) {
        setYearId(String(latestYear.id));
      }
    }
  }, [academicYears, academicYearLoading, setYearId]);

  useEffect(() => {
    if (!token || !yearId) return;

    let childId = user?.id || 0;
    if (role === "parent" && selectedChild) {
      childId = selectedChild.id;
    }
    
    const requestKey = `${token}-${childId}-${yearId}`;

    if (lastRequestRef.current !== requestKey) {
      lastRequestRef.current = requestKey;
      fetchFinalGrades(token, childId, yearId);
    }
  }, [token, user, role, selectedChild, yearId]);

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Итоговые оценки</Text>

      {/* Year select */}
      <View style={styles.selectRow}>
        <Text style={styles.label}>Учебный год</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={yearId}
            onValueChange={(value) => setYearId(String(value))}
          >
            {academicYears?.data
              ?.slice()
              .reverse()
              .map((year: any) => {
                const startYear = new Date(year.start).getFullYear();
                const endYear = new Date(year.end).getFullYear();

                return (
                  <Picker.Item
                    key={year.id}
                    label={`${startYear}–${endYear}`}
                    value={String(year.id)}
                  />
                );
              })}
          </Picker>
        </View>
      </View>

      {/* Content */}
      {loading && <Text style={styles.infoText}>Загрузка...</Text>}

      {error && <Text style={styles.errorText}>Ошибка: {error}</Text>}

      {!loading && !error && subjects.length === 0 && (
        <Text style={styles.emptyText}>Итоговые оценки не найдены.</Text>
      )}

      <View style={styles.cardContainer}>
        {!loading &&
          !error &&
          subjects.length > 0 &&
          subjects.map((gradeData, index) => (
            <SubjectGradeCard
              key={index}
              subject={gradeData.subject}
              number={index + 1}
              quarters={[
                gradeData.quarter1 ?? "-",
                gradeData.quarter2 ?? "-",
                gradeData.quarter3 ?? "-",
                gradeData.quarter4 ?? "-",
              ]}
              yearGrade={gradeData.yearly ?? "-"}
              examGrade={gradeData.exam ?? "-"}
              finalGrade={gradeData.final ?? "-"}
            />
          ))}
      </View>
    </ScrollView>
  );
};

export default FinalGradesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },

  cardContainer: {
    gap: 6
  },

  selectRow: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
  },

  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
  },

  infoText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },

  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "#777",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  subjectTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  row: {
    fontSize: 14,
    marginBottom: 4,
  },

  finalGrade: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
  },
});
