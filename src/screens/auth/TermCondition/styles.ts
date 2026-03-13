import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  /* SAME CARD AS SIGNUP */
  formCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },

  /* SAME HEADER STYLE */
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

  /* TERMS BOX */
  termsBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    padding: 16,
    marginBottom: 24,
  },

  termsDescription: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },

  /* CHECKBOX AREA */
  checkboxContainer: {
    marginBottom: 24,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
  },

  /* SAME BUTTON STYLE AS SIGNUP */
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

  /* FOOTER TEXT */
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
  backButton: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 10,
  },

  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#2C3E50',
  },
});
