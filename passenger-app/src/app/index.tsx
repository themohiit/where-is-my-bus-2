import { useEffect, useRef } from "react";
import { View, Image, Text, Animated, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("./welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/bg-imge-home.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Dark overlay taaki icons visible rahein */}
      <View style={styles.overlay} />

      {/* Center: Bus Icon */}
      <Animated.View
        style={[
          styles.iconWrapper,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={require("../../assets/bus-icon.png")}
          style={styles.busIcon}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Bottom: App Name */}
      <Animated.View style={[styles.bottomBrand, { opacity: fadeAnim }]}>
        <Text style={styles.appName}>Where Is My Bus</Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(91, 169, 67, 0.55)", // green tint overlay
  },
  iconWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  busIcon: {
    width: 80,
    height: 80,
    tintColor: "#fff",
  },
  bottomBrand: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  appName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
    opacity: 0.9,
  },
});