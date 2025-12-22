import { Platform, StyleSheet, StatusBar } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveFontSize,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  innercontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(4),

    height: '100%'
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
  banner: {
    flex: 1,
    // position: 'relative',
    width: '100%'
  },
  blur: {
    ...StyleSheet.absoluteFill,
  },


  heading: {
    letterSpacing: 0.25,
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveFontSize(2.5),
    paddingBottom: responsiveHeight(1),
    // fontWeight: Platform.OS == 'android' ? 'bold' : '500',
    color: '#000000',
  },
  heading2: {
    color: '#8A8A8A',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(1.85),
  },
  headcontainer: {
    position: 'absolute',
    bottom: responsiveScreenHeight(0),
    alignSelf: 'center',
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
    width: '40%',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveFontSize(2),
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
    fontSize: responsiveFontSize(1.75),
    marginTop: responsiveScreenHeight(4),
  },
  prefix: {
    position: 'absolute',
    paddingTop: responsiveScreenHeight(0.5),
    right: responsiveScreenWidth(8),
    color: '#AEAEAE',
    width: responsiveScreenWidth(3),
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
    top: responsiveScreenHeight(4.15)


  },
  prefix2style: {
    marginLeft: responsiveScreenWidth(14), // ✅ matches prefix width
    // borderWidth:1,
    // marginVertical:responsiveHeight(-2)
  },
  codetxt: {
    fontFamily: "Quicksand-Regular",
    fontSize: responsiveScreenFontSize(1.75),
    color: '#111111',


    // fontSize:15
  },
  inputcontainer: {
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(4),
    // borderWidth:1
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  }
  

});
