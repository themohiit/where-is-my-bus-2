import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function DriverSetup() {
  const router = useRouter();
  const [busNumber, setBusNumber] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

//   const handleStartTrip = async () => {
//     if (!busNumber || !source || !destination) {
//       Alert.alert("Missing Info", "please fill all the details!");
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       let location = await Location.getCurrentPositionAsync({});
//       console.log("Trip Started!", busNumber, location.coords.latitude);
      
//       setLoading(false);
      
//       // Navigate directly - this triggers the screen
//       router.push('/conductor_dashboard' as any);
      
//     } catch (error) {
//       setLoading(false);
//       Alert.alert("Error", "check GPS. Please enable location services.");
//       console.error(error);
//     }
//   };
const handleStartTrip = async () => {
  if (!busNumber || !source || !destination) {
    Alert.alert("Missing Info", "please fill all the details!");
    return;
  }
  
  setLoading(true);
  
  try {
    // Timeout aur Low Accuracy add karo taaki stuck na ho
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low, // High se Low karke check karo
    });
    
    console.log("Trip Started!", busNumber);
    setLoading(false);

    // Navigate logic
    router.push('/conductor_dashboard'); 
    
  } catch (error) {
    setLoading(false);
    // Agar GPS off hai toh error aayega
    Alert.alert("Error", "Check GPS. Please enable location services.");
    console.error(error);
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar barStyle="light-content" />
      
      {/* Compact Header */}
      <View className="bg-[#5BA943] pt-12 pb-6 px-6 rounded-b-[30px] shadow-md flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.push("/location_permission" as any)} className="bg-white/20 p-2 rounded-full">
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold tracking-tight">DRIVER SETUP</Text>
        <Ionicons name="bus" size={24} color="white" className="opacity-80" />
      </View>

      <View className="flex-1 px-6 pt-6">
        {/* Compact Input Form Card */}
        <View className="bg-gray-50 p-6 rounded-[25px] border border-gray-100">
          
          {/* Bus Number */}
          <View className="mb-4">
            <Text className="text-gray-400 font-bold mb-1 ml-1 text-[9px] tracking-widest uppercase">Bus ID</Text>
            <View className="bg-white flex-row items-center px-4 h-14 rounded-xl border border-gray-200">
              <TextInput 
                placeholder="e.g. 104"
                className="flex-1 text-base text-gray-800"
                value={busNumber}
                onChangeText={setBusNumber}
              />
              <Ionicons name="barcode-outline" size={18} color="#35C759" />
            </View>
          </View>

          {/* Source */}
          <View className="mb-4">
            <Text className="text-gray-400 font-bold mb-1 ml-1 text-[9px] tracking-widest uppercase">From</Text>
            <View className="bg-white flex-row items-center px-4 h-14 rounded-xl border border-gray-200">
              <TextInput 
                placeholder="Starting Point"
                className="flex-1 text-base text-gray-800"
                value={source}
                onChangeText={setSource}
              />
              <Ionicons name="navigate-outline" size={18} color="#35C759" />
            </View>
          </View>

          {/* Destination */}
          <View className="mb-2">
            <Text className="text-gray-400 font-bold mb-1 ml-1 text-[9px] tracking-widest uppercase">To</Text>
            <View className="bg-white flex-row items-center px-4 h-14 rounded-xl border border-gray-200">
              <TextInput 
                placeholder="Destination"
                className="flex-1 text-base text-gray-800"
                value={destination}
                onChangeText={setDestination}
              />
              <Ionicons name="flag-outline" size={18} color="#35C759" />
            </View>
          </View>
        </View>

        {/* Compact Start Trip Button */}
        <TouchableOpacity 
          onPress={handleStartTrip}
          
          disabled={loading}
          activeOpacity={1}
          className={`mt-8 h-14 rounded-2xl flex-row items-center justify-center shadow-md ${loading ? 'bg-gray-400' : 'bg-[#E4A152]'}`}
        >
          <Text className="text-white text-lg font-bold uppercase tracking-wider">
            {loading ? 'Starting...' : 'Start Trip'}
          </Text>
          {!loading && <Ionicons name="play" size={18} color="white" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>

        <Text className="text-center text-gray-400 mt-4 text-[10px]">
          Live tracking will start immediately.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}