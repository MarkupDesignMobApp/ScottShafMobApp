import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  targetcontainer: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderColor: '#0180FE',
    borderRadius: responsiveScreenWidth(4),
    marginTop: responsiveScreenHeight(3),
    backgroundColor: '#EFFCFF',
  },
  switchtxt: {
    fontFamily: 'Quicksand-medium',
    fontSize: responsiveScreenFontSize(1.9),
    letterSpacing: 0.5,
  },
  maincontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innercontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    flex: 1,
  },
  checkboxcontainer: {
    paddingTop: responsiveScreenHeight(2),
  },
  btncontainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: responsiveScreenHeight(10),
  },
});
