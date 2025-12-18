import { Platform, StyleSheet, StatusBar } from 'react-native';
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
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(4),
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
    color: '#8A8A8A',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(2),
  },
  headcontainer: {
    alignItems: 'center',
    // marginTop: responsiveScreenHeight(-2),
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
  bottomtxt4: {
    alignSelf: 'center',

    marginVertical: responsiveHeight(3),
    padding: 2,
    fontFamily: 'Quicksand-Regular',
    color: '#000000',
    fontSize: responsiveFontSize(1.85),
    position: 'absolute',
    bottom: responsiveScreenHeight(-8),
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
    position: 'absolute',
    left: responsiveScreenWidth(4),
    height: responsiveHeight(4),          // ✅ match input height
    minWidth: responsiveScreenWidth(14),
    alignItems: 'center',
    justifyContent: 'center',  
    borderRightWidth:1  , 
    borderRightColor:'lightgrey'         // ✅ vertical center

  },
  prefix2style: {
    marginLeft: responsiveScreenWidth(16), // ✅ matches prefix width
    
  },
  codetxt: {
    fontFamily: "Quicksand-Regular",

    // fontSize:15
  }
});
