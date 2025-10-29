import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import data from "../../../../datosEstudiante.json";

type P = { year: string; courseKey: string };

type NotificationItem = {
  id: string;
  titulo: string;
  fechaISO: string;
  fechaLarga: string;
  cuerpo: string;
  visto: boolean;
};

export default function DetailNotificaciones() {
  const { year, courseKey } = useLocalSearchParams<P>();
  const y = data.aniosLectivos.find((a) => a.anioLectivo === year);
  const c = y?.cursos.find((cc) => cc.key === courseKey);

  const [items, setItems] = useState<NotificationItem[]>(
    () => (c?.notificaciones as NotificationItem[]) ?? []
  );

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  if (!y || !c) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}>
        <View style={st.center}>
          <Text>Sin datos</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7F8", paddingTop: statusBarHeight }}>
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
        <Text style={st.title}>Notificaciones - {c.nombre}</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {items.map((n) => (
          <View key={n.id} style={st.card}>
            <View style={st.rowBetween}>
              <Text style={st.cardT}>{n.titulo}</Text>
              <View style={st.row}>
                <Text style={st.date}>{n.fechaLarga}</Text>
                {!n.visto && <View style={st.dot} />}
              </View>
            </View>

            <Text style={st.body}>{n.cuerpo}</Text>

            <Pressable
              onPress={() =>
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === n.id ? { ...x, visto: !x.visto } : x
                  )
                )
              }
              style={[st.badge, n.visto ? st.badgeOk : st.badgeWarn]}
            >
              <Text style={n.visto ? st.badgeOkTxt : st.badgeWarnTxt}>
                {n.visto ? "Visto" : "Marcar como visto"}
              </Text>
            </Pressable>
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
    backgroundColor: "#0D47A1",
  },
  icon: {
    width: 56,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTxt: { color: "#fff", fontSize: 20, fontWeight: "800" },
  title: { color: "#fff", fontWeight: "800", fontSize: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardT: { fontWeight: "800", color: "#0F172A" },
  date: { color: "#64748B", fontSize: 12 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#28A745" },
  body: { marginTop: 6, color: "#0F172A" },

  badge: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeWarn: { backgroundColor: "#FEF3C7" },
  badgeWarnTxt: { color: "#92400E", fontWeight: "800" },
  badgeOk: { backgroundColor: "#DCFCE7" },
  badgeOkTxt: { color: "#166534", fontWeight: "800" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});