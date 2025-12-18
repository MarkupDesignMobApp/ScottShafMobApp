import { StyleSheet } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0180FE',
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveScreenWidth(6),
    borderRadius: responsiveScreenWidth(30),
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenWidth(5),
    marginRight: responsiveScreenWidth(2),
    resizeMode: 'contain',
  },
  label: {
    color: '#fff',
    fontSize: responsiveFontSize(1.85),
    fontFamily: 'Ubuntu-Regular', // fixed typo
    
  },
});
