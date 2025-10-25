import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // <-- importamos navigation
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const currentStyles = styles(colorScheme);
  const navigation = useNavigation(); // <-- hook de navegación

  const logoSource =
    colorScheme === 'dark'
      ? require('@/assets/images/logo-MO.png')
      : require('@/assets/images/educonnect-logo.png');

  const student = {
    nombre: 'María Fernanda López',
    id: '0923145789',
    curso: '8vo EGB - Paralelo B',
    tutor: 'Prof. Carlos Ruiz',
  };

  // Navegar a la pantalla de Año Lectivo
  const handleDetailsPress = () => {
    navigation.navigate('AnioLectivo'); // <-- nombre de la pantalla en tu navigator
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#030912' }}
      style={{ backgroundColor: colorScheme === 'dark' ? '#030912' : '#fff' }}
      headerImage={
        <Image
          source={logoSource}
          style={currentStyles.logo}
          accessibilityLabel="Logo de EduConnect"
        />
      }
    >
      <ThemedView style={currentStyles.container}>
        <ThemedText type="title" style={currentStyles.title}>
          Información de sus Hijos
        </ThemedText>

        <ThemedView style={currentStyles.card}>
          <Ionicons
            name="person-circle-outline"
            size={80}
            color="#fff"
            style={currentStyles.icon}
          />

          <ThemedView style={currentStyles.infoContainer}>
            <ThemedText type="subtitle" style={currentStyles.name}>
              {student.nombre}
            </ThemedText>

            <ThemedText type="default" style={currentStyles.infoText}>
              <ThemedText type="defaultSemiBold" style={currentStyles.boldText}>
                ID:{' '}
              </ThemedText>
              {student.id}
            </ThemedText>

            <ThemedText type="default" style={currentStyles.infoText}>
              <ThemedText type="defaultSemiBold" style={currentStyles.boldText}>
                Curso:{' '}
              </ThemedText>
              {student.curso}
            </ThemedText>

            <ThemedText type="default" style={currentStyles.infoText}>
              <ThemedText type="defaultSemiBold" style={currentStyles.boldText}>
                Tutor:{' '}
              </ThemedText>
              {student.tutor}
            </ThemedText>

            {/* Botón Detalles */}
            <TouchableOpacity
              style={currentStyles.detailsButton}
              onPress={handleDetailsPress}
            >
              <ThemedText type="defaultSemiBold" style={currentStyles.detailsButtonText}>
                Detalles
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    logo: {
      height: 180,
      width: 180,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginTop: 40,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 24,
      marginTop: 10,
      backgroundColor: colorScheme === 'dark' ? '#030912' : '#fff',
    },
    title: {
      marginBottom: 20,
      textAlign: 'center',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    card: {
      width: '100%',
      backgroundColor: '#148DEA',
      borderRadius: 16,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#148DEA',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 6,
    },
    icon: {
      marginRight: 20,
    },
    infoContainer: {
      flex: 1,
      backgroundColor: '#148DEA',
      paddingTop: 0,
    },
    name: {
      marginBottom: 10,
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    infoText: {
      color: '#fff',
      marginBottom: 4,
      fontSize: 15,
    },
    boldText: {
      fontWeight: 'bold',
      color: '#fff',
    },
    detailsButton: {
      marginTop: 12,
      backgroundColor: '#00B92D',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    detailsButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
