import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Grade {
  value: string | number;
}

interface Homework {
  content: string;
}

interface Notes {
  content: string;
}

interface Attendances {
  status: number;
}

interface Lesson {
  name: string;
  grades: Grade[];
  homeworks: Homework[];
  notes: Notes[];
  attendances: Attendances[];
}

interface SubjectCardProps {
  lesson: Lesson;
}

export function SubjectCard({ lesson }: SubjectCardProps) {
  const { name, grades, homeworks, notes, attendances } = lesson;

  const attendanceText = (status: number) => {
    switch (status) {
      case 0:
        return { text: "Отсутствовал", color: "#DC2626" };
      case 1:
        return { text: "Опоздал", color: "#D97706" };
      default:
        return { text: "Присутствовал", color: "#059669" };
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>

      {/* Grades */}
      {grades.length > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Оценки:</Text>
          <View style={styles.gradeList}>
            {grades.map((grade, index) => (
              <View key={index} style={styles.gradeItem}>
                <Text style={styles.gradeText}>{grade.value}</Text>
                <Ionicons name="book-outline" size={18} />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Attendance */}
      <View style={styles.row}>
        <Text style={styles.label}>Посещаемость:</Text>
        <View>
          {attendances.length > 0 ? (
            attendances.map((a, i) => {
              const att = attendanceText(a.status);
              return (
                <Text key={i} style={{ color: att.color }}>
                  {att.text}
                </Text>
              );
            })
          ) : (
            <Text style={{ color: "#059669" }}>Присутствовал</Text>
          )}
        </View>
      </View>

      {/* Homework */}
      {homeworks.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.label}>Задание на дом:</Text>
          {homeworks.map((hw, index) => (
            <Text key={index} style={styles.hwText}>
              {hw.content}
            </Text>
          ))}
        </View>
      )}

      {/* Notes */}
      {notes.length > 0 && (
        <View style={styles.noteBox}>
          <Ionicons name="alert-circle-outline" size={22} color="#DC2626" />
          <View style={{ flex: 1 }}>
            <Text style={styles.noteTitle}>Замечания от учителя:</Text>
            <Text style={styles.noteText}>{notes[0].content}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    gap: 10,
    flexDirection: "column",
    marginBottom: 12,
  },
  title: {
    color: "#2563EB",
    fontSize: 20,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
  },
  gradeList: {
    flexDirection: "row",
    gap: 6,
  },
  gradeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  gradeText: {
    fontSize: 18,
    fontWeight: "700",
  },
  hwText: {
    color: "#4B5563",
  },
  noteBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
  noteTitle: {
    fontWeight: "700",
    color: "#DC2626",
  },
  noteText: {
    color: "#DC2626",
  },
});
