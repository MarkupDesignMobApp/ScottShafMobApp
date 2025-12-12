import { Platform, StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  innercontainer: {
    justifyContent: 'center',

    paddingHorizontal: 16,
    paddingTop: responsiveScreenHeight(10),
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgcontainer: {
    height: responsiveScreenHeight(30.5),
    width: responsiveScreenWidth(100),
  },
  maincontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    letterSpacing: 0.25,
    fontFamily: 'Quicksand-VariableFont_wght',
    fontSize: responsiveFontSize(3),
    paddingBottom: responsiveHeight(1),
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
    color: '#000000',
  },
  heading2: {
    color: '#8A8A8A',
    fontFamily: 'Quicksand-VariableFont_wght',
    fontSize: responsiveFontSize(1.75),
    fontWeight: '200',
    letterSpacing: 0.5,
  },
  headcontainer: {
    alignItems: 'center',
  },
  bottomtxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginVertical: responsiveHeight(3),
    padding: 2,
  },
  bottomtxt2: {
    width: '33%',
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Ubuntu-Regular',
    fontSize: responsiveFontSize(2),
    fontWeight: 'thin',
  },
  linestyle: {
    borderWidth: 0.5,
    width: '33.33%',
    borderColor: '#A5A5A5',
  },
  bottomtxt3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginVertical: responsiveHeight(1),
    padding: 2,
  },
});
