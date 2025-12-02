// ~/app/(protected)/ProfilePage.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useChildrenStore } from '@/store/useChildrenStore';

export default function ProfilePage() {
  const { user, token, role } = useAuthStore();
  const { children, fetchChildren, setSelectedChild } = useChildrenStore();

  useEffect(() => {
    if (token && role === 'parent') {
      fetchChildren(token);
    }
  }, [token, role, fetchChildren]);

  // Foydalanuvchi ismini first, middle, last ga ajratish
  const [firstName, middleName, lastName] = (() => {
    if (!user?.name) return ['', '', ''];
    const parts = user.name.split(' ');
    return [
      parts[0] || '',
      parts.length === 3 ? parts[1] : '',
      parts.length === 3 ? parts[2] : parts[1] || '',
    ];
  })();

  const phone = (() => {
    const raw = String(user?.contact_number || '');
    const d = raw.replace(/\D/g, '').slice(0, 12);
    if (!d) return '';
    return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)}-${d.slice(10, 12)}`;
  })();

  const handleChildSelect = (child: any) => {
    setSelectedChild(child);
  };

  const formatChildName = (child: any) => {
    if (child.name) return child.name;
    return [child.last_name, child.first_name, child.middle_name].filter(Boolean).join(' ');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Ваши данные</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Имя</Text>
            <Text style={styles.value}>{firstName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Отчество</Text>
            <Text style={styles.value}>{middleName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Фамилия</Text>
            <Text style={styles.value}>{lastName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Телефон</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>
        </View>

        {role === 'parent' && (
          <>
            <Text style={styles.sectionTitle}>Дети</Text>
            {children.map((c: any, i: any) => (
              <TouchableOpacity
                key={c.id || i}
                onPress={() => handleChildSelect(c)}
                style={styles.childCard}
              >
                <Text style={styles.childName}>{formatChildName(c)}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    textAlign: 'right',
  },
  childCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  childName: {
    fontSize: 16,
  },
});
