import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import data from "./../../../datosEstudiante.json";

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
    <View style={st.wrap}>
      <Image source={{ uri: s.avatar }} style={st.avatar} />
      <Text style={st.name}>{s.nombre}</Text>
      <Text style={st.sub}>{s.cursoActual.label}</Text>

      <Link
        href={{
          pathname: "/(tabs)/pages/estudiantes/detailEstudent",
          params: { year: y },
        }}
        asChild
      >
        <Pressable style={st.btn}><Text style={st.btnTxt}>Ver detalle</Text></Pressable>
      </Link>
    </View>
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
