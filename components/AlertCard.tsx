import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Comment {
  content: string;
}

interface AlertCardProps {
  comments: Comment[];
}

export function AlertCard({ comments }: AlertCardProps) {
  return (
    <View style={styles.card}>
      <Ionicons name="alert-circle-outline" size={26} color="#fff" />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          Замечания от классного руководителя:
        </Text>

        {comments.map((comment, index) => (
          <Text key={index} style={styles.comment}>
            {comment.content}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
    color: "#fff",
    marginBottom: 4,
  },
  comment: {
    color: "#fff",
    fontSize: 14,
    marginTop: 2,
  },
});
