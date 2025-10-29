import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  BackHandler,
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

const COLORS = {
  headerBg: "#0D47A1",
  headerText: "#fff",
  bg: "#F6F7F8",
  primary: "#005A9C",
  primaryText: "#fff",
  cardBg: "#fff",
  cardBorder: "#E2E8F0",
  text: "#0F172A",
  subtext: "#64748B",
  date: "#64748B",
  dot: "#28A745",
  ghostBg: "#E6F0FA",
  ghostText: "#005A9C",
  warnBg: "#FEF3C7",
  warnText: "#92400E",
  okBg: "#DCFCE7",
  okText: "#166534",
  overlay: "rgba(17,24,39,0.6)",
};

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

  // ====== Modal de Detalle ======
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);

  const openDetail = (it: Item) => {
    setSelected(it);
    setOpen(true);
  };
  const closeDetail = () => {
    setOpen(false);
    setSelected(null);
  };

  // Botón físico atrás cierra modal si está abierto
  useEffect(() => {
    const onBack = () => {
      if (open) {
        closeDetail();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [open]);

  const marcarTodoComoLeido = () =>
    setItems(prev => prev.map(n => ({ ...n, visto: true })));

  const toggleLeido = useCallback((id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, visto: !n.visto } : n)));
    // Si el toggle viene desde el modal, actualiza el seleccionado también
    setSelected(prev => (prev && prev.id === id ? { ...prev, visto: !prev.visto } : prev));
  }, []);

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, paddingTop: statusBarHeight }}>
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

      {/* Lista */}
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

            <Text style={st.body} numberOfLines={3}>{n.cuerpo}</Text>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <Pressable
                onPress={() => toggleLeido(n.id)}
                style={[st.badge, n.visto ? st.badgeOk : st.badgeWarn]}
              >
                <Text style={n.visto ? st.badgeOkTxt : st.badgeWarnTxt}>
                  {n.visto ? "Leído" : "Marcar como leído"}
                </Text>
              </Pressable>

              <Pressable style={st.ghostBtn} onPress={() => openDetail(n)}>
                <Text style={st.ghostBtnTxt}>Ver detalle</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ===== Modal Detalle (todo aquí, sin navegar) ===== */}
      <Modal visible={open} transparent animationType="fade" statusBarTranslucent>
        <View style={st.overlay}>
          <View style={st.modalCard}>
            {selected && (
              <>
                <Text style={st.modalTitle}>{selected.titulo}</Text>
                <View style={st.modalMetaRow}>
                  {"scope" in selected && selected.scope === "curso" ? (
                    <Text style={st.badgeCtx}>Materia: {selected.courseName}</Text>
                  ) : (
                    <Text style={st.badgeCtxGhost}>Colegio</Text>
                  )}
                  <Text style={st.modalDate}>{selected.fechaLarga}</Text>
                </View>

                <ScrollView style={{ maxHeight: 280 }} contentContainerStyle={{ paddingVertical: 6 }}>
                  <Text style={st.modalBody}>{selected.cuerpo}</Text>
                </ScrollView>

                <View style={st.modalRow}>
                  <Pressable
                    onPress={() => toggleLeido(selected.id)}
                    style={[st.badge, selected.visto ? st.badgeOk : st.badgeWarn, { flex: 1, height: 44 }]}
                  >
                    <Text style={selected.visto ? st.badgeOkTxt : st.badgeWarnTxt}>
                      {selected.visto ? "Marcar como no leído" : "Marcar como leído"}
                    </Text>
                  </Pressable>

                  <Pressable onPress={closeDetail} style={[st.modalPrimaryBtn, { flex: 1 }]}>
                    <Text style={st.modalPrimaryBtnTxt}>Cerrar</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  header:{height:56,flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:12,backgroundColor:COLORS.headerBg},
  icon:{width:56,height:56,alignItems:"center",justifyContent:"center"},
  iconTxt:{fontSize:28,color:COLORS.headerText,fontWeight:"700"},
  title:{color:COLORS.headerText,fontWeight:"800",fontSize:16},

  primary:{height:44,backgroundColor:COLORS.primary,borderRadius:10,alignItems:"center",justifyContent:"center"},
  primaryTxt:{color:COLORS.primaryText,fontWeight:"800"},

  card:{backgroundColor:COLORS.cardBg,borderRadius:12,borderWidth:1,borderColor:COLORS.cardBorder,padding:14},
  rowBetween:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  cardT:{fontWeight:"800",color:COLORS.text},
  date:{color:COLORS.date,fontSize:12},
  dot:{width:8,height:8,borderRadius:8,backgroundColor:COLORS.dot},
  body:{marginTop:6,color:COLORS.text},

  badge:{paddingHorizontal:12,paddingVertical:6,borderRadius:999,alignItems:"center",justifyContent:"center"},
  badgeWarn:{backgroundColor:COLORS.warnBg}, 
  badgeWarnTxt:{color:COLORS.warnText,fontWeight:"800"},
  badgeOk:{backgroundColor:COLORS.okBg}, 
  badgeOkTxt:{color:COLORS.okText,fontWeight:"800"},

  badgeCtx:{marginTop:4,alignSelf:"flex-start",backgroundColor:COLORS.ghostBg,color:COLORS.ghostText,fontWeight:"800",paddingHorizontal:10,paddingVertical:4,borderRadius:999,fontSize:12},
  badgeCtxGhost:{marginTop:4,alignSelf:"flex-start",backgroundColor:"#F1F5F9",color:"#0F172A",fontWeight:"800",paddingHorizontal:10,paddingVertical:4,borderRadius:999,fontSize:12},

  ghostBtn:{backgroundColor:COLORS.ghostBg,borderRadius:10,paddingHorizontal:12,height:36,alignItems:"center",justifyContent:"center"},
  ghostBtnTxt:{color:COLORS.ghostText,fontWeight:"800"},

  // Modal
  overlay:{flex:1,backgroundColor:COLORS.overlay,alignItems:"center",justifyContent:"center",padding:16},
  modalCard:{
    width:"100%",maxWidth:520,backgroundColor:"#fff",borderRadius:12,padding:16,
    shadowColor:"#000",shadowOpacity:0.3,shadowRadius:20,shadowOffset:{width:0,height:10},elevation:10
  },
  modalTitle:{fontSize:18,fontWeight:"800",color:"#1F2937"},
  modalMetaRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:6},
  modalDate:{color:COLORS.date,fontSize:12},
  modalBody:{color:"#0F172A",fontSize:15,lineHeight:22},

  modalRow:{flexDirection:"row",gap:10,marginTop:12},
  modalPrimaryBtn:{backgroundColor:COLORS.primary,height:44,borderRadius:8,alignItems:"center",justifyContent:"center",paddingHorizontal:16},
  modalPrimaryBtnTxt:{color:"#fff",fontWeight:"800"},
});
