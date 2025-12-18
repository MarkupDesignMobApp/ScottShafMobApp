import { Platform, StyleSheet,StatusBar } from 'react-native';
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

    paddingHorizontal:responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgcontainer: {
    height: responsiveScreenHeight(37),
    width: responsiveScreenWidth(100),
    marginTop: Platform.OS === 'android'
    ? -(StatusBar.currentHeight ?? 0)
    : -30,
  },
  maincontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    letterSpacing: 0.25,
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveFontSize(3),
    paddingBottom: responsiveHeight(1),
    // fontWeight: Platform.OS == 'android' ? 'bold' : '500',
    color: '#000000',
  },
  heading2: {
    color: '#00000',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(2),
    width: responsiveScreenWidth(80),
    textAlign: 'center',
    lineHeight: responsiveScreenHeight(2.75),
    paddingTop:responsiveScreenHeight(0.5)

  },
  headcontainer: {
    alignItems: 'center',
    // marginTop: responsiveScreenHeight(-2)
  },
  bottomtxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginVertical: responsiveHeight(3),
    padding: 2,
  },
  bottomtxt2: {
    width: '40%',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(2.15),
    fontWeight: '400'
  },
  linestyle: {
    borderWidth: 0.5,
    width: '30%',
    borderColor: '#A5A5A5',
  },
  bottomtxt3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginVertical: responsiveHeight(1),
    padding: 2,

  },
  prefix: {
    position: 'absolute', paddingTop: responsiveScreenHeight(0.5),
    right: responsiveScreenWidth(8),
    color: "#AEAEAE",
    width: responsiveScreenWidth(4),
    height: responsiveHeight(4)
  },

  resendtxt: {

    fontSize: responsiveFontSize(1.85),
    letterSpacing: 0.5,
    paddingHorizontal: responsiveScreenWidth(2)
  },
  icon: {
    width: responsiveScreenWidth(4),
    height: responsiveHeight(4),

  },
  resendcontainer: {
    flexDirection: 'row', justifyContent: 'center', alignItems: "center",
    paddingVertical: responsiveScreenHeight(1)
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    width: responsiveScreenWidth(13.25),
    height: responsiveScreenHeight(6.5),
    borderRadius: responsiveScreenWidth(2),
    textAlign: 'center',
    fontSize: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity:0.5,
    shadowRadius: 15,
  
  },
  otpcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: responsiveScreenWidth(2),

    backgroundColor: '#fff'
  },


});

