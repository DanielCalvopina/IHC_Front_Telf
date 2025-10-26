import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import data from "../../../datosEstudiante.json";

type P = { year: string };

export default function TodosLosCursos() {
  const { year } = useLocalSearchParams<P>();
  const y = data.aniosLectivos.find(a => a.anioLectivo === year);

  if (!y) {
    return (
      <View style={st.center}>
        <Text>No existe el año {year}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, backgroundColor:"#F6F7F8" }}>
      <View style={st.header}>
        <Link
          href={{ pathname:"/pages/estudiantes/detailEstudent", params:{ year } }}
          asChild
        >
          <Pressable
            style={st.icon}
            hitSlop={{ top:10, bottom:10, left:10, right:10 }}
            accessibilityRole="button"
            accessibilityLabel="Regresar"
          >
            <Text style={st.iconTxt}>←</Text>
          </Pressable>
        </Link>
        <Text style={st.title}>Cursos {y.anioLectivo}</Text>
        <View style={{ width:56 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
        {y.cursos.map(c => (
          <View key={c.key} style={st.card}>
            <Text style={st.course}>{c.nombre}</Text>
            <Link
              href={{ pathname:"/pages/estudiantes/cursos/detailCurso", params:{ year, courseKey:c.key } }}
              asChild
            >
              <Pressable style={st.go}>
                <Text style={st.goTxt}>›</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  header:{
    height:56,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal:12,
    backgroundColor:"#fff",
    borderBottomWidth:1,
    borderBottomColor:"#E5E7EB"
  },
  // ← botón más grande y visible
  icon:{
    width:56,
    height:56,
    alignItems:"center",
    justifyContent:"center",
    marginLeft:-4
  },
  iconTxt:{
    fontSize:28,
    lineHeight:28,
    fontWeight:"800",
    color:"#0F172A"
  },
  title:{fontWeight:"800",fontSize:18,color:"#0F172A"},

  card:{
    backgroundColor:"#fff",
    borderRadius:16,
    padding:16,
    borderWidth:1,
    borderColor:"#E2E8F0",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  course:{fontWeight:"800",color:"#0F172A"},
  go:{
    width:40,
    height:40,
    borderRadius:999,
    backgroundColor:"#0D47A1",
    alignItems:"center",
    justifyContent:"center"
  },
  goTxt:{color:"#fff",fontWeight:"800",fontSize:20},
  center:{flex:1,alignItems:"center",justifyContent:"center"},
});
