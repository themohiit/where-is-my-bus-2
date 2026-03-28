// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';

// export default function ConductorDashboard() {
//   const router = useRouter();
  
//   // Hardcoded Data (Baad mein isse params se le sakte ho)
//   const tripData = {
//     busNumber: "BUS 104",
//     source: "Central Station",
//     destination: "Airport Terminal 2",
//     startTime: "04:30 PM",
//     estimatedArrival: "05:15 PM"
//   };

//   return (
//     <View className="flex-1 bg-[#5BA943] px-6">
//       <StatusBar barStyle="light-content" />
//       {/* Custom Back Button - Top Left */}
//       <View className="absolute top-14 left-6 z-10">
//         <TouchableOpacity 
//           onPress={() => router.back()} // Driver Setup par wapas jane ke liye
//           activeOpacity={0.7}
//           className="p-2 bg-white/10 rounded-full"
//         >
//           <Ionicons name="arrow-back" size={26} color="white" />
//         </TouchableOpacity>
//       </View>
//       {/* Top Header Section */}
//       <SafeAreaView className="mt-8 items-center">
//         <View className="mb-2">
//           <Ionicons name="bus" size={40} color="white" />
//         </View>
//         <Text className="text-white text-2xl font-bold">{tripData.busNumber}</Text>
//         <View className="flex-row items-center mt-2 bg-white/20 px-4 py-1 rounded-full">
//           <View className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
//           <Text className="text-white font-bold text-xs uppercase tracking-widest">Live Tracking On</Text>
//         </View>
//       </SafeAreaView>

//       {/* Trip Details Card */}
//       <View className="bg-white mt-10 rounded-[35px] p-8 shadow-2xl">
//         {/* Route Row */}
//         <View className="flex-row justify-between items-center">
//           <View className="flex-1">
//             <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Source</Text>
//             <Text className="text-[#5BA943] text-lg font-bold">{tripData.source}</Text>
//           </View>
          
//           <View className="px-4">
//             <Ionicons name="arrow-forward" size={24} color="#5BA943" />
//           </View>

//           <View className="flex-1 items-end">
//             <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Destination</Text>
//             <Text className="text-[#5BA943] text-lg font-bold text-right">{tripData.destination}</Text>
//           </View>
//         </View>

//         <View className="h-[1px] bg-gray-100 my-6" />

//         {/* Time Row */}
//         <View className="flex-row justify-between">
//           <View>
//             <Text className="text-gray-400 text-[10px] font-bold uppercase">Start Time</Text>
//             <Text className="text-gray-800 text-xl font-bold">{tripData.startTime}</Text>
//           </View>
//           <View className="items-end">
//             <Text className="text-gray-400 text-[10px] font-bold uppercase">Est. Arrival</Text>
//             <Text className="text-gray-800 text-xl font-bold">{tripData.estimatedArrival}</Text>
//           </View>
//         </View>

//         {/* Status Badge */}
//         <View className="mt-8 bg-[#5BA943]/10 p-4 rounded-2xl items-center border border-[#5BA943]/20">
//           <Text className="text-[#5BA943] font-bold text-base uppercase tracking-widest">
//              Trip Activated
//           </Text>
//         </View>
//       </View>

//       <View className="flex-1" />

//       {/* End Trip Button */}
//       <View className="mb-12">
//         <TouchableOpacity 
//           activeOpacity={0.8}
//           onPress={() => {
//             router.replace('/driver_set' as any);
//           }}
//           className="bg-[#E4A152] h-16 rounded-full flex-row items-center justify-center shadow-lg"
//         >
//           <Ionicons name="stop-circle" size={24} color="white" />
//           <Text className="text-white text-xl font-bold ml-3 uppercase tracking-wider">
//             End Trip
//           </Text>
//         </TouchableOpacity>
//         <Text className="text-center text-white/70 mt-4 text-xs font-medium">
//           Ending the trip will stop sharing your location.
//         </Text>
//       </View>
//     </View>
//   );
// }

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ConductorDashboard() {
  const router = useRouter();
  
  const tripData = {
    busNumber: "BUS 104",
    source: "Central Station",
    destination: "Airport Terminal 2",
    startTime: "04:30 PM",
    estimatedArrival: "05:15 PM"
  };

  return (
    <View className="flex-1 bg-[#5BA943] px-6">
      <StatusBar barStyle="light-content" />
      
      {/* Custom Back Button - Top Left */}
      <View className="absolute top-14 left-6 z-10">
        <TouchableOpacity 
          onPress={() => router.back()} // Driver Setup par wapas jane ke liye
          activeOpacity={0.7}
          className="p-2 bg-white/10 rounded-full"
        >
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Top Header Section */}
      {/* <SafeAreaView className="mt-12 items-center">
        <View className="bg-white/20 p-4 rounded-full mb-2">
          <Ionicons name="bus" size={40} color="white" />
        </View>
        <Text className="text-white text-2xl font-bold">{tripData.busNumber}</Text>
        <View className="flex-row items-center mt-2 bg-white/20 px-4 py-1 rounded-full">
          <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
          <Text className="text-white font-bold text-xs uppercase tracking-widest">Live Tracking On</Text>
        </View>
      </SafeAreaView> */}
      <SafeAreaView className="mt-12 px-6">
  <View className="flex-row items-center justify-between">
    {/* Left Side: Bus Number & Live Status */}
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

    {/* Right Side: Small & Thin Border Bus Icon */}
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
            <Text className="text-gray-400 text-[10px] font-bold uppercase">Est. Arrival</Text>
            <Text className="text-gray-800 text-xl font-bold">{tripData.estimatedArrival}</Text>
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