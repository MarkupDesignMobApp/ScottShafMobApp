import { StyleSheet } from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innercontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(0),
    flex: 1,
    backgroundColor: '#fff',
  },
  headtxt: {
    textAlign: 'center',
    fontFamily: 'samsungsharpsans-medium',
    color: '#1E1E1E',
    fontSize: responsiveScreenFontSize(1.85),
  },
  privacytxt: {
    textAlign: 'center',
    color: '#00C4FA',
    fontFamily: 'Quicksand-Regular',
    textDecorationLine: 'underline',
    fontSize: responsiveScreenFontSize(2),
    marginTop: responsiveScreenHeight(1.5),
    alignSelf: 'center',
    paddingBottom: responsiveScreenHeight(4),
  },
  targetcontainer: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderColor: '#0180FE',
    borderRadius: responsiveScreenWidth(4),
    marginTop: responsiveScreenHeight(3),
    backgroundColor: '#EFFCFF',
  },
  switchcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchtxt: {
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(1.9),
    letterSpacing: 0.5,
  },
  privacytxt2: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.68),
    paddingTop: responsiveScreenHeight(2),
    color: '#000000',
  },
  listcontainer: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1),
    borderRadius: responsiveScreenWidth(2),
    borderColor: '#0180FE',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(2),
    backgroundColor:'#ECF6FF'
  },
  icon: {
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(5),
  },
  headcontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    
  },
  listheadtxt: {
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(1.9),
    color: '#000000',
    fontWeight:"medium"
  },
  listsubheadtxt: {
    paddingTop: responsiveScreenHeight(0.75),
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.75),
  },
  listmaincontainer: {
    paddingTop: responsiveScreenHeight(2),
  },
  list2container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: responsiveScreenHeight(0.75),
  },
  listitem: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.75),
  },
  listitem2: {
    fontFamily: 'Quicksand-Medium',
    color: '#FF04D7',
    fontSize: responsiveScreenFontSize(1.75),
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    backgroundColor: '#fff',
    paddingVertical: responsiveScreenHeight(4),
  },
  btncontainer: {
    paddingTop: responsiveScreenHeight(3),
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    // paddingBottom: responsiveScreenHeight(3),

    // borderTopColor: '#EAEAEA',
  },
});
