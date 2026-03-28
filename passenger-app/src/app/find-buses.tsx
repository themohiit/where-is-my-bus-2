import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

const GREEN = "#5BA943";
const GREEN_DARK = "#4a8f36";
const CARD_BG = "#FFFFFF";
const BORDER = "#E4EBE1";
const TEXT_PRIMARY = "#1A1A2E";
const TEXT_SECONDARY = "#5A6470";
const TEXT_MUTED = "#9CA3AF";

const MOCK_STOPS = [
  {
    id: "1",
    stopName: "Sonipat Bus Stand – Bay 1",
    stopCode: "SNP-01",
    busLines: "HR-01, HR-22, HR-88",
    walkMin: 0,
    buses: [
      { number: "HR-01", name: "Sonipat – Delhi Express", destination: "Delhi ISBT Kashmere Gate", times: ["5 min", "22 min", "38 min"], route: "SNP → DLI" },
      { number: "HR-22", name: "Hisar – Delhi Sarai Kale Khan", destination: "Delhi Sarai Kale Khan", times: ["11 min", "29 min"], route: "HSR → SKK" },
      { number: "HR-88", name: "Rewari – Delhi ISBT", destination: "Delhi ISBT Anand Vihar", times: ["18 min", "44 min"], route: "REW → DLI" },
    ],
  },
  {
    id: "2",
    stopName: "Sonipat Sector 14 Stop",
    stopCode: "SNP-02",
    busLines: "HR-01, HR-55",
    walkMin: 4,
    buses: [
      { number: "HR-01", name: "Sonipat – Delhi Express", destination: "Delhi ISBT Kashmere Gate", times: ["8 min", "25 min", "41 min"], route: "SNP → DLI" },
      { number: "HR-55", name: "Panipat – Kashmere Gate", destination: "Delhi ISBT Kashmere Gate", times: ["14 min", "33 min"], route: "PNP → KG" },
    ],
  },
  {
    id: "3",
    stopName: "Kundli Chowk Stop",
    stopCode: "KNL-04",
    busLines: "HR-77, HR-12",
    walkMin: 9,
    buses: [
      { number: "HR-77", name: "Karnal – Delhi Direct", destination: "Delhi Direct", times: ["3 min", "19 min", "37 min"], route: "KNL → DLI" },
      { number: "HR-12", name: "Rohtak – Anand Vihar", destination: "Anand Vihar ISBT", times: ["21 min", "48 min"], route: "RHK → AV" },
    ],
  },
  {
    id: "4",
    stopName: "GT Road Bus Stop",
    stopCode: "GTR-09",
    busLines: "HR-33, HR-44",
    walkMin: 13,
    buses: [
      { number: "HR-33", name: "Ambala – Chandigarh", destination: "Chandigarh ISBT 17", times: ["7 min", "31 min"], route: "ABL → CHD" },
      { number: "HR-44", name: "Bhiwani – Gurgaon", destination: "Gurgaon Bus Stand", times: ["16 min", "42 min"], route: "BHW → GGN" },
    ],
  },
];

export default function FindBusesScreen() {
  const { from, to } = useLocalSearchParams<{ from: string; to: string }>();
  const [activeTab, setActiveTab] = useState<"stops" | "find">("stops");

  const handleBusPress = (bus: { number: string; name: string; route: string }) => {
    router.push({
      pathname: "/bus-detail",
      params: {
        busNumber: bus.number,
        busName: bus.name,
        route: bus.route,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {/* ── Header ── */}
      <View style={styles.header}>
     
<TouchableOpacity style={styles.backBtn} onPress={() => router.push("/home")}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerFrom} numberOfLines={1}>{from || "From"}</Text>
          <Text style={styles.headerArrow}>→</Text>
          <Text style={styles.headerTo} numberOfLines={1}>{to || "To"}</Text>
        </View>
        <TouchableOpacity style={styles.micBtn}>
          <Image source={require("../../assets/mic.png")} style={styles.micImgHeader} resizeMode="contain" />
        </TouchableOpacity>
      </View>


      {/* ── Bottom Sheet ── */}
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Image
            source={require("../../assets/bus-icon.png")}
            style={styles.busIconImg}
            resizeMode="contain"
          />
          <Text style={styles.sheetTitle}>Bus</Text>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "stops" && styles.tabBtnActive]}
            onPress={() => setActiveTab("stops")}
          >
            <Text style={styles.tabBtnIcon}>🚏</Text>
            <Text style={[styles.tabBtnText, activeTab === "stops" && styles.tabBtnTextActive]}>Stops</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "find" && styles.tabBtnActive]}
            onPress={() => setActiveTab("find")}
          >
            <Image source={require("../../assets/search-bar.png")} style={styles.searchImgTab} resizeMode="contain" />
            <Text style={[styles.tabBtnText, activeTab === "find" && styles.tabBtnTextActive]}>Find a bus</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {MOCK_STOPS.map((stop) => (
            <View key={stop.id} style={styles.stopCard}>
              <View style={styles.stopHeader}>
                <View style={styles.stopIconBox}>
                  <Image
                    source={require("../../assets/bus-icon.png")}
                    style={styles.busIconImg}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.stopInfo}>
                  <Text style={styles.stopName}>{stop.stopName}</Text>
                  <Text style={styles.stopMeta}>{stop.stopCode} · {stop.busLines}</Text>
                </View>
                <View style={styles.walkBadge}>
                  <Text style={styles.walkIcon}>🚶</Text>
                  <Text style={styles.walkText}>{stop.walkMin} min</Text>
                </View>
              </View>

              <View style={styles.busList}>
                {stop.buses.map((bus, idx) => (
                  <TouchableOpacity
                    key={bus.number}
                    style={[styles.busRow, idx < stop.buses.length - 1 && styles.busRowBorder]}
                    onPress={() => handleBusPress(bus)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.busNumBox}>
                      <Text style={styles.busNumText}>{bus.number}</Text>
                    </View>
                    <Text style={styles.busDest} numberOfLines={1}>to {bus.destination}</Text>
                    <View style={styles.timesRow}>
                      {bus.times.map((t, ti) => (
                        <View key={ti} style={styles.timeChip}>
                          <Text style={styles.timeText}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <View style={styles.endNote}>
            <Text style={styles.endNoteText}>🛣️ Showing stops near your route</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: GREEN },
  header: {
    backgroundColor: GREEN, flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 12, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center",
  },
  backIcon: { color: "#fff", fontSize: 26, fontWeight: "700", lineHeight: 30 },
  headerCenter: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  headerFrom: { color: "#fff", fontWeight: "700", fontSize: 13, flex: 1 },
  headerArrow: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  headerTo: { color: "#fff", fontWeight: "700", fontSize: 13, flex: 1, textAlign: "right" },
  micBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center",
  },
  micImgHeader: { width: 18, height: 18, tintColor: "#fff" },
  micIcon: { fontSize: 18 },
  sheet: { flex: 1, backgroundColor: GREEN },
  sheetHeader: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 },
  busIconImg: { width: 24, height: 24, tintColor: "#fff" },
  sheetTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  tabRow: { flexDirection: "row", marginHorizontal: 16, gap: 10, marginBottom: 12 },
  tabBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.15)",
  },
  tabBtnActive: { backgroundColor: GREEN_DARK },
  searchImgTab: { width: 16, height: 16, tintColor: "rgba(255,255,255,0.7)" },
  tabBtnIcon: { fontSize: 14 },
  tabBtnText: { color: "rgba(255,255,255,0.7)", fontWeight: "700", fontSize: 14 },
  tabBtnTextActive: { color: "#fff" },
  listContent: { paddingHorizontal: 12, paddingBottom: 30, gap: 10 },
  stopCard: {
    backgroundColor: CARD_BG, borderRadius: 14, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  stopHeader: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 12, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  stopIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  stopIconText: { fontSize: 20 },
  stopInfo: { flex: 1 },
  stopName: { color: TEXT_PRIMARY, fontWeight: "700", fontSize: 13 },
  stopMeta: { color: TEXT_MUTED, fontSize: 11, marginTop: 1 },
  walkBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  walkIcon: { fontSize: 14 },
  walkText: { color: TEXT_SECONDARY, fontSize: 12, fontWeight: "700" },
  busList: { paddingHorizontal: 12, paddingBottom: 4 },
  busRow: { flexDirection: "row", alignItems: "center", paddingVertical: 11, gap: 10 },
  busRowBorder: { borderBottomWidth: 1, borderBottomColor: BORDER },
  busNumBox: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, minWidth: 54, alignItems: "center", backgroundColor: GREEN },
  busNumText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  busDest: { flex: 1, color: TEXT_SECONDARY, fontSize: 12, fontWeight: "500" },
  timesRow: { flexDirection: "row", gap: 4 },
  timeChip: { backgroundColor: "#FEF9C3", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3 },
  timeText: { color: "#92400E", fontSize: 11, fontWeight: "700" },
  endNote: { alignItems: "center", paddingVertical: 10 },
  endNoteText: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
});