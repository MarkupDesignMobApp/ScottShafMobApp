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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#00C4FA',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: responsiveScreenWidth(5),
    paddingVertical: 20,
    paddingBottom: 40,
  },
  mainHeading: {
    fontSize: responsiveScreenFontSize(2.4),
    fontFamily: 'Quicksand-Bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F4F9',
  },
  policyItem: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F9',
  },
  policyName: {
    fontSize: responsiveScreenFontSize(1.8),
    fontFamily: 'Quicksand-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  policyDescription: {
    fontSize: responsiveScreenFontSize(1.5),
    fontFamily: 'Quicksand-Regular',
    color: '#475569',
    lineHeight: 22,
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
