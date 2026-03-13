import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', // soft overall screen background
  },

  scrollContainer: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(3),
  },

  headtxt: {
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(2),
    color: '#111827',
    textAlign: 'center',
    marginBottom: responsiveScreenHeight(2),
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(2.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  switchtxt: {
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(1.9),
    color: '#111827',
  },

  privacytxt2: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.65),
    color: '#4B5563',
    marginTop: responsiveScreenHeight(1.2),
    lineHeight: responsiveScreenHeight(2.5),
  },

  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECF6FF',
    borderRadius: 12,
    paddingVertical: responsiveScreenHeight(1.5),
    paddingHorizontal: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(1.5),
    borderWidth: 1,
    borderColor: '#0180FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  icon: {
    width: responsiveScreenWidth(6),
    height: responsiveScreenWidth(6),
  },

  headcontainer: {
    flex: 1,
    paddingLeft: responsiveScreenWidth(3),
  },

  listheadtxt: {
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(1.9),
    color: '#111827',
  },

  listsubheadtxt: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.65),
    color: '#4B5563',
    marginTop: responsiveScreenHeight(0.5),
  },

  listmaincontainer: {
    paddingTop: responsiveScreenHeight(1.5),
  },

  list2container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: responsiveScreenHeight(1),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  listitem: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.7),
    color: '#111827',
  },

  listitem2: {
    fontFamily: 'Quicksand-Medium',
    fontSize: responsiveScreenFontSize(1.7),
    color: '#FF04D7',
  },

  fixedBottom: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5,
  },

  privacyLink: {
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.7),
    color: '#00C4FA',
    textDecorationLine: 'underline',
    marginTop: responsiveScreenHeight(1.5),
    textAlign: 'center',
  },
  customButton: {
    backgroundColor: '#2C3E50', // theme color
    paddingVertical: responsiveScreenHeight(1.8),
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(1.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  customButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
});
