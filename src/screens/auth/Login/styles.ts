import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* CONTAINER */

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* BANNER */

  bannerSection: {
    height: 240,
  },

  bannerImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  bannerContent: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },

  welcomeTitle: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },

  /* SAFE AREA */

  safeArea: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  /* FORM CARD */

  formCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },

  /* HEADER */

  headerSection: {
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },

  /* INPUT FIELDS */

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 6,
  },

  /* COUNTRY FIELD */

  countryField: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  countryText: {
    fontSize: 15,
    color: '#2C3E50',
  },

  placeholderText: {
    color: '#95A5A6',
  },

  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: '#95A5A6',
  },

  /* PHONE FIELD */

  phoneWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  phoneWrapperFocused: {
    borderColor: '#2C3E50',
  },

  countryCodeBox: {
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },

  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#2C3E50',
  },

  /* BUTTON */

  buttonWrapper: {
    marginTop: 12,
    marginBottom: 26,
  },

  submitButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    paddingVertical: 16,
  },

  submitButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },

  submitButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  /* DIVIDER */

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E7EC',
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#95A5A6',
  },

  /* SOCIAL BUTTONS */

  socialSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  socialButton: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2C3E50',
  },

  /* FOOTER */

  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  footerText: {
    fontSize: 14,
    color: '#7F8C8D',
  },

  signupLink: {
    color: '#2C3E50',
    fontWeight: '600',
  },

  /* TERMS */

  termsContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },

  termsText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 18,
  },

  link: {
    color: '#2C3E50',
    fontWeight: '600',
  },
});
