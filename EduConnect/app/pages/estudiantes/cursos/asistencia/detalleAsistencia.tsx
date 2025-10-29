import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
  Platform,
  BackHandler,
} from "react-native";
import { Link, useLocalSearchParams, router, type Href } from "expo-router";
import data from "../../../../datosEstudiante.json";

type Base = { id: string; fechaISO: string; fechaLarga: string; estado: string };
type ConDetalle = Base & { detalle: { motivo: string | null; comentarioProfesor: string } };
type AItem = Base | ConDetalle;

function tieneDetalle(a: AItem): a is ConDetalle {
  return typeof (a as any).detalle === "object" && (a as any).detalle !== null;
}

type P = { year: string; courseKey: string; id?: string };

export default function DetalleAsistencia() {
  const { year, courseKey, id } = useLocalSearchParams<P>();
  const y = data.aniosLectivos.find(a => a.anioLectivo === year);
  const c = y?.cursos.find(cc => cc.key === courseKey);

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  if (!y || !c) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}>
        <View style={st.center}><Text>Sin datos</Text></View>
      </SafeAreaView>
    );
  }

  const registros = (c.asistencia ?? []) as AItem[];
  const reg = id ? registros.find(r => r.id === id) : undefined;

  // Hardware Back: si hay id → volver a lista de asistencia; si no → volver al detalle del curso
  React.useEffect(() => {
    const onBack = () => {
      if (id) {
        router.replace({
          pathname: "/pages/estudiantes/cursos/asistencia/detalleAsistencia",
          params: { year: String(year), courseKey: String(courseKey) },
        });
        return true;
      }
      router.replace({
        pathname: "/pages/estudiantes/cursos/detailCurso",
        params: { year: String(year), courseKey: String(courseKey) },
      });
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [id, year, courseKey]);

  // Href del botón back (mismo criterio que hardware back)
  const backHref: Href = id
    ? {
        pathname: "/pages/estudiantes/cursos/asistencia/detalleAsistencia",
        params: { year: String(year), courseKey: String(courseKey) },
      }
    : {
        pathname: "/pages/estudiantes/cursos/detailCurso",
        params: { year: String(year), courseKey: String(courseKey) },
      };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}>
      {/* Header */}
      <View style={st.header}>
        <Link href={backHref} replace asChild>
          <Pressable style={st.icon} hitSlop={10} accessibilityRole="button" accessibilityLabel="Regresar">
            <Text style={st.iconTxt}>←</Text>
          </Pressable>
        </Link>
        <Text style={st.title}>{id ? "Detalle de Inasistencia" : `Asistencia - ${c.nombre}`}</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* Contenido */}
      {!id ? (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
          {registros.map(r => (
            <View key={r.id} style={st.row}>
              <View style={{ flex: 1 }}>
                <Text style={st.rowT}>
                  {r.fechaLarga ?? new Date(r.fechaISO).toLocaleDateString("es-EC", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}
                </Text>

                {/ausenc|tarde/i.test(r.estado) && (
                  <Link
                    href={{
                      pathname: "/pages/estudiantes/cursos/asistencia/detalleAsistencia",
                      params: { year: String(year), courseKey: String(courseKey), id: String(r.id) },
                    } as Href}
                    replace
                    asChild
                  >
                    <Pressable><Text style={st.link}>Ver Detalles ▾</Text></Pressable>
                  </Link>
                )}
              </View>

              <Text style={[
                st.badge,
                /ausenc|tarde/i.test(r.estado) ? st.badgeWarn : st.badgeOk
              ]}>
                {r.estado}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <View style={st.top}>
            <Text style={st.topT}>{reg?.estado ?? "Registro"}</Text>
            <Text style={st.muted}>{reg?.fechaLarga}</Text>
          </View>

          <View>
            <Text style={st.blockT}>Materia</Text>
            <Text style={st.blockV}>{c.nombre}</Text>
          </View>

          {reg && tieneDetalle(reg) && (
            <>
              <Text style={st.blockT}>Motivo de la inasistencia</Text>
              <Text style={st.muted}>{reg.detalle.motivo ?? "No se registró un motivo."}</Text>

              <Text style={st.blockT}>Comentarios del Profesor</Text>
              <Text style={st.muted}>{reg.detalle.comentarioProfesor ?? "—"}</Text>
            </>
          )}
        </ScrollView>
      )}
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
    backgroundColor: "#0D47A1",
  },
  icon: { width: 56, height: 48, alignItems: "center", justifyContent: "center" },
  iconTxt: { color: "#fff", fontSize: 20, fontWeight: "800" },
  title: { color: "#fff", fontWeight: "800", fontSize: 16 },

  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowT: { fontWeight: "700", color: "#0F172A" },
  link: { color: "#005A9C", fontWeight: "800", marginTop: 4 },

  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, fontWeight: "800" },
  badgeOk: { backgroundColor: "#DCFCE7", color: "#16A34A" },
  badgeWarn: { backgroundColor: "#FEF3C7", color: "#D97706" },

  top: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", padding: 16 },
  topT: { fontWeight: "800", color: "#0F172A", fontSize: 16 },
  muted: { color: "#64748B" },
  blockT: { marginTop: 10, fontWeight: "800", color: "#0F172A" },
  blockV: { color: "#0F172A" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
