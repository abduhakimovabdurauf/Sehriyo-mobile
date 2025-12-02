import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginScreen() {
  const { login, loading, error } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Phone mask: +998 90 123 45 67
  const formatPhone = (value: any) => {
    // faqat raqam qoldiramiz
    const cleaned = value.replace(/\D/g, "");
    let formatted = "+998 ";

    if (cleaned.length > 3) {
      formatted += cleaned.slice(3, 5) + " ";
    }
    if (cleaned.length > 5) {
      formatted += cleaned.slice(5, 8) + " ";
    }
    if (cleaned.length > 8) {
      formatted += cleaned.slice(8, 10) + " ";
    }
    if (cleaned.length > 10) {
      formatted += cleaned.slice(10, 12);
    }

    return formatted.trim();
  };

  const handlePhoneChange = (text: any) => {
    let onlyNumbers = text.replace(/\D/g, "");

    // avtomatik +998 qo‘shib qo'yamiz
    if (!onlyNumbers.startsWith("998")) {
      onlyNumbers = "998" + onlyNumbers;
    }

    onlyNumbers = onlyNumbers.slice(0, 12);

    setPhone(formatPhone(onlyNumbers));
  };

  const handleLogin = async () => {
    const cleanPhone = phone.replace(/\D/g, "");

    try {
      await login(cleanPhone, password);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ padding: 30, marginTop: 60 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>
        Вход в дневник
      </Text>

      {/* PHONE FIELD */}
      <Text style={{ fontSize: 16, fontWeight: "500" }}>Телефон</Text>
      <TextInput
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        placeholder="+998 90 123 45 67"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 14,
          fontSize: 16,
          borderRadius: 10,
          marginVertical: 10,
        }}
      />

      {/* PASSWORD FIELD */}
      <Text style={{ fontSize: 16, fontWeight: "500" }}>Пароль</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 14,
          fontSize: 16,
          borderRadius: 10,
          marginVertical: 10,
        }}
      />

      {/* ERROR */}
      {error && (
        <Text style={{ color: "red", marginTop: 5, fontSize: 14 }}>
          {error}
        </Text>
      )}

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#2563eb",
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {loading ? "Загрузка..." : "Войти"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
