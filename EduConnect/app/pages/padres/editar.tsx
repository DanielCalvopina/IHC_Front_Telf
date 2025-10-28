import { ThemedText } from '@/components/themed-text';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import data from '../../datosPadre.json';

export default function EditarPadreScreen() {
  const padre = data.padre;

  const [cedula, setCedula] = useState(padre.cedula ?? '');
  const [direccion, setDireccion] = useState(padre.direccion ?? '');

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const validaCedulaEC = (v: string) => /^\d{10}$/.test(v);

  const guardar = () => {
    if (!cedula || !validaCedulaEC(cedula)) {
      alert('Ingresa una cédula válida de 10 dígitos.');
      return;
    }
    if (!direccion.trim()) {
      alert('La dirección no puede estar vacía.');
      return;
    }
    if (actual || nueva || confirmar) {
      if (!actual || !nueva || !confirmar) {
        alert('Completa todos los campos de contraseña o deja todos vacíos.');
        return;
      }
      if (nueva !== confirmar) {
        alert('La nueva contraseña y la confirmación no coinciden.');
        return;
      }
    }
    alert(
      `Datos actualizados (mock):\n\nCédula: ${cedula}\nDirección: ${direccion}${nueva ? '\nContraseña: actualizada' : ''}`
    );
    router.back();
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F7F8', paddingTop: statusBarHeight }}>
      <View style={st.screen}>
        {/* Header fijo */}
        <View style={st.header}>
          <Link href="/(tabs)/home/perfil" asChild>
            <Pressable style={st.backBtn}>
              <ThemedText style={st.backTxt}>←</ThemedText>
            </Pressable>
          </Link>
          <ThemedText type="title" style={st.title}>Editar perfil</ThemedText>
          <View style={{ width: 48 }} />
        </View>

        {/* Contenido scrolleable */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Datos básicos */}
          <ThemedText type="subtitle" style={{ marginBottom: 6 }}>Datos del padre</ThemedText>
          <View style={st.card}>
            <ThemedText style={st.label}>Nombre (solo lectura)</ThemedText>
            <ThemedText style={st.readonly}>{padre.nombre}</ThemedText>

            <ThemedText style={st.label}>Correo (solo lectura)</ThemedText>
            <ThemedText style={st.readonly}>{padre.correo}</ThemedText>

            <ThemedText style={st.label}>Teléfono (solo lectura)</ThemedText>
            <ThemedText style={st.readonly}>{padre.telefono}</ThemedText>

            <ThemedText style={st.label}>Cédula</ThemedText>
            <TextInput
              style={st.input}
              keyboardType="number-pad"
              value={cedula}
              onChangeText={setCedula}
              maxLength={10}
              placeholder="1723456789"
              placeholderTextColor="#94A3B8"
            />

            <ThemedText style={st.label}>Dirección</ThemedText>
            <TextInput
              style={[st.input, { textAlignVertical: 'top' }]}
              multiline
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Calle / Av. y numeración"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Cambio de contraseña (opcional) */}
          <ThemedText type="subtitle" style={{ marginTop: 8, marginBottom: 6 }}>Cambiar contraseña (opcional)</ThemedText>
          <View style={st.card}>
            <ThemedText style={st.label}>Contraseña actual</ThemedText>
            <TextInput
              style={st.input}
              secureTextEntry
              value={actual}
              onChangeText={setActual}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
            />

            <ThemedText style={st.label}>Nueva contraseña</ThemedText>
            <TextInput
              style={st.input}
              secureTextEntry
              value={nueva}
              onChangeText={setNueva}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
            />

            <ThemedText style={st.label}>Confirmar nueva contraseña</ThemedText>
            <TextInput
              style={st.input}
              secureTextEntry
              value={confirmar}
              onChangeText={setConfirmar}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Pressable style={st.saveBtn} onPress={guardar}>
            <ThemedText type="defaultSemiBold" style={st.saveTxt}>Guardar cambios</ThemedText>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7F8' },
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, backgroundColor: '#0D47A1', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 28, fontWeight: '800', color: '#fff' },
  title: { fontSize: 18, fontWeight: '800', color: '#fff', backgroundColor: '#0D47A1'  },


  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, gap: 8, marginTop: 6 },
  label: { color: '#475569', fontWeight: '700' },
  readonly: { color: '#0F172A', fontWeight: '800', marginBottom: 4 },

  input: {
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, color: '#0F172A',
  },

  saveBtn: { marginTop: 12, backgroundColor: '#0D47A1', borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center' },
  saveTxt: { color: '#fff', fontWeight: '800' },

});
