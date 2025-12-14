import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useManResultsStore } from "@/store/useManResultStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useChildrenStore } from "@/store/useChildrenStore";
import { useAcademicYearsStore } from "@/store/useAcademicYears";
import { ManSubjectCard } from "@/components/ManSubjectCard";

const ManResults = () => {
  const { data, loading, fetchManResults, setYearId, yearId } =
    useManResultsStore();
  const { token } = useAuthStore();
  const { selectedChild } = useChildrenStore();
  const { academicYears, fetchAcademicYears, academicYearLoading } =
    useAcademicYearsStore();

  const lastRequestRef = useRef<string>("");

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

    const childId = selectedChild?.id || 0;
    const requestKey = `${token}-${childId}-${yearId}`;

    if (lastRequestRef.current !== requestKey) {
      lastRequestRef.current = requestKey;
      fetchManResults(token, childId, yearId);
    }
  }, [token, selectedChild?.id, yearId]);

  const getYear = (dateString: string) => new Date(dateString).getFullYear();

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={styles.title}>Итоги Малой Академии</Text>
      <View>
        {/* Filter */}
        <View style={styles.filter}>
          <Text style={styles.label}>Учебный год</Text>

          {academicYearLoading ? (
            <Text style={styles.muted}>Загрузка...</Text>
          ) : academicYears?.data?.length ? (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={yearId}
                onValueChange={(value) => setYearId(String(value))}
              >
                {academicYears.data
                  .slice()
                  .reverse()
                  .map((year: any) => {
                    const startYear = getYear(year.start);
                    const endYear = getYear(year.end);

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
          ) : (
            <Text style={styles.muted}>Нет учебных годов</Text>
          )}
        </View>

        {/* Results */}
        {loading ? (
          <Text>Загрузка...</Text>
        ) : data?.data?.campaigns?.length ? (
          <View style={styles.list}>
            {data.data.campaigns.map((campaign: any, idx: number) => (
              <ManSubjectCard
                key={idx}
                campaignName={campaign.campaign_name}
                studentResults={campaign.student_results}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>Нет данных</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ManResults;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  filter: {
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  muted: {
    fontSize: 14,
    color: "#6b7280",
  },
  pickerWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },
  list: {
    gap: 16,
  },
});
