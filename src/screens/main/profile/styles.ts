import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
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

  /* PROFILE */

  profileCard: {
    backgroundColor: '#fff',

    marginHorizontal: 20,
    marginTop: 20,

    borderRadius: 16,

    padding: 24,

    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,

    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },

  email: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },

  memberSince: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 6,
  },

  editButton: {
    marginTop: 14,

    backgroundColor: '#2C3E50',

    paddingVertical: 10,
    paddingHorizontal: 22,

    borderRadius: 10,
  },

  editText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* SETTINGS */

  settingsCard: {
    backgroundColor: '#fff',

    marginHorizontal: 20,
    marginTop: 20,

    borderRadius: 16,

    paddingVertical: 10,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  settingTitle: {
    fontSize: 15,
    color: '#2C3E50',
  },

  arrow: {
    width: 16,
    height: 16,
    tintColor: '#BDC3C7',
  },

  /* TERMS */

  termcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 30,
  },

  term: {
    fontSize: 13,
    color: '#7F8C8D',
  },

  circleview: {
    width: 4,
    height: 4,

    borderRadius: 2,

    backgroundColor: '#BDC3C7',

    marginHorizontal: 8,
  },

  saveButton: {
    marginTop: 25,
    marginHorizontal: 20,
    backgroundColor: '#2C3E50',

    paddingVertical: 15,

    borderRadius: 12,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: responsiveScreenHeight(5),
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

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
    width: '90%',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    backgroundColor: 'red',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    marginBottom: responsiveScreenHeight(10),
    alignItems: 'center',
    marginLeft:'5%'
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
