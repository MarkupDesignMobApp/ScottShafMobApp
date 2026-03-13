import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  innercontainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  headtxt: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
  },

  /* LIST */

  listContainer: {
    paddingBottom: 40,
  },

  row: {
    justifyContent: 'space-between',
  },

  /* CARD */

  iconContainer: {
    width: 34,
    height: 34,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /* FOOTER */

  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 18,
  },

  footerText: {
    fontSize: 14,
    color: '#7F8C8D',
  },

  highlight: {
    color: '#2C3E50',
    fontWeight: '700',
  },

  /* BUTTON */

  submitButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    paddingVertical: 16,
  },

  submitButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  cardOverlay: {
    flex: 1,

    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
  },

  interestCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },

  selectedInterestCard: {
    borderColor: '#2C3E50',
    backgroundColor: '#F1F3F6',
  },

  iconWrapper: {
    width: 50,
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 40,
    height: 40,
  },

  interestText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },

  selectedInterestText: {
    color: '#2C3E50',
  },

  checkWrapper: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#2C3E50',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkIcon: {
    width: 12,
    height: 12,
    tintColor: '#fff',
  },
});
