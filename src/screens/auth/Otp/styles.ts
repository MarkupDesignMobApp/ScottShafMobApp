import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  banner: {
    height: responsiveScreenHeight(28),
    justifyContent: 'flex-end',
    padding: 24,
  },

  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },

  scrollContent: {
    flexGrow: 1,
  },

  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },

  phoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 4,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  otpInput: {
    width: responsiveScreenWidth(14),
    height: responsiveScreenHeight(7),
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: responsiveScreenFontSize(2),
    backgroundColor: '#F8F9FA',
    color: '#2C3E50',
  },

  resendContainer: {
    alignItems: 'center',
    marginTop: 24,
  },

  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },

  verifyButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 40,
  },

  disabledButton: {
    backgroundColor: '#BDC3C7',
  },

  verifyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
