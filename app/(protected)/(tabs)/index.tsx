import HomeMenu from "@/components/HomeMenu";
import { useAuthStore } from "@/store/useAuthStore";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  const { user } = useAuthStore();

  const [firstName, middleName, lastName] = (() => {
    if (!user?.name) return ['', '', ''];
    const parts = user.name.split(' ');
    return [
      parts[0] || '',
      parts.length === 3 ? parts[1] : '',
      parts.length === 3 ? parts[2] : parts[1] || '',
    ];
  })();

  console.log(firstName, lastName);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Привет, {middleName}!
      </Text>
      <HomeMenu/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },
});
