import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers by default
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // No header for home screen
        }}
      />
      {/* Add more Stack.Screen components for other pages */}
    </Stack>
  );
}