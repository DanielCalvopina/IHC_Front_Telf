import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Link } from "expo-router";

// ⚠️ Importa los JSON con rutas relativas desde (tabs)/home
import data from "../../datosEstudiante.json";
import dataColegio from "../../notificacionesColegio.json";

type CursoNotif = {
  id: string;
  titulo: string;
  fechaISO: string;
  fechaLarga: string;
  cuerpo: string;
  visto: boolean;
  scope: "curso";
  courseKey: string;
  courseName: string;
  year: string;
};

type ColegioNotif = {
  id: string;
  titulo: string;
  fechaISO: string;
  fechaLarga: string;
  cuerpo: string;
  visto: boolean;
  scope: "colegio";
};

type Item = CursoNotif | ColegioNotif;

export default function NotificacionesScreen() {
  const currentYear = data.student?.cursoActual?.anioLectivo ?? "";
  const añoActual = data.aniosLectivos.find(a => a.anioLectivo === currentYear);

  const cursoNotifs: CursoNotif[] = useMemo(() => {
    if (!añoActual) return [];
    return (añoActual.cursos ?? []).flatMap(curso =>
      (curso.notificaciones ?? []).map(n => ({
        id: n.id,
        titulo: n.titulo,
        fechaISO: n.fechaISO,
        fechaLarga: n.fechaLarga,
        cuerpo: n.cuerpo,
        visto: !!n.visto,
        scope: "curso" as const,
        courseKey: curso.key,
        courseName: curso.nombre,
        year: añoActual.anioLectivo,
      }))
    );
  }, [añoActual]);

  const colegioNotifs: ColegioNotif[] = useMemo(() => {
    const arr = dataColegio?.colegio ?? [];
    return arr.map(n => ({
      id: n.id,
      titulo: n.titulo,
      fechaISO: n.fechaISO,
      fechaLarga: n.fechaLarga,
      cuerpo: n.cuerpo,
      visto: !!n.visto,
      scope: "colegio" as const,
    }));
  }, []);

  const inicial = useMemo<Item[]>(() => {
    const mix = [...cursoNotifs, ...colegioNotifs];
    return mix.sort((a, b) => (a.fechaISO < b.fechaISO ? 1 : -1));
  }, [cursoNotifs, colegioNotifs]);

  const [items, setItems] = useState<Item[]>(inicial);

  const marcarTodoComoLeido = () =>
    setItems(prev => prev.map(n => ({ ...n, visto: true })));

  const toggleLeido = (id: string) =>
    setItems(prev => prev.map(n => (n.id === id ? { ...n, visto: !n.visto } : n)));

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}>
      {/* Header */}
      <View style={st.header}>
        <Link href="/(tabs)/home" asChild>
          <Pressable style={st.icon}><Text style={st.iconTxt}>←</Text></Pressable>
        </Link>
        <Text style={st.title}>Notificaciones</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* Acciones */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Pressable onPress={marcarTodoComoLeido} style={st.primary}>
          <Text style={st.primaryTxt}>Marcar todo como leído</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {items.map(n => (
          <View key={n.id} style={st.card}>
            <View style={st.rowBetween}>
              <Text style={st.cardT}>{n.titulo}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={st.date}>{n.fechaLarga}</Text>
                {!n.visto && <View style={st.dot} />}
              </View>
            </View>

            {"scope" in n && n.scope === "curso" && (
              <Text style={st.badgeCtx}>Materia: {n.courseName}</Text>
            )}

            <Text style={st.body}>{n.cuerpo}</Text>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <Pressable
                onPress={() => toggleLeido(n.id)}
                style={[st.badge, n.visto ? st.badgeOk : st.badgeWarn]}
              >
                <Text style={n.visto ? st.badgeOkTxt : st.badgeWarnTxt}>
                  {n.visto ? "Leído" : "Marcar como leído"}
                </Text>
              </Pressable>

              {"scope" in n && n.scope === "curso" && (
                <Link
                  href={{
                    pathname: "/pages/estudiantes/cursos/notificaciones/detailNotificaciones",
                    params: { year: n.year, courseKey: n.courseKey },
                  }}
                  asChild
                >
                  <Pressable style={st.ghostBtn}>
                    <Text style={st.ghostBtnTxt}>Abrir Materia</Text>
                  </Pressable>
                </Link>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  header:{height:56,flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:12,backgroundColor:"#0D47A1"},
  icon:{width:56,height:56,alignItems:"center",justifyContent:"center"},
  iconTxt:{fontSize:28,color:"#fff",fontWeight:"700"},
  title:{color:"#fff",fontWeight:"800",fontSize:16},

  primary:{height:44,backgroundColor:"#005A9C",borderRadius:10,alignItems:"center",justifyContent:"center"},
  primaryTxt:{color:"#fff",fontWeight:"800"},

  card:{backgroundColor:"#fff",borderRadius:12,borderWidth:1,borderColor:"#E2E8F0",padding:14},
  rowBetween:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  cardT:{fontWeight:"800",color:"#0F172A"},
  date:{color:"#64748B",fontSize:12},
  dot:{width:8,height:8,borderRadius:8,backgroundColor:"#28A745"},
  body:{marginTop:6,color:"#0F172A"},

  badge:{paddingHorizontal:12,paddingVertical:6,borderRadius:999,alignItems:"center",justifyContent:"center"},
  badgeWarn:{backgroundColor:"#FEF3C7"}, badgeWarnTxt:{color:"#92400E",fontWeight:"800"},
  badgeOk:{backgroundColor:"#DCFCE7"}, badgeOkTxt:{color:"#166534",fontWeight:"800"},

  badgeCtx:{marginTop:4,alignSelf:"flex-start",backgroundColor:"#E6F0FA",color:"#005A9C",fontWeight:"800",paddingHorizontal:10,paddingVertical:4,borderRadius:999,fontSize:12},

  ghostBtn:{backgroundColor:"#E6F0FA",borderRadius:10,paddingHorizontal:12,height:36,alignItems:"center",justifyContent:"center"},
  ghostBtnTxt:{color:"#005A9C",fontWeight:"800"},
});