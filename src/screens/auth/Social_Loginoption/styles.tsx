import { StyleSheet } from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(4),

    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
  },
  imgcontainer: {
    height: responsiveScreenHeight(25),
    width: responsiveScreenWidth(25),
  },
  img: {
    width: '100%',
    height: '100%',
  },
  headtxt1: {
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(3.5),
    color: '#0180FE',
    paddingBottom: responsiveScreenHeight(2),
  },
  headtxt2: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(2),
    color: '#000000',
    paddingBottom: responsiveScreenHeight(2),
  },
  bottomtxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: responsiveScreenHeight(5),
    paddingBottom: responsiveScreenHeight(0.5),
  },
  bottomtxt2: {
    width: '10%',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(2.15),
    fontWeight: '400',
  },
  linestyle: {
    borderWidth: 0.5,
    width: '45%',
    borderColor: '#A5A5A5',
  },
  mostbottomtxt: {
    fontFamily: 'Quicksand-Regular',
    color: '#8A8A8A',
    fontSize: responsiveScreenFontSize(2),
    paddingBottom: responsiveScreenHeight(1),
  },
  hyperlinktxtcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hypertxt: {
    fontFamily: 'Ubuntu-Regular',
    color: '#0180FE',
    textDecorationLine: 'underline',
    fontSize: responsiveScreenFontSize(2),
  },
  btn: {
    width: '100%',
    backgroundColor: '#ECFBFF',
    borderColor: '#00C4FA',
    marginTop: responsiveScreenHeight(2),
    paddingVertical: responsiveScreenHeight(0.5),
  },
});
