import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { styles as Homestyle } from '../home/styles';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import {
  useGetCatalogItemsByCategoryQuery,
  useAddCatalogItemToListMutation,
} from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';


const CATEGORIES = ['All', 'Restaurants', 'Cafes', 'Bars'];

export default function BrowseCatalogScreen({ navigation, route }) {
  const { categoryId, listId } = route.params;

  /* ================= API ================= */
  const { data, isLoading } = useGetCatalogItemsByCategoryQuery(categoryId);
  const [addCatalogItems, { isLoading: isAdding }] =
    useAddCatalogItemToListMutation();


  /* ================= STATE ================= */
  const [items, setItems] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  /* ================= MAP API → LOCAL ================= */
  useEffect(() => {
    if (data) {
     
      setItems(
        data.map(item => ({
          ...item,
          selected: false,
        })),
      );
    }
  }, [data]);

  /* ================= ACTIONS ================= */
  const toggleSelect = (id: number) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, selected: !i.selected } : i)),
    );
  };

  const handleSkip = () => {
    if (!items || items.length === 0) {
      // No items available → go back
      navigation.goBack();
      return;
    }
  
    // Items exist → go to Addcustom screen
    navigation.navigate('Addcustom', {
      selectedItems: items.filter(item => item.selected).map(item => item.id),
      listId: listId,
    });
  };
  

  const handleNext = async () => {
    if (!items || items.length === 0) {
      Alert.alert(
        'No items available',
        'There are no items in this category to select.',
      );
      return;
    }

    const selectedIds = items
      .filter(item => item.selected)
      .map(item => item.id);

    if (selectedIds.length === 0) {
      Alert.alert(
        'No items selected',
        'Please select at least one item to continue.',
      );
      return;
    }

    const payload = {
      catalog_item_ids: selectedIds,
      listId: listId,
    };

    try {
      const res = await addCatalogItems(payload).unwrap();

      Alert.alert('Success', res.message || 'Items added successfully', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('Addcustom', {
              selectedItems: selectedIds,
              listId: listId,
            }),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to add items. Please try again.',
      );
    }
  };

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, item.selected && styles.cardActive]}
      onPress={() => toggleSelect(item.id)}
    >
      <View style={styles.image}>
        <Image
          resizeMode="contain"
          source={require('../../../../assets/image/glass.png')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>

      <View style={styles.iconWrap}>
        <Text style={[styles.icon, item.selected && styles.iconActive]}>
          {item.selected ? '✓' : '+'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Loader color="blue" visible={isLoading || isAdding} />
      <SafeAreaProvider style={{ flex: 1 }}>
        <StatusBar backgroundColor="#00C4FA" barStyle="light-content" />
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#00C4FA' }} />

        <View style={styles.header2}>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backarrow}
            >
              <Image
                tintColor={'#fff'}
                resizeMode="contain"
                style={styles.img}
                source={require('../../../../assets/image/left-icon.png')}
              />
            </Pressable>

            <Text style={styles.headerTitle}>Browse Catalogue</Text>
            <View />
          </View>

          <View style={styles.serchmaincontainer}>
            <SearchBar placeholder="Search items..." />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              ...Homestyle.scrollcontainer,
              paddingTop: responsiveScreenHeight(2.25),
            }}
          >
            {/* {CATEGORIES.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <Pressable
                  key={item}
                  onPress={() => setActiveIndex(index)}
                  style={[
                    Homestyle.scrollbox,
                    isActive && Homestyle.activeScrollBox,
                  ]}
                >
                  <Text
                    style={[
                      Homestyle.boxtitle,
                      isActive && Homestyle.activeBoxTitle,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })} */}
          </ScrollView>
        </View>

        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: responsiveScreenWidth(4),
              paddingTop: responsiveScreenHeight(2),
              paddingBottom: responsiveScreenHeight(16),
            }}
          />

          <SafeAreaView edges={['bottom']} style={styles.footer}>
            <Pressable style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </>
  );
}

export const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: '#00C4FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header2: {
    backgroundColor: '#00C4FA',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(2),
  },
  serchmaincontainer: {
    paddingTop: responsiveScreenHeight(2.25),
  },
  backarrow: {
    width: responsiveScreenHeight(4),
    height: responsiveScreenHeight(3),
  },
  img: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: responsiveScreenHeight(2.35),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1,
    borderColor: '#C5C5C5',
  },
  cardActive: { borderColor: '#0180FE', backgroundColor: '#ECF6FF' },
  image: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(6),
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    fontSize: responsiveScreenFontSize(1.85),
    fontFamily: 'Quicksand-Regular',
    color: 'black',
    fontWeight: '500',
  },
  desc: {
    fontSize: responsiveScreenFontSize(1.75),
    color: '#777',
    marginTop: responsiveScreenHeight(1.25),
    fontFamily: 'Quicksand-Regular',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  skipBtn: {
    flex: 1,
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#00C4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  skipText: {
    color: '#00C4FA',
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
  },
  nextBtn: {
    flex: 1,
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    backgroundColor: '#00C4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#22B8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18, color: '#22B8F0' },
  iconActive: { fontWeight: '700' },
});
