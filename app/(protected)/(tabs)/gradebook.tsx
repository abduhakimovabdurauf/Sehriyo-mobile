// app/(protected)/gradebook.tsx
import React, { useEffect, useRef } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useGradebookStore } from "@/store/useGradebook";
import { useAuthStore } from "@/store/useAuthStore";
import { useChildrenStore } from "@/store/useChildrenStore";
import { useUncheckedGradesStore } from "@/store/useUncheckedGradesStore";
// import { useRouter } from 'expo-router';

export default function GradebookPage() {
  const { data, loading, error, fetchGradebook, setSelectedDate, loadingMore } =
    useGradebookStore();
  const { token } = useAuthStore();
  const { selectedChild } = useChildrenStore();
  const childId = selectedChild?.id || 0;
  const { unCheckedStoreData, fetchUncheckedGrades } =
    useUncheckedGradesStore();
  // const router = useRouter();
  const lastRequestRef = useRef<string>("");

  const groupByWeeks = (dates: string[]) => {
    const weeks: Record<number, string[]> = {};
    dates.forEach((date) => {
      const week = getWeekNumber(date);
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(date);
    });
    return weeks;
  };

  const getWeekNumber = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayOfWeek = date.getDay();
    const mondayDate = new Date(date);
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    mondayDate.setDate(date.getDate() - daysToMonday);

    const augustStart = new Date(date.getFullYear(), 7, 1);
    const diffTime = mondayDate.getTime() - augustStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 34;
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const days = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    return `${days[date.getDay()]} · ${day}.${month}.${year}`;
  };

  useEffect(() => {
    if (token) {
      const requestKey = `${token}`;
      if (lastRequestRef.current !== requestKey) {
        lastRequestRef.current = requestKey;
        fetchGradebook(token);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token && childId) {
      fetchUncheckedGrades(token, childId);
    }
  }, [token, childId]);

  const handleCardClick = (date: string) => {
    setSelectedDate(date);
    router.replace("/gradebookday");
  };

  const handleLoadMore = () => {
    if (token && data?.dates) {
      const allDates = data.dates;
      const oldestDateStr = allDates.reduce((oldest: any, current: any) =>
        new Date(current) < new Date(oldest) ? current : oldest
      );
      const prevDay = new Date(oldestDateStr);
      prevDay.setDate(prevDay.getDate() - 1);
      const prevDateStr = prevDay.toISOString().split("T")[0];
      setSelectedDate(prevDateStr);
      fetchGradebook(token, prevDateStr);
    }
  };

  const weeks = data?.dates ? groupByWeeks(data.dates) : {};

  // Unchecked grades count
  const dateCounts: Record<string, number> = {};
  if (unCheckedStoreData?.data?.length) {
    unCheckedStoreData.data.forEach((item: any) => {
      item.unchecked_grades.forEach((grade: any) => {
        const date = grade.date;
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Ошибка: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Дневник</Text>
      {Object.entries(weeks).map(([weekNum, dates]) => {
        const uniqueDates = Array.from(new Set(dates)).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );

        return (
          <View key={weekNum}>
            {uniqueDates
              .map((date) => {
                const count = dateCounts[date] || 0;
                return (
                  <TouchableOpacity
                    key={date}
                    onPress={() => handleCardClick(date)}
                    style={styles.card}
                  >
                    <Text style={styles.cardTitle}>{formatDate(date)}</Text>
                    {count > 0 && <Text style={styles.badge}>{count}</Text>}
                  </TouchableOpacity>
                );
              })}
          </View>
        );
      })}

      <TouchableOpacity
        onPress={handleLoadMore}
        style={[styles.loadMore, loadingMore && { opacity: 0.5 }]}
      >
        <Text style={styles.loadMoreText}>
          {loadingMore ? "Загрузка..." : "Загрузить еще"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: 700,
    // lineHeight: 30
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  badge: {
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
  },
  loadMore: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
