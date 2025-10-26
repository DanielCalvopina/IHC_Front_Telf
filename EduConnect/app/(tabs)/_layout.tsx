import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
     <Tabs.Screen
      name="home/perfil"
      options={{
        title: 'Perfil',
        tabBarIcon: ({ color }) => (
          <Ionicons name="person" size={28} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="home/notificaciones"
      options={{
        title: 'Notificaciones',
        tabBarIcon: ({ color }) => (
          <Ionicons name="notifications" size={28} color={color} />
        ),
      }}
    />
    </Tabs>
  );
}