import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

import { useAuth } from "../../context/auth";
import { ApiError } from "../../services/api";
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

const C = {
  bg: "#F7F1E8",
  card: "#FFFFFF",
  field: "#F4EEE4",
  ink: "#2B2620",
  muted: "#9C9388",
  coral: "#FF6B4A",
  coralDark: "#F2502B",
  line: "#EBE3D6",
};

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Backend requires a password of at least 12 characters (weak_password).
  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 12 &&
    !loading;

  const handleSignup = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      // The root layout's route guard redirects to /(main)/home on success.
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "Couldn't create your account. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
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
            {/* Brand */}
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Ionicons name="bug" size={22} color={C.card} />
              </View>
              <Text style={styles.brandName}>spyder</Text>
            </View>

            <Text style={styles.title}>Create your account ✨</Text>
            <Text style={styles.subtitle}>
              Join Spyder and start in seconds.
            </Text>

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.label}>Name</Text>
              <Field
                icon="person-outline"
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />

              <Text style={[styles.label, styles.labelSpaced]}>Email</Text>
              <Field
                icon="mail-outline"
                placeholder="you@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Text style={[styles.label, styles.labelSpaced]}>Password</Text>
              <Field
                icon="lock-closed-outline"
                placeholder="At least 12 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                trailing={
                  <Pressable
                    onPress={() => setShowPassword((s) => !s)}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={C.muted}
                    />
                  </Pressable>
                }
              />

              {error && <Text style={styles.error}>{error}</Text>}

              <Pressable
                onPress={handleSignup}
                disabled={!canSubmit}
                style={({ pressed }) => [
                  styles.button,
                  !canSubmit && styles.buttonDisabled,
                  pressed && canSubmit && styles.buttonPressed,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={C.card} />
                ) : (
                  <Text style={styles.buttonText}>Create account</Text>
                )}
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <Social icon="logo-google" label="Google" />
                <Social icon="logo-apple" label="Apple" />
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text style={styles.footerLink}>Log in</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

type FieldProps = React.ComponentProps<typeof TextInput> & {
  icon: keyof typeof Ionicons.glyphMap;
  trailing?: React.ReactNode;
};

function Field({ icon, trailing, ...props }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.fieldWrap, focused && styles.fieldFocused]}>
      <Ionicons name={icon} size={20} color={focused ? C.coral : C.muted} />
      <TextInput
        style={styles.fieldInput}
        placeholderTextColor={C.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {trailing}
    </View>
  );
}

function Social({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.social, pressed && styles.socialPressed]}
    >
      <Ionicons name={icon} size={20} color={C.ink} />
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.coral,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "800",
    color: C.ink,
    letterSpacing: -0.5,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: C.ink,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    color: C.muted,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 21,
  },

  card: {
    backgroundColor: C.card,
    borderRadius: 28,
    padding: 22,
    shadowColor: "#9A7B5A",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 8,
  },
  labelSpaced: { marginTop: 16 },

  fieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.field,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: 16,
    height: 56,
  },
  fieldFocused: {
    borderColor: C.coral,
    backgroundColor: C.card,
  },
  fieldInput: {
    flex: 1,
    color: C.ink,
    fontSize: 16,
    height: "100%",
  },

  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: C.coral,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: C.coral,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  buttonPressed: { backgroundColor: C.coralDark },
  buttonDisabled: {
    backgroundColor: "#F0C9BD",
    shadowOpacity: 0,
  },
  buttonText: {
    color: C.card,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: C.line },
  dividerText: { color: C.muted, fontSize: 13, fontWeight: "600" },

  socialRow: { flexDirection: "row", gap: 12 },
  social: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.line,
    backgroundColor: C.card,
  },
  socialPressed: { backgroundColor: C.field },
  socialText: { fontSize: 14, fontWeight: "700", color: C.ink },

  error: {
    fontSize: 13,
    color: "#D6453B",
    marginTop: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  footerText: { fontSize: 14, color: C.muted },
  footerLink: { fontSize: 14, fontWeight: "800", color: C.coral },
});
