import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StatusBar, 
  Alert, KeyboardAvoidingView, Platform, ActivityIndicator, 
  FlatList, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

const BUS_STANDS = [
  "Delhi ISBT", 
  "Ambala",
  "Chandigarh",
  "Karnal",
  "Jind",
  "Kaithal",
  "Sonipat",
  "Yamunanagar",
  "Delhi Depot (Haryana Roadways)",
  "Kurukshetra",
  "Panipat",
  "Gurugram",
  "Rohtak",
  "Hisar",
  "Rewari",
  "Bhiwani",
  "Sirsa",
  "Faridabad",
  "Fatehabad",
  "Jhajjar",
  "Narnaul",
  "Charkhi Dadri",
  "Faridabad City Bus Service (CBS)",
  "Palwal",
  "Nuh",
  "Naraingarh",
  "Kalka",
  "Panchkula",
  "Narwana",
  "Safidon",
  "Gohana",
  "Pehowa",
  "Hansi",
  "Tosham",
  "Dabwali",
  "Tohana",
  "Bahadurgarh",
  "Loharu"
];

export default function DriverSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    busNumber: '',
    source: '',
    destination: ''
  });
  
  const [activeField, setActiveField] = useState(null); 
  const [filteredStands, setFilteredStands] = useState([]);

  // Corrected Filter Logic
  const handleSearch = (text: string, fieldName: any) => {
    // Update the specific field in the form object
    setForm(prev => ({ ...prev, [fieldName]: text }));

    if (text.trim().length > 0) {
      const results:any = BUS_STANDS.filter(stand => 
        stand.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStands(results);
      setActiveField(fieldName);
    } else {
      setFilteredStands([]);
      setActiveField(null);
    }
  };

  const selectStand = (standName:string, fieldName:string) => {
    setForm(prev => ({ ...prev, [fieldName]: standName }));
    setFilteredStands([]);
    setActiveField(null);
    Keyboard.dismiss();
  };

  const sendLocationUpdate = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await fetch('http://localhost:3000/api/trips/update-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: form.busNumber,
          coordinates: [location.coords.longitude, location.coords.latitude],
        }),
      });
    } catch (err) {
      console.error("Tracking update failed", err);
    }
  };

  const handleStartTrip = async () => {
    const { busNumber, source, destination } = form;
    
    // Validation against the allowed list
    const isSourceValid = BUS_STANDS.includes(source);
    const isDestValid = BUS_STANDS.includes(destination);

    if (!isSourceValid || !isDestValid) {
      Alert.alert("Invalid Route", "Please select valid bus stands from the suggestions.");
      return;
    }

    if (!busNumber.trim()) {
      Alert.alert("Missing Info", "Please enter a Bus ID.");
      return;
    }
    
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Error", "Location access is required.");
        setLoading(false);
        return;
      }
      setForm({ busNumber: '', source: '', destination: '' }); // Clear form to prevent duplicate submissions while loading 
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

      const response = await fetch('http://localhost:3000/api/trips/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: busNumber,
          source,
          destination,
          coordinates: [location.coords.longitude, location.coords.latitude],
          startTime: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setInterval(sendLocationUpdate, 10000); 
        setLoading(false);
        router.push({
          pathname: '/conductor_dashboard',
          params: { 
            busNumber: form.busNumber, 
            source: form.source, 
            destination: form.destination,
            startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        });
      } else {
        setLoading(false);
        Alert.alert("Server Error", "Could not start trip.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Network Error", "Please check your connection.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setActiveField(null)}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
        <StatusBar barStyle="light-content" />
        
        <View className="bg-[#5BA943] pt-12 pb-6 px-6 rounded-b-[30px] shadow-md flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.push('/')} className="bg-white/20 p-2 rounded-full">
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold tracking-tight uppercase">Driver Setup</Text>
          <Ionicons name="bus" size={24} color="white" />
        </View>

        <View className="flex-1 px-6 pt-6">
          <View className="bg-gray-50 p-6 rounded-[25px] border border-gray-100 z-50">
            
            {/* Bus ID */}
            <View className="mb-4">
              <Text className="text-gray-400 font-bold mb-1 ml-1 text-[9px] tracking-widest uppercase">Bus ID</Text>
              <View className="bg-white flex-row items-center px-4 h-14 rounded-xl border border-gray-200">
                <TextInput 
                  placeholder="e.g. HR18F9981"
                  className="flex-1 text-base text-gray-800"
                  value={form.busNumber}
                  onChangeText={(text) => setForm(prev => ({ ...prev, busNumber: text }))}
                />
                <Ionicons name="barcode-outline" size={18} color="#35C759" />
              </View>
            </View>

            {/* Source Input */}
            <View className="mb-4 z-50">
              <Text className="text-gray-400 font-bold mb-1 ml-1 text-[9px] tracking-widest uppercase">From</Text>
              <View className="bg-white flex-row items-center px-4 h-14 rounded-xl border border-gray-200">
                <TextInput 
                  placeholder="Search Source Station"
                  className="flex-1 text-base text-gray-800"
                  value={form.source}
                  onChangeText={(text) => handleSearch(text, 'source')}
                  onFocus={() => form.source && handleSearch(form.source, 'source')}
                />
                <Ionicons name="navigate-outline" size={18} color="#35C759" />
              </View>
              {activeField === 'source' && filteredStands.length > 0 && (
                <View className="absolute top-[70px] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-[100] max-h-40">
                  <FlatList
                    data={filteredStands}
                    keyExtractor={(item) => item}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => selectStand(item, 'source')} className="p-4 border-b border-gray-50">
                        <Text className="text-gray-700 font-medium">{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>

            {/* Destination Input */}
            <View className="mb-2 z-40">
              <Text className="text-gray-400 font-bold mb-1 ml-1 text-[9px] tracking-widest uppercase">To</Text>
              <View className="bg-white flex-row items-center px-4 h-14 rounded-xl border border-gray-200">
                <TextInput 
                  placeholder="Search Destination Station"
                  className="flex-1 text-base text-gray-800"
                  value={form.destination}
                  onChangeText={(text) => handleSearch(text, 'destination')}
                  onFocus={() => form.destination && handleSearch(form.destination, 'destination')}
                />
                <Ionicons name="flag-outline" size={18} color="#35C759" />
              </View>
              {activeField === 'destination' && filteredStands.length > 0 && (
                <View className="absolute top-[70px] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-[100] max-h-40">
                  <FlatList
                    data={filteredStands}
                    keyExtractor={(item) => item}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => selectStand(item, 'destination')} className="p-4 border-b border-gray-50">
                        <Text className="text-gray-700 font-medium">{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>

          </View>

          <TouchableOpacity 
            onPress={handleStartTrip}
            disabled={loading}
            className={`mt-8 h-14 rounded-2xl flex-row items-center justify-center shadow-md ${loading ? 'bg-gray-400' : 'bg-[#E4A152]'}`}
          >
            {loading ? <ActivityIndicator color="white" /> : (
              <Text className="text-white text-lg font-bold uppercase tracking-wider">Start Trip</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}