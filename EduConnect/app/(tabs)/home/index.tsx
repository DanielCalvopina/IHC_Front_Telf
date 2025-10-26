import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import data from "../../datosEstudiante.json"; // ← desde (tabs)/home a /pages

export default function HomeScreen() {
  const s = data.student;
  const y = s.cursoActual.anioLectivo;

  return (
    <View style={st.wrap}>
      <Image source={{ uri: s.avatar }} style={st.avatar} />
      <Text style={st.name}>{s.nombre}</Text>
      <Text style={st.sub}>{s.cursoActual.label}</Text>

      <Link
        href={{ pathname: "/pages/estudiantes/detailEstudent", params: { year: y } }}
        asChild
      >
        <Pressable style={st.btn}>
          <Text style={st.btnTxt}>Ver detalle</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#F6F7F8", padding: 20 },
  avatar: { width: 120, height: 120, borderRadius: 100 },
  name: { fontSize: 20, fontWeight: "800", color: "#0F172A", marginTop: 4 },
  sub: { color: "#475569" },
  btn: { marginTop: 14, backgroundColor: "#005A9C", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  btnTxt: { color: "#fff", fontWeight: "800" },
});
