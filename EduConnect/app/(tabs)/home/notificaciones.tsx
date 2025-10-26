import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, useColorScheme } from 'react-native';

interface Notificacion {
  id: string;
  mensaje: string;
  leido: boolean;
}

export default function NotificacionesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([
    { id: '1', mensaje: 'Tu cuenta fue creada exitosamente.', leido: false },
    { id: '2', mensaje: 'Nueva tarea disponible en Matemáticas.', leido: false },
    { id: '3', mensaje: 'Tu contraseña fue actualizada.', leido: true },
  ]);

  const marcarTodoComoLeido = () => {
    const actualizadas = notificaciones.map((n) => ({ ...n, leido: true }));
    setNotificaciones(actualizadas);
  };

  const renderItem = ({ item }: { item: Notificacion }) => (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: item.leido ? '#e0e0e0' : '#f2f2f2' },
      ]}
    >
      <ThemedText style={styles.mensaje}>{item.mensaje}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Notificaciones
      </ThemedText>

      <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <Pressable style={styles.button} onPress={marcarTodoComoLeido}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Marcar todo como leído
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  mensaje: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1883E3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});