// app/(protected)/(tabs)/grades.tsx

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { GradesTable } from "@/components/GradesTable";
import { GradesCountTable } from "@/components/GradesCountTable";
import { useAllGradesStore } from "@/store/useAllGrades";
import { useAuthStore } from "@/store/useAuthStore";
import { useChildrenStore } from "@/store/useChildrenStore";
import { useAcademicYearsStore } from "@/store/useAcademicYears";

const Grades = () => {
  const {
    data,
    yearId,
    quarterId,
    loading,
    subjects,
    fetchAllGrades,
    setYearId,
    setQuarterId,
  } = useAllGradesStore();

  const { token, user, role } = useAuthStore();
  const { selectedChild } = useChildrenStore();
  const { academicYears, fetchAcademicYears, academicYearLoading } =
    useAcademicYearsStore();

  const lastRequestRef = useRef<string>("");

  useEffect(() => {
    if (token) fetchAcademicYears(token);
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

    const id = role === "parent" ? selectedChild?.id : user?.id;
    if (!id) return;

    const requestKey = `${token}-${id}-${yearId}-${quarterId}`;
    if (lastRequestRef.current === requestKey) return;

    lastRequestRef.current = requestKey;
    fetchAllGrades(token, id, yearId, quarterId);
  }, [token, role, user?.id, selectedChild?.id, yearId, quarterId]);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={styles.title}>Итоговые оценки</Text>
      <View style={styles.grid}>
        {/* Учебный год */}
        <View style={styles.column}>
          <Text style={styles.label}>Учебный год</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={yearId ?? ""}
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

        {/* Четверть */}
        <View style={styles.column}>
          <Text style={styles.label}>Четверть</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={quarterId ? String(quarterId) : "1"}
              onValueChange={(value) => setQuarterId(Number(value))}
            >
              <Picker.Item label="Четверть I" value="1" />
              <Picker.Item label="Четверть II" value="2" />
              <Picker.Item label="Четверть III" value="3" />
              <Picker.Item label="Четверть IV" value="4" />
            </Picker>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <Text style={styles.loaderText}>Загрузка данных...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <GradesTable subjects={subjects} />

          <View style={styles.countSection}>
            <Text style={styles.sectionTitle}>Количество оценок</Text>
            <GradesCountTable subjects={subjects} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Grades;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  pickerWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },
  loader: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  content: {
    gap: 16,
  },
  countSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
});
