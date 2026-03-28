import { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const fadeTop = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const fadeMid = useRef(new Animated.Value(0)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeTop, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(fadeMid, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeBtn, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/bg-imge-home.png")}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ width, height }}
    >
      {/* Top: Logo + Title */}
      <Animated.View
        style={[
          styles.topSection,
          { opacity: fadeTop, transform: [{ translateY: slideUp }] },
        ]}
      >
        <View style={styles.logoCircle}>
          <Image
            source={require("../../assets/bus-icon.png")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Where Is My Bus</Text>
        <Text style={styles.subtitle}>Real-time bus tracking at your fingertips</Text>
      </Animated.View>

      {/* Middle: spacer so button stays at bottom */}
      <Animated.View style={[styles.illustrationArea, { opacity: fadeMid }]} />

      {/* Bottom: Start Button */}
      <Animated.View style={[styles.bottomSection, { opacity: fadeBtn }]}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("./home")}
          activeOpacity={0.85}
        >
          <Text style={styles.startText}>Start</Text>
          <Image
            source={require("../../assets/arrow-home-screen.png")}
            style={styles.startArrowImg}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 50,
  },

  // TOP
  topSection: {
    alignItems: "center",
    gap: 10,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  logoIcon: {
    width: 38,
    height: 38,
    tintColor: "#fff",
  },
  title: {
    marginTop: 10,
    paddingTop: 10,
    color: "#fff",
    fontSize: 36,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 17,
    fontWeight: "400",
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  // ILLUSTRATION
  illustrationArea: {
    flex: 1,
  },

  // BOTTOM
  bottomSection: {
    width: "100%",
    paddingHorizontal: 24,
  },
  startButton: {
    backgroundColor: "#E8A04A",
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  startText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "400",
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.5,
    flex: 1,
    textAlign: "center",
  },
  startArrowImg: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },
});