import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, useColorScheme } from 'react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    alert(`Iniciando sesión con cédula: ${cedula}`);
  };

  const handleGoogleLogin = () => {
    alert('Iniciar sesión con Google (aquí iría la integración)');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#08121E' }}
      headerImage={
        <Image
          source={
            colorScheme === 'dark'
              ? require('@/assets/images/logo-MO.png')
              : require('@/assets/images/educonnect-logo.png')
          }
          style={styles.logo}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Iniciar Sesión
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Cédula"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={cedula}
          onChangeText={setCedula}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <ThemedText type="defaultSemiBold" style={styles.loginButtonText}>
            Iniciar sesión
          </ThemedText>
        </Pressable>

        <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
          <Image
            source={require('@/assets/images/google-icon.png')} // Añade este ícono
            style={styles.googleIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.googleButtonText}>
            Iniciar con Google
          </ThemedText>
        </Pressable>

        <Link href="/(tabs)/crear_cuenta" asChild>
          <Pressable style={styles.createAccountButton}>
            <ThemedText type="link" style={styles.createAccountText}>
              ¿No tienes cuenta? Crear una
            </ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 160,
    width: 160,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 40,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 12,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    color: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#23A044',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
  },
  createAccountButton: {
    marginTop: 10,
  },
  createAccountText: {
    color: '#1883E3',
    fontSize: 16,
  },
});
