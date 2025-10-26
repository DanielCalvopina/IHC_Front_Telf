import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

export default function HeaderLogo() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const arrowColor = isDark ? '#fff' : '#000';

  return (
    <ThemedView style={styles.headerContainer}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ThemedText style={[styles.backArrow, { color: arrowColor }]}>⟵</ThemedText>
      </Pressable>

      <Image
        source={
          isDark
            ? require('@/assets/images/logo-MO.png')
            : require('@/assets/images/educonnect-logo.png')
        }
        style={styles.logo}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 40,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 10,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 44,
    fontWeight: 'bold',
  },
  logo: {
    height: 120,
    width: 160,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 0, // ← asegúrate de que no tenga margen extra
  },
});