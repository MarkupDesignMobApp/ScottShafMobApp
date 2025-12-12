import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './styles';

interface Props {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  label?: string;
}

export const AppInput = ({
  value,
  placeholder,
  onChangeText,
  secureTextEntry,
  label,
}: Props) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      />
    </View>
  );
};
