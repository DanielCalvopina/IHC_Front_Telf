import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';

export default function AcademicYearScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#0B1C2D' : '#F2F7FF';
  const cardColor = isDark ? '#1A3A5B' : '#FFFFFF';
  const titleColor = isDark ? '#00FFAA' : '#12943E';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';

  return (
    <ScrollView style={[styles.screen, { backgroundColor }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>
          Seleccionar Año Lectivo
        </ThemedText>
      </ThemedView>

      {/* Año lectivo actual */}
      <ThemedView style={[styles.card, { backgroundColor: cardColor, borderColor: titleColor }]}>
        <IconSymbol name="calendar" size={32} color={titleColor} style={styles.icon} />
        <ThemedView style={styles.cardContent}>
          <ThemedText type="subtitle" style={[styles.grado, { color: titleColor }]}>
            10mo Grado
          </ThemedText>
          <ThemedText type="default" style={{ color: textColor }}>
            Año Lectivo 2024-2025
          </ThemedText>
          <ThemedText type="default" style={{ color: textColor }}>
            Septiembre 2024 - Junio 2025
          </ThemedText>
          <Link href="/(tabs)/pages/estudiantes/año lectivo/cursos" asChild>
            <ThemedView style={[styles.button, { backgroundColor: titleColor }]}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Ver Cursos
              </ThemedText>
            </ThemedView>
          </Link>
        </ThemedView>
      </ThemedView>

      {/* Año lectivo anterior 1 */}
      <ThemedView style={[styles.card, { backgroundColor: cardColor, borderColor: '#ccc' }]}>
        <IconSymbol name="calendar" size={32} color={titleColor} style={styles.icon} />
        <ThemedView style={styles.cardContent}>
          <ThemedText type="subtitle" style={[styles.grado, { color: titleColor }]}>
            9no Grado
          </ThemedText>
          <ThemedText type="default" style={{ color: textColor }}>
            Año Lectivo 2023-2024
          </ThemedText>
          <ThemedText type="default" style={{ color: textColor }}>
            Septiembre 2023 - Junio 2024
          </ThemedText>
          <Link href="/(tabs)/pages/estudiantes/año lectivo/cursos" asChild>
            <ThemedView style={[styles.button, { backgroundColor: titleColor }]}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Ver Detalles...
              </ThemedText>
            </ThemedView>
          </Link>
        </ThemedView>
      </ThemedView>

      {/* Año lectivo anterior 2 */}
      <ThemedView style={[styles.card, { backgroundColor: cardColor, borderColor: '#ccc' }]}>
        <IconSymbol name="calendar" size={32} color={titleColor} style={styles.icon} />
        <ThemedView style={styles.cardContent}>
          <ThemedText type="subtitle" style={[styles.grado, { color: titleColor }]}>
            8vo Grado
          </ThemedText>
          <ThemedText type="default" style={{ color: textColor }}>
            Año Lectivo 2022-2023
          </ThemedText>
          <ThemedText type="default" style={{ color: textColor }}>
            Septiembre 2022 - Junio 2023
          </ThemedText>
          <Link href="/(tabs)/pages/estudiantes/año lectivo/cursos" asChild>
            <ThemedView style={[styles.button, { backgroundColor: titleColor }]}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Ver Detalles...
              </ThemedText>
            </ThemedView>
          </Link>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  grado: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  button: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});