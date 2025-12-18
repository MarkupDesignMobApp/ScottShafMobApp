import { StyleSheet } from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 0.5,
    // paddingHorizontal: responsiveScreenWidth(4),
    marginHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    borderColor: '#707070',
  },
  imgcontainer: {
    width: responsiveScreenWidth(14),
    height: responsiveScreenHeight(10),
  },
  img: {
    width: '100%',
    height: '100%',
  },
  nametxt: {
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(2),
  },
  nameheadtxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.75),
    paddingVertical: responsiveScreenHeight(0.5),
  },
  datetxt: {
    fontSize: responsiveScreenFontSize(1.5),
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: responsiveScreenHeight(2),
    right: responsiveScreenWidth(0),
  },
  edittxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.75),
    color: '#0180FE',
  },
  imgcontainer2: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenHeight(4),
    marginLeft: responsiveScreenWidth(1),
  },
  listcontainer: {
    // paddingHorizontal: responsiveScreenWidth(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  imgcontainer3: {
    width: responsiveScreenWidth(4),
    height: responsiveScreenHeight(4),
  },
  title: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.7),
    paddingLeft: responsiveScreenWidth(3),
  },
  listmaincontainer: {
    borderBottomWidth: 1,
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(12),
    marginHorizontal: responsiveScreenWidth(4),
    // paddingHorizontal: responsiveScreenWidth(4),
    borderColor: '#707070',
  },
  circleview: {
    height: responsiveScreenWidth(2),
    width: responsiveScreenWidth(2),
    borderRadius: responsiveScreenWidth(1),
    backgroundColor: '#00C4FA',
    marginHorizontal: responsiveScreenWidth(4),
  },
  termcontainer: {
    alignItems: 'center',
    flexDirection: 'row',

    alignSelf: 'center',
    paddingTop: responsiveScreenHeight(3),
    paddingBottom: responsiveScreenHeight(1),
  },
  term: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.75),
    color: '#000000',
  },
  profile: {
    alignSelf: 'center',
    height: responsiveScreenWidth(25),
    width: responsiveScreenWidth(25),
    borderRadius: responsiveScreenWidth(12.5),
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(5),
  },
  camcontainer: {
    borderWidth: 1,
    height: responsiveScreenWidth(8),
    width: responsiveScreenWidth(8),
    borderRadius: responsiveScreenWidth(4),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6FBFF',
    right: 10,
    bottom: -12,
    borderColor: "#0180FE"
  },
  cammaincontainer: {
    width: responsiveScreenHeight(1.5),
    height: responsiveScreenHeight(1.5)
  },
});
