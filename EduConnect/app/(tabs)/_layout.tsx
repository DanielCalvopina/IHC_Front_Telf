// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useFocusEffect, usePathname, router, type Href } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { BackHandler, Modal, View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const INITIAL_TAB = '/home' as const satisfies Href; // pestaña “Inicio”

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [showExit, setShowExit] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        // Si no estamos en Home, retroceder “hacia Home” con replace
        if (pathname !== INITIAL_TAB) {
          router.replace(INITIAL_TAB);
          return true;
        }
        // Ya en Home: abrir confirmación de cierre de sesión
        setShowExit(true);
        return true; // consumimos el evento
      });
      return () => sub.remove();
    }, [pathname])
  );

  const onConfirmLogout = () => {
    setShowExit(false);
    // Aquí podrías limpiar tu store de auth si tienes una función (e.g. signOut()).
    router.replace('/login');
  };

  return (
    <>
      {/* Modal de confirmación */}
      <Modal
        animationType="fade"
        transparent
        visible={showExit}
        statusBarTranslucent
        onRequestClose={() => setShowExit(false)}
      >
        <View style={st.overlay}>
          <View style={st.card}>
            <Text style={st.title}>¿Cerrar sesión?</Text>
            <Text style={st.text}>
              Vas a salir de tu cuenta. ¿Deseas continuar?
            </Text>

            <View style={st.row}>
              <Pressable style={[st.btn, st.btnGhost]} onPress={() => setShowExit(false)}>
                <Text style={[st.btnGhostTxt]}>Cancelar</Text>
              </Pressable>
              <Pressable style={[st.btn, st.btnPrimary]} onPress={onConfirmLogout}>
                <Text style={st.btnPrimaryTxt}>Cerrar sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Tabs
        backBehavior="initialRoute"
        initialRouteName="home/index"
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
            tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="home/perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="home/notificaciones"
          options={{
            title: 'Notificaciones',
            tabBarIcon: ({ color }) => <Ionicons name="notifications" size={28} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}

const st = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'android' ? 0.35 : 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  title: {
    fontWeight: '800',
    fontSize: 18,
    color: '#0F172A',
  },
  text: {
    color: '#475569',
    marginTop: 6,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  btn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  btnGhost: {
    backgroundColor: '#F1F5F9',
  },
  btnGhostTxt: {
    color: '#0F172A',
    fontWeight: '800',
  },
  btnPrimary: {
    backgroundColor: '#1173d4',
  },
  btnPrimaryTxt: {
    color: '#fff',
    fontWeight: '800',
  },
});
