import { Platform, StatusBar, StyleSheet, } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveFontSize,
responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  innercontainer: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    justifyContent: 'space-between',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgcontainer: {
    width: '100%',
    height: responsiveScreenHeight(38),
    overflow: 'hidden',
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
    alignSelf: 'center',
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(10),
    padding: responsiveHeight(0.5),
    fontFamily: 'Quicksand-Regular',
    color: '#000000',
    fontSize: responsiveFontSize(1.75),
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

  },
  prefix2: {
    position: 'absolute',
    left: responsiveScreenWidth(8),
    // height: responsiveHeight(4),          // ✅ match input height
    minWidth: responsiveScreenWidth(10),
    // alignItems: 'center',
    // justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'lightgrey',       // ✅ vertical center
    top:responsiveScreenHeight(4.15)


  },
  
  
  prefix2style: {
    marginLeft: responsiveScreenWidth(14), // ✅ matches prefix width
     color:'#111111'
  },
  
  codetxt: {
    fontFamily: "Quicksand-Regular",
    fontSize:responsiveScreenFontSize(1.75),
    color:'#111111',


  
  },
  countryArrow: {
    position: 'absolute',
    right: responsiveScreenWidth(4),
    top: responsiveScreenHeight(4), // aligns with input center
    width: responsiveScreenWidth(4),
    height: responsiveHeight(2),
    tintColor: '#AEAEAE', // optional
    
  },
  
  
  
  inputcontainer: {
    paddingBottom: responsiveScreenHeight(2),
  },

  banner: {
    flex: 1,
    // position: 'relative',
    width: '100%'
  },
  blur: {
    ...StyleSheet.absoluteFill,
  },
});
