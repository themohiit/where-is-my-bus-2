import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Add useLocalSearchParams
import { Ionicons } from '@expo/vector-icons';

export default function ConductorDashboard() {
  const router = useRouter();
  const params = useLocalSearchParams(); // This catches the data from the previous page

  // Dynamically use params or fallback to default data
  const tripData = {
    busNumber: params.busNumber || "N/A",
    source: params.source || "Unknown",
    destination: params.destination || "Unknown",
    startTime: params.startTime || "--:--",
    estimatedArrival: "Calculating..." // You can calculate this based on distance later
  };
  const handleEndTrip = async () => {
    // Here you can add any cleanup logic or API calls to update trip status before ending the trip
    try { const response = await fetch('http://localhost:3000/api/trips/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ busId: tripData.busNumber })
    });
    if (!response.ok) {
      throw new Error('Failed to end trip');
    }
  } catch (error) {
    console.error('Error ending trip:', error);
  }
}

  return (
    <View className="flex-1 bg-[#5BA943] px-6">
      <StatusBar barStyle="light-content" />
      
      {/* Custom Back Button */}
      <View className="absolute top-14 left-6 z-10">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-2 bg-white/10 rounded-full"
        >
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <SafeAreaView className="mt-12 px-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-3xl font-extrabold tracking-tight">
              {tripData.busNumber}
            </Text>
            <View className="flex-row items-center mt-1 bg-white/20 px-3 py-1 rounded-full self-start">
              <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              <Text className="text-white font-bold text-[10px] uppercase tracking-widest">
                Live Tracking On
              </Text>
            </View>
          </View>

          <View className="border border-white/40 p-2.5 rounded-full bg-white/5">
            <Ionicons name="bus" size={22} color="white" />
          </View>
        </View>
      </SafeAreaView>

      {/* Trip Details Card */}
      <View className="bg-white mt-10 rounded-[35px] p-8 shadow-2xl">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Source</Text>
            <Text className="text-[#5BA943] text-lg font-bold">{tripData.source}</Text>
          </View>
          
          <View className="px-4">
            <Ionicons name="arrow-forward" size={24} color="#5BA943" />
          </View>

          <View className="flex-1 items-end">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Destination</Text>
            <Text className="text-[#5BA943] text-lg font-bold text-right">{tripData.destination}</Text>
          </View>
        </View>

        <View className="h-[1px] bg-gray-100 my-6" />

        <View className="flex-row justify-between">
          <View>
            <Text className="text-gray-400 text-[10px] font-bold uppercase">Start Time</Text>
            <Text className="text-gray-800 text-xl font-bold">{tripData.startTime}</Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-400 text-[10px] font-bold uppercase">Status</Text>
            <Text className="text-gray-800 text-xl font-bold">In Transit</Text>
          </View>
        </View>

        <View className="mt-8 bg-[#5BA943]/10 p-4 rounded-2xl items-center border border-[#5BA943]/20">
          <Text className="text-[#5BA943] font-bold text-base uppercase tracking-widest">
              Trip Activated
          </Text>
        </View>
      </View>

      <View className="flex-1" />

      {/* End Trip Button */}
      <View className="mb-12">
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => {
            handleEndTrip(); // You can implement this function to handle any cleanup or API calls before ending the trip 
            router.replace('/driver_set');
          }}
          className="bg-[#E4A152] h-16 rounded-full flex-row items-center justify-center shadow-lg"
        >
          <Ionicons name="stop-circle" size={24} color="white" />
          <Text className="text-white text-xl font-bold ml-3 uppercase tracking-wider">
            End Trip
          </Text>
        </TouchableOpacity>
        <Text className="text-center text-white/70 mt-4 text-xs font-medium">
          Ending the trip will stop sharing your location.
        </Text>
      </View>
    </View>
  );
}