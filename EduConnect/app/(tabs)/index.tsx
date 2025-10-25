import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const logoSource =
    colorScheme === 'dark'
      ? require('@/assets/images/logo-MO.png')
      : require('@/assets/images/educonnect-logo.png');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#08121E' }}
      headerImage={
        <Image
          source={logoSource}
          style={styles.logo}
          accessibilityLabel="Logo de EduConnect"
        />
      }
    >
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Bienvenido</ThemedText>
        </ThemedView>

        <ThemedView style={styles.descriptionContainer}>
          <ThemedText type="default">
            Obten un seguimiento académico de tus hijos podrás ver sus calificaciones y su asistencia.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <Link href="/(tabs)/login" asChild>
            <Pressable
              style={styles.button}
              accessible
              accessibilityLabel="Botón para empezar sesión"
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Empezar
              </ThemedText>
            </Pressable>
          </Link>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 180,
    width: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 18,
  },
  descriptionContainer: {
    paddingHorizontal: 28,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 12,
  },
  button: {
    backgroundColor: '#23A044',
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 10,
    shadowColor: '#08121E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});