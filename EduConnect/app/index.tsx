import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
      headerImage={
        <Image
          source={require('@/assets/images/educonnect-logo.png')}
          style={st.logo}
          accessibilityLabel="Logo de EduConnect"
        />
      }
    >
      <ThemedView style={st.wrap}>
        <ThemedText type="title" style={st.title}>
          Bienvenido a EduConnect
        </ThemedText>
        <ThemedText style={st.subtitle}>
          La mejor manera de seguir el progreso escolar de tus hijos.
        </ThemedText>

        <Image
          source={{
            uri:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCEJia00rz1Hpea33Oa-JC8C6jRp65o4XMagMlxG2pU1yx7ply99Gg19W4ePc40J8n1j51SCKh1-27iHnwFQ-j1zLgak-kt5YOnobmg6YF0jp9qG63rvGKH0fWDI4xa67LolTuJvaEig0cNQU4hA2aFVUKU5qPccAUkpZhUKGTSbjY4AzjVUCRk1DmQu9RfSKcXqw6BdKY7xnhH7mfbjOD5ujWWbfaiqrDc10Lenaxa96BeN1niBP84vTMqJWZ9bk4rvhvCpBhd-Bk',
          }}
          style={st.hero}
          accessibilityLabel="Ilustración de estudiantes en clase"
        />

        <Link href="/login" asChild>
          <Pressable style={st.btn} accessibilityRole="button" accessibilityLabel="Ir a iniciar sesión">
            <ThemedText type="defaultSemiBold" style={st.btnTxt}>
              Empezar
            </ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const st = StyleSheet.create({
  // ⬇️ Logo más grande y más abajo
  logo: {
    height: 140,
    width: 140,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 64, // lo baja respecto al borde superior
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
    color: '#475569',
    maxWidth: 320,
    marginBottom: 18,
  },
  hero: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 14,
    marginBottom: 18,
  },
  btn: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: '92%',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  btnTxt: {
    color: '#fff',
    fontSize: 16,
  },
});
