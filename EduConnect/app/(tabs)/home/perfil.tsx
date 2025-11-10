import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { router, Href } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Text,
  useColorScheme, // 1. Importar hook de tema
} from 'react-native';
import padreData from '../../datosPadre.json';
import estudianteData from '../../datosEstudiante.json';

// 2. Definir la paleta de colores completa
const Palettes = {
  light: {
    primary: '#1173d4',
    primaryHover: '#0e63b5',
    bg: '#F6F7F8', // Fondo de pantalla (gris claro)
    surface: '#FFFFFF', // Fondo del card (blanco)
    text: '#0F172A',
    subtext: '#64748B',
    border: '#E0F2FE',
    cardBorder: '#E5E7EB',
    // Colores específicos de esta pantalla
    topbarBg: '#0D47A1',
    topbarText: '#fff',
    primaryGhostBg: '#E6F0FA',
    primaryGhostText: '#005A9C',
    // Modal
    overlay: 'rgba(17,24,39,0.6)',
    modalTitle: '#0F172A',
    modalText: '#475569',
    modalGhostBg: '#F1F5F9',
    modalGhostText: '#0F172A',
  },
  dark: {
    primary: '#38BDF8',
    primaryHover: '#7DD3FC',
    bg: '#0F172A', // Fondo de pantalla (azul muy oscuro)
    surface: '#1E293B', // Fondo del card (azul-gris)
    text: '#F1F5F9',
    subtext: '#94A3B8',
    border: '#334155',
    cardBorder: '#334155',
    // Colores específicos de esta pantalla
    topbarBg: '#0A367E', // Azul más oscuro
    topbarText: '#fff',
    primaryGhostBg: '#1E3A8A',
    primaryGhostText: '#BFDBFE',
    // Modal
    overlay: 'rgba(0,0,0,0.7)',
    modalTitle: '#F1F5F9',
    modalText: '#CBD5E1',
    modalGhostBg: '#475569',
    modalGhostText: '#F1F5F9',
  },
};

export default function PerfilScreen() {
  // 3. Detectar el tema
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? Palettes.dark : Palettes.light;

  const [showExit, setShowExit] = useState(false);

  const padre = padreData.padre;

  // (Lógica de hijos sin cambios)
  const hijos = (() => {
    const s = estudianteData.student;
    const anios = estudianteData.aniosLectivos ?? [];
    return [
      {
        id: s.id,
        nombre: s.nombre,
        avatar: s.avatar,
        cursoActual: s.cursoActual?.label ?? '',
        anios: anios.map((a: any) => ({
          anio: a.anioLectivo,
          grado: `${a.grado} - Paralelo ${a.paralelo}`,
          rango: a.rango,
        })),
      },
    ];
  })();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  const onConfirmLogout = () => {
    setShowExit(false);
    router.replace('/login' as Href);
  };

  // 4. Mover el StyleSheet a un useMemo
  const st = useMemo(() => StyleSheet.create({
    safeArea: { // Estilo para el SafeAreaView
      flex: 1, 
      backgroundColor: theme.bg 
    },
    container: { 
      flex: 1, 
      paddingHorizontal: 16, 
      paddingTop: 8,
      backgroundColor: theme.bg // Asegurar que ThemedView tenga el fondo
    },
    topbar: {
      height: 52,
      paddingHorizontal: 16, // Aumentado para el link de logout
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.topbarBg, // Dinámico
      borderRadius: 12,
      marginTop: 6,
    },
    topbarTitle: { 
      color: theme.topbarText, // Dinámico
      fontSize: 16, 
      fontWeight: '800' 
    },
    logoutLink: { 
      color: theme.topbarText, // Dinámico
      fontWeight: '800', 
      fontSize: 12 
    },
    header: { 
      alignItems: 'center', 
      gap: 6, 
      marginTop: 16, 
      marginBottom: 10 
    },
    avatar: { 
      width: 96, 
      height: 96, 
      borderRadius: 999, 
      backgroundColor: theme.border, // Dinámico
      borderWidth: 2,
      borderColor: theme.surface
    },
    name: { 
      fontSize: 20, 
      fontWeight: '800', 
      marginTop: 6, 
      color: theme.text // Dinámico
    },
    infoRow: { 
      color: theme.subtext // Dinámico
    },
    editBtn: {
      marginTop: 10,
      backgroundColor: theme.primary, // Dinámico
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
    },
    editBtnTxt: { 
      color: theme.topbarText, // '#fff'
      fontWeight: '800' 
    },
    sectionTitle: { 
      marginTop: 12, 
      marginBottom: 8, 
      fontSize: 16, 
      fontWeight: '800', 
      color: theme.text // Dinámico
    },
    childCard: {
      backgroundColor: theme.surface, // Dinámico
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.cardBorder, // Dinámico
      padding: 12,
      gap: 8,
    },
    childAvatar: { 
      width: 52, 
      height: 52, 
      borderRadius: 999, 
      backgroundColor: theme.border // Dinámico
    },
    childName: { 
      fontWeight: '800', 
      color: theme.text // Dinámico
    },
    childSub: { 
      color: theme.subtext // Dinámico
    },
    childYears: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      gap: 6, 
      marginTop: 4 
    },
    yearPill: { 
      paddingHorizontal: 10, 
      paddingVertical: 4, 
      borderRadius: 999, 
      backgroundColor: theme.primaryGhostBg // Dinámico
    },
    yearPillTxt: { 
      color: theme.primaryGhostText, // Dinámico
      fontWeight: '800', 
      fontSize: 12 
    },

    /* ====== Modal (overlay + card) ====== */
    overlay: {
      flex: 1,
      backgroundColor: theme.overlay, // Dinámico
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    card: {
      width: '100%',
      maxWidth: 520,
      backgroundColor: theme.surface, // Dinámico
      borderRadius: 12,
      padding: 18,
      shadowColor: '#000',
      shadowOpacity: Platform.OS === 'android' ? 0.35 : 0.2,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    title: {
      fontWeight: '800',
      fontSize: 18,
      color: theme.modalTitle, // Dinámico
    },
    text: {
      color: theme.modalText, // Dinámico
      marginTop: 6,
      marginBottom: 14,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'flex-end',
    },
    btn: {
      height: 44,
      paddingHorizontal: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 120,
    },
    btnGhost: {
      backgroundColor: theme.modalGhostBg, // Dinámico
    },
    btnGhostTxt: {
      color: theme.modalGhostText, // Dinámico
      fontWeight: '800',
    },
    btnPrimary: {
      backgroundColor: theme.primary, // Dinámico
    },
    btnPrimaryTxt: {
      color: '#fff', // Se mantiene blanco
      fontWeight: '800',
    },
  }), [isDarkMode, theme]); // Depende del tema


  return (
    <SafeAreaView style={[st.safeArea, { paddingTop: statusBarHeight }]}>
      {/* 5. Añadir StatusBar dinámica */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* Modal de confirmación */}
      <Modal
        animationType="fade"
        transparent
        visible={showExit}
        statusBarTranslucent
        onRequestClose={() => setShowExit(false)}
      >
        <View style={st.overlay}>
          <View style={st.card}>
            <Text style={st.title}>¿Cerrar sesión?</Text>
            <Text style={st.text}>Vas a salir de tu cuenta. ¿Deseas continuar?</Text>

            <View style={st.row}>
              <Pressable style={[st.btn, st.btnGhost]} onPress={() => setShowExit(false)}>
                <Text style={st.btnGhostTxt}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={({ pressed }) => [
                  st.btn, 
                  st.btnPrimary,
                  pressed && { backgroundColor: theme.primaryHover }
                ]} 
                onPress={onConfirmLogout}
              >
                <Text style={st.btnPrimaryTxt}>Cerrar sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 6. ThemedView ahora usa el color de fondo correcto */}
      <ThemedView 
        style={st.container}
        lightColor={theme.bg}
        darkColor={theme.bg}
      >
        {/* Topbar */}
        <View style={st.topbar}>
          <View style={{ width: 48 }} />
          <ThemedText type="title" style={st.topbarTitle}>Mi Perfil</ThemedText>

          <Pressable onPress={() => setShowExit(true)} style={{ padding: 8 }}>
            <ThemedText style={st.logoutLink}>Cerrar Sesión</ThemedText>
          </Pressable>
        </View>

        {/* Datos del padre */}
        <View style={st.header}>
          <Image source={{ uri: padre.avatar }} style={st.avatar} />
          <ThemedText style={st.name}>{padre.nombre}</ThemedText>
          <ThemedText style={st.infoRow}>🪪 &nbsp;{padre.cedula}</ThemedText>
          <ThemedText style={st.infoRow}>✉️ &nbsp;{padre.correo}</ThemedText>
          <ThemedText style={st.infoRow}>📞 &nbsp;{padre.telefono}</ThemedText>
          <ThemedText style={st.infoRow}>📍 &nbsp;{padre.direccion}</ThemedText>

          <Pressable
            onPress={() => router.push('/pages/padres/editar' as Href)}
            style={({ pressed }) => [
              st.editBtn,
              pressed && { backgroundColor: theme.primaryHover }
            ]}
          >
            <ThemedText type="defaultSemiBold" style={st.editBtnTxt}>Editar perfil</ThemedText>
          </Pressable>
        </View>

        {/* Hijos asignados */}
        <ThemedText style={st.sectionTitle}>Hijos asignados</ThemedText>
        <View style={{ gap: 10 }}>
          {hijos.map((h) => (
            <View key={h.id} style={st.childCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={{ uri: h.avatar }} style={st.childAvatar} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={st.childName}>{h.nombre}</ThemedText>
                  <ThemedText style={st.childSub}>{h.cursoActual}</ThemedText>
                </View>
              </View>

              <View style={st.childYears}>
                {h.anios.map((a) => (
                  <View key={a.anio} style={st.yearPill}>
                    <ThemedText style={st.yearPillTxt}>{a.anio}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />
      </ThemedView>
    </SafeAreaView>
  );
}