import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  innercontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(4),
    backgroundColor: '#fff',
    flex: 1,
  },
  headtxt: {
    fontFamily: 'samsungsharpsans-medium',
    color: '#1E1E1E',
    fontSize: responsiveScreenFontSize(1.85),
    lineHeight: 25,
  },
  btncontainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: responsiveScreenHeight(10),
  },
  

  listContainer: {
    paddingVertical: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 20,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedItem: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    borderRadius:responsiveScreenWidth(10)
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    
    fontWeight: '600',
  },
 
});
