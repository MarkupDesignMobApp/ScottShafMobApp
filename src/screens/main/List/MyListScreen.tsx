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
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyPublishedListsQuery();

  const apiLists = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const [lists, setLists] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

useEffect(() => {
  if (!apiLists?.length) {
    setLists([]);
    return;
  }

  setLists(prev => {
    // prevent unnecessary state updates
    if (prev.length === apiLists.length) return prev;

    return apiLists.map(list => ({
      ...list,
      selected: false,
    }));
  });
}, [data]); // ✅ depend on raw RTK data ONLY


  /* ================= ACTIONS ================= */
  const toggleSelectList = id => {
    setLists(prev =>
      prev.map(l =>
        l.id === id ? { ...l, selected: !l.selected } : l,
      ),
    );
  };

  const toggleExpand = id => {
    setExpandedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id],
    );
  };

  const handleShareList = async list => {
    try {
      const shareUrl =
        list?.share_url ||
        list?.shareUrl ||
        list?.share_link ||
        '';

      if (!shareUrl) {
        Alert.alert('Error', 'Share link not available');
        return;
      }

      await RNShare.share({
        title: list?.title || 'My List',
        message: `Check out my list "${list?.title}"\n${shareUrl}`,
        url: shareUrl,
      });
    } catch (e) {
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
    const imageUrl =
      typeof catalog?.image_url === 'string' &&
      catalog.image_url.length > 0
        ? catalog.image_url
        : null;

    const name =
      catalog?.name ||
      item?.custom_item_name ||
      'Unnamed item';

    const desc =
      catalog?.description ||
      item?.custom_text ||
      '';

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
      item?.items?.find(
        it =>
          typeof it?.catalog_item?.image_url === 'string' &&
          it.catalog_item.image_url.length > 0,
      )?.catalog_item?.image_url || null;

    return (
      <View style={[styles.card, item.selected && styles.cardActive]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => toggleSelectList(item.id)}
            style={{ flexDirection: 'row', flex: 1 }}>
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
            style={styles.shareListBtn}>
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

  /* ================= UI ================= */
  return (
    <>
      <Loader
        color="blue"
        visible={(isLoading || isFetching) && !lists.length}
      />

      <SafeAreaProvider>
        <StatusBar backgroundColor="#00C4FA" barStyle="light-content" />
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#00C4FA' }} />

        <View style={styles.header2}>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backarrow}>
              <Image
                source={require('../../../../assets/image/left-icon.png')}
                style={styles.img}
                tintColor="#fff"
              />
            </Pressable>
            <Text style={styles.headerTitle}>My List</Text>
            <View />
          </View>

          <View style={styles.serchmaincontainer}>
            <SearchBar placeholder="Search items..." />
          </View>
        </View>

        <FlatList
          data={lists}
          keyExtractor={item => String(item.id)}
          renderItem={renderListCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: responsiveScreenWidth(4),
            paddingTop: responsiveScreenHeight(2),
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
                  onPress={handleCreateList}>
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
  shareListIcon: {
    width: 22,
    height: 22,
    tintColor: '#0180FE',
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
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: responsiveScreenHeight(2),
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
    overflow: 'hidden',
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
    marginTop: responsiveScreenHeight(0.5),
    fontFamily: 'Quicksand-Regular',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
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
  nextBtnLarge: {
    marginTop: 16,
    width: '60%',
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    backgroundColor: '#00C4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 48,
    height: 48,
    marginLeft: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6EEF6',
    backgroundColor: '#fff',
  },
  shareIcon: {
    width: 24,
    height: 24,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#22B8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  icon: { fontSize: 18, color: '#22B8F0' },
  iconActive: { fontWeight: '700' },

  /* list card footer */
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveScreenHeight(1.25),
  },
  expandBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  expandText: {
    color: '#0180FE',
    fontWeight: '600',
  },
  shareListBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareListText: {
    color: '#fff',
    fontWeight: '600',
  },

  itemsContainer: {
    marginTop: responsiveScreenHeight(1.5),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: responsiveScreenHeight(1.25),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(1.5),
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemImage: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(6),
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemActions: {
    marginLeft: 12,
  },

  /* empty state */
  emptyImg: {
    width: responsiveScreenWidth(50),
    height: responsiveScreenHeight(20),
    resizeMode: 'contain',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: responsiveScreenFontSize(1.9),
    color: '#444',
    marginBottom: 8,
  },
});
