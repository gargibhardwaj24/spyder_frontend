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
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
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
};

// Same gradient as the login / home screens.
const GRADIENT = ["#333337", "#040513", "#050615", "#020626", "#423f3f"] as const;
const GRADIENT_LOCATIONS = [0, 0.29, 0.61, 0.95, 1] as const;

type Contact = {
  id: string;
  name: string;
  handle: string;
  lastSeen: string;
  online: boolean;
};

const CONTACTS: Contact[] = [
  { id: "1", name: "Aria Vance", handle: "@aria", lastSeen: "2m ago", online: true },
  { id: "2", name: "Marcus Cole", handle: "@mcole", lastSeen: "1h ago", online: false },
  { id: "3", name: "Priya Nair", handle: "@priya", lastSeen: "3h ago", online: true },
  { id: "4", name: "Diego Ramos", handle: "@dramos", lastSeen: "yesterday", online: false },
  { id: "5", name: "Hana Sato", handle: "@hana", lastSeen: "2d ago", online: false },
  { id: "6", name: "Leo Fischer", handle: "@leo", lastSeen: "just now", online: true },
  { id: "7", name: "Noor Khan", handle: "@noor", lastSeen: "5d ago", online: false },
  { id: "8", name: "Sofia Bianchi", handle: "@sofia", lastSeen: "1w ago", online: false },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ContactsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [fontsLoaded] = useFonts({
    Jersey10_400Regular,
    JosefinSlab_400Regular,
    Khula_400Regular,
    KronaOne_400Regular,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONTACTS;
    return CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q)
    );
  }, [query]);

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
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              {/* Header */}
              <View style={styles.header}>
                <Pressable
                  onPress={() => router.back()}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.iconBtn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.title}>
                  <Text style={styles.titleSpy}>spy</Text>
                  <Text style={styles.titleDer}>der</Text>
                </Text>
                <View style={styles.iconBtnGhost} />
              </View>

              <Text style={styles.heading}>Contacts</Text>
              <Text style={styles.subtitle}>
                {CONTACTS.length} in your web
              </Text>

              {/* Search */}
              <View style={styles.searchWrap}>
                <Ionicons
                  name="search"
                  size={18}
                  color="rgba(255,255,255,0.5)"
                />
                <TextInput
                  style={styles.search}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search contacts"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  cursorColor="#fff"
                />
                {query.length > 0 && (
                  <Pressable onPress={() => setQuery("")} hitSlop={10}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color="rgba(255,255,255,0.5)"
                    />
                  </Pressable>
                )}
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="search-outline"
                size={28}
                color="rgba(255,255,255,0.4)"
              />
              <Text style={styles.emptyText}>No contacts match “{query}”</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/contact/${item.id}`)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(item.name)}</Text>
                {item.online && <View style={styles.dot} />}
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.handle}>{item.handle}</Text>
              </View>
              <Text style={styles.lastSeen}>{item.lastSeen}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D1031" },
  safe: { flex: 1 },
  listContent: {
    paddingHorizontal: 28,
    paddingTop: 16,
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
    marginBottom: 18,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnGhost: { width: 46, height: 46 },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 40,
  },
  titleSpy: { fontFamily: F.spy, fontSize: 34 },
  titleDer: { fontFamily: F.der, fontSize: 30 },

  heading: {
    fontFamily: F.label,
    color: "#FFFFFF",
    fontSize: 26,
  },
  subtitle: {
    fontFamily: F.body,
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 18,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 22,
  },
  search: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    height: "100%",
    fontFamily: F.body,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: F.label,
    color: "#FFFFFF",
    fontSize: 15,
  },
  dot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#3FD27E",
    borderWidth: 2,
    borderColor: "#050615",
  },
  rowBody: { flex: 1 },
  name: {
    fontFamily: F.label,
    color: "#FFFFFF",
    fontSize: 15,
  },
  handle: {
    fontFamily: F.body,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 2,
  },
  lastSeen: {
    fontFamily: F.body,
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
  },

  empty: {
    alignItems: "center",
    gap: 10,
    paddingTop: 40,
  },
  emptyText: {
    fontFamily: F.body,
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  pressed: { opacity: 0.7 },
});
