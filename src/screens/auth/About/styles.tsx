import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  /* ---------- TEXT ---------- */
  headtxt: {
    fontFamily: 'samsungsharpsans-medium',
    color: '#1E1E1E',
    fontSize: responsiveScreenFontSize(1.85),
    lineHeight: 25,
  },

  labeltxt: {
    fontFamily: 'samsungsharpsans-medium',
    color: '#1E1E1E',
    fontSize: responsiveScreenFontSize(1.7),
  },

  itemText: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#333',
  },

  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* ---------- CONTAINERS ---------- */
  innercontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
  },

  footer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(3),
    paddingTop: responsiveScreenHeight(1),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  /* ---------- AGE GROUP GRID ---------- */
  listContainer: {
    paddingVertical: responsiveScreenHeight(1.5),
  },

  row: {
    justifyContent: 'space-between',
  },

  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: responsiveScreenHeight(2.2),
    marginBottom: responsiveScreenHeight(1.5),
    marginHorizontal: responsiveScreenWidth(1),
    borderRadius: responsiveScreenWidth(20),
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  selectedItem: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },

  /* ---------- BUDGET ---------- */
  budgetList: {
    paddingBottom: responsiveScreenHeight(2),
    gap: responsiveScreenHeight(1.5),
  },

  budgetItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: responsiveScreenHeight(2),
    borderRadius: responsiveScreenWidth(20),
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  /* ---------- SECTION TITLE ---------- */
  sectionTitle: {
    marginTop: responsiveScreenHeight(3),
    marginBottom: responsiveScreenHeight(1.5),
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(1.85),
    color: '#1E1E1E',
  },
});
