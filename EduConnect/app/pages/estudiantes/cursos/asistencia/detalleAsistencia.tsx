// app/(tabs)/pages/estudiantes/cursos/asistencia/detalleAsistencia.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
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

  if (!y || !c) return <View style={st.center}><Text>Sin datos</Text></View>;

  const registros = (c.asistencia ?? []) as AItem[];
  const reg = id ? registros.find(r => r.id === id) : undefined;

  return (
    <View style={{ flex:1, backgroundColor:"#F6F7F8" }}>
      {/* Header con botón de retroceso grande */}
      <View style={st.header}>
        <Link
          href={{ pathname:"/pages/estudiantes/cursos/detailCurso", params:{ year, courseKey }}}
          asChild
        >
          <Pressable style={st.backBtn} hitSlop={10}>
            <Text style={st.backIcon}>←</Text>
          </Pressable>
        </Link>
        <Text style={st.title}>{id ? "Detalle de Inasistencia" : "Asistencia"}</Text>
        <View style={{ width:20 }}/>
      </View>

      {!id ? (
        <ScrollView contentContainerStyle={{ padding:16, gap:8 }}>
          {registros.map(r=>(
            <View key={r.id} style={st.row}>
              <View style={{ flex:1 }}>
                <Text style={st.rowT}>
                  {r.fechaLarga ?? new Date(r.fechaISO).toLocaleDateString("es-EC",{day:"2-digit",month:"long",year:"numeric"})}
                </Text>

                {/ausenc|tarde/i.test(r.estado) && (
                  <Link
                    href={{ pathname:"/pages/estudiantes/cursos/asistencia/detalleAsistencia", params:{ year, courseKey, id:r.id } }}
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
        <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
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
    </View>
  );
}

const st = StyleSheet.create({
  header:{
    height:56,flexDirection:"row",alignItems:"center",
    justifyContent:"space-between",paddingHorizontal:12,
    backgroundColor:"#fff",borderBottomWidth:1,borderBottomColor:"#E5E7EB"
  },

  // Botón de retroceso grande
  backBtn:{ width:56, height:56, alignItems:"center", justifyContent:"center", marginLeft:-8 },
  backIcon:{ fontSize:22, color:"#0F172A", fontWeight:"600" },

  title:{fontSize:18,fontWeight:"800",color:"#0F172A"},

  row:{
    backgroundColor:"#fff",borderRadius:12,borderWidth:1,borderColor:"#E2E8F0",
    padding:14,flexDirection:"row",alignItems:"center",justifyContent:"space-between"
  },
  rowT:{fontWeight:"700",color:"#0F172A"},
  link:{color:"#005A9C",fontWeight:"800",marginTop:4},

  badge:{paddingHorizontal:12,paddingVertical:6,borderRadius:999,fontWeight:"800"},
  badgeOk:{backgroundColor:"#DCFCE7",color:"#16A34A"},
  badgeWarn:{backgroundColor:"#FEF3C7",color:"#D97706"},

  top:{backgroundColor:"#fff",borderRadius:16,borderWidth:1,borderColor:"#E2E8F0",padding:16},
  topT:{fontWeight:"800",color:"#0F172A",fontSize:16},
  muted:{color:"#64748B"},
  blockT:{marginTop:10,fontWeight:"800",color:"#0F172A"},
  blockV:{color:"#0F172A"},

  center:{flex:1,alignItems:"center",justifyContent:"center"},
});
