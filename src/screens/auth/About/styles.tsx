import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
 
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
    borderRadius:responsiveScreenWidth(20),
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedItem: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    borderRadius:responsiveScreenWidth(20)
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(3),
    backgroundColor: '#fff',
  },
  innercontainer: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
  },
  sectionTitle: {
    marginTop: responsiveScreenHeight(3),
    marginBottom: responsiveScreenHeight(1.5),
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(1.85),
    color: '#1E1E1E',
  },
  
  budgetList: {
    gap: 12,
  },
  
  budgetItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 16,
    borderRadius: responsiveScreenWidth(20),
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
  
  
});
