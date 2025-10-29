import React, { useCallback } from "react";
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
  BackHandler,
} from "react-native";
import {
  Link,
  useLocalSearchParams,
  useFocusEffect,
  router,
} from "expo-router";
import data from "../../../datosEstudiante.json";

type P = { year: string; courseKey: string };

export default function DetailCurso() {
  const { year, courseKey } = useLocalSearchParams<P>();
  const y = data.aniosLectivos.find((a) => a.anioLectivo === year);
  const c = y?.cursos.find((cc) => cc.key === courseKey);

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  if (!y || !c) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}
      >
        <View style={st.center}>
          <Text>Curso no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const s1 = c.notas.semestres.find((s) => s.id === 1)?.promedio ?? 0;
  const s2 = c.notas.semestres.find((s) => s.id === 2)?.promedio ?? 0;
  const prom = Number(((s1 + s2) / 2).toFixed(1));

  const asist = c.asistencia ?? [];
  const presentes = asist.filter((a) => a.estado === "Presente").length;
  const pct = asist.length ? Math.round((presentes / asist.length) * 100) : 100;

  // ⬇️ Intercepta el botón físico Atrás y manda SIEMPRE a la lista de cursos del mismo año
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        router.replace({
          pathname: "/pages/estudiantes/cursos/todosLosCursos",
          params: { year: String(year) },
        });
        return true; // consumimos el evento
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [year])
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}
    >
      <View style={st.header}>
        {/* Flecha: también vuelve a la lista de cursos del MISMO año */}
        <Link
          href={{
            pathname: "/pages/estudiantes/cursos/todosLosCursos",
            params: { year: String(year) },
          }}
          replace
          asChild
        >
          <Pressable
            style={st.icon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Regresar a cursos"
          >
            <Text style={st.iconTxt}>←</Text>
          </Pressable>
        </Link>
        <Text style={st.title}>{c.detalleTitulo || c.nombre}</Text>
        <View style={{ width: 56 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {/* Profesor */}
        <View style={{ padding: 16 }}>
          <View style={st.teacher}>
            <View style={{ flex: 2 }}>
              <Text style={st.teacherLbl}>Profesor</Text>
              <Text style={st.teacherName}>{c.docente.nombre}</Text>
              <Text style={st.teacherMail}>{c.docente.email}</Text>
            </View>
            <Image
              source={{
                uri:
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop",
              }}
              style={st.avatar}
            />
          </View>
        </View>

        {/* Notificaciones */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={st.box}>
            <Text style={st.boxT}>Contactar al profesor</Text>
            <Text style={st.boxS}>
              Consulta las notificaciones del profesor para estar al día.
            </Text>
            <Link
              href={{
                pathname: "/pages/estudiantes/cursos/notificaciones/detailNotificaciones",
                params: { year: String(year), courseKey: String(courseKey) },
              }}
              replace
              asChild
            >
              <Pressable style={st.primary}>
                <Text style={st.primaryTxt}>🔔  Ver Notificaciones</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Calificaciones */}
        <View style={{ padding: 16 }}>
          <View style={st.card}>
            <View style={st.rowBetween}>
              <Text style={st.cardTitle}>Calificaciones</Text>
              <Text style={st.avg}>Promedio: {prom}</Text>
            </View>

            <View style={{ gap: 10 }}>
              {[{ id: 1, v: s1 }, { id: 2, v: s2 }].map((s) => (
                <Link
                  key={s.id}
                  href={{
                    pathname: "/pages/estudiantes/cursos/notas/detalleNotas",
                    params: {
                      year: String(year),
                      courseKey: String(courseKey),
                      semestre: String(s.id),
                    },
                  }}
                  replace
                  asChild
                >
                  <Pressable style={st.item}>
                    <View>
                      <Text style={st.itemT}>
                        {s.id === 1 ? "Primer" : "Segundo"} Semestre
                      </Text>
                      <Text style={st.itemS}>Promedio: {s.v.toFixed(1)}</Text>
                    </View>
                    <Text style={st.arrow}>›</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        </View>

        {/* Asistencia */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={st.card}>
            <View style={st.rowBetween}>
              <Text style={st.cardTitle}>Asistencia</Text>
              <Text style={st.ok}>{pct}%</Text>
            </View>

            <View style={st.barWrap}>
              <View style={[st.barFill, { width: `${pct}%` }]} />
            </View>

            <Link
              href={{
                pathname: "/pages/estudiantes/cursos/asistencia/detalleAsistencia",
                params: { year: String(year), courseKey: String(courseKey) },
              }}
              replace
              asChild
            >
              <Pressable style={st.secondary}>
                <Text style={st.secondaryTxt}>Ver lista / detalles</Text>
              </Pressable>
            </Link>
          </View>
        </View>
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
  iconTxt: { fontSize: 28, lineHeight: 28, fontWeight: "800", color: "#0F172A" },
  title: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  teacher: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  teacherLbl: { color: "#005A9C", fontWeight: "700" },
  teacherName: { fontWeight: "800", fontSize: 16, color: "#0F172A" },
  teacherMail: { color: "#64748B" },
  avatar: { width: 96, height: 96, borderRadius: 999, backgroundColor: "#E5E7EB", flex: 1 },

  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  boxT: { fontWeight: "800", color: "#0F172A" },
  boxS: { color: "#475569" },
  primary: {
    height: 48,
    backgroundColor: "#005A9C",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  primaryTxt: { color: "#fff", fontWeight: "800" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontWeight: "800", color: "#0F172A", fontSize: 18 },
  avg: { color: "#16A34A", fontWeight: "800", fontSize: 16 },

  item: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemT: { fontWeight: "800", color: "#0F172A" },
  itemS: { color: "#64748B", marginTop: 2 },
  arrow: { color: "#005A9C", fontSize: 22, fontWeight: "900" },

  barWrap: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    marginTop: 6,
  },
  barFill: { height: "100%", backgroundColor: "#22C55E", borderRadius: 999 },
  secondary: {
    marginTop: 10,
    height: 44,
    backgroundColor: "#0D47A1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryTxt: { color: "#fff", fontWeight: "800" },
  ok: { color: "#16A34A", fontWeight: "800" },
});
