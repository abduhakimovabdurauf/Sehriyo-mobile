import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";

import { useGradebookDayStore } from "@/store/useGradebookDayStore";
import { useGradebookStore } from "@/store/useGradebook";
import { useAuthStore } from "@/store/useAuthStore";
import { useChildrenStore } from "@/store/useChildrenStore";
import { useUncheckedGradesStore } from "@/store/useUncheckedGradesStore";
import { useCheckGradeStore } from "@/store/useCheckGrades";

import { SubjectCard } from "@/components/SubjectCard";
import { AlertCard } from "@/components/AlertCard";
import { NotificationCard } from "@/components/NotificationCard";

export default function GradebookDayScreen() {
  const { token } = useAuthStore();
  const { selectedChild } = useChildrenStore();

  const { data, loading, fetchGradebookDay } = useGradebookDayStore();
  const { unCheckedStoreData, fetchUncheckedGrades } =
    useUncheckedGradesStore();
  const {
    selectedDate,
    setSelectedDate,
    goToNextDate,
    goToPreviousDate,
    setCanAcquainted,
  } = useGradebookStore();
  const { checkGrades } = useCheckGradeStore();

  const lastRequestRef = useRef("");

  if (!token) return <Redirect href="/login" />;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const pageTitle = selectedDate ? formatDate(selectedDate) : "Дневник";

  useEffect(() => {
    if (!token || !selectedDate) return;

    const childId = selectedChild?.id ?? null;
    const requestKey = `${token}-${selectedDate}-${childId || "self"}`;

    fetchUncheckedGrades(token, childId!);

    if (lastRequestRef.current !== requestKey) {
      lastRequestRef.current = requestKey;
      fetchGradebookDay(childId, selectedDate);
    }
  }, [token, selectedChild?.id, selectedDate]);

  const dates = data?.dates || [];
  const diary = data?.diary_data || {};
  const lessons = diary?.lessons || [];
  const comments = data?.comments;
  const can_acquainted = diary?.can_acquainted;
  const grade_checks = diary?.grade_checks;
  const father = grade_checks?.father;
  const mother = grade_checks?.mother;

  const unchecked_grades =
    unCheckedStoreData?.data?.[0]?.unchecked_grades || [];

  const handleAcquainted = async () => {
    const grade_ids = lessons.flatMap((l: any) =>
      l.grades ? l.grades.map((g: any) => g.id) : []
    );

    try {
      if (selectedChild?.id && selectedDate) {
        await checkGrades(token, grade_ids, selectedChild.id, selectedDate);
      }
    } catch (e) {
      console.log("Error checking grades:", e);
    }
  };
  const currentIndex = dates.findIndex((d: any) => d === selectedDate);

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Title */}
      <Text style={styles.title}>{pageTitle}</Text>

      {/* Dates Horizontal Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {dates.map((d: any, i: any) => (
            <Pressable
              key={i}
              onPress={() => setSelectedDate(d)}
              style={[
                styles.dateButton,
                selectedDate === d && styles.dateButtonActive,
              ]}
            >
              <Text style={styles.dateText}>
                {new Date(d).toLocaleDateString("ru-RU", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Loader */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* Lessons */}
      {!loading && (
        <View style={{ gap: 12, marginTop: 12 }}>
          {lessons.length > 0 ? (
            lessons.map((lesson: any, idx: number) => (
              <SubjectCard key={idx} lesson={lesson} />
            ))
          ) : (
            <Text style={styles.noLessons}>Сегодня занятий нет.</Text>
          )}
        </View>
      )}

      {/* Comments */}
      {comments?.content && <AlertCard comments={[comments]} />}

      {/* Acquaintance */}
      {can_acquainted && lessons.some((l: any) => l.grades?.length > 0) && (
        <>
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#b45309"
            />
            <Text style={{ flex: 1 }}>
              Нажимая "Ознакомиться", вы подтверждаете, что изучили содержание
              дневника.
            </Text>
          </View>

          <Pressable style={styles.acquaintBtn} onPress={handleAcquainted}>
            <Text style={styles.acquaintBtnText}>Ознакомиться</Text>
          </Pressable>
        </>
      )}

      <View style={{ marginVertical: 10, gap: 4 }}>
        {father?.checked && (
          <Text style={styles.checkedText}>
            Папа ознакомился {father.time} ✔️
          </Text>
        )}
        {mother?.checked && (
          <Text style={styles.checkedText}>
            Мама ознакомилась {mother.time} ✔️
          </Text>
        )}
      </View>

      <View style={styles.nextPrevRow}>
        <Pressable
          style={[
            styles.navBtn,
            currentIndex === 0 && styles.navBtnDisabled,
          ]}
          onPress={goToPreviousDate}
          disabled={currentIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentIndex === 0 ? "#aaa" : "#000"}
          />
          <Text style={{ color: currentIndex === 0 ? "#aaa" : "#000" }}>
            Предыдущая
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.navBtn,
            currentIndex === dates.length - 1 && styles.navBtnDisabled,
          ]}
          onPress={goToNextDate}
          disabled={currentIndex === dates.length - 1}
        >
          <Text
            style={{
              color: currentIndex === dates.length - 1 ? "#aaa" : "#000",
            }}
          >
            Следующая
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentIndex === dates.length - 1 ? "#aaa" : "#000"}
          />
        </Pressable>
      </View>

      {unchecked_grades.length > 0 && (
        <View style={{ marginTop: 20, gap: 12 }}>
          <Text style={styles.uncheckedTitle}>
            Не забудьте проверить дневники других дней
          </Text>

          <View style={{ gap: 10 }}>
            {Array.from(
              new Set(unchecked_grades.map((g: { date: string }) => g.date))
            )
              .map(String)
              .map((date: string, i: number) => (
                <Pressable key={i} onPress={() => setSelectedDate(date)}>
                  <NotificationCard
                    title={formatDate(date)}
                    count={
                      unchecked_grades.filter(
                        (g: { date: string }) => g.date === date
                      ).length
                    }
                  />
                </Pressable>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  dateButtonActive: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  dateText: {
    fontSize: 13,
  },
  noLessons: {
    textAlign: "center",
    color: "#6b7280",
  },
  infoBox: {
    padding: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
  },
  acquaintBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    alignItems: "center",
    borderRadius: 12,
    marginTop: 8,
  },
  acquaintBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  checkedText: {
    fontSize: 13,
    color: "#6b7280",
  },
  nextPrevRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  navBtnDisabled: {
    backgroundColor: '#f0f0f0',
  },
  uncheckedTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
});
