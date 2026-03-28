import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Keyboard,
} from "react-native";
import { router } from "expo-router";

const GREEN = "#5BA943";
const BG = "#FFFFFF";
const CARD_BG = "#F7F8FA";
const BORDER = "#E8EAF0";
const TEXT_PRIMARY = "#1A1A2E";
const TEXT_SECONDARY = "#6B7280";
const TEXT_MUTED = "#9CA3AF";

const AREAS = [
  "Sonipat Bus Stand",
  "Panipat Bus Stand",
  "Karnal Bus Stand",
  "Delhi ISBT Kashmere Gate",
  "Delhi ISBT Anand Vihar",
  "Delhi ISBT Sarai Kale Khan",
  "Rohtak Bus Stand",
  "Bahadurgarh Bus Stand",
  "Gurgaon Bus Stand",
  "Faridabad Bus Stand",
  "Ambala Bus Stand",
  "Kurukshetra Bus Stand",
  "Chandigarh ISBT 17",
  "Hisar Bus Stand",
  "Sirsa Bus Stand",
  "Bhiwani Bus Stand",
  "Jhajjar Bus Stand",
  "Rewari Bus Stand",
];

const BUS_DATA = [
  { number: "HR-01", name: "Sonipat – Delhi Express", route: "SNP → DLI", time: "6:00 AM" },
  { number: "HR-55", name: "Panipat – Kashmere Gate", route: "PNP → KG", time: "7:30 AM" },
  { number: "HR-12", name: "Rohtak – Anand Vihar", route: "RHK → AV", time: "8:00 AM" },
  { number: "HR-77", name: "Karnal – Delhi Direct", route: "KNL → DLI", time: "9:15 AM" },
  { number: "HR-33", name: "Ambala – Chandigarh", route: "ABL → CHD", time: "10:00 AM" },
  { number: "HR-22", name: "Hisar – Delhi Sarai Kale Khan", route: "HSR → SKK", time: "5:45 AM" },
  { number: "HR-44", name: "Bhiwani – Gurgaon", route: "BHW → GGN", time: "11:00 AM" },
  { number: "HR-88", name: "Rewari – Delhi ISBT", route: "REW → DLI", time: "6:30 AM" },
];

const SEARCH_HISTORY = [
  { id: "HR-01", name: "Sonipat – Delhi Express", route: "SNP → DLI" },
  { id: "HR-55", name: "Panipat – Kashmere Gate", route: "PNP → KG" },
  { id: "HR-12", name: "Rohtak – Anand Vihar", route: "RHK → AV" },
  { id: "HR-77", name: "Karnal – Delhi Direct", route: "KNL → DLI" },
  { id: "HR-33", name: "Ambala – Chandigarh", route: "ABL → CHD" },
];

type ActiveField = "from" | "to" | null;

export default function HomeScreen() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromSelected, setFromSelected] = useState("");
  const [toSelected, setToSelected] = useState("");
  const [activeField, setActiveField] = useState<ActiveField>(null);

  const [busQuery, setBusQuery] = useState("");
  const [busResults, setBusResults] = useState<typeof BUS_DATA>([]);
  const [busSearched, setBusSearched] = useState(false);

  const fromRef = useRef<TextInput>(null);
  const toRef = useRef<TextInput>(null);

  const fromSuggestions =
    fromText.length > 0
      ? AREAS.filter((a) => a.toLowerCase().includes(fromText.toLowerCase()))
      : [];

  const toSuggestions =
    toText.length > 0
      ? AREAS.filter((a) => a.toLowerCase().includes(toText.toLowerCase()))
      : [];

  const handleFromSelect = (area: string) => {
    setFromText(area);
    setFromSelected(area);
    setActiveField(null);
    Keyboard.dismiss();
  };

  const handleToSelect = (area: string) => {
    setToText(area);
    setToSelected(area);
    setActiveField(null);
    Keyboard.dismiss();
  };

  const handleSwap = () => {
    const tempText = fromText;
    const tempSelected = fromSelected;
    setFromText(toText);
    setFromSelected(toSelected);
    setToText(tempText);
    setToSelected(tempSelected);
  };

  const handleFindBuses = () => {
    Keyboard.dismiss();
    const from = fromText.trim() || "Any Station";
    const to = toText.trim() || "Any Station";
    router.push({ pathname: "/find-buses", params: { from, to } });
  };

  const handleBusSearch = () => {
    Keyboard.dismiss();
    if (!busQuery.trim()) return;
    const results = BUS_DATA.filter(
      (b) =>
        b.number.toLowerCase().includes(busQuery.toLowerCase()) ||
        b.name.toLowerCase().includes(busQuery.toLowerCase())
    );
    setBusResults(results);
    setBusSearched(true);
  };

  const showFromSuggestions = activeField === "from" && fromSuggestions.length > 0;
  const showToSuggestions = activeField === "to" && toSuggestions.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/")}>
          <Text style={styles.menuIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Where Is My Bus</Text>
        <View style={styles.headerIcon} />
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={styles.tabTextActive}>ROADWAYS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabTextInactive}>CITY BUS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── From / To Card ── */}
        <View style={styles.card}>
          {/* FROM */}
          <View style={[
            styles.stationRow,
            activeField === "from" && styles.stationRowFocused
          ]}>
            <Image source={require("../../assets/search-bar.png")} style={styles.stationIcon} resizeMode="contain" />
            <TextInput
              ref={fromRef}
              style={styles.stationInput}
              placeholder="From Station"
              placeholderTextColor={TEXT_MUTED}
              value={fromText}
              onChangeText={(t) => {
                setFromText(t);
                setFromSelected("");
                setActiveField("from");
              }}
              onFocus={() => setActiveField("from")}
              onBlur={() => setActiveField(null)}
            />
            {fromText.length > 0 ? (
              <TouchableOpacity onPress={() => { setFromText(""); setFromSelected(""); }}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Image source={require("../../assets/mic.png")} style={styles.micImg} resizeMode="contain" />
              </TouchableOpacity>
            )}
          </View>

          {showFromSuggestions && (
            <View style={styles.suggestionsBox}>
              {fromSuggestions.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={styles.suggestionItem}
                  onPress={() => handleFromSelect(area)}
                >
                  <Text style={styles.suggestionDot}>📍</Text>
                  <Text style={styles.suggestionText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* DIVIDER + SWAP */}
          <View style={styles.dividerRow}>
            <View style={styles.dottedLine} />
            <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          {/* TO */}
          <View style={[
            styles.stationRow,
            activeField === "to" && styles.stationRowFocused
          ]}>
            <Image source={require("../../assets/search-bar.png")} style={styles.stationIcon} resizeMode="contain" />
            <TextInput
              ref={toRef}
              style={styles.stationInput}
              placeholder="To Station"
              placeholderTextColor={TEXT_MUTED}
              value={toText}
              onChangeText={(t) => {
                setToText(t);
                setToSelected("");
                setActiveField("to");
              }}
              onFocus={() => setActiveField("to")}
              onBlur={() => setActiveField(null)}
            />
            {toText.length > 0 ? (
              <TouchableOpacity onPress={() => { setToText(""); setToSelected(""); }}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Image source={require("../../assets/mic.png")} style={styles.micImg} resizeMode="contain" />
              </TouchableOpacity>
            )}
          </View>

          {showToSuggestions && (
            <View style={styles.suggestionsBox}>
              {toSuggestions.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={styles.suggestionItem}
                  onPress={() => handleToSelect(area)}
                >
                  <Text style={styles.suggestionDot}>📍</Text>
                  <Text style={styles.suggestionText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* FIND BUTTON */}
          <TouchableOpacity style={styles.findBtn} activeOpacity={0.85} onPress={handleFindBuses}>
            <Text style={styles.findBtnText}>Find Buses</Text>
          </TouchableOpacity>
        </View>

        {/* ── Search by Bus Number ── */}
        <View style={styles.card}>
          <View style={styles.busSearchRow}>
            <View style={styles.busNumberBadge}>
              <Text style={styles.busNumberBadgeText}>HR</Text>
            </View>
            <TextInput
              style={styles.busInput}
              placeholder="Search by bus number or name"
              placeholderTextColor={TEXT_MUTED}
              value={busQuery}
              onChangeText={(t) => {
                setBusQuery(t);
                if (!t.trim()) { setBusResults([]); setBusSearched(false); }
              }}
              onFocus={() => setActiveField(null)}
              returnKeyType="search"
              onSubmitEditing={handleBusSearch}
            />
            <TouchableOpacity style={styles.busSearchBtn} onPress={handleBusSearch}>
              <Image source={require("../../assets/search-bar.png")} style={styles.busSearchImg} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          {busSearched && busResults.length === 0 && (
            <View style={styles.noResultBox}>
              <Text style={styles.noResultText}>No buses found for "{busQuery}"</Text>
            </View>
          )}

          {busResults.length > 0 && (
            <View style={styles.busResultsList}>
              {busResults.map((bus, index) => (
                <TouchableOpacity
                  key={bus.number}
                  style={[styles.busResultItem, index < busResults.length - 1 && styles.busResultBorder]}
                  activeOpacity={0.7}
                >
                  <View style={styles.busResultLeft}>
                    <View style={styles.busResultBadge}>
                      <Text style={styles.busResultBadgeText}>{bus.number}</Text>
                    </View>
                    <View>
                      <Text style={styles.busResultName}>{bus.name}</Text>
                      <Text style={styles.busResultRoute}>{bus.route} · {bus.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.historyArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Search History ── */}
        <View style={styles.historyCard}>
          <Text style={styles.historyLabel}>SEARCH HISTORY</Text>
          {SEARCH_HISTORY.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.historyRow, index < SEARCH_HISTORY.length - 1 && styles.historyRowBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.historyLeft}>
                <Text style={styles.historyId}>{item.id}</Text>
                <Text style={styles.historyName} numberOfLines={1}>{item.name}</Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyRoute}>{item.route}</Text>
                <Text style={styles.historyArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom Nav ── */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={styles.navLabel}>PNR</Text>
        </TouchableOpacity>
        <View style={styles.navDivider} />
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🎟️</Text>
          <Text style={styles.navLabel}>TICKETS</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: GREEN },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 18, paddingVertical: 14, backgroundColor: GREEN,
  },
  headerIcon: { padding: 4 },
  menuIcon: { fontSize: 26, color: "#fff", fontWeight: "700" },
  micIcon: { fontSize: 20 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700", letterSpacing: 0.3 },
  tabRow: {
    flexDirection: "row", backgroundColor: "rgba(0,0,0,0.15)",
    marginHorizontal: 16, borderRadius: 10, padding: 4, marginBottom: 14,
  },
  tab: { flex: 1, paddingVertical: 9, alignItems: "center", borderRadius: 8 },
  tabActive: { backgroundColor: "#fff" },
  tabTextActive: { color: GREEN, fontWeight: "800", fontSize: 13, letterSpacing: 1 },
  tabTextInactive: { color: "rgba(255,255,255,0.75)", fontWeight: "700", fontSize: 13, letterSpacing: 1 },
  scroll: { flex: 1, backgroundColor: BG, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  scrollContent: { padding: 16, paddingTop: 6, paddingBottom: 100 },
  card: {
    backgroundColor: CARD_BG, borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  stationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  stationRowFocused: {
    borderColor: "rgba(91, 169, 67, 0.3)",
    backgroundColor: "rgba(91, 169, 67, 0.05)",
    paddingVertical: 10,
  },
  stationIcon: { width: 20, height: 20, tintColor: GREEN },
  micImg: { width: 22, height: 22, tintColor: TEXT_MUTED },
  stationDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: GREEN },
  stationDotOutline: { backgroundColor: "transparent", borderWidth: 2, borderColor: GREEN },
  stationInput: { flex: 1, fontSize: 15, fontWeight: "600", color: TEXT_PRIMARY, paddingVertical: 6, paddingLeft: 4 },
  clearBtn: { color: TEXT_MUTED, fontSize: 16, paddingHorizontal: 4 },
  suggestionsBox: {
    backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: BORDER,
    marginTop: 4, marginLeft: 24, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  suggestionItem: {
    flexDirection: "row", alignItems: "center", paddingVertical: 11,
    paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: BORDER, gap: 10,
  },
  suggestionDot: { fontSize: 13 },
  suggestionText: { color: TEXT_PRIMARY, fontSize: 14, fontWeight: "500" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginLeft: 5, marginVertical: 4 },
  dottedLine: {
    width: 2, height: 24, borderStyle: "dashed", borderWidth: 1,
    borderColor: "#CDD0D8", marginLeft: 5,
  },
  swapBtn: {
    marginLeft: "auto", width: 36, height: 36, borderRadius: 18,
    backgroundColor: GREEN, alignItems: "center", justifyContent: "center",
    elevation: 4, shadowColor: GREEN, shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  swapIcon: { color: "#fff", fontSize: 18, fontWeight: "700" },
  findBtn: {
    marginTop: 14, backgroundColor: GREEN, borderRadius: 10, paddingVertical: 15, alignItems: "center",
    elevation: 4, shadowColor: GREEN, shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  findBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  busSearchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  busNumberBadge: { backgroundColor: "#E8F5E2", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  busNumberBadgeText: { color: GREEN, fontWeight: "800", fontSize: 13 },
  busInput: { flex: 1, fontSize: 14, fontWeight: "500", color: TEXT_PRIMARY, paddingVertical: 6 },
  busSearchBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  busSearchImg: { width: 20, height: 20, tintColor: "#fff" },
  noResultBox: { marginTop: 12, alignItems: "center", paddingVertical: 8 },
  noResultText: { color: TEXT_MUTED, fontSize: 13 },
  busResultsList: { marginTop: 12 },
  busResultItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  busResultBorder: { borderBottomWidth: 1, borderBottomColor: BORDER },
  busResultLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  busResultBadge: { backgroundColor: "#E8F5E2", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  busResultBadgeText: { color: GREEN, fontWeight: "800", fontSize: 12 },
  busResultName: { color: TEXT_PRIMARY, fontSize: 13, fontWeight: "600" },
  busResultRoute: { color: TEXT_SECONDARY, fontSize: 12, marginTop: 2 },
  historyCard: {
    backgroundColor: CARD_BG, borderRadius: 14, paddingTop: 14,
    borderWidth: 1, borderColor: BORDER, elevation: 2, overflow: "hidden",
  },
  historyLabel: { color: TEXT_MUTED, fontSize: 11, fontWeight: "700", letterSpacing: 1.2, paddingHorizontal: 16, marginBottom: 8 },
  historyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13 },
  historyRowBorder: { borderBottomWidth: 1, borderBottomColor: BORDER },
  historyLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  historyId: {
    color: GREEN, fontSize: 12, fontWeight: "800", backgroundColor: "#E8F5E2",
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, overflow: "hidden",
  },
  historyName: { color: TEXT_PRIMARY, fontSize: 13, fontWeight: "500", flex: 1 },
  historyRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  historyRoute: { color: TEXT_SECONDARY, fontSize: 12, fontWeight: "600" },
  historyArrow: { color: GREEN, fontSize: 20, fontWeight: "700", lineHeight: 22 },
  bottomNav: {
    flexDirection: "row", backgroundColor: "#fff", borderTopWidth: 1,
    borderTopColor: BORDER, paddingVertical: 12, paddingHorizontal: 30,
  },
  navItem: { flex: 1, alignItems: "center", gap: 3 },
  navIcon: { fontSize: 20 },
  navLabel: { color: TEXT_SECONDARY, fontSize: 11, fontWeight: "700", letterSpacing: 0.8 },
  navDivider: { width: 1, backgroundColor: BORDER, marginVertical: 4 },
});