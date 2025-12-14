// ~/app/(protected)/HomeMenu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
// import { BookOpenText, Utensils, Scale, GraduationCap, FileCheck2 } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
export default function HomeMenu() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Дневник',
      bgColor: '#2563eb',
      icon: <Ionicons name='book' size={32} color="#fff" />,
      link: '/gradebook',
    },
    {
      title: 'Меню',
      bgColor: '#f97316',
      icon: <Ionicons name='fast-food' size={32} color="#fff" />,
      link: '/menu',
    },
    {
      title: 'Итоговые оценки',
      bgColor: '#0ea5e9',
      icon: <Ionicons name='scale' size={32} color="#fff" />,
      link: '/finalGrades',
    },
    {
      title: 'Итоги Малой Академии',
      bgColor: '#7c3aed', // violet-600results
      icon: <Ionicons name='school' size={32} color="#fff" />,
      link: '/manResults',
    },
    {
      title: 'Все оценки',
      bgColor: '#facc15', // yellow-500
      icon: <Ionicons name='document' size={32} color="#fff" />,
      link: '/grades',
    },
  ];

  return (
    <View style={styles.grid}>
      {menuItems.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.menuItem}
          onPress={() => router.push(item.link as any)}
        >
          <View style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}>
            {item.icon}
          </View>
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    // padding: 16,
    paddingVertical: 16
  },
  menuItem: {
    width: '22%',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
  },
});
