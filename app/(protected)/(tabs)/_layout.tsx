// app/(protected)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="gradebook"
        options={{
          title: "Дневник",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="gradebookday"
        options={{
          title: "Дневник",
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: null,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          href: null,
        }}
      />
      <Tabs.Screen
        name="finalGrades"
        options={{
          title: "finalGrades",
          href: null,
        }}
      />
      <Tabs.Screen
        name="manResults"
        options={{
          title: "manResults",
          href: null,
        }}
      />
      <Tabs.Screen
        name="grades"
        options={{
          title: "grades",
          href: null,
        }}
      />
    </Tabs>
  );
}