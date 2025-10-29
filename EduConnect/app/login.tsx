// app/login.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import datosPadre from './datosPadre.json';
import { getPasswordOverride } from './authStore';

const COLORS = {
  primary: '#1173d4',
  primaryHover: '#0e63b5',
  bg: '#F0F9FF',
  surface: '#FFFFFF',
  text: '#0F172A',
  border: '#E0F2FE',
  placeholder: '#94A3B8',
  icon: '#38BDF8',
  subtext: '#64748B',
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
  const [usuario, setUsuario] = useState(''); // puede ser usuario o cédula
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const handleLogin = () => {
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

    // ¿Matchea por usuario o cédula?
    const esEstePadre =
      String(padre.credenciales?.usuario) === usuario || String(padre.cedula) === usuario;

    if (!esEstePadre) {
      Alert.alert('No encontrado', 'No existe una cuenta con ese usuario/identificación.');
      return;
    }

    // password final = override en memoria (si existiera) o la del JSON
    const override = getPasswordOverride(usuario);
    const jsonPass = padre.credenciales?.password ?? '';
    const okPass = override ?? jsonPass;

    if (password === okPass) {
      router.replace('/(tabs)/home');
    } else {
      // También probamos si el override se guardó usando la cédula como clave
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, paddingTop: statusBarHeight }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={st.wrapper}>
          <View style={st.card}>
            <View style={st.cardHeader}>
              <Image
                source={require('@/assets/images/educonnect-logo.png')}
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
                  <Ionicons name="person-outline" size={26} color={COLORS.icon} style={st.inputIcon} />
                  <TextInput
                    style={st.input}
                    placeholder="Usuario / Cédula"
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType="default"
                    value={usuario}
                    onChangeText={(t) => setUsuario(t.replace(/\s+/g, ''))}
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <View style={st.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={26} color={COLORS.icon} style={st.inputIcon} />
                  <TextInput
                    style={st.input}
                    placeholder="Contraseña"
                    placeholderTextColor={COLORS.placeholder}
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
                    <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={22} color={COLORS.subtext} />
                  </Pressable>
                </View>

                <Pressable
                  style={({ pressed }) => [st.loginBtn, pressed && { backgroundColor: COLORS.primaryHover }]}
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

        <ThemedView />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardHeader: {
    backgroundColor: '#FFFFFF',
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
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 4,
  },
  inputWrap: { position: 'relative', width: '100%' },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -13,
  },
  input: {
    width: '100%',
    height: 64,
    backgroundColor: '#F0F9FF',
    color: COLORS.text,
    borderRadius: 12,
    paddingLeft: 56,
    paddingRight: 48,
    fontSize: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  loginBtnTxt: { color: '#fff', fontSize: 18, fontWeight: '800' },
  forgotBtn: { marginTop: 10, alignSelf: 'center' },
  forgotTxt: { color: '#0369A1', fontSize: 14, fontWeight: '700' },
});
