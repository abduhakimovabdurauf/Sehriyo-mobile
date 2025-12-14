import { View, Text, StyleSheet, ScrollView } from "react-native";

interface ApiGrade {
  subject: string;
  quarter1: number | null;
  quarter2: number | null;
  quarter3: number | null;
  quarter4: number | null;
  yearly: number | null;
  exam: number | null;
  final: number | null;
  quarter1_average?: number;
  quarter2_average?: number;
  quarter3_average?: number;
  quarter4_average?: number;
}

interface GradesTableProps {
  subjects: ApiGrade[] | null;
}

export function GradesTable({ subjects }: GradesTableProps) {
  if (!subjects || subjects.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Нет данных об оценках.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.indexCell]}>№</Text>
          <Text style={[styles.cell, styles.subjectCell]}>Предмет</Text>
          <Text style={styles.cell}>I</Text>
          <Text style={styles.cell}>II</Text>
          <Text style={styles.cell}>III</Text>
          <Text style={styles.cell}>IV</Text>
          <Text style={styles.cell}>Год</Text>
          <Text style={styles.cell}>Экзамен</Text>
          <Text style={styles.cell}>Итог</Text>
        </View>

        {/* Body */}
        {subjects.map((subject, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.indexCell]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.subjectCell]}>{subject.subject}</Text>
            <Text style={styles.cell}>{subject.quarter1 ?? "-"}</Text>
            <Text style={styles.cell}>{subject.quarter2 ?? "-"}</Text>
            <Text style={styles.cell}>{subject.quarter3 ?? "-"}</Text>
            <Text style={styles.cell}>{subject.quarter4 ?? "-"}</Text>
            <Text style={styles.cell}>{subject.yearly ?? "-"}</Text>
            <Text style={styles.cell}>{subject.exam ?? "-"}</Text>
            <Text style={styles.cell}>{subject.final ?? "-"}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    alignItems: "center",
  },
  headerRow: {
    borderTopWidth: 0,
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 70,
    textAlign: "center",
  },
  indexCell: {
    minWidth: 40,
  },
  subjectCell: {
    minWidth: 160,
    fontWeight: "700",
    color: "#2563eb",
    textAlign: "left",
  },
  empty: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#6b7280",
  },
});
