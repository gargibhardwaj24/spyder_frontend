import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  bg: "#F7F1E8",
  ink: "#2B2620",
  muted: "#9C9388",
  coral: "#FF6B4A",
  coralDark: "#F2502B",
};

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: clear session via services/auth.ts
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.center}>
        <Text style={styles.title}>Spyder Home</Text>
      </View>

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, padding: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", color: C.ink, letterSpacing: -0.5 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.coral,
    shadowColor: C.coral,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  buttonPressed: { backgroundColor: C.coralDark },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
