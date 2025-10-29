// app/pages/estudiantes/cursos/notas/detalleNotas.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  BackHandler,
} from "react-native";
import { Link, useLocalSearchParams, router } from "expo-router";
import data from "../../../../datosEstudiante.json";

/** ===== Tipos FLEXIBLES (opcionales) para que no truene TS ===== */
type NotaItem = { titulo: string; fecha: string; nota: number };
type Unidad = { id: number; items?: NotaItem[]; promedio?: number };
type Semestre = { id: number; unidades?: Unidad[] };
type Notas = { semestres?: Semestre[] };

type Promedios = { semestre1?: number; semestre2?: number };
type Docente = { nombre?: string; email?: string };

type Curso = {
  key: string;
  nombre: string;
  detalleTitulo?: string;
  docente?: Docente;
  portada?: string;
  promedios?: Promedios;
  semestreActual?: number;
  notas?: Notas;
};

type AnioLectivo = { anioLectivo: string; cursos: Curso[] };
type Root = { aniosLectivos: AnioLectivo[]; student: any };

/** Cast del JSON a nuestros tipos */
const ALL = data as unknown as Root;

type P = { year: string; courseKey: string; semestre?: string };

export default function DetalleNotas() {
  const { year, courseKey, semestre } = useLocalSearchParams<P>();

  const y = ALL.aniosLectivos.find((a) => a.anioLectivo === year);
  const c = y?.cursos.find((cc) => cc.key === courseKey);

  const initialSem: 1 | 2 = (Number(semestre ?? "1") === 2 ? 2 : 1) as 1 | 2;
  const [sem, setSem] = useState<1 | 2>(initialSem);

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  if (!y || !c) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}
      >
        <View style={st.center}>
          <Text>Sin datos</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hardware Back → siempre volver al Detalle del Curso (evita ir a Home)
  useEffect(() => {
    const onBack = () => {
      router.replace({
        pathname: "/pages/estudiantes/cursos/detailCurso",
        params: { year: String(year), courseKey: String(courseKey) },
      });
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [year, courseKey]);

  const semestres = c.notas?.semestres ?? [];
  const semData = useMemo(
    () => semestres.find((s) => s.id === sem),
    [sem, semestres]
  );
  const unidades = semData?.unidades ?? [];

  const [unidad, setUnidad] = useState<number>(unidades[0]?.id ?? 1);
  useEffect(() => {
    setUnidad(unidades[0]?.id ?? 1);
  }, [sem, unidades.length]);

  const items = useMemo(() => {
    const list = unidades.find((u) => u.id === unidad)?.items ?? [];
    return [...list].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }, [unidad, unidades]);

  const promU = unidades.find((u) => u.id === unidad)?.promedio ?? 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}
    >
      {/* Header */}
      <View style={st.header}>
        <Link
          href={{
            pathname: "/pages/estudiantes/cursos/detailCurso",
            params: { year: String(year), courseKey: String(courseKey) },
          }}
          replace
          asChild
        >
          <Pressable style={st.icon}>
            <Text style={st.iconTxt}>←</Text>
          </Pressable>
        </Link>
        <Text style={st.title}>Detalle de Notas - {c.nombre}</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text style={st.big}>{c.nombre}</Text>
          <Text style={st.muted}>{ALL.student?.nombre ?? ""}</Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <View className="segment" style={st.segment}>
            <Pressable
              onPress={() => setSem(1)}
              style={[st.segBtn, sem === 1 && st.segActive]}
            >
              <Text style={[st.segTxt, sem === 1 && st.segTxtActive]}>
                Semestre 1
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSem(2)}
              style={[st.segBtn, sem === 2 && st.segActive]}
            >
              <Text style={[st.segTxt, sem === 2 && st.segTxtActive]}>
                Semestre 2
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 12 }}
        >
          {unidades.length ? (
            unidades.map((u) => (
              <Pressable
                key={u.id}
                onPress={() => setUnidad(u.id)}
                style={[st.chip, unidad === u.id ? st.chipOn : st.chipOff]}
              >
                <Text
                  style={[
                    st.chipTxt,
                    unidad === u.id ? st.chipTxtOn : st.chipTxtOff,
                  ]}
                >
                  Unidad {u.id}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: "#64748B" }}>Sin unidades</Text>
          )}
        </ScrollView>

        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <View style={st.avgCard}>
            <Text style={st.avgLabel}>Promedio Unidad {unidad}</Text>
            <Text style={st.avgValue}>{promU.toFixed(1)}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 6 }}>
          <Text style={st.listTitle}>Calificaciones Unidad {unidad}</Text>
        </View>

        <View style={{ marginTop: 6 }}>
          {items.length ? (
            items.map((it, idx) => (
              <View key={`${unidad}-${idx}`} style={st.row}>
                <View>
                  <Text style={st.rowT}>{it.titulo}</Text>
                  <Text style={st.muted}>
                    {new Date(it.fecha).toLocaleDateString("es-EC", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <Text style={st.rowV}>{Number(it.nota).toFixed(1)}</Text>
              </View>
            ))
          ) : (
            <Text
              style={{ paddingHorizontal: 16, color: "#64748B", marginTop: 4 }}
            >
              Sin items en esta unidad.
            </Text>
          )}
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
    backgroundColor: "#0D47A1",
  },
  icon: { width: 56, height: 48, alignItems: "center", justifyContent: "center" },
  iconTxt: { color: "#fff", fontSize: 20, fontWeight: "800" },
  title: { color: "#fff", fontWeight: "800", fontSize: 16 },

  big: { fontSize: 22, fontWeight: "800", color: "#111827" },
  muted: { color: "#6B7280", marginTop: 2 },

  segment: { flexDirection: "row", borderRadius: 12, overflow: "hidden", backgroundColor: "#E5E7EB" },
  segBtn: { flex: 1, paddingVertical: 10, alignItems: "center" },
  segActive: { backgroundColor: "#fff" },
  segTxt: { color: "#475569", fontWeight: "800" },
  segTxtActive: { color: "#0F172A" },

  chip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  chipOn: { backgroundColor: "#005A9C", borderColor: "#005A9C" },
  chipOff: { backgroundColor: "#fff", borderColor: "#CBD5E1" },
  chipTxt: { fontWeight: "800" },
  chipTxtOn: { color: "#fff" },
  chipTxtOff: { color: "#0F172A" },

  avgCard: { backgroundColor: "#E6F0FA", borderRadius: 16, padding: 16 },
  avgLabel: { color: "#0F172A", fontWeight: "700" },
  avgValue: { fontSize: 32, fontWeight: "800", color: "#0F172A", marginTop: 2 },

  listTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowT: { fontWeight: "700", color: "#0F172A" },
  rowV: { fontWeight: "800", fontSize: 18, color: "#0F172A" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
