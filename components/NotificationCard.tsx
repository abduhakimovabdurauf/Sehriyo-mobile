import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  count?: number;
};

export function NotificationCard({ title = "Notification", count = 0 }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 16 }}>{title}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {count > 0 && (
          <View
            style={{
              backgroundColor: "#dc2626",
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {count}
            </Text>
          </View>
        )}

        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </View>
  );
}
