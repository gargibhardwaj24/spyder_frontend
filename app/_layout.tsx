import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

import { AuthProvider, useAuth } from "../context/auth";

function RootNavigator() {
  const { isAuthenticated, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Signed out but on a protected screen → send to login.
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Signed in but sitting on login/signup → send home.
      router.replace("/(main)/home");
    }
  }, [isAuthenticated, initializing, segments, router]);

  // Hold on a blank screen until the session has been restored, so we don't
  // flash the login page for an already-authenticated user.
  if (initializing) {
    return <View style={{ flex: 1, backgroundColor: "#0D1031" }} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(main)/home" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
