import { StyleSheet } from 'react-native';
import {
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
    paddingTop: responsiveScreenHeight(4),
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
    position: 'absolute',
    alignSelf: 'center',
    bottom: responsiveScreenHeight(5),
  },
  targetcontainer: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderColor: '#00C4FA',
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
    fontSize: responsiveScreenFontSize(1.65),
    paddingTop: responsiveScreenHeight(1),
    color: '#000000',
  },
  listcontainer:{
    borderWidth:1,
    paddingHorizontal:responsiveScreenWidth(4),
    paddingVertical:responsiveScreenHeight(1),
    borderRadius:responsiveScreenWidth(2),
    borderColor:'#0180FE',
    flexDirection:"row",
    alignItems:"center",
    marginBottom:responsiveScreenHeight(2)
  },
  icon:{
    height:responsiveScreenHeight(5),
    width:responsiveScreenWidth(5)
  },
  headcontainer:{
   paddingHorizontal:responsiveScreenWidth(4)
  },
  listheadtxt:{
    fontFamily:"Quicksand-Medium",
    fontSize:responsiveScreenFontSize(1.9),
    color:"#000000"
  },
  listsubheadtxt:{
    paddingTop:responsiveScreenHeight(0.75),
    fontFamily:'Quicksand-Regular',
    fontSize:responsiveScreenFontSize(1.75)
  },
  listmaincontainer:{
    paddingTop:responsiveScreenHeight(2)
  }
});
