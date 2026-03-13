import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  StatusBar,
  Alert,
  Share as RNShare,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import Loader from '../../../components/ui/Loader/Loader';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import { useGetMyPublishedListsQuery } from '../../../features/auth/authApi';

export default function MyListScreen({ navigation }) {
  /* ================= API ================= */
  const { data, isLoading, isFetching, refetch } =
    useGetMyPublishedListsQuery();

  const apiLists = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchText, setSearchText] = useState('');

  /* ================= REFRESH ON FOCUS ================= */
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  /* ================= SET LISTS ================= */
  useEffect(() => {
    if (!apiLists?.length) {
      setLists([]);
      setFilteredLists([]);
      return;
    }

    const formatted = apiLists.map(list => ({
      ...list,
      selected: false,
    }));

    setLists(formatted);
    setFilteredLists(formatted);
  }, [data]);

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredLists(lists);
      return;
    }

    const filtered = lists.filter(list =>
      list?.title?.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredLists(filtered);
  }, [searchText, lists]);

  /* ================= HELPERS ================= */
  const formatSubCategory = raw => {
    if (raw === null || raw === undefined) return '';
    const s = String(raw).trim();
    const cleaned = s.replace(/^#+/, '').trim();
    if (!cleaned) return '';
    if (/^\d+$/.test(cleaned)) return `Subcategory ID: ${cleaned}`;
    return `#${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)}`;
  };

  const getSubCategoryDisplay = list => {
    const listLevel = list?.sub_category_id ?? null;
    if (listLevel !== null && String(listLevel).trim() !== '') {
      return formatSubCategory(listLevel);
    }
    const firstCatalogSub = list?.items?.find(it => it?.catalog_item)
      ?.catalog_item?.sub_category_id;
    if (firstCatalogSub !== null && firstCatalogSub !== undefined) {
      return formatSubCategory(firstCatalogSub);
    }
    return '';
  };

  /* ================= ACTIONS ================= */
  const toggleSelectList = id => {
    setLists(prev =>
      prev.map(l => (l.id === id ? { ...l, selected: !l.selected } : l)),
    );
  };

  const toggleExpand = id => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleShareList = async list => {
    try {
      const shareUrl =
        list?.share_url || list?.shareUrl || list?.share_link || '';
      if (!shareUrl) {
        Alert.alert('Error', 'Share link not available');
        return;
      }

      await RNShare.share({
        title: list?.title || 'My List',
        message: `Check out my list "${list?.title}"\n${shareUrl}`,
        url: shareUrl,
      });
    } catch {
      Alert.alert('Error', 'Unable to share list');
    }
  };

  const handleCreateList = () => {
    navigation.navigate('Create');
  };

  /* ================= RENDER ITEM ================= */
  const renderItemRow = item => {
    if (!item) return null;

    const catalog = item?.catalog_item || {};
    const imageUrl = catalog?.image_url?.length ? catalog.image_url : null;
    const name = catalog?.name || item?.custom_item_name || 'Unnamed item';
    const desc = catalog?.description || item?.custom_text || '';

    return (
      <View key={`item-${item.id}`} style={styles.itemRow}>
        <View style={styles.itemLeft}>
          <View style={styles.itemImage}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ flex: 1, backgroundColor: '#E5E7EB' }} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.title}>{name}</Text>
            {!!desc && (
              <Text style={styles.desc} numberOfLines={2}>
                {desc}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  /* ================= RENDER LIST CARD ================= */
  const renderListCard = ({ item }) => {
    const expanded = expandedIds.includes(item.id);
    const firstImage =
      item?.items?.find(it => it?.catalog_item?.image_url?.length)?.catalog_item
        ?.image_url || null;
    const subCategoryLabel = getSubCategoryDisplay(item);

    return (
      <View style={[styles.card, item.selected && styles.cardActive]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => toggleSelectList(item.id)}
            style={{ flexDirection: 'row', flex: 1 }}
          >
            <View style={styles.image}>
              {firstImage ? (
                <Image
                  source={{ uri: firstImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ flex: 1, backgroundColor: '#E5E7EB' }} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item?.title}</Text>
              <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
                {subCategoryLabel}
              </Text>
              <Text style={styles.desc}>
                {item?.items?.length || 0} items •{' '}
                {item?.created_at
                  ? new Date(item.created_at).toLocaleDateString()
                  : ''}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => handleShareList(item)}
            style={styles.shareListBtn}
          >
            <Image
              source={require('../../../../assets/image/unfillshare.png')}
              style={styles.shareListIcon}
            />
          </Pressable>
        </View>

        <View style={styles.cardFooter}>
          <Pressable onPress={() => toggleExpand(item.id)}>
            <Text style={styles.expandText}>
              {expanded ? 'Hide items' : 'Show items'}
            </Text>
          </Pressable>
        </View>

        {expanded && (
          <View style={styles.itemsContainer}>
            {item?.items?.length > 0 ? (
              item.items.map(renderItemRow)
            ) : (
              <Text style={{ padding: 12, color: '#666' }}>
                No items in this list
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Loader
        color="blue"
        visible={(isLoading || isFetching) && !lists.length}
      />

      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Image
                source={require('../../../../assets/image/left-icon.png')}
                style={styles.backIcon}
              />
            </Pressable>

            <Text style={styles.headerTitle}>My Lists</Text>

            <View style={{ width: 36 }} />
          </View>

          <View style={styles.searchWrapper}>
            <SearchBar
              inputStyle={{ color: '#fff', fontWeight: '600' }}
              placeholder="Search items..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <FlatList
          data={filteredLists}
          keyExtractor={item => String(item.id)}
          renderItem={renderListCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: responsiveScreenWidth(4),
            paddingTop: responsiveScreenHeight(2),
            paddingBottom: responsiveScreenHeight(10), // ensures last item visible
          }}
          ListEmptyComponent={
            !isLoading && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Image
                  source={require('../../../../assets/image/notificationnotfount.jpg')}
                  style={styles.emptyImg}
                />
                <Text style={styles.emptyText}>No lists found</Text>
                <TouchableOpacity
                  style={styles.nextBtnLarge}
                  onPress={handleCreateList}
                >
                  <Text style={styles.nextText}>Create List</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
      </SafeAreaProvider>
    </>
  );
}

export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2C3E50',
    paddingTop: responsiveScreenHeight(1.5),
    paddingBottom: responsiveScreenHeight(2),
    paddingHorizontal: responsiveScreenWidth(4),
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: responsiveScreenFontSize(2.3),
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
  searchWrapper: {
    marginTop: responsiveScreenHeight(1.6),
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardActive: {
    borderColor: '#2C3E50',
    backgroundColor: '#F8FAFC',
  },
  image: {
    width: responsiveScreenWidth(14),
    height: responsiveScreenHeight(7),
    borderRadius: 12,
    marginRight: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  title: {
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'Quicksand-Bold',
    color: '#111827',
  },
  desc: {
    fontSize: responsiveScreenFontSize(1.7),
    color: '#6B7280',
    marginTop: responsiveScreenHeight(0.4),
    fontFamily: 'Quicksand-Regular',
  },
  shareListBtn: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  shareListIcon: {
    width: 20,
    height: 20,
    tintColor: '#2C3E50',
  },
  cardFooter: {
    marginTop: responsiveScreenHeight(1.6),
    paddingTop: responsiveScreenHeight(1.2),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  expandText: {
    color: '#2C3E50',
    fontWeight: '700',
    fontSize: responsiveScreenFontSize(1.7),
  },
  itemsContainer: {
    marginTop: responsiveScreenHeight(1.6),
    paddingTop: responsiveScreenHeight(1.4),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(1.6),
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemImage: {
    width: responsiveScreenWidth(13),
    height: responsiveScreenHeight(6),
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  emptyImg: {
    width: responsiveScreenWidth(50),
    height: responsiveScreenHeight(20),
    resizeMode: 'contain',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: responsiveScreenFontSize(1.9),
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Quicksand-SemiBold',
  },
  nextBtnLarge: {
    marginTop: 16,
    width: '60%',
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
  },
});
