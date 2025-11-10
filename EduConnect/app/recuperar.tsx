// app/recuperar.tsx
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  SafeAreaView,
  StatusBar,
  Text,
  Modal,
  ScrollView,
  useColorScheme, // 1. Importar hook de tema
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { setPasswordOverride } from './authStore';
import datosPadre from './datosPadre.json';

// 2. Crear la paleta de colores dinámica
const Palettes = {
  light: {
    primary: '#1173d4',
    primaryHover: '#0e63b5',
    bg: '#F6F7F8', // Fondo de pantalla (gris claro)
    surface: '#FFFFFF', // Fondo del card (blanco)
    text: '#0F172A',
    border: '#E0F2FE', // Borde de input
    cardBorder: '#CFDBE7', // Borde de card
    placeholder: '#94A3B8',
    icon: '#38BDF8',
    subtext: '#64748B',
    inputBg: '#F0F9FF',
    backLink: '#0369A1',
    // Colores de Alerta
    success: '#16A34A',
    successBg: '#DCFCE7',
    warn: '#D97706',
    warnBg: '#FEF3C7',
    danger: '#DC2626',
    dangerBg: '#FEE2E2', // (Añadido para el ícono de "no encontrado")
    overlay: 'rgba(17,24,39,0.6)',
    // Colores de Modal
    modalTitle: '#1F2937',
    modalText: '#4B5563',
    modalGhostBg: '#F1F5F9',
    modalGhostText: '#0F172A',
  },
  dark: {
    primary: '#38BDF8', // Botón más brillante
    primaryHover: '#7DD3FC',
    bg: '#0F172A', // Fondo de pantalla (azul muy oscuro)
    surface: '#1E293B', // Fondo del card (azul-gris)
    text: '#F1F5F9', // Texto claro
    border: '#334155',
    cardBorder: '#334155', // Borde de card
    placeholder: '#94A3B8',
    icon: '#7DD3FC',
    subtext: '#94A3B8',
    inputBg: '#0F172A', // Fondo de input (igual al fondo de pantalla)
    backLink: '#7DD3FC',
    // Colores de Alerta
    success: '#4ADE80',
    successBg: '#166534',
    warn: '#FDE047',
    warnBg: '#78350F',
    danger: '#F87171',
    dangerBg: '#7F1D1D', // (Añadido)
    overlay: 'rgba(0,0,0,0.7)',
    // Colores de Modal
    modalTitle: '#F1F5F9',
    modalText: '#CBD5E1',
    modalGhostBg: '#475569',
    modalGhostText: '#F1F5F9',
  },
};

type PadreJSON = {
  padre: {
    id: string;
    nombre: string;
    cedula: string;
    correo: string;
    telefono: string;
    avatar: string;
    direccion: string;
    credenciales: { usuario: string; password: string };
  };
};

// (Validaciones sin cambios)
const idValida = (v: string) => /^\d{10}$/.test(v) || v.trim().length >= 4;
const isStrong = (pwd: string) => /[A-Z]/.test(pwd) && /\d/.test(pwd) && pwd.length >= 8;

export default function RecuperarScreen() {
  // 3. Detectar el tema
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? Palettes.dark : Palettes.light;

  const [idNumber, setIdNumber] = useState(''); // cédula o usuario
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  // Modales
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWeak, setShowWeak] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showInvalidFields, setShowInvalidFields] = useState<null | string>(null);

  // ===== Validaciones (lógica sin cambios) =====
  const idError = useMemo(() => {
    if (!idNumber) return 'Ingresa tu cédula o usuario.';
    if (!idValida(idNumber)) return 'Usa cédula de 10 dígitos o usuario (mín. 4 caracteres).';
    return '';
  }, [idNumber]);

  const matchError = useMemo(() => {
    if (!pwd2) return 'Contraseña.';
    if (pwd && pwd2 && pwd !== pwd2) return 'Las contraseñas no coinciden.';
    return '';
  }, [pwd, pwd2]);

  const handleSubmit = () => {
    // (Lógica de submit sin cambios)
    if (!idValida(idNumber) || !pwd || !pwd2 || pwd !== pwd2) {
      const msg = !idValida(idNumber)
        ? idError
        : !pwd
          ? 'Ingresa una nueva contraseña.'
          : !pwd2
            ? 'Contraseña.'
            : 'Las contraseñas no coinciden.';
      setShowInvalidFields(msg);
      return;
    }
    if (!isStrong(pwd)) {
      setShowWeak(true);
      return;
    }
    const dp = datosPadre as PadreJSON;
    const p = dp?.padre;
    const match = p && (String(p.cedula) === idNumber || String(p.credenciales?.usuario) === idNumber);
    if (!match) {
      setShowNotFound(true);
      return;
    }
    setPasswordOverride(String(p.cedula), pwd);
    setPasswordOverride(String(p.credenciales?.usuario), pwd);
    setShowSuccess(true);
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  // 4. Mover el StyleSheet a un useMemo
  const st = useMemo(() => StyleSheet.create({
    scrollContainer: {
      minHeight: '100%',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.bg, // Dinámico
    },
    card: {
      backgroundColor: theme.surface, // Dinámico
      borderRadius: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: theme.cardBorder, // Dinámico
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 6,
      alignItems: 'center',
    },
    h1: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.text, // Dinámico
      textAlign: 'center',
    },
    p: {
      color: theme.subtext, // Dinámico
      marginTop: 6,
      textAlign: 'center',
    },
    body: { paddingHorizontal: 20, paddingVertical: 10, gap: 14 },

    inputWrap: { position: 'relative', width: '100%' },
    inputIcon: { position: 'absolute', left: 16, top: '50%', marginTop: -11 },
    input: {
      width: '100%',
      height: 56,
      backgroundColor: theme.inputBg, // Dinámico
      color: theme.text, // Dinámico
      borderRadius: 12,
      paddingLeft: 56,
      paddingRight: 48,
      fontSize: 16,
      borderWidth: 2,
      borderColor: theme.border, // Dinámico
    },
    trailingIconBtn: {
      position: 'absolute',
      right: 12,
      top: 0,
      bottom: 0,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },

    primaryBtn: {
      backgroundColor: theme.primary, // Dinámico
      width: '100%',
      height: 44,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },

    backLink: { // Estilo para el link de volver
      color: theme.backLink, // Dinámico
      fontWeight: '700'
    },
    backLinkIcon: { // Estilo para el ícono de volver
      color: theme.backLink // Dinámico
    },

    /* ====== Modal (overlay + card) ====== */
    overlay: {
      flex: 1,
      backgroundColor: theme.overlay, // Dinámico
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      width: '100%',
      maxWidth: 520,
      backgroundColor: theme.surface, // Dinámico
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
      alignItems: 'center',
    },
    modalIconWrapSuccess: {
      width: 64, height: 64, borderRadius: 32,
      backgroundColor: theme.successBg, // Dinámico
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 10,
    },
    modalIconWrapWarn: {
      width: 64, height: 64, borderRadius: 32,
      backgroundColor: theme.warnBg, // Dinámico
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 10,
    },
    modalIconWrapDanger: { // (Nuevo para "no encontrado")
      width: 64, height: 64, borderRadius: 32,
      backgroundColor: theme.dangerBg, // Dinámico
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 10,
    },
    modalTitle: { 
      fontSize: 18, 
      fontWeight: '800', 
      color: theme.modalTitle, // Dinámico
      textAlign: 'center' 
    },
    modalText: { 
      color: theme.modalText, // Dinámico
      textAlign: 'center', 
      marginTop: 6, 
      marginBottom: 10 
    },
    modalPrimaryBtn: {
      backgroundColor: theme.primary, // Dinámico
      height: 40,
      borderRadius: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
    },
    modalPrimaryBtnTxt: { color: '#fff', fontWeight: '800' },
    modalRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 },
    modalGhostBtn: {
      flex: 1,
      height: 40,
      borderRadius: 8,
      backgroundColor: theme.modalGhostBg, // Dinámico
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalGhostBtnTxt: { color: theme.modalGhostText, fontWeight: '800' }, // Dinámico
  }), [isDarkMode, theme]); // Depende del tema


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, paddingTop: statusBarHeight }}>
      {/* 5. Añadir StatusBar dinámica */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* ===== MODAL ÉXITO ===== */}
      <Modal visible={showSuccess} transparent animationType="fade" statusBarTranslucent>
        <View style={st.overlay}>
          <View style={st.modalCard}>
            <View style={st.modalIconWrapSuccess}>
              <Ionicons name="checkmark-circle" size={48} color={theme.success} />
            </View>
            <Text style={st.modalTitle}>Contraseña Actualizada</Text>
            <Text style={st.modalText}>
              Tu contraseña ha sido cambiada exitosamente. Por favor, inicia sesión de nuevo.
            </Text>
            <Pressable
              onPress={() => {
                setShowSuccess(false);
                router.replace('/login');
              }}
              style={({ pressed }) => [st.modalPrimaryBtn, pressed && { backgroundColor: theme.primaryHover }]}
            >
              <Text style={st.modalPrimaryBtnTxt}>Ir al Login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ===== MODAL ADVERTENCIA (débil) ===== */}
      <Modal visible={showWeak} transparent animationType="fade" statusBarTranslucent>
        <View style={st.overlay}>
          <View style={st.modalCard}>
            <View style={st.modalIconWrapWarn}>
              <Ionicons name="warning" size={44} color={theme.warn} />
            </View>
            <Text style={st.modalTitle}>Contraseña Débil</Text>
            <Text style={st.modalText}>
              Para tu seguridad, usa al menos 8 caracteres, una mayúscula y un número.
            </Text>
            <View style={st.modalRow}>
              <Pressable onPress={() => setShowWeak(false)} style={st.modalGhostBtn}>
                <Text style={st.modalGhostBtnTxt}>Cerrar</Text>
              </Pressable>
              <Pressable onPress={() => setShowWeak(false)} style={st.modalPrimaryBtn}>
                <Text style={st.modalPrimaryBtnTxt}>Reintentar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== MODAL NO ENCONTRADO ===== */}
      <Modal visible={showNotFound} transparent animationType="fade" statusBarTranslucent>
        <View style={st.overlay}>
          <View style={st.modalCard}>
            <View style={st.modalIconWrapDanger}>
              <Ionicons name="alert-circle" size={44} color={theme.danger} />
            </View>
            <Text style={st.modalTitle}>Cuenta no encontrada</Text>
            <Text style={st.modalText}>
              No existe una cuenta con ese identificador. Verifica tu cédula o usuario.
            </Text>
            <Pressable onPress={() => setShowNotFound(false)} style={st.modalPrimaryBtn}>
              <Text style={st.modalPrimaryBtnTxt}>Entendido</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ===== MODAL CAMPOS INVÁLIDOS ===== */}
      <Modal visible={!!showInvalidFields} transparent animationType="fade" statusBarTranslucent>
        <View style={st.overlay}>
          <View style={st.modalCard}>
            <View style={st.modalIconWrapWarn}>
              <Ionicons name="information-circle" size={44} color={theme.warn} />
            </View>
            <Text style={st.modalTitle}>Revisa los campos</Text>
            <Text style={st.modalText}>{showInvalidFields ?? 'Completa correctamente el formulario.'}</Text>
            <Pressable onPress={() => setShowInvalidFields(null)} style={st.modalPrimaryBtn}>
              <Text style={st.modalPrimaryBtnTxt}>Entendido</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ===== CONTENIDO ===== */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={st.scrollContainer}
        >
          <View style={st.card}>
            <View style={st.header}>
              <Text style={st.h1}>¿Olvidaste tu contraseña?</Text>
              <Text style={st.p}>
                Ingresa tu <Text style={{ fontWeight: '700' }}>cédula</Text> o tu{' '}
                <Text style={{ fontWeight: '700' }}>usuario</Text> y define una nueva contraseña.
              </Text>
            </View>

            <View style={st.body}>
              {/* Identificador */}
              <View style={st.inputWrap}>
                <Ionicons name="pricetag-outline" size={22} color={theme.icon} style={st.inputIcon} />
                <TextInput
                  style={st.input}
                  placeholder="Cédula o Usuario"
                  placeholderTextColor={theme.placeholder}
                  keyboardType="default"
                  value={idNumber}
                  onChangeText={(t) => setIdNumber(t.replace(/\s+/g, ''))}
                  maxLength={20}
                  returnKeyType="next"
                  autoCapitalize="none"
                />
              </View>

              {/* Nueva contraseña */}
              <View style={st.inputWrap}>
                <Ionicons name="lock-closed-outline" size={22} color={theme.icon} style={st.inputIcon} />
                <TextInput
                  style={st.input}
                  placeholder="Nueva contraseña"
                  placeholderTextColor={theme.placeholder}
                  value={pwd}
                  onChangeText={setPwd}
                  secureTextEntry={secure1}
                  returnKeyType="next"
                />
                <Pressable
                  onPress={() => setSecure1((s) => !s)}
                  style={st.trailingIconBtn}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={secure1 ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                >
                  <Ionicons name={secure1 ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.subtext} />
                </Pressable>
              </View>

              {/* Confirmar contraseña */}
              <View style={st.inputWrap}>
                <Ionicons name="lock-closed-outline" size={22} color={theme.icon} style={st.inputIcon} />
                <TextInput
                  style={st.input}
                  placeholder="Confirmar contraseña" // Texto corregido
                  placeholderTextColor={theme.placeholder}
                  value={pwd2}
                  onChangeText={setPwd2}
                  secureTextEntry={secure2}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <Pressable
                  onPress={() => setSecure2((s) => !s)}
                  style={st.trailingIconBtn}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={secure2 ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                >
                  <Ionicons name={secure2 ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.subtext} />
                </Pressable>
              </View>

              {/* Acciones */}
              <Pressable
                style={({ pressed }) => [
                  st.primaryBtn,
                  pressed && { backgroundColor: theme.primaryHover },
                ]}
                onPress={handleSubmit}
              >
                <Text style={st.primaryBtnTxt}>Guardar nueva contraseña</Text>
              </Pressable>

              <Pressable
                onPress={() => router.replace('/login')}
                style={{ alignSelf: 'center', marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <Ionicons name="arrow-back" size={16} style={st.backLinkIcon} />
                <Text style={st.backLink}>Volver a Inicio de Sesión</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}