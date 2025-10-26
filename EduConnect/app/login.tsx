// app/login.tsx (ajusta la ruta si tu login vive en otra carpeta)
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import datosPadre from './datosPadre.json';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const handleLogin = () => {
    const okU = datosPadre.padre.credenciales.usuario;
    const okP = datosPadre.padre.credenciales.password;

    if (!usuario || !password) {
      Alert.alert('Faltan datos', 'Ingresa usuario y contraseña');
      return;
    }
    if (usuario === okU && password === okP) {
      router.replace('/(tabs)/home'); // redirige al Home/Tabs
    } else {
      Alert.alert('Credenciales inválidas', 'Revisa tu usuario/contraseña');
    }
  };

  const handleForgot = () => {
    Alert.alert('Recuperación de cuenta', 'Este flujo se implementará más adelante.');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F6F7F8' }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ThemedView style={st.container}>
        {/* Logo */}
        <Image
          source={require('@/assets/images/educonnect-logo.png')}
          style={st.logo}
          accessibilityLabel="Logo EduConnect"
        />

        {/* Título */}
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <ThemedText type="title" style={st.title}>Bienvenido</ThemedText>
          <ThemedText style={st.subtitle}>Inicia sesión para continuar</ThemedText>
        </View>

        {/* Usuario */}
        <View style={st.inputWrap}>
          <Ionicons name="person-outline" size={20} color="#94A3B8" style={st.inputIcon} />
          <TextInput
            style={[st.input, { paddingLeft: 44 }]}
            placeholder="Usuario (cédula)"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>

        {/* Contraseña */}
        <View style={st.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={st.inputIcon} />
          <TextInput
            style={[st.input, { paddingLeft: 44, paddingRight: 44 }]}
            placeholder="Contraseña"
            placeholderTextColor="#94A3B8"
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
            <Ionicons
              name={secure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#64748B"
            />
          </Pressable>
        </View>

        {/* Botón Login */}
        <Pressable style={st.loginBtn} onPress={handleLogin}>
          <ThemedText type="defaultSemiBold" style={st.loginBtnTxt}>
            Iniciar sesión
          </ThemedText>
        </Pressable>

        {/* Forgot password */}
        <Pressable onPress={handleForgot} style={st.forgotBtn}>
          <ThemedText style={st.forgotTxt}>¿Olvidaste tu contraseña?</ThemedText>
        </Pressable>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8', // fondo claro fijo
    paddingHorizontal: 24,
    paddingTop: 36,
    alignItems: 'center',
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 2,
  },
  inputWrap: {
    width: '100%',
    marginTop: 12,
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: 0,
    bottom: 0,
    textAlignVertical: 'center',
    height: 48,
    lineHeight: 48,
  },
  trailingIconBtn: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loginBtn: {
    backgroundColor: '#1173d4',
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#1173d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  loginBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  forgotBtn: { marginTop: 14 },
  forgotTxt: { color: '#1173d4', fontSize: 14, fontWeight: '700' },
});
