import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  useColorScheme, // 1. Importar el hook para detectar el tema
} from "react-native";
import { Link } from "expo-router";
import data from "../../datosEstudiante.json";

/**
 * Home de Padres
 * - Mis Hijos (usa datosEstudiante.json)
 * - Notas recientes (promedios rápidos por materia del año actual) → NUMÉRICAS
 * - Anuncios generales (mock corto)
 */

// 2. Definir las paletas de colores para ambos modos
const Colors = {
  light: {
    background: "#F6F7F8",
    card: "#fff",
    cardBorder: "#E2E8F0",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textTertiary: "#334155",
    buttonSecondaryBg: "#0D47A1",
    buttonSecondaryText: "#fff",
    miniGradeBg: "#F8FAFC",
    miniGradeBorder: "#E2E8F0",
    noticeIconBg: "#DBEAFE",
    noticeIconText: "#1d4ed8",
    noticeBody: "#475569",
  },
  dark: {
    background: "#1E293B", // Azul oscuro
    card: "#334155", // Azul-gris
    cardBorder: "#475569",
    textPrimary: "#F1F5F9", // Blanco-hueso
    textSecondary: "#94A3B8", // Gris claro
    textTertiary: "#E2E8F0",
    buttonSecondaryBg: "#3B82F6", // Azul más brillante
    buttonSecondaryText: "#fff",
    miniGradeBg: "#475569",
    miniGradeBorder: "#64748B",
    noticeIconBg: "#1E3A8A", // Azul más oscuro
    noticeIconText: "#BFDBFE", // Azul pálido
    noticeBody: "#CBD5E1",
  },
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const s = data.student;
  const yActual = s.cursoActual?.anioLectivo;
  const yData = data.aniosLectivos.find((y) => y.anioLectivo === yActual);

  const notasRecientes = useMemo(() => {
    if (!yData) return [];
    return yData.cursos.slice(0, 3).map((c) => {
      const s1 = c.notas?.semestres?.find((x) => x.id === 1)?.promedio ?? 0;
      const s2 = c.notas?.semestres?.find((x) => x.id === 2)?.promedio ?? 0;
      const prom = ((s1 + s2) / 2) || 0;
      return { key: c.key, nombre: c.nombre, promedio: Number(prom.toFixed(1)) };
    });
  }, [yData]);

  const colorByScore = (n: number) => {
    if (n >= 9) return { color: "#16A34A" }; // Verde (se mantiene)
    if (n >= 7) return { color: "#F59E0B" }; // Ámbar (se mantiene)
    return { color: "#EF4444" }; // Rojo (se mantiene)
  };

  const anuncios = [
    { id: "a1", titulo: "Reunión de Padres y Maestros", cuerpo: "Recordatorio: mañana 18:00 en el auditorio." },
    { id: "a2", titulo: "Simulacro de evacuación", cuerpo: "Viernes 10:30. Llegar puntuales." },
  ];

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  // 3. Mover los estilos adentro y usar useMemo para hacerlos dinámicos
  const st = useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background, // Dinámico
      paddingTop: statusBarHeight,
    },
    sectionTitle: { 
      color: theme.textPrimary, // Dinámico
      fontWeight: "800", 
      fontSize: 16 
    },
    card: {
      backgroundColor: theme.card, // Dinámico
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.cardBorder, // Dinámico
      padding: 12,
      shadowColor: "#000",
      shadowOpacity: isDarkMode ? 0.1 : 0.05, // Ajuste sutil
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    childAvatar: { 
      width: 44, 
      height: 44, 
      borderRadius: 999, 
      backgroundColor: theme.miniGradeBorder // Dinámico
    },
    childName: { 
      fontWeight: "800", 
      color: theme.textPrimary // Dinámico
    },
    childSub: { 
      color: theme.textSecondary, // Dinámico
      marginTop: 2 
    },
    blockTitle: { 
      color: theme.textTertiary, // Dinámico
      fontWeight: "800", 
      marginTop: 4 
    },
    miniGrade: {
      width: 116,
      backgroundColor: theme.miniGradeBg, // Dinámico
      borderWidth: 1,
      borderColor: theme.miniGradeBorder, // Dinámico
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
      alignItems: "center",
    },
    miniLabel: { 
      fontSize: 12, 
      color: theme.textSecondary, // Dinámico
      marginBottom: 4 
    },
    miniValue: { 
      fontSize: 20, 
      fontWeight: "800" 
    },
    secondaryBtn: {
      height: 44,
      backgroundColor: theme.buttonSecondaryBg, // Dinámico
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryBtnTxt: {  
      color: theme.buttonSecondaryText, // Dinámico
      fontWeight: "800",
    },
    notice: {
      backgroundColor: theme.card, // Dinámico
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.cardBorder, // Dinámico
      padding: 10,
      gap: 10,
    },
    noticeRow: { 
      flexDirection: "row", 
      gap: 10, 
      alignItems: "center" 
    },
    noticeIcon: {
      width: 36, height: 36, borderRadius: 999,
      alignItems: "center", justifyContent: "center",
      backgroundColor: theme.noticeIconBg, // Dinámico
    },
    noticeIconText: { // Estilo para el emoji
      color: theme.noticeIconText, // Dinámico
    },
    noticeTitle: { 
      fontWeight: "800", 
      color: theme.textPrimary // Dinámico
    },
    noticeBody: { 
      color: theme.noticeBody, // Dinámico
      marginTop: 2, 
      fontSize: 13 
    },
    noDataText: { // Estilo para el texto "sin calificaciones"
      color: theme.textSecondary // Dinámico
    }
  }), [isDarkMode, theme, statusBarHeight]); // Dependencias del useMemo

  return (
    <SafeAreaView style={st.safeArea}>
      {/* 4. Barra de estado dinámica */}
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background}
      />
      <ScrollView contentContainerStyle={{ padding: 14, gap: 14 }}>
        {/* Mis Hijos */}
        <View style={st.card}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Image source={{ uri: s.avatar }} style={st.childAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={st.childName}>{s.nombre}</Text>
              <Text style={st.childSub}>{s.cursoActual?.label}</Text>
            </View>
          </View>

          {/* Notas Recientes */}
          <Text style={st.blockTitle}>Notas recientes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 6, paddingBottom: 4 }}
          >
            {notasRecientes.map((n) => (
              <View key={n.key} style={st.miniGrade}>
                <Text style={st.miniLabel} numberOfLines={1}>{n.nombre}</Text>
                <Text style={[st.miniValue, colorByScore(n.promedio)]}>
                  {n.promedio.toFixed(1)}
                </Text>
              </View>
            ))}
            {notasRecientes.length === 0 && (
              <Text style={st.noDataText}>Sin calificaciones registradas.</Text>
            )}
          </ScrollView>

          {/* Botón (dejamos solo "Visualizar años lectivos") */}
          <View style={{ gap: 8, marginTop: 8 }}>
            <Link
              href={{ pathname: "/pages/estudiantes/detailEstudent", params: { year: yActual } }}
              asChild
            >
              <Pressable style={st.secondaryBtn}>
                <Text style={st.secondaryBtnTxt}>Visualizar años lectivos</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Anuncios */}
        <Text style={st.sectionTitle}>Anuncios Generales</Text>
        <View style={st.notice}>
          {anuncios.map((a) => (
            <View key={a.id} style={st.noticeRow}>
              <View style={st.noticeIcon}>
                <Text style={st.noticeIconText}>ℹ️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.noticeTitle}>{a.titulo}</Text>
                <Text style={st.noticeBody}>{a.cuerpo}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Ya no necesitamos el StyleSheet.create estático aquí abajo