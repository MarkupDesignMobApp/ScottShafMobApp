import React from 'react';
import {
  View,
  TextInput,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { styles } from './styles';

interface SearchBarProps {
  placeholder?: string;
  placeholderTextColor?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconSource?: ImageSourcePropType;
  iconTintColor?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '',
  placeholderTextColor = '#fff',
  value,
  onChangeText,
  style,
  inputStyle,
  iconSource = require('../../../../assets/image/mysearch.png'),
  iconTintColor = '#fff',
}) => {
  return (
    <View style={[styles.searchbar, style]}>
      <View style={styles.imgcontainer}>
        <Image
          tintColor={iconTintColor}
          style={styles.img}
          resizeMode="contain"
          source={iconSource}
        />
      </View>
      <TextInput
        style={[styles.inputstyle, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;
