import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { styles } from './styles';
import { OnboardingItemType } from './data';

const { width } = Dimensions.get('window');

interface Props {
  item: OnboardingItemType;
}

const OnboardingItem: React.FC<Props> = ({ item }) => {
  return (
    <View style={[styles.slide, { width }]}>
        
        <View style={styles.imgcontainer}>
      <Image resizeMode='cover' source={item.image} style={styles.image} />
       <Image resizeMode='cover' source={item.image2} style={styles.image2} />
      </View>
      <View style={{alignItems:"center"}}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default OnboardingItem;
