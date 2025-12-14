import { View, Text, StyleSheet } from "react-native";

type Props = {
  subject: string;
  number: number;
  quarters: [number | string, number | string, number | string, number | string];
  yearGrade: number | string;
  examGrade: number | string;
  finalGrade: number | string;
};

export function SubjectGradeCard({
  subject,
  number,
  quarters,
  yearGrade,
  examGrade,
  finalGrade,
}: Props) {
  const romanNumerals = ["I", "II", "III", "IV"];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.subject}>{subject}</Text>
        <Text style={styles.number}>№{number}</Text>
      </View>

      {/* Grades */}
      <View style={styles.grid}>
        {quarters.map((grade, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>
              Четверть {romanNumerals[index]}:
            </Text>
            <Text style={styles.value}>{grade}</Text>
          </View>
        ))}

        <View style={styles.row}>
          <Text style={styles.label}>Год:</Text>
          <Text style={styles.value}>{yearGrade}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Экзамен:</Text>
          <Text style={styles.value}>{examGrade}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Итог:</Text>
          <Text style={styles.value}>{finalGrade}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subject: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb", // blue-600
  },
  number: {
    color: "#9ca3af", // gray-400
  },
  grid: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  label: {
    fontWeight: "700",
  },
  value: {
    fontWeight: "400",
  },
});
