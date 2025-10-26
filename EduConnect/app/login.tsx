import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, useColorScheme, View } from 'react-native';
import datosPadre from './datosPadre.json';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const okU = datosPadre.padre.credenciales.usuario;
    const okP = datosPadre.padre.credenciales.password;

    if (!usuario || !password) {
      Alert.alert('Faltan datos', 'Ingresa usuario y contraseña');
      return;
    }
    if (usuario === okU && password === okP) {
      router.replace('/(tabs)/home'); // luego puedes cambiar a la ruta que prefieras
    } else {
      Alert.alert('Credenciales inválidas', 'Revisa tu usuario/contraseña');
    }
  };

  const handleForgot = () => {
    Alert.alert('Recuperación', 'Flujo de recuperación pendiente.');
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={
          colorScheme === 'dark'
            ? require('@/assets/images/logo-MO.png')
            : require('@/assets/images/educonnect-logo.png')
        }
        style={styles.logo}
      />

      <ThemedText type="title" style={styles.title}>
        Iniciar sesión
      </ThemedText>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Usuario (cédula)"
          placeholderTextColor="#8CA3B5"
          keyboardType="numeric"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#8CA3B5"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Pressable style={styles.loginBtn} onPress={handleLogin}>
        <ThemedText type="defaultSemiBold" style={styles.loginBtnTxt}>
          Iniciar sesión
        </ThemedText>
      </Pressable>

      <Pressable onPress={handleForgot} style={styles.forgotBtn}>
        <ThemedText style={styles.forgotTxt}>¿Olvidaste tu contraseña?</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },
  logo: { height: 140, width: 140, resizeMode: 'contain', marginBottom: 16 },
  title: { marginBottom: 18 },
  inputWrap: { width: '100%', marginBottom: 14 },
  input: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loginBtn: {
    backgroundColor: '#22c55e',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  loginBtnTxt: { color: '#fff', fontSize: 16 },
  forgotBtn: { marginTop: 14 },
  forgotTxt: { color: '#0ea5e9', fontSize: 14, fontWeight: '600' },
});
