import { Stack } from "expo-router";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';


export default function Layout() {
  return <ActionSheetProvider>
    <Stack>
      <Stack.Screen name="auth/login" options={{headerShown: false,}}></Stack.Screen>
      <Stack.Screen name="auth/register" options={{headerShown: false,}}></Stack.Screen>
      <Stack.Screen name="(tabs)" options={{headerShown: false,}}></Stack.Screen>
    </Stack>
  </ActionSheetProvider>;
}