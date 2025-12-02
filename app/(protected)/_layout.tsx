// ~/app/protected/_layout.tsx
import React, { useEffect } from "react";
import { Redirect, Slot } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useChildrenStore } from "../../store/useChildrenStore";
import { Header } from "@/components/Header";
import { StatusBar } from "expo-status-bar";

export default function ProtectedLayout() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const fetchChildren = useChildrenStore((state) => state.fetchChildren);

  // Token va role mavjud bo‘lsa, bolalarni yuklash
  useEffect(() => {
    if (token && role === "parent") {
      console.log("aaaaa");

      fetchChildren(token);
    }
  }, [token, role, fetchChildren]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <StatusBar style="light" animated />
      <Header />
      <Slot />
    </>
  );
}
