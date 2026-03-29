import React from "react";
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
import { Ionicons } from "@expo/vector-icons"; // Ensure you have expo-icons

const GREEN = "#5BA943";
const GREEN_LIGHT = "#E8F5E2";
const BG = "#FFFFFF";
const BORDER = "#EFEFEF";
const TEXT_PRIMARY = "#1A1A2E";
const TEXT_SECONDARY = "#6B7280";
const TEXT_MUTED = "#9CA3AF";

// ... Keep your BUS_STOPS and DEFAULT_STOPS constants here ...
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
      <View style={{ flex: 1 }}>
        {/* Background Continuous Line */}
        <View style={styles.absoluteLineContainer}>
          <View style={styles.backgroundLine} />
        </View>

        <ScrollView
          style={styles.timeline}
          contentContainerStyle={styles.timelineContent}
          showsVerticalScrollIndicator={false}
        >
          {stops.map((stop: any, index: number) => {
            const isPassed = stop.passed;
            const isCurrent = stop.current;
            const isLast = index === stops.length - 1;

            return (
              <View key={index} style={styles.stopRow}>
                {/* Left: Arrival Times (Similar to 2:49 PM in photo) */}
                <View style={styles.timeLeftBlock}>
                  <Text style={styles.timeMainText}>
                    {isCurrent ? "Live" : "---"}
                  </Text>
                  {isPassed && <Text style={styles.timeSubText}>Passed</Text>}
                </View>

                {/* Center: The Dot/Bus Icon */}
                <View style={styles.centerIndicator}>
                   {isCurrent ? (
                     <View style={styles.busIconContainer}>
                        <Ionicons name="bus" size={18} color="white" />
                     </View>
                   ) : (
                     <View style={[styles.dotSmall, isPassed && styles.dotActive]} />
                   )}
                </View>

                {/* Right: Station Info */}
                <View style={styles.stopInfoRight}>
                  <View style={styles.stationTextRow}>
                    <Text style={[
                      styles.stationName, 
                      isCurrent && styles.activeStationText,
                      isPassed && styles.passedStationText
                    ]}>
                      {stop.name}
                    </Text>
                    
                    <Text style={styles.distanceText}>
                      {index * 4} km
                    </Text>
                  </View>

                  {isCurrent && stop.times && (
                    <Text style={styles.liveUpdateText}>
                      Next: {stop.times.split(',')[0]}
                    </Text>
                  )}
                  
                  {/* Departure time on far right */}
                  <Text style={styles.departureTimeText}>
                    {isLast ? "End" : "Sch."}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      
      {/* Bottom Status Bar (matching 'Arrived Sonipat Junction') */}
      <View style={styles.bottomStatus}>
         <Text style={styles.statusMain}>Current Status: {stops.find((s: any) => s.current)?.name}</Text>
         <Text style={styles.statusSub}>Updated just now</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  backIcon: { color: "#fff", fontSize: 28, fontWeight: "300", lineHeight: 32 },
  headerTitle: { flex: 1, color: "#fff", fontSize: 20, fontWeight: "700", textAlign: "center" },
  headerActionBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerActionIcon: { fontSize: 22, color: "#fff" },

  routeBar: { backgroundColor: GREEN, flexDirection: "row", paddingHorizontal: 18, paddingBottom: 12 },
  routeText: { color: "#fff", fontSize: 13, flex: 1, opacity: 0.9 },
  routeBadge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, color: "#fff", fontSize: 11 },

  // TIMELINE LOGIC
  timeline: { flex: 1 },
  timelineContent: { paddingVertical: 20 },
  
  // The blue line from the photo (placed behind everything)
  absoluteLineContainer: {
    position: 'absolute',
    left: 88, // Centers line under the dots
    top: 0,
    bottom: 0,
    width: 6,
    alignItems: 'center',
  },
  backgroundLine: {
    width: 6,
    height: '100%',
    backgroundColor: BORDER, // Change to GREEN if you want the whole line active
    borderRadius: 3,
  },

  stopRow: {
    flexDirection: "row",
    minHeight: 100,
    paddingHorizontal: 10,
  },

  // Time on left
  timeLeftBlock: { width: 70, alignItems: 'flex-end', paddingRight: 10, paddingTop: 4 },
  timeMainText: { fontSize: 13, fontWeight: '700', color: TEXT_PRIMARY },
  timeSubText: { fontSize: 11, color: GREEN, fontWeight: '600' },

  // Center Dot/Icon
  centerIndicator: { width: 30, alignItems: 'center', zIndex: 10 },
  dotSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: BORDER,
    marginTop: 6,
  },
  dotActive: { borderColor: GREEN, backgroundColor: GREEN },
  busIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GREEN, // Matching your color theme
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  // Info on right
  stopInfoRight: { flex: 1, paddingLeft: 15, position: 'relative' },
  stationTextRow: { flexDirection: 'row', justifyContent: 'space-between', paddingRight: 15 },
  stationName: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY },
  activeStationText: { color: GREEN },
  passedStationText: { color: TEXT_MUTED },
  distanceText: { fontSize: 12, color: TEXT_SECONDARY },
  liveUpdateText: { color: GREEN, fontSize: 12, fontWeight: '700', marginTop: 4 },
  departureTimeText: { 
    position: 'absolute', 
    right: 15, 
    top: 25, 
    fontSize: 13, 
    color: TEXT_SECONDARY,
    fontWeight: '500'
  },

  // Bottom Status
  bottomStatus: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  statusMain: { fontSize: 14, fontWeight: '800', color: TEXT_PRIMARY },
  statusSub: { fontSize: 12, color: TEXT_SECONDARY, marginTop: 2 },
});