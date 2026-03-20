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
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import {
  useGetCatalogItemsByCategoryQuery,
  useAddCatalogItemsMutation,
} from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';

const CATEGORIES = ['All', 'Restaurants', 'Cafes', 'Bars'];

export default function BrowseCatalogScreen({ navigation, route }) {
  const { categoryId, listId } = route.params;

  /* ================= API ================= */
  const { data, isLoading } = useGetCatalogItemsByCategoryQuery(categoryId);
  const [addCatalogItems, { isLoading: isAdding }] =
    useAddCatalogItemsMutation();

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
      navigation.goBack();
      return;
    }

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

      if (res?.success) {
        navigation.navigate('Addcustom', {
          selectedItems: selectedIds,
          listId: listId,
        });
      } else {
        Alert.alert('Error', res?.message || 'Something went wrong');
      }
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
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          resizeMode="cover"
          source={{ uri: item.image_url }}
          style={styles.image}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View style={[styles.iconWrap, item.selected && styles.iconWrapActive]}>
        <Text style={[styles.icon, item.selected && styles.iconActive]}>
          {item.selected ? '✓' : '+'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Loader color="#2C3E50" visible={isLoading || isAdding} />
      <SafeAreaProvider style={{ flex: 1 }}>
        <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Image
                tintColor={'#fff'}
                resizeMode="contain"
                style={styles.backIcon}
                source={require('../../../../assets/image/left-icon.png')}
              />
            </Pressable>

            <Text style={styles.headerTitle}>Browse Catalogue</Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.searchContainer}>
            <SearchBar placeholder="Search items..." />
          </View>

          {/* Optional Categories Scroll - Commented out as in original */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {/* {CATEGORIES.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <Pressable
                  key={item}
                  onPress={() => setActiveIndex(index)}
                  style={[
                    styles.categoryChip,
                    isActive && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isActive && styles.categoryChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })} */}
          </ScrollView>
        </View>

        <View style={styles.contentContainer}>
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>📦</Text>
                  <Text style={styles.emptyText}>No items available</Text>
                </View>
              ) : null
            }
          />

          <SafeAreaView edges={['bottom']} style={styles.footer}>
            <Pressable
              style={styles.skipButton}
              onPress={handleSkip}
              android_ripple={{ color: '#E0E0E0', borderless: false }}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>

            <Pressable
              style={styles.nextButton}
              onPress={handleNext}
              android_ripple={{ color: '#1a2632', borderless: false }}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </>
  );
}

export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveScreenHeight(1.5),
  },
  backButton: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
  },
  backIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: responsiveScreenHeight(3),
  },
  searchContainer: {
    paddingTop: responsiveScreenHeight(1),
  },
  categoriesContainer: {
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(0.5),
  },
  categoryChip: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1),
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginRight: responsiveScreenWidth(2),
  },
  categoryChipActive: {
    backgroundColor: '#2C3E50',
  },
  categoryChipText: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#666',
    fontFamily: 'Quicksand-Regular',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(16),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: responsiveScreenHeight(1.8),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(1.5),
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardActive: {
    borderColor: '#2C3E50',
    backgroundColor: '#F0F4F8',
    shadowColor: '#2C3E50',
    shadowOpacity: 0.1,
  },
  imageContainer: {
    width: responsiveScreenWidth(14),
    height: responsiveScreenHeight(7),
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    marginRight: responsiveScreenWidth(3),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: responsiveScreenFontSize(1.9),
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: responsiveScreenHeight(0.3),
  },
  desc: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#718096',
    fontFamily: 'Quicksand-Regular',
    lineHeight: responsiveScreenHeight(2.2),
  },
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  skipButton: {
    flex: 1,
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveScreenWidth(3),
    backgroundColor: '#FFFFFF',
  },
  skipButtonText: {
    color: '#2C3E50',
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
    fontFamily: 'Quicksand-Bold',
  },
  nextButton: {
    flex: 1,
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
    fontFamily: 'Quicksand-Bold',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconWrapActive: {
    backgroundColor: '#2C3E50',
    borderColor: '#2C3E50',
  },
  icon: {
    fontSize: 20,
    color: '#2C3E50',
    fontWeight: '500',
  },
  iconActive: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveScreenHeight(10),
  },
  emptyEmoji: {
    fontSize: responsiveScreenFontSize(5),
    marginBottom: responsiveScreenHeight(2),
  },
  emptyText: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#A0A0A0',
    fontFamily: 'Quicksand-Regular',
  },
});