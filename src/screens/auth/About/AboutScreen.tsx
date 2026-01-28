import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

export default function AboutScreen() {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);

  const Data = [
    { id: '1', agegroup: '18-24' },
    { id: '2', agegroup: '25-34' },
    { id: '3', agegroup: '35-44' },
    { id: '4', agegroup: '45+' },
  ];

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          isSelected && styles.selectedItem,
        ]}
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.itemText,
            isSelected && styles.selectedText,
          ]}
        >
          {item.agegroup}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader
        title="Tell Us About Yourself"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <View style={styles.innercontainer}>
        <Text style={styles.headtxt}>
          Help us personalize your experience
        </Text>

        <FlatList
          data={Data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.btncontainer}>
          <AppButton
            title="Finish Setup"
            onPress={() => navigation.navigate('Privacy')}
            disabled={!selectedId} // optional
          />
        </View>
      </View>
    </View>
  );
}
