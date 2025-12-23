import { StyleSheet } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  box: {
    width: 23,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#00C4FA',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFFCFF',
  },
  checkedBox: {
    backgroundColor: '#EFFCFF',
  },

  img:{
    width:'100%',
    height:'100%'
  },
  imgcontainer:{
    width:responsiveScreenWidth(2.5),
    height:responsiveScreenHeight(2.5)
  }
});
