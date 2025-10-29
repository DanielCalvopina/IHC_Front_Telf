import { Slot, useFocusEffect, useRouter, useSegments } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments(); // Ejemplo: ['(tabs)', 'home'] o ['pages', 'estudiantes']

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Verifica si estás en la pantalla principal
        const isInHome = segments.length >= 2 && segments[0] === '(tabs)' && segments[1] === 'home';

        if (!isInHome) {
          // Si no estás en Home, vuelve directamente a ella
          router.replace('/(tabs)/home');
          return true; // Evita el comportamiento normal del botón
        }

        // Si estás en Home, deja que el sistema maneje el back (salir/minimizar)
        return false;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();
    }, [segments, router])
  );

  return <Slot />;
}
