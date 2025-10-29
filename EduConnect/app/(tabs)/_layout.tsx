// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useFocusEffect, usePathname, router, type Href } from 'expo-router';
import React, { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const INITIAL_TAB = '/home' as const satisfies Href; // ✅ ruta válida

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (pathname !== INITIAL_TAB) {
          router.replace(INITIAL_TAB);  // ✅ replace hacia /home
          return true;
        }
        return true; // bloquear salir (o BackHandler.exitApp())
      });
      return () => sub.remove();
    }, [pathname])
  );

  return (
    <Tabs
      backBehavior="initialRoute"
      initialRouteName="home/index"   // ✅ aquí sí va el path de archivo
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{ title: 'Inicio', tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} /> }}
      />
      <Tabs.Screen
        name="home/perfil"
        options={{ title: 'Perfil', tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} /> }}
      />
      <Tabs.Screen
        name="home/notificaciones"
        options={{ title: 'Notificaciones', tabBarIcon: ({ color }) => <Ionicons name="notifications" size={28} color={color} /> }}
      />
    </Tabs>
  );
}
