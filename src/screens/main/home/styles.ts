import { StyleSheet } from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  header: {
    // borderWidth:1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#00C4FA',
    paddingHorizontal: responsiveScreenWidth(4),
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgcontainer: {
    width: responsiveScreenWidth(8),
    height: responsiveScreenHeight(3),
  },
    imgcontainerlogo: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(8),
  },
  innercontainer: {
    flex: 1,
  },
  contentcontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    backgroundColor: '#00C4FA',
    paddingVertical: responsiveScreenHeight(2),
  },
  scrollcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: responsiveScreenHeight(2),
  },

  scrollbox: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1.25),
    borderRadius: responsiveScreenWidth(20),
    borderColor: '#fff',
    marginRight: responsiveScreenWidth(2.5),
    backgroundColor: 'transparent',
  },

  activeScrollBox: {
    backgroundColor: '#0180FE',
    borderColor: '#0180FE',
  },

  boxtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.85),
  },

  activeBoxTitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
  },
  checkcontainer: {
    backgroundColor: '#0180FE',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenWidth(4),
    borderRadius: responsiveScreenWidth(4),
  },
  checkmaincontainer: {
    flex: 1,
    backgroundColor: '#fff',

    paddingHorizontal: responsiveScreenWidth(4),
    // paddingTop: responsiveScreenHeight(4),
  },
  btncontainer: {
    width: '100%',
    borderRadius: responsiveScreenWidth(12),
    backgroundColor: '#00C4FA',
    paddingVertical: responsiveScreenHeight(0.25),
    marginTop: responsiveScreenHeight(2),
  },
  btntxt: {
    fontFamily: 'Ubuntu-Regular',
    color: '#fff',
    fontSize: responsiveScreenFontSize(2),
  },
  btnheadertxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.85),
    color: '#fff',
    paddingTop: responsiveScreenHeight(1),
  },

  card: {
    borderWidth: 1,
    height: responsiveScreenHeight(40),
    width: responsiveScreenWidth(75),
    margin: responsiveScreenWidth(1),
    borderRadius: responsiveScreenWidth(4),
    borderColor: '#CFCFCF',
  },
  content: {
    flexDirection: 'row',
  },
  innerscrollcontainer: {
    paddingTop: responsiveScreenHeight(3),
  },
  cardimgcontainer: {
    borderRadius: responsiveScreenWidth(4),
    height: '60%',
  },
  img2: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: responsiveScreenWidth(4),
    borderTopRightRadius: responsiveScreenWidth(4),
  },
  cardlike: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '5%',
  },
  imgcontainer3: {
    height: responsiveScreenHeight(4),
    width: responsiveScreenWidth(6),
  },
  imgcontainer4: {
    height: responsiveScreenHeight(8),
    width: responsiveScreenWidth(12),
  },
  likecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: responsiveScreenWidth(4),
  },
  liketxt: {
    paddingLeft: responsiveScreenWidth(1.5),
    fontFamily: 'Ubuntu-Regular',
    fontSize: responsiveScreenFontSize(2),
  },
  cardtitlecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(2),
  },
  cardmaintitletxt: {
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(2),
  },
  cardsubtitletxt: {
    fontFamily: 'Quicksand-Light',
    color: '#1D1D1D',
    paddingTop: '2%',
    fontSize: responsiveScreenFontSize(1.85),
  },
  cardheading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: responsiveScreenHeight(4),
    paddingBottom:responsiveScreenHeight(2)
  },
  cardheadingtxt: {
    fontFamily: 'Quicksand-Regular',
    fontWeight: 'medium',
    color: '#000',
    fontSize:responsiveScreenFontSize(2.25),
    letterSpacing:0.1
  },
});
