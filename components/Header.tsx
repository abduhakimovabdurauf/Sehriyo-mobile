// components/Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from '@expo/vector-icons';

import { useChildrenStore } from "../store/useChildrenStore";
import { useAuthStore } from "../store/useAuthStore";
import { useLinkTo } from "@react-navigation/native";

export function Header() {
  const { children, selectedChild, setSelectedChild } = useChildrenStore();
  const { logout, role, user } = useAuthStore();
  const linkTo = useLinkTo();

  const handleLogout = () => {
    logout();
    linkTo("/login");
  };

  const childrenOptions = children
    .slice()
    .sort((a, b) => {
      const nameA = `${a.last_name ?? ""} ${a.first_name ?? ""}`.trim().toLowerCase();
      const nameB = `${b.last_name ?? ""} ${b.first_name ?? ""}`.trim().toLowerCase();
      return nameA.localeCompare(nameB);
    })
    .map((c) => ({
      label: c?.first_name ? `${c.first_name} ${c?.last_name?.[0] ?? ""}.` : "—",
      value: c.id.toString(),
    }));

  return (
    <View style={styles.container}>
      {role === "parent" && (
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            value={selectedChild?.id?.toString()}
            onValueChange={(value) => {
              const child = children.find((c) => c.id.toString() === value);
              setSelectedChild(child || null);
            }}
            items={childrenOptions}
            style={{
              ...pickerStyles,
              placeholder: { color: "#6b7280", fontSize: 16 },
            }}
            placeholder={{ label: "Выберите ребенка", value: null }}
            useNativeAndroidPickerStyle={false}
            Icon={() => <Ionicons name="chevron-down" size={20} color="#6b7280" style={{ marginTop:8 }} />}
          />
        </View>
      )}

      {role === "student" && (
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            value={user?.id?.toString()}
            onValueChange={() => {}}
            items={[
              {
                label: `${user?.first_name} ${user?.last_name}`,
                value: user?.id?.toString(),
              },
            ]}
            style={{
              ...pickerStyles,
              placeholder: { color: "#6b7280", fontSize: 16 },
            }}
            useNativeAndroidPickerStyle={false}
          />
        </View>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={28} color="#2563eb" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => linkTo("/profile")} style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={28} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 36,
    // marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "center",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    paddingHorizontal: 6,
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: "#111827",
    paddingVertical: 8,
  },
  inputAndroid: {
    fontSize: 16,
    color: "#111827",
    paddingVertical: 4,
  },
});
