import { Stack } from "expo-router";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="auth/login" options={{headerShown: false,}}></Stack.Screen>
        <Stack.Screen name="auth/register" options={{headerShown: false,}}></Stack.Screen>
        <Stack.Screen name="(tabs)" options={{headerShown: false,}}></Stack.Screen>
      </Stack>
    </QueryClientProvider>)
}