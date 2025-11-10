import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
// 1. Importar 'Text' de 'react-native'
import { Pressable, StyleSheet, useColorScheme, Text } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// Colores solo para el subtítulo (el botón será estático)
const AppColors = {
  light: {
    subtext: '#475569',
  },
  dark: {
    subtext: '#94A3B8',
  },
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const logoSource = isDarkMode
    ? require('@/assets/images/logo-MO.png')
    : require('@/assets/images/educonnect-logo.png');

  // Asignamos solo el color del subtítulo
  const subtitleColor = isDarkMode ? AppColors.dark.subtext : AppColors.light.subtext;

  return (
    <ParallaxScrollView
      // Fondo del header vuelve a ser transparente
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
      headerImage={
        <Image
          source={logoSource}
          style={st.logo}
          accessibilityLabel="Logo de EduConnect"
        />
      }
    >
      {/* ThemedView usará blanco/negro por defecto */}
      <ThemedView style={st.wrap}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <ThemedText type="title" style={st.title}>
            Bienvenido a EduConnect
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <ThemedText
            style={[
              st.subtitle,
              { color: subtitleColor },
            ]}
          >
            La mejor manera de seguir el progreso escolar de tus hijos.
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(800).delay(400)}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEJia00rz1Hpea33Oa-JC8C6jRp65o4XMagMlxG2pU1yx7ply99Gg19W4ePc40J8n1j51SCKh1-27iHnwFQ-j1zLgak-kt5YOnobmg6YF0jp9qG63rvGKH0fWDI4xa67LolTuJvaEig0cNQU4hA2aFVUKU5qPccAUkpZhUKGTSbjY4AzjVUCRk1DmQu9RfSKcXqw6BdKY7xnhH7mfbjOD5ujWWbfaiqrDc10Lenaxa96BeN1niBP84vTMqJWZ9bk4rvhvCpBhd-Bk',
            }}
            style={st.hero}
            accessibilityLabel="Ilustración de estudiantes en clase"
          />
        </Animated.View>

        <Animated.View style={{ width: '92%' }} entering={FadeInUp.duration(600).delay(600)}>
          <Link href="/login" asChild>
            {/* 2. Botón vuelve a usar el estilo estático 'st.btn' */}
            <Pressable
              style={st.btn}
              accessibilityRole="button"
              accessibilityLabel="Ir a iniciar sesión"
            >
              {/* 3. ¡LA CORRECCIÓN! Usar 'Text' normal, no 'ThemedText' */}
              <Text style={st.btnTxt}>
                Empezar
              </Text>
            </Pressable>
          </Link>
        </Animated.View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const st = StyleSheet.create({
  logo: {
    height: 140,
    width: 140,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 64,
  },
  wrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 34,
    marginTop: 16,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: 18,
  },
  hero: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 14,
    marginBottom: 18,
  },
  // 4. Estilo del botón vuelve a ser estático (como el original)
  btn: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  // 5. Estilo para el 'Text' normal del botón
  btnTxt: {
    color: '#fff', // Siempre blanco
    fontSize: 16,
    fontWeight: '600', // Semi-bold
  },
});