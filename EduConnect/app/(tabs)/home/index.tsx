import React, { useMemo } from "react";
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import data from "../../datosEstudiante.json";

/**
 * Home de Padres
 * - Mis Hijos (usa datosEstudiante.json)
 * - Notas recientes (promedios rápidos por materia del año actual) → NUMÉRICAS
 * - Botón "Ver Años Lectivos"
 * - Anuncios generales (mock corto)
 */

export default function HomeScreen() {
  const s = data.student;
  const yActual = s.cursoActual?.anioLectivo;
  const yData = data.aniosLectivos.find((y) => y.anioLectivo === yActual);

  // Notas rápidas: hasta 3 cursos y promedio (s1+s2)/2 en NÚMERO
  const notasRecientes = useMemo(() => {
    if (!yData) return [];
    return yData.cursos.slice(0, 3).map((c) => {
      const s1 = c.notas?.semestres?.find((x) => x.id === 1)?.promedio ?? 0;
      const s2 = c.notas?.semestres?.find((x) => x.id === 2)?.promedio ?? 0;
      const prom = ((s1 + s2) / 2) || 0;
      return { key: c.key, nombre: c.nombre, promedio: Number(prom.toFixed(1)) };
    });
  }, [yData]);

  // Colorear por rango NUMÉRICO
  const colorByScore = (n: number) => {
    if (n >= 9) return { color: "#16A34A" };      // verde
    if (n >= 7) return { color: "#F59E0B" };      // naranja
    return { color: "#EF4444" };                  // rojo
  };

  const anuncios = [
    { id: "a1", titulo: "Reunión de Padres y Maestros", cuerpo: "Recordatorio: mañana 18:00 en el auditorio." },
    { id: "a2", titulo: "Simulacro de evacuación", cuerpo: "Viernes 10:30. Llegar puntuales." },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F7F8" }}>
      {/* Header simple */}

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

          {/* Notas Recientes (numéricas) */}
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
              <Text style={{ color: "#64748B" }}>Sin calificaciones registradas.</Text>
            )}
          </ScrollView>

          {/* CTA → Cursos y Años lectivos */}
          <View style={{ gap: 8, marginTop: 8 }}>
            {yActual && (
              <Link
                href={{ pathname: "/pages/estudiantes/cursos/todosLosCursos", params: { year: yActual } }}
                asChild
              >
                <Pressable style={st.primaryBtn}>
                  <Text style={st.primaryBtnTxt}>Ver Materias de {s.nombre.split(" ")[0]}</Text>
                </Pressable>
              </Link>
            )}
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

        {/* Anuncios Generales */}
        <Text style={st.sectionTitle}>Anuncios Generales</Text>
        <View style={st.notice}>
          {anuncios.map((a) => (
            <View key={a.id} style={st.noticeRow}>
              <View style={st.noticeIcon}><Text style={{ color: "#1d4ed8" }}>ℹ️</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={st.noticeTitle}>{a.titulo}</Text>
                <Text style={st.noticeBody}>{a.cuerpo}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* === estilos === */
const st = StyleSheet.create({
  topbar: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topbarTitle: { fontWeight: "800", color: "#0F172A", fontSize: 16 },

  sectionTitle: { color: "#0F172A", fontWeight: "800", fontSize: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  childAvatar: { width: 44, height: 44, borderRadius: 999, backgroundColor: "#E5E7EB" },
  childName: { fontWeight: "800", color: "#0F172A" },
  childSub: { color: "#64748B", marginTop: 2 },

  blockTitle: { color: "#334155", fontWeight: "800", marginTop: 4 },

  miniGrade: {
    width: 116,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  miniLabel: { fontSize: 12, color: "#64748B", marginBottom: 4 },
  miniValue: { fontSize: 20, fontWeight: "800" },

  primaryBtn: {
    height: 44,
    backgroundColor: "#0D47A1",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnTxt: { color: "#fff", fontWeight: "800" },

  secondaryBtn: {
    height: 44,
    backgroundColor: "#E6F0FA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnTxt: { color: "#005A9C", fontWeight: "800" },

  notice: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    gap: 10,
  },
  noticeRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  noticeIcon: {
    width: 36, height: 36, borderRadius: 999,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#DBEAFE",
  },
  noticeTitle: { fontWeight: "800", color: "#0F172A" },
  noticeBody: { color: "#475569", marginTop: 2, fontSize: 13 },
});
