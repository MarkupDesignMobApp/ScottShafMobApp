import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  ImageSourcePropType,
  View,
} from 'react-native';
import { styles } from './styles';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  image?: ImageSourcePropType; // optional image
}

export const AppButton = ({ title, onPress, disabled, image }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {image && (
          <Image
            resizeMode="contain"
            tintColor={'#fff'}
            source={image}
            style={styles.image}
          />
        )}
        <Text style={styles.label}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
