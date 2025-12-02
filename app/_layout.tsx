// ~/app/_layout.tsx
import { Stack } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const token = useAuthStore((state) => state.token);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen
          name="(protected)"
          options={{ animation: "none" }}
        />
      ) : (
        <Stack.Screen name="login" options={{ animation: "none" }} />
      )}
    </Stack>
  );
}
