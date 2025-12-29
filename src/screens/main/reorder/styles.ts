import { StyleSheet } from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
export const styles = StyleSheet.create({
  header2: {
    backgroundColor: '#fff',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(2),

    //  borderWidth:1
  },
    header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  img:{
    width:'100%',
    height:'100%'
  }
});
