import { StyleSheet } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3478f6',
    padding: responsiveHeight(2.5),
    borderRadius: responsiveScreenWidth(30),
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#fff',
    fontSize: responsiveFontSize(1.85),

    fontFamily: 'Ubuntu-Reguular',
  },
  container: {
    color: 'green',
  },
});
