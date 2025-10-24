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
      </View>

      <Text style={styles.welcome}>Bienvenido</Text>
      <Text style={styles.description}>
        Conecta a padres y maestros de manera fácil para un mejor seguimiento de hijos.
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
    backgroundColor: '#ffffff', // Fondo blanco
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    alignItems: 'center',
    marginBottom: 0, // antes estaba en 30
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 0, // antes estaba en 2
  },
  tagline: {
    fontSize: 14,
    color: '#333',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1883E3', // Azul principal
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#12943E', // Verde secundario
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