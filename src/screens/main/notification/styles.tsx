import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  listcontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.25,
    paddingBottom: responsiveScreenHeight(2),
    marginHorizontal: responsiveScreenWidth(4),
    borderBottomColor: '#707070',
  },
  imgcontainer: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(10),
  },
  img: {
    width: '100%',
    height: '100%',
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
  subtitletxt: {
    fontSize: responsiveScreenFontSize(1.75),
    width: responsiveScreenWidth(75),
    fontFamily: 'Quicksand-Regular',
  },
  btncontainer: {
    paddingTop: responsiveScreenHeight(1),
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',
  },
  btn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: responsiveScreenHeight(1.25),
    borderRadius: responsiveScreenWidth(20),
    width: '32%',
  },
  activeBtn: {
    backgroundColor: '#0180FE', // green for selected
    borderColor: '#0180FE',
  },

  declineActiveBtn: {
    backgroundColor: '#E53935', // red for decline
    borderColor: '#E53935',
  },

  btnText: {
    fontFamily: 'Quicksand-Medium',
    fontSize: responsiveScreenFontSize(1.7),
    color: '#1D1D1D',
  },

  activeBtnText: {
    color: '#FFFFFF',
  },
});
