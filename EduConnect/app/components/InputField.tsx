import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
}

export default function InputField({
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: '100%',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: {
    color: '#FF4D4D',
    fontSize: 14,
    marginTop: 4,
  },
});