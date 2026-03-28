import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
export default function OnboardingScreen() {
    const router = useRouter();
  return (
    <View className="flex-1 bg-[#5BA943] px-6">
      <StatusBar hidden />
      
      {/* Header Section */}
      <View className="mt-20 items-center">
        {/* White circle with smile logo */}
        <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-5">
           <Image 
            source={require('../../assets/splash_icon_full.png')} 
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
        
        <Text className="text-white text-4xl font-bold mb-2">
          Where Is My Bus
        </Text>
        <Text className="text-white text-lg text-center font-medium opacity-90">
          The ultimate transport app
        </Text>
      </View>

      {/* Illustration Section (Bus & Rocket) */}
      <View className="flex-1 items-center justify-center">
        <Image 
          source={require('../../assets/bus_illustration.png')} 
          className="w-64 h-64"
          resizeMode="contain"
        />
        {/* SkyLine Silhouette Overlay (If you have it as asset) */}
        <View className="absolute bottom-0 w-full opacity-20">
             {/* Background skyline vector here */}
        </View>
      </View>

      {/* Action Button Section */}
      <View className="mb-14">
        {/* bg-[#EA9E32] is the exact Orange from your image */}
       <TouchableOpacity 
  activeOpacity={0.9}
  onPress={() => router.push('/location_permission' as any)}
  className="bg-[#EA9E32] w-full h-16 rounded-full flex-row items-center justify-center shadow-lg px-6"
>
  <Text className="text-white text-xl font-bold tracking-tight">
    Start
  </Text>
  
  {/* Right Side Chevron Arrow */}
  <View className="absolute right-8">
    <Text className="text-white text-2xl font-bold">›</Text>
  </View>
</TouchableOpacity>
      </View>
    </View>
  );
}