import { StyleSheet } from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  headtxt: {
    fontFamily: 'samsungsharpsans-medium',
    color: '#1E1E1E',
    fontSize: responsiveScreenFontSize(1.85),
    lineHeight: 25,
  },
  innercontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(4),
    backgroundColor: '#fff',
    flex: 1,
  },
  btncontainer: {
    // position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    paddingTop: responsiveScreenHeight(2),
    // bottom: responsiveScreenHeight(8),
  },
  container: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%', // 🔑 critical for 2 columns
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  card2: {
    height: responsiveScreenHeight(15),
    width: '48%',
    marginRight: '4%',
    borderRadius: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1.5,
    borderColor: '#707070',
    backgroundColor: '#FFFFFF',
    padding: responsiveScreenHeight(2),
    paddingTop: responsiveScreenHeight(0),
  },
  listmaincontainer: {
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(15), // 👈 space for button
  },

  img: {
    width: '100%',
    height: '100%',
  },
  imgcontainer: {
    width: responsiveScreenWidth(7),
    height: responsiveScreenHeight(7),
  },
  btntitlecontainer: {
    position: 'absolute',
    bottom: responsiveScreenHeight(2),
    left: responsiveScreenWidth(4),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  btntitle: {
    fontFamily: 'Ubuntu-Regular',
    color: '#000000',
    fontSize: responsiveScreenFontSize(2),
  },
  selectedCard: {
    backgroundColor: '#FFFBFE',
    borderColor: '#FF04D7',
  },

  selectedText: {
    color: '#FF04D7',
  },
  img2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  checkboxcontainer: {
    // borderWidth:1,
    height: responsiveScreenHeight(2),
    width: responsiveScreenHeight(2),
    // borderRadius:responsiveScreenHeight(1),
    // backgroundColor:'red',
    // alignItems:"center",
    // justifyContent:"center"
  },
  bottomtxtcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: responsiveScreenHeight(1),
  },
  bottomtxt: {
    color: '#000000',
    fontFamily: 'Ubuntu-Medium',
    fontSize: responsiveScreenFontSize(2),
  },
});
