import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { styles } from './styles';

export default function EditProfile() {
  return (
    <View>
      <AppHeader
        title="Edit Profile"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <View style={{ flex: 1 }}>
        <View style={styles.profile}>
          <Image
            resizeMode="cover"
            style={styles.img}
            source={require('../../../../assets/image/women1.png')}
          />
          <Pressable onPress={()=>alert("efef")} style={styles.camcontainer}>
            <View style={styles.cammaincontainer}>
              <Image
                resizeMode="contain"
                style={styles.img}
                source={require('../../../../assets/image/camera.png')}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
