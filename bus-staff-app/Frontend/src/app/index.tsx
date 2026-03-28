import React, { useEffect } from 'react';
import { View,Text, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import "../../global.css"


export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000); // 2 Seconds exact
    return () => clearTimeout(timer);
  }, []);

  return (
    // bg-[#35C759] is the exact Citymapper Green
    <View className="flex-1 bg-[#35C759] items-center justify-center">
      <StatusBar hidden />
      
      {/* Central Smile Logo */}
      <Image 
        source={require('../../assets/splash_icon_full.png')} 
        className="w-48 h-48"
        resizeMode="contain"
      />

      {/* Bottom Citymapper Text */}
      {/* <View className="absolute bottom-12 w-full items-center"> */}
        <Image 
          source={require('../../assets/splash_icon_full.png')} 
          className="w-32 h-10"
          resizeMode="contain"
        />
        
      {/* </View> */}
      <Text>WHERE IS MY BUS</Text>
    </View>
  );
}