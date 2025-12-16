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
    fontSize: responsiveScreenFontSize(3.5),

    fontFamily: 'samsungsharpsans-medium',
    textAlign: 'center',
    color: '#000000',
    position: 'absolute',
    top: responsiveScreenHeight(-4),
    width: responsiveScreenWidth(85),
  },

  description: {
    fontSize: responsiveScreenFontSize(2.25),
    fontFamily: 'Quickand-Regular',
    textAlign: 'center',
    paddingTop: responsiveScreenHeight(6),
    color: '#8A8A8A',
    lineHeight: responsiveScreenHeight(3),
    width: responsiveScreenWidth(85),
  },
  imgcontainer: {
    height: responsiveScreenHeight(50),
    width: responsiveScreenWidth(100),
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
    color: '#00C4FA',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(2.15),
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 90, // above button
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
    width: responsiveScreenWidth(8),
    backgroundColor: '#FF04D7', // iOS blue / primary
  },

  inactiveDot: {
    width: responsiveScreenWidth(2),
    backgroundColor: '#D1D5DB', // light gray
  },
});
