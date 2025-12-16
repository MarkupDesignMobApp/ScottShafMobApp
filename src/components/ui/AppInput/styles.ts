import { StyleSheet } from 'react-native';
import { responsiveScreenFontSize } from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    // padding: 12,
    borderRadius: 8,
    fontSize:responsiveScreenFontSize(2)
  },
});
