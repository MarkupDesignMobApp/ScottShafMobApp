import { StyleSheet, Platform, Dimensions } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
  },

  scrollContainer: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  headerButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },

  headerIcon: {
    width: 22,
    height: 22,
    tintColor: '#2C3E50',
  },

  /* PROFILE CARD */
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#E9ECEF',
  },

  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  avatarBadgeText: {
    fontSize: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },

  email: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
    textAlign: 'center',
  },

  memberBadge: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 16,
  },

  memberSince: {
    fontSize: 12,
    color: '#95A5A6',
  },

  editButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginTop: 8,
  },

  editButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  editText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  /* SETTINGS CARD */
  settingsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  settingItemLast: {
    borderBottomWidth: 0,
  },

  settingItemPressed: {
    backgroundColor: '#F8F9FA',
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  settingIcon: {
    width: 16,
    height: 16,
    tintColor: '#2C3E50',
  },

  settingTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C3E50',
  },

  arrow: {
    width: 16,
    height: 16,
    tintColor: '#BDC3C7',
  },

  /* LOGOUT BUTTON */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },

  logoutButtonPressed: {
    backgroundColor: '#FFF5F5',
    transform: [{ scale: 0.98 }],
  },

  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: '#DC3545',
    marginRight: 8,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC3545',
  },

  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: -10,
    marginBottom: 20,
  },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: width - 48,
    maxWidth: 340,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  deleteIconContainer: {
    backgroundColor: '#FFF5F5',
  },

  modalIcon: {
    fontSize: 32,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },

  modalMessage: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },

  modalWarning: {
    fontSize: 13,
    color: '#DC3545',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 24,
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  modalCancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  modalConfirmButton: {
    backgroundColor: '#DC3545',
  },

  deleteConfirmButton: {
    backgroundColor: '#DC3545',
  },

  modalCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
  },

  modalConfirmText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

// Keep your existing styles2 for edit profile screen
export const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* PROFILE IMAGE */
  profile: {
    alignItems: 'center',
    marginTop: responsiveScreenHeight(3),
    marginBottom: responsiveScreenHeight(3),
  },

  img: {
    width: responsiveScreenWidth(30),
    height: responsiveScreenWidth(30),
    borderRadius: responsiveScreenWidth(15),
    borderWidth: 3,
    borderColor: '#2C3E50',
  },

  camcontainer: {
    position: 'absolute',
    bottom: 0,
    right: responsiveScreenWidth(32),
    backgroundColor: '#2C3E50',
    padding: 10,
    borderRadius: 20,
    elevation: 4,
  },

  /* TEXT AREA */
  labeltxt: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
    marginTop: responsiveScreenHeight(2),
    marginBottom: 6,
  },

  paragraph: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 120,
  },

  wordcapacity: {
    textAlign: 'right',
    marginTop: 6,
    fontSize: 12,
    color: '#7F8C8D',
  },

  /* SAVE BUTTON */
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    alignItems: 'center',
  },

  /* MODAL */
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },

  modalTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 10,
  },

  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
});
