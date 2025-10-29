import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import data from "../../datosEstudiante.json"; // ← desde /pages/estudiantes

type P = { year?: string };

export default function DetailStudent() {
  const { year } = useLocalSearchParams<P>();
  const years = data.aniosLectivos.map(a => a.anioLectivo);
  const current = year && years.includes(year) ? year : data.student.cursoActual.anioLectivo;

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}>
      <View style={st.header}>
        <Link href="/(tabs)/home" replace  asChild>
          <Pressable style={st.icon}>
            <Text style={st.iconTxt}>←</Text>
          </Pressable>
        </Link>
        <Text style={st.title}>Año lectivo</Text>
        <View style={{ width: 56 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {data.aniosLectivos.map((a) => (
          <View key={a.anioLectivo} style={[st.card, a.anioLectivo === current && st.cardActive]}>
            <View>
              <Text style={st.grade}>{a.grado} - Paralelo {a.paralelo}</Text>
              <Text style={st.year}>{a.anioLectivo}</Text>
              <Text style={st.range}>{a.rango}</Text>
            </View>
              <Link
                href={{
                  pathname: "/pages/estudiantes/cursos/todosLosCursos",
                  params: { year: String(a.anioLectivo) },
                }}
                replace
                asChild
              >
                <Pressable style={st.btn}>
                  <Text style={st.btnTxt}>Ver cursos</Text>
                </Pressable>
              </Link>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  icon: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -4,
  },
  iconTxt: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 28,
  },
  title: { fontWeight: "800", fontSize: 18, color: "#0F172A" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardActive: { borderColor: "#005A9C" },
  grade: { color: "#0F172A", fontWeight: "700" },
  year: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginTop: 4 },
  range: { color: "#64748B", marginTop: 2 },
  btn: {
    marginTop: 10,
    backgroundColor: "#005A9C",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: { color: "#fff", fontWeight: "800" },
});