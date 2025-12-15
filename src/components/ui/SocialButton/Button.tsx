import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Pressable
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import React from 'react';

export default function Button({
  title,
  source,
}: {
  title: string;
  source: ImageSourcePropType;
}) {
  return (
    <Pressable  style={styles.button}>
      <View style={styles.imgcontainer}>
        <Image
          resizeMode="contain"
          style={styles.img}
          source={source}
        />
      </View>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 0.5,
    borderColor: '#B9B9B9',
    
    paddingVertical: responsiveScreenHeight(0.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveScreenWidth(2),
    width:responsiveScreenWidth(44),
  
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgcontainer: {
    width: responsiveScreenWidth(7),
    height: responsiveHeight(5),
  },
  text: {
    marginLeft: responsiveScreenWidth(2.25),
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(1.9),
    
    letterSpacing:0.25
  },
});
