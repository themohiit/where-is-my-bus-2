import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

const GREEN = "#5BA943";
const GREEN_LIGHT = "#E8F5E2";
const BG = "#FFFFFF";
const BORDER = "#EFEFEF";
const TEXT_PRIMARY = "#1A1A2E";
const TEXT_SECONDARY = "#6B7280";
const TEXT_MUTED = "#9CA3AF";

// All stops per bus number
const BUS_STOPS: Record<string, { name: string; times?: string; passed?: boolean; current?: boolean }[]> = {
  "HR-01": [
    { name: "Sonipat Bus Stand", passed: true },
    { name: "Sonipat Sector 14", passed: true },
    { name: "Kundli Chowk", passed: true },
    { name: "GT Road Crossing", current: true, times: "2, 18, 34 min" },
    { name: "Singhu Border", times: "8, 24, 40 min" },
    { name: "Mukarba Chowk", times: "14, 30, 46 min" },
    { name: "Azadpur Metro", times: "20, 36, 52 min" },
    { name: "Kashmere Gate ISBT", times: "28, 44, 60 min" },
  ],
  "HR-22": [
    { name: "Hisar Bus Stand", passed: true },
    { name: "Rohtak Bypass", passed: true },
    { name: "Bahadurgarh", current: true, times: "5, 21, 37 min" },
    { name: "Tikri Border", times: "12, 28, 44 min" },
    { name: "Punjabi Bagh", times: "19, 35, 51 min" },
    { name: "Sarai Kale Khan ISBT", times: "30, 46, 62 min" },
  ],
  "HR-88": [
    { name: "Rewari Bus Stand", passed: true },
    { name: "Dharuhera", passed: true },
    { name: "Manesar", current: true, times: "3, 19, 35 min" },
    { name: "Kherki Daula", times: "9, 25, 41 min" },
    { name: "Rajiv Chowk Gurgaon", times: "16, 32, 48 min" },
    { name: "Dhaula Kuan", times: "23, 39, 55 min" },
    { name: "Delhi ISBT Anand Vihar", times: "35, 51, 67 min" },
  ],
  "HR-55": [
    { name: "Panipat Bus Stand", passed: true },
    { name: "Samalkha", passed: true },
    { name: "Gannaur", current: true, times: "4, 20, 36 min" },
    { name: "Kundli", times: "11, 27, 43 min" },
    { name: "Singhu Border", times: "17, 33, 49 min" },
    { name: "Kashmere Gate ISBT", times: "26, 42, 58 min" },
  ],
  "HR-77": [
    { name: "Karnal Bus Stand", passed: true },
    { name: "Panipat", passed: true },
    { name: "Murthal", current: true, times: "6, 22, 38 min" },
    { name: "Sonipat", times: "13, 29, 45 min" },
    { name: "Narela", times: "20, 36, 52 min" },
    { name: "Delhi Direct ISBT", times: "32, 48, 64 min" },
  ],
  "HR-12": [
    { name: "Rohtak Bus Stand", passed: true },
    { name: "Bahadurgarh", current: true, times: "7, 23, 39 min" },
    { name: "Nangloi", times: "15, 31, 47 min" },
    { name: "Punjabi Bagh", times: "21, 37, 53 min" },
    { name: "Anand Vihar ISBT", times: "32, 48, 64 min" },
  ],
  "HR-33": [
    { name: "Ambala Bus Stand", passed: true },
    { name: "Shahabad", passed: true },
    { name: "Kurukshetra", current: true, times: "3, 19, 35 min" },
    { name: "Pipli", times: "9, 25, 41 min" },
    { name: "Karnal", times: "18, 34, 50 min" },
    { name: "Chandigarh ISBT 17", times: "38, 54, 70 min" },
  ],
  "HR-44": [
    { name: "Bhiwani Bus Stand", passed: true },
    { name: "Jhajjar", current: true, times: "5, 21, 37 min" },
    { name: "Badli", times: "13, 29, 45 min" },
    { name: "Gurgaon Bus Stand", times: "25, 41, 57 min" },
  ],
};

const DEFAULT_STOPS = [
  { name: "Origin Stop", passed: true },
  { name: "Midway Stop", current: true, times: "5, 20, 35 min" },
  { name: "Next Stop", times: "12, 27, 42 min" },
  { name: "Destination Stop", times: "24, 39, 54 min" },
];

export default function BusDetailScreen() {
  const { busNumber, busName, route } = useLocalSearchParams<{
    busNumber: string;
    busName: string;
    route: string;
  }>();

  const stops = BUS_STOPS[busNumber] || DEFAULT_STOPS;
  const currentIdx = stops.findIndex((s) => s.current);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{busNumber}</Text>
        <TouchableOpacity style={styles.headerActionBtn}>
          <Text style={styles.headerActionIcon}>☆</Text>
        </TouchableOpacity>
      </View>

      {/* ── Route Label ── */}
      <View style={styles.routeBar}>
        <Text style={styles.routeText}>{busName || "Bus Route"}</Text>
        <Text style={styles.routeBadge}>{route || ""}</Text>
      </View>

      {/* ── Stop Timeline ── */}
      <ScrollView
        style={styles.timeline}
        contentContainerStyle={styles.timelineContent}
        showsVerticalScrollIndicator={false}
      >
        {stops.map((stop, index) => {
          const isPassed = stop.passed;
          const isCurrent = stop.current;
          const isUpcoming = !isPassed && !isCurrent;
          const isLast = index === stops.length - 1;

          return (
            <View key={index} style={styles.stopRow}>
              {/* Left: line + dot */}
              <View style={styles.stopLeft}>
                {/* Top segment */}
                {index > 0 ? (
                  <View
                    style={[
                      styles.lineSegment,
                      styles.lineTop,
                      (isPassed || isCurrent) && styles.lineActive,
                    ]}
                  />
                ) : (
                  <View style={styles.lineTopEmpty} />
                )}

                {/* Dot */}
                {isCurrent ? (
                  <View style={styles.dotCurrent}>
                    <View style={styles.dotCurrentInner} />
                  </View>
                ) : isPassed ? (
                  <View style={styles.dotPassed} />
                ) : (
                  <View style={styles.dotUpcoming} />
                )}

                {/* Bottom segment */}
                {!isLast ? (
                  <View
                    style={[
                      styles.lineSegment,
                      styles.lineBottom,
                      isPassed && styles.lineActive,
                    ]}
                  />
                ) : (
                  <View style={styles.lineBottomEmpty} />
                )}
              </View>

              {/* Right: stop info */}
              <View style={styles.stopRight}>
                <View style={styles.stopContent}>
                  <View style={styles.stopTextBlock}>
                    <Text
                      style={[
                        styles.stopName,
                        isCurrent && styles.stopNameCurrent,
                        isPassed && styles.stopNamePassed,
                      ]}
                    >
                      {stop.name}
                    </Text>
                    {isCurrent && stop.times && (
                      <View style={styles.timesRow}>
                        <Text style={styles.timesBolt}>⚡</Text>
                        <Text style={styles.timesText}>{stop.times}</Text>
                      </View>
                    )}
                  </View>

                  {isUpcoming && (
                    <TouchableOpacity style={styles.goBtn}>
                      <Text style={styles.goBtnText}>GO</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {!isLast && <View style={styles.rowDivider} />}
              </View>
            </View>
          );
        })}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // HEADER
  header: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { color: "#fff", fontSize: 28, fontWeight: "300", lineHeight: 32, marginTop: -2 },
  headerTitle: { flex: 1, color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center" },
  headerActionBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerActionIcon: { fontSize: 22, color: "#fff" },

  // ROUTE BAR
  routeBar: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  routeText: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "500", flex: 1 },
  routeBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },


  // TIMELINE
  timeline: { flex: 1, backgroundColor: BG },
  timelineContent: { paddingTop: 4 },

  stopRow: {
    flexDirection: "row",
    minHeight: 56,
  },

  // LEFT column (line + dot)
  stopLeft: {
    width: 52,
    alignItems: "center",
  },
  lineTopEmpty: { height: 12 },
  lineBottomEmpty: { flex: 1 },
  lineSegment: {
    width: 2,
    backgroundColor: BORDER,
  },
  lineTop: { height: 12 },
  lineBottom: { flex: 1 },
  lineActive: { backgroundColor: GREEN },

  dotPassed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
    opacity: 0.5,
  },
  dotCurrent: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  dotCurrentInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
  },
  dotUpcoming: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1D5DB",
  },

  // RIGHT column
  stopRight: { flex: 1, paddingRight: 16 },
  stopContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  stopTextBlock: { flex: 1 },
  stopName: {
    fontSize: 15,
    fontWeight: "500",
    color: TEXT_SECONDARY,
  },
  stopNameCurrent: {
    color: TEXT_PRIMARY,
    fontWeight: "700",
    fontSize: 15,
  },
  stopNamePassed: {
    color: TEXT_MUTED,
    fontWeight: "400",
  },
  timesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  timesBolt: { fontSize: 12 },
  timesText: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: "500",
  },
  goBtn: {
    backgroundColor: GREEN,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginLeft: 10,
    shadowColor: GREEN,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  goBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  rowDivider: { height: 1, backgroundColor: BORDER },
});