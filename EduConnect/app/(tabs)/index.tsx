// WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/educonnect-logo.png')} // Asegúrate de tener el logo aquí
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>EduConnect</Text>
        <Text style={styles.tagline}>Aprende, crece, triunfa</Text>
      </View>

      <Text style={styles.welcome}>Bienvenido</Text>
      <Text style={styles.description}>
        Conecta a padres y maestros de manera fácil para un mejor seguimiento de hij@s.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')} // O la pantalla que desees
      >
        <Text style={styles.buttonText}>Empezar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366', // Azul profundo
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tagline: {
    fontSize: 14,
    color: '#333',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#28a745', // Verde
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});