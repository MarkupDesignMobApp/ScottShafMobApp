import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const AppButton = ({ title, onPress, disabled }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
};
