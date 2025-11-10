// app/login.tsx
import { ThemedText } from '@/components/themed-text'; // (Aunque no se usan, los dejo por si los necesitas)
import { ThemedView } from '@/components/themed-view'; // (Aunque no se usan, los dejo por si los necesitas)
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme, // 1. Importar el hook para detectar el tema
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import datosPadre from './datosPadre.json';
import { getPasswordOverride } from './authStore';

// 2. Definir las paletas de colores para ambos modos
const Palettes = {
  light: {
    primary: '#1173d4',
    primaryHover: '#0e63b5',
    bg: '#F0F9FF', // Fondo de pantalla (azul claro)
    surface: '#FFFFFF', // Fondo del card (blanco)
    text: '#0F172A',
    border: '#E0F2FE',
    placeholder: '#94A3B8',
    icon: '#38BDF8',
    subtext: '#64748B',
    forgotText: '#0369A1',
    inputBg: '#F0F9FF', // Fondo de input (igual al fondo de pantalla)
  },
  dark: {
    primary: '#38BDF8', // Botón más brillante
    primaryHover: '#7DD3FC',
    bg: '#0F172A', // Fondo de pantalla (azul muy oscuro)
    surface: '#1E293B', // Fondo del card (azul-gris)
    text: '#F1F5F9', // Texto claro
    border: '#334155',
    placeholder: '#94A3B8',
    icon: '#7DD3FC',
    subtext: '#94A3B8',
    forgotText: '#7DD3FC', // Texto de "olvidaste" más brillante
    inputBg: '#0F172A', // Fondo de input (igual al fondo de pantalla)
  },
};

type PadreJSON = {
  padre: {
    id: string;
    nombre: string;
    cedula: string;
    correo: string;
    telefono: string;
    avatar: string;
    direccion: string;
    credenciales: { usuario: string; password: string };
  };
};

export default function LoginScreen() {
  // 3. Detectar el tema actual
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? Palettes.dark : Palettes.light;

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  // 4. Lógica para el logo dinámico
  const logoSource = isDarkMode
    ? require('@/assets/images/logo-MO.png') // Asumiendo esta ruta
    : require('@/assets/images/educonnect-logo.png');

  const handleLogin = () => {
    // (Lógica de Login sin cambios)
    if (!usuario || !password) {
      Alert.alert('Faltan datos', 'Ingresa usuario y contraseña');
      return;
    }
    const dp = datosPadre as PadreJSON;
    const padre = dp?.padre;
    if (!padre) {
      Alert.alert('Error', 'Base de datos local no disponible.');
      return;
    }
    const esEstePadre =
      String(padre.credenciales?.usuario) === usuario || String(padre.cedula) === usuario;
    if (!esEstePadre) {
      Alert.alert('No encontrado', 'No existe una cuenta con ese usuario/identificación.');
      return;
    }
    const override = getPasswordOverride(usuario);
    const jsonPass = padre.credenciales?.password ?? '';
    const okPass = override ?? jsonPass;
    if (password === okPass) {
      router.replace('/(tabs)/home');
    } else {
      const overrideCed = getPasswordOverride(padre.cedula);
      const finalPass = overrideCed ?? okPass;
      if (password === finalPass) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Credenciales inválidas', 'Revisa tu usuario/contraseña');
      }
    }
  };

  const handleForgot = () => {
    router.push('/recuperar');
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  // 5. Mover el StyleSheet a un useMemo para hacerlo dinámico
  const st = useMemo(() => StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.bg, // Dinámico
      paddingHorizontal: 16,
      paddingVertical: 16,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: theme.surface, // Dinámico
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: theme.border, // Dinámico
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    cardHeader: {
      backgroundColor: theme.surface, // Dinámico
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      height: 96,
      width: 96,
      resizeMode: 'contain',
    },
    cardBody: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    title: {
      color: theme.text, // Dinámico
      fontSize: 28,
      fontWeight: '800',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.subtext, // Dinámico
      textAlign: 'center',
      marginTop: 4,
    },
    inputWrap: { position: 'relative', width: '100%' },
    inputIcon: {
      position: 'absolute',
      left: 16,
      top: '50%',
      marginTop: -13, // Ajustado para 26px de ícono
    },
    input: {
      width: '100%',
      height: 64,
      backgroundColor: theme.inputBg, // Dinámico
      color: theme.text, // Dinámico
      borderRadius: 12,
      paddingLeft: 56,
      paddingRight: 48,
      fontSize: 16,
      borderWidth: 2,
      borderColor: theme.border, // Dinámico
    },
    trailingIconBtn: {
      position: 'absolute',
      right: 12,
      top: 0,
      bottom: 0,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    loginBtn: {
      backgroundColor: theme.primary, // Dinámico
      width: '100%',
      height: 64,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
      shadowColor: theme.primary, // Dinámico
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    loginBtnTxt: { color: '#fff', fontSize: 18, fontWeight: '800' },
    forgotBtn: { marginTop: 10, alignSelf: 'center' },
    forgotTxt: { color: theme.forgotText, fontSize: 14, fontWeight: '700' }, // Dinámico
  }), [isDarkMode, theme]); // Depende del tema

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, paddingTop: statusBarHeight }}>
      {/* 6. Añadir Barra de Estado dinámica */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={st.wrapper}>
          <View style={st.card}>
            <View style={st.cardHeader}>
              <Image
                source={logoSource} // 7. Usar el logo dinámico
                style={st.logo}
                accessibilityLabel="Logo EduConnect"
              />
            </View>

            <View style={st.cardBody}>
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={st.title}>Bienvenido</Text>
                <Text style={st.subtitle}>Inicia sesión para continuar</Text>
              </View>

              <View style={{ gap: 14 }}>
                <View style={st.inputWrap}>
                  <Ionicons name="person-outline" size={26} color={theme.icon} style={st.inputIcon} />
                  <TextInput
                    style={st.input}
                    placeholder="Usuario / Cédula"
                    placeholderTextColor={theme.placeholder}
                    keyboardType="default"
                    value={usuario}
                    onChangeText={(t) => setUsuario(t.replace(/\s+/g, ''))}
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <View style={st.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={26} color={theme.icon} style={st.inputIcon} />
                  <TextInput
                    style={st.input}
                    placeholder="Contraseña"
                    placeholderTextColor={theme.placeholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secure}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <Pressable
                    onPress={() => setSecure((s) => !s)}
                    style={st.trailingIconBtn}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={secure ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                  >
                    <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={22} color={theme.subtext} />
                  </Pressable>
                </View>

                <Pressable
                  style={({ pressed }) => [st.loginBtn, pressed && { backgroundColor: theme.primaryHover }]}
                  onPress={handleLogin}
                >
                  <Text style={st.loginBtnTxt}>Iniciar Sesión</Text>
                </Pressable>

                <Pressable onPress={handleForgot} style={st.forgotBtn}>
                  <Text style={st.forgotTxt}>¿Olvidaste tu contraseña?</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* 8. Eliminar el ThemedView extra que no hacía nada */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}