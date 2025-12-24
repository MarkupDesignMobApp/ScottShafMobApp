import { Platform, StyleSheet } from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 0.25,
    // paddingHorizontal: responsiveScreenWidth(4),
    marginHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    borderColor: '#707070',
    paddingBottom: responsiveScreenHeight(1),
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
    paddingTop: responsiveScreenHeight(2),
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
    borderBottomWidth: 0.25,
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
    borderColor: '#0180FE',
  },
  cammaincontainer: {
    width: responsiveScreenHeight(1.75),
    height: responsiveScreenHeight(1.75),
  },
  bottomcontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    position: 'absolute',
    width: '100%',
    bottom:
      Platform.OS == 'ios'
        ? responsiveScreenHeight(2)
        : responsiveScreenHeight(6),
  },
});

export const styles2 = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  fieldWrapper: {
    marginTop: responsiveScreenHeight(2),
    zIndex: 10,
  },
  profile: {
    alignSelf: 'center',
    height: responsiveScreenWidth(20),
    width: responsiveScreenWidth(20),
    borderRadius: responsiveScreenWidth(10),
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(4),
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
    right: 0,
    bottom: -14,
    borderColor: '#0180FE',
  },
  cammaincontainer: {
    width: responsiveScreenHeight(1.5),
    height: responsiveScreenHeight(1.5),
  },
  floatingLabel: {
    position: 'absolute',
    top: -9,
    left: 18,
    backgroundColor: '#FFFFFF', // must be solid
    paddingHorizontal: 6,
    fontSize: 12,
    color: '#8A8A8A',
    zIndex: 20, // ⭐ label ABOVE everything
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveScreenWidth(10),
  },

  input: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: '#E4E6EB',
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },

  prefix: {
    position: 'absolute',
    paddingTop: responsiveScreenHeight(0.5),
    right: responsiveScreenWidth(8),
    color: '#AEAEAE',
    width: responsiveScreenWidth(4),
    height: responsiveScreenHeight(4),
  },

  labeltxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(2),
    paddingBottom: responsiveScreenHeight(2),
  },

  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },

  descriptionLabel: {
    paddingHorizontal: 18,
    marginBottom: 6,
    backgroundColor: '#FFFFFF', // must be solid
    fontSize: 12,
    color: '#8A8A8A',
  },
  paragraph: {
    borderWidth: 1,
    height: responsiveScreenHeight(20),
    borderRadius: responsiveScreenWidth(4),
    borderColor: 'lightgrey',
    padding: responsiveScreenWidth(3), // 👈 important
  },
  multilineInput: {
    flex: 1,
    textAlignVertical: 'top', // 👈 top-left start
    fontSize: responsiveScreenFontSize(2),
    color: '#1A1A1A',
  },

  wordcapacity: {
    position: 'absolute',
    right: 0,
    marginVertical: responsiveScreenHeight(3),
    marginHorizontal: responsiveScreenWidth(2),
    bottom: -responsiveScreenHeight(2.5),
  },
  bottomFixed: {
    position: 'absolute',
    bottom:
      Platform.OS === 'ios'
        ? responsiveScreenHeight(2)
        : responsiveScreenHeight(1.5),
    left: 0,
    right: 0,
    paddingHorizontal: responsiveScreenWidth(4),
    backgroundColor: '#fff',
  },
  cammaincontainer2: {
    height: responsiveScreenWidth(22),
    width: responsiveScreenWidth(22),
    borderRadius: responsiveScreenWidth(11),

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6FBFF',
  },
});
