import { StyleSheet } from 'react-native';
import {
    responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  searchbar: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(5),
    paddingVertical: responsiveScreenHeight(1.25),
    borderRadius: responsiveScreenWidth(10),
    borderColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgcontainer: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenHeight(3),
  },
  img: {
    width: '100%',
    height: '100%',
    color: '#fff',
  },
  inputstyle: {

    width: '100%',
    paddingHorizontal: responsiveScreenHeight(2),
    fontFamily:"Quicksand-Regular",
    fontSize:responsiveScreenFontSize(2.15),
    
  },
});
