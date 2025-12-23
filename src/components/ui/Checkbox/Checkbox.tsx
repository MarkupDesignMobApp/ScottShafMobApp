import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { styles } from './styles';
const CustomCheckBox = ({ checked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.box, checked && styles.checkedBox]}>
        {/* {checked && <View style={styles.tick} />} */}
        {checked && (
          <View style={styles.imgcontainer}>
            <Image
              tintColor={'#00C4FA'}
              style={styles.img}
              resizeMode="contain"
              source={require('../../../../assets/image/plaincheck.png')}
            />
            {/* <Image sourc}/> */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomCheckBox;
