import { ThemedText } from '@/components/themed-text';
import { Link, router } from 'expo-router';
import React, { useState, useMemo } from 'react'; // 1. Importar useMemo
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  useColorScheme, // 2. Importar useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import data from '../../datosPadre.json';

// 3. Definir la paleta de colores completa
const Palettes = {
  light: {
    primary: '#0D47A1',
    primaryHover: '#0A367E',
    bg: '#F6F7F8', // Fondo de pantalla
    surface: '#FFFFFF', // Fondo de los cards
    text: '#0F172A',
    subtext: '#64748B', // Labels y íconos "ojo"
    border: '#CBD5E1', // Borde de Input
    cardBorder: '#E5E7EB', // Borde de Card
    topbarBg: '#0D47A1', // Header
    topbarText: '#fff',
    inputBg: '#F1F5F9',
    inputReadonlyBg: '#F8FAFC',
    placeholder: '#94A3B8',
  },
  dark: {
    primary: '#3B82F6', // Botón "Guardar" más brillante
    primaryHover: '#60A5FA',
    bg: '#0F172A', // Fondo de pantalla
    surface: '#1E293B', // Fondo de los cards
    text: '#F1F5F9',
    subtext: '#94A3B8', // Labels y íconos "ojo"
    border: '#334155', // Borde de Input
    cardBorder: '#334155', // Borde de Card
    topbarBg: '#0A367E', // Header
    topbarText: '#fff',
    inputBg: '#0F172A', // Fondo de input (igual al fondo de pantalla)
    inputReadonlyBg: '#1E293B', // Fondo de input (igual al fondo del card)
    placeholder: '#94A3B8',
  },
};

export default function EditarPadreScreen() {
  // 4. Detectar el tema
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? Palettes.dark : Palettes.light;

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

  // ----- validaciones (lógica sin cambios) -----
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

  // 5. Mover el StyleSheet a un useMemo
  const st = useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.bg }, // Dinámico
    header: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      backgroundColor: theme.topbarBg, // Dinámico
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder, // Dinámico
    },
    backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    backTxt: { fontSize: 28, fontWeight: '800', color: theme.topbarText }, // Dinámico
    title: { 
      fontSize: 18, 
      fontWeight: '800', 
      color: theme.topbarText, // Dinámico
      backgroundColor: 'transparent' // El header ya tiene el fondo
    },
    card: {
      backgroundColor: theme.surface, // Dinámico
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.cardBorder, // Dinámico
      padding: 14,
      gap: 8,
      marginTop: 6,
    },
    label: { color: theme.subtext, fontWeight: '700' }, // Dinámico
    readonly: { color: theme.text, fontWeight: '800', marginBottom: 4 }, // Dinámico

    input: {
      backgroundColor: theme.inputBg, // Dinámico
      borderWidth: 1,
      borderColor: theme.border, // Dinámico
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 12,
      color: theme.text, // Dinámico
    },
    readonlyInput: {
      backgroundColor: theme.inputReadonlyBg, // Dinámico
      color: theme.subtext, // Dinámico
    },
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
      backgroundColor: theme.primary, // Dinámico
      borderRadius: 12,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveTxt: { color: theme.topbarText, fontWeight: '800' }, // Dinámico
  }), [isDarkMode, theme]); // Depende del tema

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, paddingTop: statusBarHeight }}>
      {/* 6. Añadir StatusBar dinámica */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.topbarBg} // Color del header
      />
      
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
              placeholderTextColor={theme.placeholder} // Dinámico
            />

            <ThemedText style={st.label}>Cédula</ThemedText>
            <TextInput
              style={[st.input, st.readonlyInput]}
              value={cedula}
              editable={false}
              placeholderTextColor={theme.placeholder} // Dinámico
            />

            <ThemedText style={st.label}>Nombre</ThemedText>
            <TextInput
              style={st.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre y Apellido"
              placeholderTextColor={theme.placeholder} // Dinámico
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
              placeholderTextColor={theme.placeholder} // Dinámico
            />

            <ThemedText style={st.label}>Teléfono</ThemedText>
            <TextInput
              style={st.input}
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+593 99 123 4567"
              placeholderTextColor={theme.placeholder} // Dinámico
            />

            <ThemedText style={st.label}>Dirección</ThemedText>
            <TextInput
              style={[st.input, { textAlignVertical: 'top' }]}
              multiline
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Calle / Av. y numeración"
              placeholderTextColor={theme.placeholder} // Dinámico
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
                placeholderTextColor={theme.placeholder} // Dinámico
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowActual(v => !v)}
                style={st.trailingIconBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showActual ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
              >
                {/* 7. Ícono con color dinámico */}
                <Ionicons name={showActual ? 'eye-outline' : 'eye-off-outline'} size={22} color={theme.subtext} />
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
                placeholderTextColor={theme.placeholder} // Dinámico
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowNueva(v => !v)}
                style={st.trailingIconBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showNueva ? 'Ocultar contraseña nueva' : 'Mostrar contraseña nueva'}
              >
                <Ionicons name={showNueva ? 'eye-outline' : 'eye-off-outline'} size={22} color={theme.subtext} />
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
                placeholderTextColor={theme.placeholder} // Dinámico
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowConfirmar(v => !v)}
                style={st.trailingIconBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showConfirmar ? 'Ocultar confirmación' : 'Mostrar confirmación'}
              >
                <Ionicons name={showConfirmar ? 'eye-outline' : 'eye-off-outline'} size={22} color={theme.subtext} />
              </Pressable>
            </View>
          </View>

          {/* 8. Botón de guardar con estado 'pressed' */}
          <Pressable 
            style={({ pressed }) => [
              st.saveBtn,
              pressed && { backgroundColor: theme.primaryHover }
            ]} 
            onPress={guardar}
          >
            <ThemedText type="defaultSemiBold" style={st.saveTxt}>Guardar cambios</ThemedText>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}