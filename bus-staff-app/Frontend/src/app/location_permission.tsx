import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location'; // 1. Import Location library

export default function LocationPermissionScreen() {
  const router = useRouter();

  // 2. Location Function
  const handleLocationRequest = async () => {
    try {
      // Permission maange ka popup aayega
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "Bhai, location on karni padegi tabhi bus track ho payegi!",
          [{ text: "OK" }]
        );
        return;
      }

      // Agar permission mil gayi, to next page par bhej do
      router.push('/driver_set' as any);
      
    } catch (error) {
      Alert.alert("Error", "Kuch gadbad ho gayi location on karne mein.");
    }
  };

  return (
    <View className="flex-1 bg-[#5BA943] px-8">
      <StatusBar barStyle="light-content" />

      {/* Back Button */}
      <View className="absolute top-14 left-6 z-10">
        <TouchableOpacity 
          onPress={() => router.replace('/onboarding')} 
          className="p-2"
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Top Icon */}
      <View className="items-center mt-24">
        <View className="w-24 h-24 items-center justify-center overflow-hidden">
          <Image 
            source={require('../../assets/location.png')} 
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Content */}
      <View className="items-center mt-10">
        <Text className="text-white text-4xl font-bold text-center">Allow Location</Text>
        <Text className="text-white text-xl font-semibold mt-4 text-center">We're a transport app</Text>
        <Text className="text-white text-lg text-center mt-6 leading-7 font-medium opacity-90">
          Location helps us get you from A to B
        </Text>
      </View>

      {/* Radar UI */}
      <View className="flex-1 justify-center items-center">
        <View className="w-40 h-40 rounded-full bg-white/10 items-center justify-center">
          <View className="w-28 h-28 rounded-full bg-white/20 items-center justify-center">
             <View className="w-6 h-6 bg-[#3878F4] rounded-full border-2 border-white shadow-xl" />
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View className="mb-12 w-full">
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={handleLocationRequest} // 3. Yahan function call kiya
          className="bg-[#E4A152] h-16 rounded-full flex-row items-center justify-center shadow-lg"
        >
          <Text className="text-white text-xl font-bold">OK</Text>
          <View className="absolute right-6">
            <Ionicons name="chevron-forward" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}