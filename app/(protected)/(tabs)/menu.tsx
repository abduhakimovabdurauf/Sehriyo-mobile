import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";

import { useMenuStore } from "@/store/useMenuStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useChildrenStore } from "@/store/useChildrenStore";

const MenuScreen = () => {
  const { data, loading, fetchMenu, selectedDate, setSelectedDate } =
    useMenuStore();

  const { token } = useAuthStore();
  const { selectedChild } = useChildrenStore();

  const lastRequestRef = useRef<string>("");
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const dayName = daysOfWeek[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${dayName} · ${day}.${month}.${year}`;
  };

  useEffect(() => {
    if (!token) return;

    const class_type = selectedChild?.class_type || 11;
    const requestKey = `${token}-${class_type}-${selectedDate || ""}`;

    if (lastRequestRef.current !== requestKey) {
      lastRequestRef.current = requestKey;
      fetchMenu(token, class_type, selectedDate!);
    }
  }, [token, selectedChild, selectedDate]);

  const menu = data?.menu || {};
  const currentDate = data?.date || selectedDate;
  const additionalDates = data?.additional_dates || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Меню</Text>
      {/* Sana tugmalari */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateScroll}
      >
        {additionalDates.map((d: any) => (
          <Pressable
            key={d.date}
            onPress={() => setSelectedDate(d.date)}
            style={[
              styles.dateButton,
              selectedDate === d.date && styles.dateButtonActive,
            ]}
          >
            <Text style={styles.dateText}>{formatDate(d.date)}</Text>
          </Pressable>
        ))}
        {loading ? (
          <Text style={styles.centerText}>Загрузка...</Text>
        ) : data ? (
          <>
            <Text style={styles.title}>{formatDate(currentDate)}</Text>

            {Object.entries(menu).map(
              ([mealName, items]: [string, any], idx) => (
                <View key={idx} style={styles.card}>
                  <Text style={styles.cardTitle}>{mealName}</Text>

                  {items.map((item: string, i: number) => (
                    <Text key={i} style={styles.listItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )
            )}
          </>
        ) : (
          <Text style={styles.centerText}>Нет данных</Text>
        )}
      </ScrollView>

      {/* Content */}
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },

  dateScroll: {
    marginBottom: 16,
  },

  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },

  dateButtonActive: {
    backgroundColor: "#E5E5E5",
  },

  dateText: {
    fontSize: 14,
    fontWeight: "500",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  listItem: {
    fontSize: 15,
    marginBottom: 4,
  },

  centerText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
});
