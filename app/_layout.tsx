import { Stack } from "expo-router";
import { QueryProvider } from "../lib/queryClient";
import "./global.css";

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTintColor: '#000',
        }}
      >
        <Stack.Screen
          name="(main)/index"
          options={{
            title: "Home",
            headerShown: true
          }}
        />
        <Stack.Screen
          name="(auth)/login"
          options={{
            title: "Login",
            headerShown: true
          }}
        />
        <Stack.Screen
          name="(auth)/forget-password"
          options={{
            title: "Forget Password",
            headerShown: true
          }}
        />
        <Stack.Screen
          name="(auth)/reset-password"
          options={{
            title: "Reset Password",
            headerShown: true
          }}
        />
      </Stack>
    </QueryProvider>
  );
}
