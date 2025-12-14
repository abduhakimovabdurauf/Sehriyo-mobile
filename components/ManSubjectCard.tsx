import { View, Text, StyleSheet } from "react-native";

interface StudentResult {
  student_name: string;
  incoming_test: number;
  outgoing_test: number;
  creative_work: number;
  total: number;
}

interface ManSubjectCardProps {
  campaignName: string;
  studentResults: StudentResult[];
}

export function ManSubjectCard({
  campaignName,
  studentResults,
}: ManSubjectCardProps) {
  const student = studentResults?.[0];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{campaignName}</Text>

      {student ? (
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Входящий тест</Text>
            <Text>{student.incoming_test}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Исходящий тест</Text>
            <Text>{student.outgoing_test}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Творческая работа</Text>
            <Text>{student.creative_work}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Итог</Text>
            <Text>{student.total}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.empty}>Нет данных</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb", // blue-600
  },
  content: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "700",
  },
  empty: {
    color: "#6b7280", // gray-500
    fontStyle: "italic",
  },
});
