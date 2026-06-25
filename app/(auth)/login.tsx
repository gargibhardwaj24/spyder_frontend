import { Jersey10_400Regular } from "@expo-google-fonts/jersey-10";
import { JosefinSlab_400Regular } from "@expo-google-fonts/josefin-slab";
import { Khula_400Regular } from "@expo-google-fonts/khula";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const F = {
  spy: "Jersey10_400Regular",
  der: "JosefinSlab_400Regular",
  body: "Khula_400Regular",
  label: "KronaOne_400Regular",
  or: "Kokoro_400Regular",
};

// Gradient stops from the Figma design, with the blues darkened.
const GRADIENT = ["#333337", "#040513", "#050615", "#020626", "#423f3f"] as const;
const GRADIENT_LOCATIONS = [0, 0.29, 0.61, 0.95, 1] as const;

export default function LoginScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Jersey10_400Regular,
    JosefinSlab_400Regular,
    Khula_400Regular,
    KronaOne_400Regular,
    Kokoro_400Regular: require("../../assets/fonts/Kokoro-Regular.ttf"),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (loading) return;
    setLoading(true);
    // TODO: wire up services/auth.ts
    setTimeout(() => {
      setLoading(false);
      router.replace("/(main)/home");
    }, 900);
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
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <Text style={styles.logo}>
              <Text style={styles.logoSpy}>spy</Text>
              <Text style={styles.logoDer}>der</Text>
            </Text>
            <Text style={styles.subtitle}>
              Sign in to pick where you left off
            </Text>

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  cursorColor="#fff"
                />
              </View>

              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  cursorColor="#fff"
                />
                <Pressable
                  onPress={() => setShowPassword((s) => !s)}
                  hitSlop={10}
                  style={styles.eye}
                >
                  <Text style={styles.eyeText}>
                    {showPassword ? "HIDE" : "SHOW"}
                  </Text>
                </Pressable>
              </View>

              <Pressable hitSlop={8} style={styles.forgotWrap}>
                <Text style={styles.forgot}>Forgot?</Text>
              </Pressable>

              <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.loginBtn,
                  pressed && styles.pressed,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginText}>Log in</Text>
                )}
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <Social
                  source={require("../../assets/images/google.png")}
                  label="Google"
                />
                <Social
                  source={require("../../assets/images/apple.png")}
                  label="Apple"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Social({
  source,
  label,
}: {
  source: number;
  label: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.social, pressed && styles.pressed]}
    >
      <Image source={source} style={styles.socialIcon} contentFit="contain" />
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D1031" },
  flex: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
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

  logo: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 58,
    lineHeight: 64,
  },
  logoSpy: { fontFamily: F.spy, fontSize: 58 },
  logoDer: { fontFamily: F.der, fontSize: 52 },

  subtitle: {
    fontFamily: F.body,
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 34,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 22,
  },

  fieldLabel: {
    fontFamily: F.label,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 14,
    height: 48,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
    fontFamily: F.body,
  },
  eye: { paddingLeft: 10 },
  eyeText: {
    fontFamily: F.body,
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 1,
  },

  forgotWrap: { alignSelf: "flex-end", marginTop: 8 },
  forgot: {
    fontFamily: F.body,
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },

  loginBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  loginText: {
    fontFamily: F.label,
    color: "#FFFFFF",
    fontSize: 17,
  },
  pressed: { opacity: 0.7 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 18,
  },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.25)" },
  orText: {
    fontFamily: F.or,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    letterSpacing: 1,
  },

  socialRow: { flexDirection: "row", gap: 14 },
  social: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  socialIcon: { width: 18, height: 18 },
  // LINE Seed JP is not distributed as a TTF (Google Fonts / fontsource ship
  // only woff/woff2, which RN can't load). Falls back to a bold system font.
  // Drop assets/fonts/LINESeedJP_Bd.ttf in and register it to use the real one.
  socialText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
