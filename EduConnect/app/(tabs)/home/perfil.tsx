import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

export default function PerfilScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Simulación de datos del usuario (puedes conectar con contexto o API)
  const usuario = {
    nombre: 'Pamela Rodríguez',
    cedula: '1723456789',
    correo: 'pamela@educonnect.ec',
  };

  const handleLogout = () => {
    // Aquí puedes limpiar tokens, contexto, etc.
    alert('Sesión cerrada');
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={
          isDark
            ? require('@/assets/images/logo-MO.png')
            : require('@/assets/images/educonnect-logo.png')
        }
        style={styles.logo}
      />

      <ThemedText type="title" style={styles.title}>
        Perfil
      </ThemedText>

      <ThemedView style={styles.card}>
        <ThemedText style={styles.label}>Nombre:</ThemedText>
        <ThemedText style={styles.value}>{usuario.nombre}</ThemedText>

        <ThemedText style={styles.label}>Cédula:</ThemedText>
        <ThemedText style={styles.value}>{usuario.cedula}</ThemedText>

        <ThemedText style={styles.label}>Correo:</ThemedText>
        <ThemedText style={styles.value}>{usuario.correo}</ThemedText>
      </ThemedView>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText type="defaultSemiBold" style={styles.logoutText}>
          Cerrar sesión
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  logo: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});