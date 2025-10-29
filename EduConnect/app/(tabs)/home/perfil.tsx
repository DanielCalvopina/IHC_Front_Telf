import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { router, Href } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Text,
} from 'react-native';
import padreData from '../../datosPadre.json';
import estudianteData from '../../datosEstudiante.json';

export default function PerfilScreen() {
  const [showExit, setShowExit] = useState(false);

  const padre = padreData.padre;

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
    // TODO: aquí podrías limpiar tu store de auth (e.g. signOut())
    router.replace('/login' as Href);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F7F8', paddingTop: statusBarHeight }}>
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
              <Pressable style={[st.btn, st.btnPrimary]} onPress={onConfirmLogout}>
                <Text style={st.btnPrimaryTxt}>Cerrar sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ThemedView style={st.container}>
        {/* Topbar */}
        <View style={st.topbar}>
          <View style={{ width: 48 }} />
          <ThemedText type="title" style={st.topbarTitle}>Mi Perfil</ThemedText>

          {/* En lugar de Link, abrimos el modal */}
          <Pressable onPress={() => setShowExit(true)}>
            <ThemedText style={st.logoutLink}>Cerrar Sesión</ThemedText>
          </Pressable>
        </View>

        {/* Datos del padre */}
        <View style={st.header}>
          <Image source={{ uri: padre.avatar }} style={st.avatar} />
          <ThemedText style={st.name}>{padre.nombre}</ThemedText>
          <ThemedText style={st.infoRow}>🪪  {padre.cedula}</ThemedText>
          <ThemedText style={st.infoRow}>✉️  {padre.correo}</ThemedText>
          <ThemedText style={st.infoRow}>📞  {padre.telefono}</ThemedText>
          <ThemedText style={st.infoRow}>📍  {padre.direccion}</ThemedText>

          {/* Si deseas, puedes mantener tu navegación a editar perfil así */}
          {/* <Link href="/pages/padres/editar" asChild>
            <Pressable style={st.editBtn}>
              <ThemedText type="defaultSemiBold" style={st.editBtnTxt}>Editar perfil</ThemedText>
            </Pressable>
          </Link> */}
          <Pressable
            onPress={() => router.push('/pages/padres/editar' as Href)}
            style={st.editBtn}
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

const st = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  topbar: {
    height: 52,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D47A1',
    borderRadius: 12,
    marginTop: 6,
  },
  topbarTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  logoutLink: { color: '#fff', fontWeight: '800', fontSize: 12 },

  header: { alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 10 },
  avatar: { width: 96, height: 96, borderRadius: 999, backgroundColor: '#E5E7EB' },
  name: { fontSize: 20, fontWeight: '800', marginTop: 6, color: '#0F172A' },
  infoRow: { color: '#64748B' },

  editBtn: {
    marginTop: 10,
    backgroundColor: '#0D47A1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  editBtnTxt: { color: '#fff', fontWeight: '800' },

  sectionTitle: { marginTop: 12, marginBottom: 8, fontSize: 16, fontWeight: '800', color: '#0F172A' },

  childCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 8,
  },
  childAvatar: { width: 52, height: 52, borderRadius: 999, backgroundColor: '#E5E7EB' },
  childName: { fontWeight: '800', color: '#888c95ff' },
  childSub: { color: '#64748B' },

  childYears: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  yearPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#E6F0FA' },
  yearPillTxt: { color: '#005A9C', fontWeight: '800', fontSize: 12 },

  // ===== estilos del modal (igual estilo a _layout de tabs) =====
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
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
    color: '#0F172A',
  },
  text: {
    color: '#475569',
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
    backgroundColor: '#F1F5F9',
  },
  btnGhostTxt: {
    color: '#0F172A',
    fontWeight: '800',
  },
  btnPrimary: {
    backgroundColor: '#1173d4',
  },
  btnPrimaryTxt: {
    color: '#fff',
    fontWeight: '800',
  },
});
