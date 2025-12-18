import React, { useEffect, useState } from 'react';

import { FlatList, View, Text, Pressable, Image } from 'react-native';
import { styles } from './styles';

const DATA = [
  {
    id: '1',
    title: 'Movie',
    icon: require('../../../../assets/image/movie.png'),
  },
  {
    id: '2',
    title: 'Music',
    icon: require('../../../../assets/image/music.png'),
  },
  {
    id: '3',
    title: 'Food',
    icon: require('../../../../assets/image/food.png'),
  },
  {
    id: '4',
    title: 'Travel',
    icon: require('../../../../assets/image/travel.png'),
  },
  {
    id: '5',
    title: 'Gaming',
    icon: require('../../../../assets/image/controller.png'),
  },
  {
    id: '6',
    title: 'Books',
    icon: require('../../../../assets/image/book.png'),
  },
];
const MIN_SELECTION = 3;
const TwoColumnList = () => {
  useEffect(() => {
    const defaultSelected = DATA.slice(0, MIN_SELECTION).map(item => item.id);
    setSelectedItems(defaultSelected);
  }, []);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id],
    );
  };

  const renderItem = ({ item }: any) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <Pressable
        onPress={() => toggleSelection(item.id)}
        delayLongPress={250}
        style={[styles.card2, isSelected && styles.selectedCard]}
      >
        <View style={styles.imgcontainer}>
          <Image source={item.icon} resizeMode="contain" style={styles.img} />
          {/* <Image  source={require("../../../../assets/image/blur.png")} resizeMode="contain" style={styles.img2} /> */}
        </View>

        <View style={styles.btntitlecontainer}>
          <Text style={[styles.btntitle, isSelected && styles.selectedText]}>
            {item.title}
          </Text>
          {isSelected && (
            <View style={styles.checkboxcontainer}>
              <Image
                tintColor={'red'}
                style={styles.img}
                resizeMode="contain"
                source={require('../../../../assets/image/check.png')}
              />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listmaincontainer}
        ListFooterComponent={
          <View style={styles.bottomtxtcontainer}>
            <Text style={styles.bottomtxt}>
              Selected:{' '}
              <Text style={{ color: '#0180FE' }}>
                {selectedItems.length.toString().padStart(2, '0')}
              </Text>
            </Text>

            <Text style={styles.bottomtxt}>
              Minimum:{' '}
              <Text style={{ color: '#0180FE',  }}>
                {MIN_SELECTION.toString().padStart(2, '0')}
              </Text>
            </Text>
          </View>
        }
      />
    </>
  );
};

export default TwoColumnList;
