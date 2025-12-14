import { View, Text, StyleSheet, ScrollView } from "react-native";

interface ApiGrade {
  subject: string;
  quarter1: number | null;
  quarter2: number | null;
  quarter3: number | null;
  quarter4: number | null;
  yearly: number | null;
}

interface GradesCountTableProps {
  subjects: ApiGrade[] | null;
}

export function GradesCountTable({ subjects }: GradesCountTableProps) {
  if (!subjects || subjects.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Нет данных</Text>
      </View>
    );
  }

  const data = subjects.map((s, index) => {
    const counts: Record<2 | 3 | 4 | 5, number> = { 2: 0, 3: 0, 4: 0, 5: 0 };
    [s.quarter1, s.quarter2, s.quarter3, s.quarter4].forEach((g) => {
      if (g && g >= 2 && g <= 5) counts[g as 2 | 3 | 4 | 5] += 1;
    });

    return {
      id: index + 1,
      subject: s.subject,
      grades: counts,
    };
  });

  const totals = data.reduce(
    (acc, row) => {
      acc[2] += row.grades[2];
      acc[3] += row.grades[3];
      acc[4] += row.grades[4];
      acc[5] += row.grades[5];
      return acc;
    },
    { 2: 0, 3: 0, 4: 0, 5: 0 }
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.indexCell]}>№</Text>
          <Text style={[styles.cell, styles.subjectCell]}>Предмет</Text>
          <Text style={styles.cell}>5</Text>
          <Text style={styles.cell}>4</Text>
          <Text style={styles.cell}>3</Text>
          <Text style={styles.cell}>2</Text>
        </View>

        {/* Body */}
        {data.map((row) => (
          <View key={row.id} style={styles.row}>
            <Text style={[styles.cell, styles.indexCell]}>{row.id}</Text>
            <Text style={[styles.cell, styles.subjectCell]}>{row.subject}</Text>
            <Text style={styles.cell}>{row.grades[5]}</Text>
            <Text style={styles.cell}>{row.grades[4]}</Text>
            <Text style={styles.cell}>{row.grades[3]}</Text>
            <Text style={styles.cell}>{row.grades[2]}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.cell, styles.indexCell]} />
          <Text style={[styles.cell, styles.totalLabel]}>Итого</Text>
          <Text style={styles.cell}>{totals[5]}</Text>
          <Text style={styles.cell}>{totals[4]}</Text>
          <Text style={styles.cell}>{totals[3]}</Text>
          <Text style={styles.cell}>{totals[2]}</Text>
        </View>
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
  totalRow: {
    backgroundColor: "#f9fafb",
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
  totalLabel: {
    fontWeight: "700",
    color: "#111827",
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
