import { StyleSheet } from 'react-native';
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },

  checkbox: {
    width:responsiveScreenWidth(6),
    height:responsiveScreenHeight(3),
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#00C4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checked: {
    backgroundColor: '#00C4FA',
  },

  innerTick: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  label: {
    marginLeft:responsiveScreenWidth(3),
   
    color: '#131313',
    fontFamily: 'Quicksand-Regular',
    fontSize:responsiveScreenFontSize(1.75)
  },

  disabled: {
    opacity: 0.5,
  },

  disabledLabel: {
    color: '#131313',
    fontSize:responsiveScreenFontSize(2)
  },
});
