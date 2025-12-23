import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Pressable, Image, Alert } from 'react-native';
import { styles } from './styles';
import {
  useGetAllInterestsQuery,
  useGetUserInterestsQuery,
  useSaveUserInterestsMutation,
} from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../../components/ui/AppButton/AppButton';

interface TwoColumnListProps {
  userId: number;
}

const MIN_SELECTION = 3;

const TwoColumnList: React.FC<TwoColumnListProps> = ({ userId }) => {
  const navigation = useNavigation();

  // ✅ GET ALL INTERESTS
  const { data: allInterests, isLoading } = useGetAllInterestsQuery();

  // ✅ GET USER SELECTED INTERESTS
  const { data: userInterests } = useGetUserInterestsQuery(userId);

  // ✅ SAVE
  const [saveInterests, { isLoading: isSaving }] =
    useSaveUserInterestsMutation();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // ✅ PRESELECT USER INTERESTS
  useEffect(() => {
    if (userInterests) {
      setSelectedItems(userInterests.map(i => i.id));
    }
  }, [userInterests]);

  // ✅ TOGGLE
  const toggleSelection = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id],
    );
  };

  const ICONS: Record<string, any> = {
    Books: require('../../../../assets/image/book.png'),
    Gaming: require('../../../../assets/image/controller.png'),
    Travel: require('../../../../assets/image/travel.png'),
    Movies: require('../../../../assets/image/movie.png'),
    Music: require('../../../../assets/image/music.png'),
    Food: require('../../../../assets/image/food.png'),
  };

  const renderItem = ({ item }: any) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <Pressable
        onPress={() => toggleSelection(item.id)}
        style={[styles.card2, isSelected && styles.selectedCard]}
      >
        <View style={styles.imgcontainer}>
          <Image
            source={ICONS[item.name] || ICONS.Movies}
            style={styles.img}
            resizeMode="contain"
          />
        </View>

        <View style={styles.btntitlecontainer}>
          <Text style={[styles.btntitle, isSelected && styles.selectedText]}>
            {item.name}
          </Text>

          {isSelected && (
            <View style={styles.checkboxcontainer}>
              <Image
                source={require('../../../../assets/image/check.png')}
                style={styles.img}
                resizeMode="contain"
                tintColor="red"
              />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (selectedItems.length < MIN_SELECTION) {
      Alert.alert(`Please select at least ${MIN_SELECTION} interests`);
      return;
    }

    try {
      await saveInterests({
        user_id: userId,
        interests: selectedItems,
      }).unwrap();

      Alert.alert('Success', 'Interests saved successfully');
      navigation.navigate('About' as never);
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Failed to save interests');
    }
  };

  return (
    <>
      <Loader visible={isLoading || isSaving} color="blue" />

      <FlatList
        data={allInterests}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listmaincontainer}
        ListFooterComponent={
          <>
            <View style={styles.bottomtxtcontainer}>
              <Text style={styles.bottomtxt}>
                Selected:{' '}
                <Text style={{ color: '#0180FE' }}>
                  {selectedItems.length.toString().padStart(2, '0')}
                </Text>
              </Text>

              <Text style={styles.bottomtxt}>
                Minimum:{' '}
                <Text style={{ color: '#0180FE' }}>
                  {MIN_SELECTION.toString().padStart(2, '0')}
                </Text>
              </Text>
            </View>

            <View style={styles.btncontainer}>
              <AppButton title="Submit And Continue" onPress={handleSubmit} />
            </View>
          </>
        }
      />
    </>
  );
};

export default TwoColumnList;
