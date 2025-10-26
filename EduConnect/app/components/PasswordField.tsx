import { ThemedText } from '@/components/themed-text';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
}

export default function PasswordField({
  value,
  onChangeText,
  placeholder,
  error,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor="#888"
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
        />
        <Pressable onPress={() => setVisible(!visible)}>
          <ThemedText style={styles.eye}>{visible ? '🙈' : '👁'}</ThemedText>
        </Pressable>
      </View>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  eye: {
    fontSize: 22,
    marginLeft: 10,
  },
  error: {
    color: '#FF4D4D',
    fontSize: 14,
    marginTop: 4,
  },
});