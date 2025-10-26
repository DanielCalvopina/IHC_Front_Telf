import HeaderLogo from '@/components/HeaderLogo';
import InputField from '@/components/InputField';
import PasswordField from '@/components/PasswordField';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';

// ✅ Tipado para errores de formulario
interface FormErrors {
  cedula?: string;
  telefono?: string;
  correo?: string;
  password?: string;
  confirmPassword?: string;
}

export default function CrearCuentaScreen() {
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!/^\d{10}$/.test(cedula)) {
      newErrors.cedula = 'La cédula debe tener 10 dígitos';
    }

    if (!/^\d{9,}$/.test(telefono)) {
      newErrors.telefono = 'Teléfono inválido';
    }

    if (!correo.includes('@') || !/\.\w{2,4}$/.test(correo)) {
      newErrors.correo = 'Correo inválido';
    }

    if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'No coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = () => {
    if (validate()) {
      alert(`Cuenta creada para: ${cedula}`);
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <HeaderLogo />
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Crear Cuenta
          </ThemedText>

          <InputField
            value={cedula}
            onChangeText={setCedula}
            placeholder="Cédula"
            error={errors.cedula}
            keyboardType="numeric"
          />

          <InputField
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Número de teléfono"
            error={errors.telefono}
            keyboardType="phone-pad"
          />

          <InputField
            value={correo}
            onChangeText={setCorreo}
            placeholder="Correo electrónico"
            error={errors.correo}
            keyboardType="email-address"
          />

          <PasswordField
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            error={errors.password}
          />

          <PasswordField
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Verificar contraseña"
            error={errors.confirmPassword}
          />

          <Pressable style={styles.button} onPress={handleCreateAccount}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Crear cuenta
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
  },
  scroll: {
    paddingBottom: 40,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#1883E3',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
  },
});