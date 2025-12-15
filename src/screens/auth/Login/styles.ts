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
    paddingTop: responsiveScreenHeight(9),
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
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveFontSize(3),
    paddingBottom: responsiveHeight(1),
    // fontWeight: Platform.OS == 'android' ? 'bold' : '500',
    color: '#000000',
  },
  heading2: {
    color: '#8A8A8A',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(2),
  },
  headcontainer: {
    alignItems: 'center',
    marginTop: responsiveScreenHeight(-2),
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
    fontWeight: '400',
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
    position: 'absolute',
    paddingTop: responsiveScreenHeight(0.5),
    right: responsiveScreenWidth(8),
    color: '#AEAEAE',
    width: responsiveScreenWidth(4),
    height: responsiveHeight(4),
  },
  labeltxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(2),
  },
  prefix2: {
    height: responsiveHeight(4),
    width: responsiveScreenWidth(10),

    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: responsiveScreenWidth(5),

    fontSize: responsiveFontSize(12),
    paddingVertical: responsiveScreenHeight(1.25),
    fontFamily: 'Quicksand-Regular',
    color: '#535353',
    paddingLeft: responsiveScreenWidth(1),
  },
  prefix2style: {
    marginLeft: responsiveScreenWidth(10),
  },
  codetxt:{
    fontFamily:"Quicksand-Regular",
    // fontSize:15
  }
});
