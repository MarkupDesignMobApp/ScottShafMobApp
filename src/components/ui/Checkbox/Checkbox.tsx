import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles'

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      disabled={disabled}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && <View style={styles.innerTick} />}
      </View>

      {label && (
        <Text style={[styles.label, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default Checkbox;
