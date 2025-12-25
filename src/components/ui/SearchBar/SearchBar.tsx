import React from 'react';
import {
  View,
  TextInput,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { styles } from './styles';
interface SearchBarProps {
  placeholder?: string;
  placeholderTextColor?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;

  // Left icon (fixed)
  leftIconSource?: ImageSourcePropType;
  leftIconTintColor?: string;

  // Right icon (optional)
  rightIconSource?: ImageSourcePropType;
  rightIconTintColor?: string;
  onRightIconPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '',
  placeholderTextColor = '#fff',
  value,
  onChangeText,
  style,
  inputStyle,

  // LEFT (fixed)
  leftIconSource = require('../../../../assets/image/mysearch.png'),
  leftIconTintColor = '#fff',

  // RIGHT (optional)
  rightIconSource,
  rightIconTintColor = '#fff',
  onRightIconPress,
}) => {
  return (
    <View style={[styles.searchbar, style]}>
      {/* 🔍 LEFT ICON (FIXED) */}
      <View style={styles.imgcontainer}>
        <Image
          source={leftIconSource}
          tintColor={leftIconTintColor}
          style={styles.img}
          resizeMode="contain"
        />
      </View>

      {/* INPUT */}
      <TextInput
        style={[styles.inputstyle, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
      />

      {/* 👉 RIGHT ICON (OPTIONAL) */}
      {rightIconSource && (
        <Pressable
          onPress={onRightIconPress}
          style={{...styles.imgcontainer,right:responsiveScreenWidth(10)}}
          hitSlop={10}
        >
          <Image
            source={rightIconSource}
            tintColor={rightIconTintColor}
            style={styles.img}
            resizeMode="contain"
          />
        </Pressable>
      )}
    </View>
  );
};

export default SearchBar;
