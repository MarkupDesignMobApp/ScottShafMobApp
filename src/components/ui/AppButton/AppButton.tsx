import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  ImageSourcePropType,
  View,
  ViewStyle,
} from 'react-native';
import { styles } from './styles';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  image?: ImageSourcePropType;
  style?: ViewStyle;
  Textcolor?: string;
}

export const AppButton = ({ title, onPress, disabled, image, style, Textcolor }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
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
        <Text style={[styles.label, {color: Textcolor}]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
