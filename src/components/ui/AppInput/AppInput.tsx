import React, { useState, useEffect,  useRef, forwardRef, useImperativeHandle  } from 'react';
import { View, TextInput, Animated, StyleSheet,StyleProp,TextStyle,KeyboardTypeOptions} from 'react-native';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

interface Props {
  value: React.ReactNode;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  label?: React.ReactNode;
  prefix?: string; 
  editable?:boolean;
  onPress?: () => void;
  inputStyle?: StyleProp<TextStyle>;
  autofocus?:boolean;
  keyboardType?:KeyboardTypeOptions
}

export const AppInput = forwardRef<TextInput, Props>(({
  value,
  onChangeText,
  secureTextEntry,
  label,
  prefix,
  editable,
  onPress,
  inputStyle,
  autofocus,
  keyboardType
}: Props,ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  const internalRef = useRef<TextInput>(null);
useImperativeHandle(ref,()=>({
  focus:()=>internalRef.current?.focus(),
}));

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  // Handle change to enforce prefix if provided
  const handleChange = (text: string) => {
    if (prefix) {
      // Ensure prefix is always at the start
      if (!text.startsWith(prefix)) {
        text = prefix;
      }
    }
    onChangeText(text);
  };

  const labelStyle = {
    position: 'absolute',
    left: responsiveScreenWidth(6),
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [responsiveFontSize(1.75), responsiveFontSize(1.85)],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#888', '#000000'],
    }),
    backgroundColor: '#fff',
    paddingLeft: responsiveScreenWidth(1.5),
    paddingRight: responsiveScreenWidth(1.75),
  };

  const borderColor = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#AEAEAE'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}

        <TextInput
           ref={internalRef} 
           
          editable={editable}
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={handleChange}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPressIn={onPress}
          placeholder=""
          placeholderTextColor="red"
        
          autoFocus={autofocus}
        keyboardType={keyboardType}
        
        />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveScreenHeight(1.5),
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: responsiveScreenWidth(30),
    paddingHorizontal: responsiveScreenWidth(6.5),
    paddingTop: responsiveScreenHeight(1.5),
    paddingBottom: responsiveScreenHeight(1),
  },
  input: {
    fontSize: responsiveFontSize(2),
    paddingVertical: responsiveScreenHeight(1.25),
    fontFamily:'Quicksand-Regular',
    color:'#535353',
    paddingLeft:responsiveScreenWidth(1)
  },
});
