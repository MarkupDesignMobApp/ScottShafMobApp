import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  innercontainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 80,
  },

  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
    marginTop: 16,
  },

  row: {
    justifyContent: 'space-between',
  },

  optionCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 14,
  },

  budgetCard: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 14,
  },

  optionSelected: {
    backgroundColor: '#2C3E50',
    borderColor: '#2C3E50',
  },

  optionText: {
    fontSize: 14,
    color: '#2C3E50',
  },

  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#E4E7EC',
  },

  submitButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 16,
    borderRadius: 12,
  },

  disabledButton: {
    backgroundColor: '#BDC3C7',
  },

  submitText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  /* MODAL */

  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },

  cityItem: {
    paddingVertical: 12,
  },

  cityText: {
    fontSize: 15,
    color: '#2C3E50',
  },

  closeButton: {
    marginTop: 16,
    backgroundColor: '#2C3E50',
    paddingVertical: 14,
    borderRadius: 12,
  },

  closeText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});
