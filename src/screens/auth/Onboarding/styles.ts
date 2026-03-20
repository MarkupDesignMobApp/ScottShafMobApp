import { StyleSheet, Platform, StatusBar } from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44;

export const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '40%', // image covers top part
  },

  content: {
    position: 'absolute',
    bottom: 120,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: responsiveScreenFontSize(3.2),
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    color: '#2C3E50',
    width: responsiveScreenWidth(85),
    marginBottom: responsiveScreenHeight(1.5),
  },

  description: {
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    color: '#4A5568',
    lineHeight: responsiveScreenHeight(3),
    width: responsiveScreenWidth(85),
  },

  imgcontainer: {
    height: responsiveScreenHeight(50),
    width: responsiveScreenWidth(100),
    position: 'relative',
  },

  image: {
    height: '100%',
    width: '100%',
  },

  image2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  textContainer: {
    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(5),
    marginTop: responsiveScreenHeight(2),
  },

  buttonContainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(1),
    position: 'absolute',
    width: '100%',
    bottom: responsiveScreenHeight(15),
  },

  bottomtxt: {
    textAlign: 'center',
    paddingTop: responsiveScreenHeight(2),
    color: '#2C3E50',
    fontFamily: 'Quicksand-Medium',
    fontSize: responsiveScreenFontSize(2.15),
    textDecorationLine: 'underline',
    textDecorationColor: '#2C3E50',
  },

  paginationContainer: {
    position: 'absolute',
    bottom: responsiveScreenHeight(20),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: responsiveScreenWidth(1),
  },

  activeDot: {
    width: responsiveScreenWidth(6),
    backgroundColor: '#2C3E50',
  },

  inactiveDot: {
    width: responsiveScreenWidth(2.5),
    backgroundColor: '#E2E8F0',
  },
});
