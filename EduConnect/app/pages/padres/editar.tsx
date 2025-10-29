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
import { Ionicons } from '@expo/vector-icons';
import data from '../../datosPadre.json';

export default function EditarPadreScreen() {
  const padre = data.padre;

  // ----- estados editables -----
  const [nombre, setNombre] = useState(padre.nombre ?? '');
  const [correo, setCorreo] = useState(padre.correo ?? '');
  const [telefono, setTelefono] = useState(padre.telefono ?? '');
  const [direccion, setDireccion] = useState(padre.direccion ?? '');

  // Solo lectura
  const usuario = padre.credenciales?.usuario ?? '';
  const cedula = padre.cedula ?? '';

  // Passwords
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');

  // Toggles de visibilidad (ojitos)
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  // ----- validaciones -----
  const validaCedulaEC = (v: string) => /^\d{10}$/.test(v);
  const validaEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validaTelefono = (v: string) => /^[0-9+\s-]{7,16}$/.test(v);

  const guardar = () => {
    if (!cedula || !validaCedulaEC(cedula)) {
      alert('Cédula inválida en los datos (debe tener 10 dígitos).');
      return;
    }
    if (!nombre.trim()) {
      alert('El nombre no puede estar vacío.');
      return;
    }
    if (!validaEmail(correo)) {
      alert('Ingresa un correo válido.');
      return;
    }
    if (!validaTelefono(telefono)) {
      alert('Ingresa un teléfono válido (7–16 caracteres, solo números, espacios, + y -).');
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
      `Datos actualizados (mock):
      
Nombre: ${nombre}
Correo: ${correo}
Teléfono: ${telefono}
Dirección: ${direccion}
Usuario: ${usuario} 
Cédula: ${cedula} 
${nueva ? 'Contraseña: actualizada' : ''}`
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
            <ThemedText style={st.label}>Usuario</ThemedText>
            <TextInput
              style={[st.input, st.readonlyInput]}
              value={usuario}
              editable={false}
              placeholderTextColor="#94A3B8"
            />

            <ThemedText style={st.label}>Cédula</ThemedText>
            <TextInput
              style={[st.input, st.readonlyInput]}
              value={cedula}
              editable={false}
              placeholderTextColor="#94A3B8"
            />

            <ThemedText style={st.label}>Nombre</ThemedText>
            <TextInput
              style={st.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre y Apellido"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
            />

            <ThemedText style={st.label}>Correo</ThemedText>
            <TextInput
              style={st.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={setCorreo}
              placeholder="correo@dominio.com"
              placeholderTextColor="#94A3B8"
            />

            <ThemedText style={st.label}>Teléfono</ThemedText>
            <TextInput
              style={st.input}
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+593 99 123 4567"
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
            <View style={st.inputWrap}>
              <TextInput
                style={[st.input, { paddingRight: 44 }]}
                secureTextEntry={!showActual}
                value={actual}
                onChangeText={setActual}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowActual(v => !v)}
                style={st.trailingIconBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showActual ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
              >
                <Ionicons name={showActual ? 'eye-outline' : 'eye-off-outline'} size={22} color="#64748B" />
              </Pressable>
            </View>

            <ThemedText style={st.label}>Nueva contraseña</ThemedText>
            <View style={st.inputWrap}>
              <TextInput
                style={[st.input, { paddingRight: 44 }]}
                secureTextEntry={!showNueva}
                value={nueva}
                onChangeText={setNueva}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowNueva(v => !v)}
                style={st.trailingIconBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showNueva ? 'Ocultar contraseña nueva' : 'Mostrar contraseña nueva'}
              >
                <Ionicons name={showNueva ? 'eye-outline' : 'eye-off-outline'} size={22} color="#64748B" />
              </Pressable>
            </View>

            <ThemedText style={st.label}>Confirmar nueva contraseña</ThemedText>
            <View style={st.inputWrap}>
              <TextInput
                style={[st.input, { paddingRight: 44 }]}
                secureTextEntry={!showConfirmar}
                value={confirmar}
                onChangeText={setConfirmar}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowConfirmar(v => !v)}
                style={st.trailingIconBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showConfirmar ? 'Ocultar confirmación' : 'Mostrar confirmación'}
              >
                <Ionicons name={showConfirmar ? 'eye-outline' : 'eye-off-outline'} size={22} color="#64748B" />
              </Pressable>
            </View>
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: '#0D47A1',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 28, fontWeight: '800', color: '#fff' },
  title: { fontSize: 18, fontWeight: '800', color: '#fff', backgroundColor: '#0D47A1' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 8,
    marginTop: 6,
  },
  label: { color: '#475569', fontWeight: '700' },
  readonly: { color: '#0F172A', fontWeight: '800', marginBottom: 4 },

  input: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#0F172A',
  },
  readonlyInput: {
    backgroundColor: '#F8FAFC',
    color: '#64748B',
  },

  // wrapper para inputs con icono a la derecha
  inputWrap: { position: 'relative', width: '100%' },
  trailingIconBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  saveBtn: {
    marginTop: 12,
    backgroundColor: '#0D47A1',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveTxt: { color: '#fff', fontWeight: '800' },
});
