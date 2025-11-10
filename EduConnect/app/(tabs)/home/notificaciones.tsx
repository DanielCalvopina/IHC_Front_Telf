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
  useColorScheme,
} from "react-native";
import { Link } from "expo-router";

// ⚠️ Importa los JSON con rutas relativas
import data from "../../datosEstudiante.json";
import dataColegio from "../../notificacionesColegio.json";

// (Tipos de datos)
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

// (Paletas de colores)
const Palettes = {
  light: {
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
    modalCardBg: "#fff",
    filterBtnBg: "#E0E7FF",
    filterBtnTxt: "#3730A3",
    filterBtnActiveBg: "#3730A3",
    filterBtnActiveTxt: "#fff",
    badgeCtxGhostBg: "#F1F5F9",
    badgeCtxGhostTxt: "#0F172A",
  },
  dark: {
    headerBg: "#0A367E",
    headerText: "#fff",
    bg: "#1E293B",
    primary: "#3B82F6",
    primaryText: "#fff",
    cardBg: "#334155",
    cardBorder: "#475569",
    text: "#F1F5F9",
    subtext: "#94A3B8",
    date: "#94A3B8",
    dot: "#4ADE80",
    ghostBg: "#1E3A8A",
    ghostText: "#BFDBFE",
    warnBg: "#78350F",
    warnText: "#FDE68A",
    okBg: "#166534",
    okText: "#A7F3D0",
    overlay: "rgba(0,0,0,0.7)",
    modalCardBg: "#293548",
    filterBtnBg: "#475569",
    filterBtnTxt: "#E0E7FF",
    filterBtnActiveBg: "#818CF8",
    filterBtnActiveTxt: "#1E1B4B",
    badgeCtxGhostBg: "#475569",
    badgeCtxGhostTxt: "#E0E7FF",
  },
};

type FilterStatus = 'all' | 'unread' | 'read';

export default function NotificacionesScreen() {
  // --- Configuración de Tema ---
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = isDarkMode ? Palettes.dark : Palettes.light;

  // --- Carga de Datos ---
  const currentYear = data.student?.cursoActual?.anioLectivo ?? "";
  const añoActual = data.aniosLectivos.find(a => a.anioLectivo === currentYear);

  const availableCourses = useMemo(() => {
    if (!añoActual) return [];
    return (añoActual.cursos ?? []).map(c => ({ key: c.key, nombre: c.nombre }));
  }, [añoActual]);

  const cursoNotifs: CursoNotif[] = useMemo(() => {
    if (!añoActual) return [];
    return (añoActual.cursos ?? []).flatMap(curso =>
      (curso.notificaciones ?? []).map(n => ({ ...n, visto: !!n.visto, scope: "curso" as const, courseKey: curso.key, courseName: curso.nombre, year: añoActual.anioLectivo }))
    );
  }, [añoActual]);
  const colegioNotifs: ColegioNotif[] = useMemo(() => {
    const arr = dataColegio?.colegio ?? [];
    return arr.map(n => ({ ...n, visto: !!n.visto, scope: "colegio" as const }));
  }, []);
  const inicial = useMemo<Item[]>(() => {
    const mix = [...cursoNotifs, ...colegioNotifs];
    return mix.sort((a, b) => (a.fechaISO < b.fechaISO ? 1 : -1));
  }, [cursoNotifs, colegioNotifs]);

  // --- Estado ---
  const [items, setItems] = useState<Item[]>(inicial);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);

  // --- Estado del Modal de Filtros ---
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sourceFilter, setSourceFilter] = useState<string[]>(['all']); 
  const [tempFilterStatus, setTempFilterStatus] = useState<FilterStatus>('all');
  const [tempSourceFilter, setTempSourceFilter] = useState<string[]>(['all']);
  
  // --- Sincronización ---
  useEffect(() => {
    const onBack = () => {
      if (filterModalVisible) {
        setFilterModalVisible(false); 
        return true;
      }
      if (detailModalOpen) {
        closeDetail(); 
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [detailModalOpen, filterModalVisible]); 

  useEffect(() => {
    setItems(inicial);
  }, [inicial]);

  // --- Lógica de Filtro ---
  const displayedItems = useMemo(() => {
    return items.filter(item => {
      let statusMatch = false;
      if (filterStatus === 'all') {
        statusMatch = true;
      } else if (filterStatus === 'unread') {
        statusMatch = !item.visto;
      } else if (filterStatus === 'read') {
        statusMatch = item.visto;
      }

      let sourceMatch = false;
      if (sourceFilter.includes('all')) {
        sourceMatch = true;
      } else {
        const isColegioMatch = sourceFilter.includes('colegio') && item.scope === 'colegio';
        const isCursoMatch = item.scope === 'curso' && sourceFilter.includes(item.courseKey);
        sourceMatch = isColegioMatch || isCursoMatch;
      }
      
      return statusMatch && sourceMatch;
    });
  }, [items, filterStatus, sourceFilter]);


  // --- Handlers de Modales ---
  
  // Modal de Detalle
  const openDetail = (it: Item) => {
    setSelected(it);
    setDetailModalOpen(true);
  };
  const closeDetail = () => {
    setDetailModalOpen(false);
    setSelected(null);
  };

  // Handlers del Modal de Filtros
  const openFilterModal = () => {
    setTempFilterStatus(filterStatus);
    setTempSourceFilter(sourceFilter);
    setFilterModalVisible(true);
  };

  const applyAndCloseFilterModal = () => {
    setFilterStatus(tempFilterStatus);
    setSourceFilter(tempSourceFilter);
    setFilterModalVisible(false);
  };
  
  const cancelAndCloseFilterModal = () => {
    setFilterModalVisible(false); 
  };
  
  // 1. NUEVO: Handler para el botón Restablecer
  const resetTempFilters = () => {
    setTempFilterStatus('all');
    setTempSourceFilter(['all']);
  };

  // 2. Lógica de multi-selección actualizada (sin 'all')
  const toggleTempSource = (key: string) => {
    setTempSourceFilter(prev => {
      // Empezar quitando 'all' si se selecciona cualquier otra cosa
      let newFilter = [...prev].filter(k => k !== 'all'); 
      
      const index = newFilter.indexOf(key);
      if (index > -1) {
        // Si ya estaba, se quita
        newFilter.splice(index, 1);
      } else {
        // Si no estaba, se añade
        newFilter.push(key);
      }
      
      // Si el array queda vacío, vuelve a 'all'
      if (newFilter.length === 0) {
        return ['all'];
      }
      
      return newFilter;
    });
  };
  // --- Fin Handlers Modal Filtros ---

  const marcarTodoComoLeido = () =>
    setItems(prev => prev.map(n => ({ ...n, visto: true })));

  const toggleLeido = useCallback((id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, visto: !n.visto } : n)));
    setSelected(prev => (prev && prev.id === id ? { ...prev, visto: !prev.visto } : prev));
  }, []);

  // Etiqueta del botón de filtro
  const filterLabel = useMemo(() => {
    let statusLabel = "Todos";
    if (filterStatus === 'unread') statusLabel = "No Leídos";
    if (filterStatus === 'read') statusLabel = "Leídos";
    
    let sourceLabel = "Todos";
    if (!sourceFilter.includes('all')) {
      const allSources = [{ key: 'colegio', nombre: 'Colegio' }, ...availableCourses];
      sourceLabel = sourceFilter
        .map(key => allSources.find(s => s.key === key)?.nombre)
        .filter(Boolean) 
        .join(', ');
    }
    
    return `Filtros: ${statusLabel} / ${sourceLabel}`;
  }, [filterStatus, sourceFilter, availableCourses]);
  // --- Fin Etiqueta ---

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  // (Estilos dinámicos)
  const st = useMemo(() => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.bg, paddingTop: statusBarHeight },
    header: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, backgroundColor: theme.headerBg },
    icon: { width: 56, height: 56, alignItems: "center", justifyContent: "center" },
    iconTxt: { fontSize: 28, color: theme.headerText, fontWeight: "700" },
    title: { color: theme.headerText, fontWeight: "800", fontSize: 16 },
    primary: { height: 44, backgroundColor: theme.primary, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    primaryTxt: { color: theme.primaryText, fontWeight: "800" },
    
    filterTriggerBtn: {
      height: 44,
      backgroundColor: theme.filterBtnBg,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 6,
      paddingHorizontal: 12,
    },
    filterTriggerBtnTxt: {
      color: theme.filterBtnTxt,
      fontWeight: "800",
      flexShrink: 1, 
    },
    
    filterModalCard: {
      width: "100%", 
      maxWidth: 520, 
      backgroundColor: theme.modalCardBg, 
      borderRadius: 12, 
      padding: 16,
      maxHeight: "80%", 
    },
    filterSectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 8,
      marginTop: 12, 
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    filterRow: { 
      flexDirection: "row", 
      gap: 8,
      flexWrap: 'wrap', 
    },
    filterOptionBtn: {
      paddingHorizontal: 14,
      height: 36,
      backgroundColor: theme.filterBtnBg,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.filterBtnBg,
    },
    filterOptionBtnTxt: {
      color: theme.filterBtnTxt,
      fontWeight: "700",
      fontSize: 13,
    },
    filterOptionBtnActive: {
      paddingHorizontal: 14,
      height: 36,
      backgroundColor: theme.filterBtnActiveBg,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.filterBtnActiveBg,
    },
    filterOptionBtnActiveTxt: {
      color: theme.filterBtnActiveTxt,
      fontWeight: "700",
      fontSize: 13,
    },
    modalFooter: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.cardBorder,
      paddingTop: 12,
    },
    
    card: { backgroundColor: theme.cardBg, borderRadius: 12, borderWidth: 1, borderColor: theme.cardBorder, padding: 14 },
    rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    cardT: { fontWeight: "800", color: theme.text, flexShrink: 1, marginRight: 8 },
    date: { color: theme.date, fontSize: 12 },
    dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: theme.dot },
    body: { marginTop: 6, color: theme.text },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, alignItems: "center", justifyContent: "center" },
    badgeWarn: { backgroundColor: theme.warnBg },
    badgeWarnTxt: { color: theme.warnText, fontWeight: "800" },
    badgeOk: { backgroundColor: theme.okBg },
    badgeOkTxt: { color: theme.okText, fontWeight: "800" },
    badgeCtx: { marginTop: 4, alignSelf: "flex-start", backgroundColor: theme.ghostBg, color: theme.ghostText, fontWeight: "800", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 12 },
    badgeCtxGhost: { marginTop: 4, alignSelf: "flex-start", backgroundColor: theme.badgeCtxGhostBg, color: theme.badgeCtxGhostTxt, fontWeight: "800", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 12 },
    ghostBtn: { backgroundColor: theme.ghostBg, borderRadius: 10, paddingHorizontal: 12, height: 36, alignItems: "center", justifyContent: "center" },
    ghostBtnTxt: { color: theme.ghostText, fontWeight: "800" },
    
    overlay: { flex: 1, backgroundColor: theme.overlay, alignItems: "center", justifyContent: "center", padding: 16 },
    modalCard: {
      width: "100%", maxWidth: 520, backgroundColor: theme.modalCardBg, borderRadius: 12, padding: 16,
      shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10
    },
    modalTitle: { fontSize: 18, fontWeight: "800", color: theme.text },
    modalMetaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
    modalDate: { color: theme.date, fontSize: 12 },
    modalBody: { color: theme.text, fontSize: 15, lineHeight: 22, paddingVertical: 6 },
    modalRow: { flexDirection: "row", gap: 10, marginTop: 12 },
    modalPrimaryBtn: { backgroundColor: theme.primary, height: 44, borderRadius: 8, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
    modalPrimaryBtnTxt: { color: theme.primaryText, fontWeight: "800" },
    noItemsText: {
      textAlign: 'center',
      marginTop: 40,
      color: theme.subtext,
      fontSize: 16
    }
  }), [isDarkMode, theme, statusBarHeight]); 


  return (
    <SafeAreaView style={st.safeArea}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.headerBg}
      />
      {/* Header */}
      <View style={st.header}>
        <Link href="/(tabs)/home" asChild>
          <Pressable style={st.icon}><Text style={st.iconTxt}>←</Text></Pressable>
        </Link>
        <Text style={st.title}>Notificaciones</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* Acciones y Filtros */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>
        {/* Botón Marcar como Leído */}
        <Pressable onPress={marcarTodoComoLeido} style={st.primary}>
          <Text style={st.primaryTxt}>Marcar todo como leído</Text>
        </Pressable>
        
        {/* Botón de Filtro "Dropdown" */}
        <Pressable onPress={openFilterModal} style={st.filterTriggerBtn}>
          <Text style={st.filterTriggerBtnTxt}>▼</Text>
          <Text style={st.filterTriggerBtnTxt} numberOfLines={1}>{filterLabel}</Text>
        </Pressable>
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {displayedItems.map(n => (
          <View key={n.id} style={st.card}>
             <View style={st.rowBetween}>
              <Text style={st.cardT} numberOfLines={1}>{n.titulo}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={st.date} numberOfLines={1}>{n.fechaLarga}</Text>
                {!n.visto && <View style={st.dot} />}
              </View>
            </View>
            {"scope" in n && n.scope === "curso" && ( <Text style={st.badgeCtx}>Materia: {n.courseName}</Text> )}
            {"scope" in n && n.scope === "colegio" && ( <Text style={st.badgeCtxGhost}>Colegio</Text> )}
            <Text style={st.body} numberOfLines={3}>{n.cuerpo}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <Pressable onPress={() => toggleLeido(n.id)} style={[st.badge, n.visto ? st.badgeOk : st.badgeWarn]}>
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
        {displayedItems.length === 0 && (
          <Text style={st.noItemsText}>No hay notificaciones que coincidan con los filtros.</Text>
        )}
      </ScrollView>

      {/* ===== Modal Detalle (sin cambios) ===== */}
      <Modal visible={detailModalOpen} transparent animationType="fade" statusBarTranslucent>
        <Pressable style={st.overlay} onPress={closeDetail}>
          <Pressable style={st.modalCard} onPress={() => {}}> 
            {selected && (
              <>
                <Text style={st.modalTitle}>{selected.titulo}</Text>
                <View style={st.modalMetaRow}>
                  {"scope" in selected && selected.scope === "curso" ? ( <Text style={st.badgeCtx}>Materia: {selected.courseName}</Text> ) : ( <Text style={st.badgeCtxGhost}>Colegio</Text> )}
                  <Text style={st.modalDate}>{selected.fechaLarga}</Text>
                </View>
                <ScrollView style={{ maxHeight: 280, marginVertical: 8 }} contentContainerStyle={{ paddingVertical: 6 }}>
                  <Text style={st.modalBody}>{selected.cuerpo}</Text>
                </ScrollView>
                <View style={st.modalRow}>
                  <Pressable onPress={() => toggleLeido(selected.id)} style={[st.badge, selected.visto ? st.badgeOk : st.badgeWarn, { flex: 1, height: 44 }]}>
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
          </Pressable>
        </Pressable>
      </Modal>

      {/* ===== Modal de Filtros Actualizado ===== */}
      <Modal visible={filterModalVisible} transparent animationType="fade" statusBarTranslucent>
        <Pressable style={st.overlay} onPress={cancelAndCloseFilterModal}>
          <Pressable style={st.filterModalCard} onPress={() => {}}> 
            
            <ScrollView>
              {/* --- Sección Estado (3 opciones) --- */}
              <Text style={st.filterSectionTitle}>Estado</Text>
              <View style={st.filterRow}>
                <Pressable 
                  style={tempFilterStatus === 'all' ? st.filterOptionBtnActive : st.filterOptionBtn}
                  onPress={() => setTempFilterStatus('all')}
                >
                  <Text style={tempFilterStatus === 'all' ? st.filterOptionBtnActiveTxt : st.filterOptionBtnTxt}>Todos</Text>
                </Pressable>
                <Pressable 
                  style={tempFilterStatus === 'unread' ? st.filterOptionBtnActive : st.filterOptionBtn}
                  onPress={() => setTempFilterStatus('unread')}
                >
                  <Text style={tempFilterStatus === 'unread' ? st.filterOptionBtnActiveTxt : st.filterOptionBtnTxt}>No Leídos</Text>
                </Pressable>
                <Pressable 
                  style={tempFilterStatus === 'read' ? st.filterOptionBtnActive : st.filterOptionBtn}
                  onPress={() => setTempFilterStatus('read')}
                >
                  <Text style={tempFilterStatus === 'read' ? st.filterOptionBtnActiveTxt : st.filterOptionBtnTxt}>Leídos</Text>
                </Pressable>
              </View>

              {/* 3. Sección "Tipo" (nuevo nombre) y solo "Colegio" */}
              <Text style={st.filterSectionTitle}>Tipo</Text>
              <View style={st.filterRow}>
                {/* Se eliminó el botón "Todos (Fuente)" */}
                <Pressable 
                  style={tempSourceFilter.includes('colegio') ? st.filterOptionBtnActive : st.filterOptionBtn}
                  onPress={() => toggleTempSource('colegio')}
                >
                  <Text style={tempSourceFilter.includes('colegio') ? st.filterOptionBtnActiveTxt : st.filterOptionBtnTxt}>Colegio</Text>
                </Pressable>
              </View>
              
              {/* --- Sección Materias (multi-selección) --- */}
              <Text style={st.filterSectionTitle}>Materias</Text>
              <View style={st.filterRow}>
                {availableCourses.map(course => (
                  <Pressable 
                    key={course.key}
                    style={tempSourceFilter.includes(course.key) ? st.filterOptionBtnActive : st.filterOptionBtn}
                    onPress={() => toggleTempSource(course.key)}
                  >
                    <Text 
                      style={tempSourceFilter.includes(course.key) ? st.filterOptionBtnActiveTxt : st.filterOptionBtnTxt}
                      numberOfLines={1}
                    >
                      {course.nombre}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* 4. Pie de Modal con botón "Restablecer" */}
            <View style={st.modalFooter}>
              <Pressable onPress={cancelAndCloseFilterModal} style={[st.ghostBtn, { flex: 1, height: 44, backgroundColor: theme.cardBorder }]}>
                <Text style={[st.ghostBtnTxt, { color: theme.text }]}>Cerrar</Text>
              </Pressable>
              {/* --- Botón Restablecer --- */}
              <Pressable 
                onPress={resetTempFilters} 
                style={[st.ghostBtn, { flex: 1, height: 44, backgroundColor: theme.filterBtnBg }]}
              >
                <Text style={[st.ghostBtnTxt, { color: theme.filterBtnTxt }]}>Reiniciar</Text>
              </Pressable>
              {/* --- Fin Botón Restablecer --- */}
              <Pressable onPress={applyAndCloseFilterModal} style={[st.primary, { flex: 1.2 }]}>
                <Text style={st.primaryTxt}>Aplicar</Text>
              </Pressable>
            </View>

          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}