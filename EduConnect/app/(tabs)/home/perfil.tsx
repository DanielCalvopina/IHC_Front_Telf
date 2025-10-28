import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import padreData from '../../datosPadre.json';
import estudianteData from '../../datosEstudiante.json';

export default function PerfilScreen() {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F7F8', paddingTop: statusBarHeight }}>
      <ThemedView style={st.container}>
        {/* Topbar */}
        <View style={st.topbar}>
          <View style={{ width: 48 }} />
          <ThemedText type="title" style={st.topbarTitle}>Mi Perfil</ThemedText>
          <Link href="/login" asChild>
            <Pressable><ThemedText style={st.logoutLink}>Cerrar Sesión</ThemedText></Pressable>
          </Link>
        </View>

        {/* Datos del padre */}
        <View style={st.header}>
          <Image source={{ uri: padre.avatar }} style={st.avatar} />
          <ThemedText style={st.name}>{padre.nombre}</ThemedText>
          <ThemedText style={st.infoRow}>🪪  {padre.cedula}</ThemedText>
          <ThemedText style={st.infoRow}>✉️  {padre.correo}</ThemedText>
          <ThemedText style={st.infoRow}>📞  {padre.telefono}</ThemedText>
          <ThemedText style={st.infoRow}>📍  {padre.direccion}</ThemedText>

          <Link href="/pages/padres/editar" asChild>
            <Pressable style={st.editBtn}>
              <ThemedText type="defaultSemiBold" style={st.editBtnTxt}>Editar perfil</ThemedText>
            </Pressable>
          </Link>
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
    height: 52, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#0D47A1', borderRadius: 12, marginTop: 6,
  },
  topbarTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  logoutLink: { color: '#fff', fontWeight: '800', fontSize: 12 },

  header: { alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 10 },
  avatar: { width: 96, height: 96, borderRadius: 999, backgroundColor: '#E5E7EB' },
  name: { fontSize: 20, fontWeight: '800', marginTop: 6, color: '#0F172A' },
  infoRow: { color: '#64748B' },

  editBtn: { marginTop: 10, backgroundColor: '#0D47A1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  editBtnTxt: { color: '#fff', fontWeight: '800' },

  sectionTitle: { marginTop: 12, marginBottom: 8, fontSize: 16, fontWeight: '800', color: '#0F172A' },

  childCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, gap: 8 },
  childAvatar: { width: 52, height: 52, borderRadius: 999, backgroundColor: '#E5E7EB' },
  childName: { fontWeight: '800', color: '#888c95ff' },
  childSub: { color: '#64748B' },

  childYears: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  yearPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#E6F0FA' },
  yearPillTxt: { color: '#005A9C', fontWeight: '800', fontSize: 12 },
});