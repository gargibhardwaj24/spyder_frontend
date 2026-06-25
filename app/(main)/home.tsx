import { Ionicons } from "@expo/vector-icons";
import { Jersey10_400Regular } from "@expo-google-fonts/jersey-10";
import { JosefinSlab_400Regular } from "@expo-google-fonts/josefin-slab";
import { Khula_400Regular } from "@expo-google-fonts/khula";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const F = {
  spy: "Jersey10_400Regular",
  der: "JosefinSlab_400Regular",
  body: "Khula_400Regular",
  label: "KronaOne_400Regular",
};

// Same gradient as the login screen.
const GRADIENT = ["#333337", "#040513", "#050615", "#020626", "#423f3f"] as const;
const GRADIENT_LOCATIONS = [0, 0.29, 0.61, 0.95, 1] as const;

const ACTIONS = [
  {
    icon: "people-outline",
    title: "Contacts",
    subtitle: "Browse your saved web",
    route: "/(main)/contacts",
  },
  {
    icon: "mic-outline",
    title: "New recording",
    subtitle: "Capture a moment",
    route: "/recording",
  },
  {
    icon: "person-outline",
    title: "Profile",
    subtitle: "Manage your account",
    route: "/(main)/profile",
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Jersey10_400Regular,
    JosefinSlab_400Regular,
    Khula_400Regular,
    KronaOne_400Regular,
  });

  const handleLogout = () => {
    // TODO: clear session via services/auth.ts
    router.replace("/(auth)/login");
  };

  if (!fontsLoaded) {
    return <View style={[styles.root, { backgroundColor: "#0D1031" }]} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={GRADIENT}
        locations={GRADIENT_LOCATIONS}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Corner spider webs */}
      <Image
        source={require("../../assets/images/web2.png")}
        style={styles.webTop}
        contentFit="contain"
      />
      <Image
        source={require("../../assets/images/web3.png")}
        style={styles.webBottom}
        contentFit="contain"
      />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.logo}>
                <Text style={styles.logoSpy}>spy</Text>
                <Text style={styles.logoDer}>der</Text>
              </Text>
            </View>
            <Pressable
              onPress={handleLogout}
              hitSlop={10}
              style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
            >
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Actions */}
          <View style={styles.list}>
            {ACTIONS.map((a) => (
              <Pressable
                key={a.title}
                onPress={() => router.push(a.route)}
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              >
                <View style={styles.cardIcon}>
                  <Ionicons name={a.icon} size={22} color="#FFFFFF" />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{a.title}</Text>
                  <Text style={styles.cardSubtitle}>{a.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="rgba(255,255,255,0.4)"
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D1031" },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 40,
  },

  webTop: {
    position: "absolute",
    top: -20,
    right: -30,
    width: 220,
    height: 220,
    opacity: 0.9,
  },
  webBottom: {
    position: "absolute",
    bottom: -10,
    left: -40,
    width: 220,
    height: 220,
    opacity: 0.5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 34,
  },
  greeting: {
    fontFamily: F.body,
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 44,
    lineHeight: 50,
  },
  logoSpy: { fontFamily: F.spy, fontSize: 44 },
  logoDer: { fontFamily: F.der, fontSize: 40 },

  logoutBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  list: { gap: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontFamily: F.label,
    color: "#FFFFFF",
    fontSize: 16,
  },
  cardSubtitle: {
    fontFamily: F.body,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 3,
  },
  pressed: { opacity: 0.7 },
});
