import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  StyleProp,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

interface Props {
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  label?: string;
  placeholder?: string;
  prefix?: string;
  editable?: boolean;
  onPress?: () => void;
  inputStyle?: StyleProp<TextStyle>;
  autofocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

export const AppInput = forwardRef<TextInput, Props>(
  (
    {
      value,
      onChangeText,
      secureTextEntry,
      label,
      placeholder,
      prefix,
      editable,
      onPress,
      inputStyle,
      autofocus,
      keyboardType,
    }: Props,
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPlaceholder, setShowPlaceholder] = useState(!value);

    const internalRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => ({
      focus: () => internalRef.current?.focus(),
    }));

    const handleFocus = () => {
      setIsFocused(true);
      setShowPlaceholder(false); // hide placeholder on focus
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (!value) setShowPlaceholder(true); // show placeholder if input is empty
    };

    const handleChange = (text: string) => {
      if (prefix && !text.startsWith(prefix)) {
        text = prefix;
      }
      onChangeText?.(text);
    };

    const labelStyle = {
      position: 'absolute',
      left: responsiveScreenWidth(6),
      top: -10,
      fontSize: responsiveFontSize(1.85),
      color: '#000',
      backgroundColor: '#fff',
      paddingLeft: responsiveScreenWidth(1.5),
      paddingRight: responsiveScreenWidth(1.75),
    };

    const borderColor = isFocused ? '#AEAEAE' : '#ccc';

    return (
      <View style={styles.container}>
        <View style={[styles.inputContainer, { borderColor }]}>
          {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}

          <TextInput
            ref={internalRef}
            editable={editable}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={handleChange}
            secureTextEntry={secureTextEntry}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPressIn={onPress}
            placeholder={showPlaceholder ? placeholder : ''}
            placeholderTextColor="#999"
            autoFocus={autofocus}
            keyboardType={keyboardType}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveScreenHeight(1.5),
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: responsiveScreenWidth(30),
    paddingHorizontal: responsiveScreenWidth(6.5),
    paddingVertical:responsiveScreenHeight(1.75),
    paddingBottom: responsiveScreenHeight(1),
  },
  input: {
    fontSize: responsiveFontSize(2),
    paddingVertical: responsiveScreenHeight(0.75),
    fontFamily: 'Quicksand-Regular',
    color: '#535353',
    paddingLeft: responsiveScreenWidth(1),
  },
});
