import { Stack } from 'expo-router';
import "../../global.css"

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
       <Stack.Screen name="location_permission" />
       <Stack.Screen name="driver_set" />
        <Stack.Screen name="conductor_dashboard" />


    </Stack>
  );
}