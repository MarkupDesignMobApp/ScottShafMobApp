import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  Pressable,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';

import { styles } from './styles';

import {
  useGetAllInterestsQuery,
  useGetUserInterestsQuery,
  useSaveUserInterestsMutation,
} from '../../../features/auth/authApi';

import Loader from '../../../components/ui/Loader/Loader';
import { useNavigation } from '@react-navigation/native';

interface Interest {
  id: number;
  name: string;
  icon: string;
}

interface TwoColumnListProps {
  userId: number;
}

const MIN_SELECTION = 3;

const TwoColumnList: React.FC<TwoColumnListProps> = ({ userId }) => {

  const navigation = useNavigation<any>();

  const { data: allInterests, isLoading } = useGetAllInterestsQuery();
  const { data: userInterests } = useGetUserInterestsQuery(userId);

  const [saveInterests, { isLoading: isSaving }] =
    useSaveUserInterestsMutation();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  /* PRESELECT USER INTERESTS */
  useEffect(() => {
    if (userInterests && Array.isArray(userInterests)) {
      setSelectedItems(userInterests.map((i: Interest) => i.id));
    }
  }, [userInterests]);

  /* TOGGLE SELECT */
  const toggleSelection = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  /* INTEREST CARD */
  const renderItem = ({ item }: { item: Interest }) => {

    const isSelected = selectedItems.includes(item.id);

    return (

      <Pressable
        onPress={() => toggleSelection(item.id)}
        style={[
          styles.interestCard,
          isSelected && styles.selectedInterestCard
        ]}
      >

        <View style={styles.iconWrapper}>
          <Image
            source={{ uri: item.icon }}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text
          style={[
            styles.interestText,
            isSelected && styles.selectedInterestText
          ]}
        >
          {item.name}
        </Text>

        {isSelected && (
          <View style={styles.checkWrapper}>
            <Image
              source={require('../../../../assets/image/check.png')}
              style={styles.checkIcon}
            />
          </View>
        )}

      </Pressable>

    );
  };

  /* SUBMIT INTERESTS */
  const handleSubmit = async () => {

    if (selectedItems.length < MIN_SELECTION) {
      Alert.alert(`Please select at least ${MIN_SELECTION} interests`);
      return;
    }

    try {

      const res = await saveInterests({
        user_id: userId,
        interests: selectedItems,
      }).unwrap();

      navigation.navigate('About', {
        userId: res.user_id,
      });

    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.data?.message || 'Failed to save interests'
      );
    }

  };

  /* RENDER */

  return (

    <>
      <Loader visible={isLoading || isSaving} color="#2C3E50" />

      <FlatList
        data={allInterests || []}
        keyExtractor={(item: Interest) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}

        ListFooterComponent={

          <>

            {/* SELECTION INFO */}
            <View style={styles.footerInfo}>

              <Text style={styles.footerText}>
                Selected:
                <Text style={styles.highlight}> {selectedItems.length}</Text>
              </Text>

              <Text style={styles.footerText}>
                Minimum:
                <Text style={styles.highlight}> {MIN_SELECTION}</Text>
              </Text>

            </View>

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>
                Submit & Continue
              </Text>
            </TouchableOpacity>

          </>
        }
      />
    </>
  );
};

export default TwoColumnList;