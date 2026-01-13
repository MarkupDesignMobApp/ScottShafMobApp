import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  Share as RNShare,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { styles as Homestyle } from '../home/styles';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import { useGetMyPublishedListsQuery } from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';
import { useFocusEffect } from '@react-navigation/native';

export default function MyListScreen({ navigation }) {
  /* ================= API ================= */
  const { data: rawData, isLoading , refetch} = useGetMyPublishedListsQuery();
  const listsFromApi = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
    ? rawData
    : [];

  const [lists, setLists] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const isAdding = false;

 useFocusEffect(
    React.useCallback(() => {
      refetch();
      return () => {
      };
    }, [refetch])
  );

  useEffect(() => {
    if (listsFromApi && Array.isArray(listsFromApi)) {
      setLists(
        listsFromApi.map(list => ({
          ...list,
          selected: false,
        })),
      );
    } else {
      setLists([]);
    }
  }, [listsFromApi]);

  /* ================= ACTIONS ================= */
  const toggleSelectList = id => {
    setLists(prev => prev.map(l => (l.id === id ? { ...l, selected: !l.selected } : l)));
  };

  const toggleExpand = id => {
    setExpandedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleShareList = async list => {
    try {
      const shareUrl = list?.share_url ?? list?.shareUrl ?? null; 
      const title = list?.title ?? 'Untitled List';

      if (!shareUrl) {
        Alert.alert('Error', 'Share link not available');
        return;
      }
      const message = `I just published my list "${title}". Check it out here: ${shareUrl}`;

      await RNShare.share({
        title: `Check out my list: ${title}`,
        message,
        url: shareUrl,
      });
    } catch (error) {
      console.warn('Share error:', error);
      Alert.alert('Error', 'Unable to open share dialog');
    }
  };

  const handleCreateList = () => {
    navigation.navigate('Create');
  };

  /* ================= RENDERERS ================= */
  const renderItemRow = item => {
    if (!item) return null;

    const catalog = item.catalog_item ?? null;
    const imageUrl = catalog?.image_url ?? null;
    const name = catalog?.name ?? item.custom_item_name ?? 'Unnamed';
    const desc = catalog?.description ?? item.custom_text ?? '';

    return (
      <View key={String(item.id ?? `${Math.random()}`)} style={styles.itemRow}>
        <View style={styles.itemLeft}>
          <View style={styles.itemImage}>
            {imageUrl ? (
              <Image
                resizeMode="cover"
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <View style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', borderRadius: 8 }} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {desc}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderListCard = ({ item: list }) => {
    if (!list) return null;

    const firstImage =
      Array.isArray(list.items) && list.items.length
        ? (list.items.find(it => it?.catalog_item && it?.catalog_item?.image_url)?.catalog_item?.image_url ?? null)
        : null;

    const expanded = expandedIds.includes(list.id);

    return (
      <View key={String(list.id)} style={[styles.card, list.selected && styles.cardActive]}>
        {/* top row: left = tappable card info, right = share icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => toggleSelectList(list.id)}
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 }}
          >
            <View style={styles.image}>
              {firstImage ? (
                <Image resizeMode="cover" source={{ uri: firstImage }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <View style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', borderRadius: 8 }} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{list.title ?? 'Untitled List'}</Text>
              <Text style={styles.desc}>
                {Array.isArray(list.items) ? `${list.items.length} items` : '0 items'} •{' '}
                {new Date(list.created_at ?? list.updated_at ?? Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>

          {/* Share icon aligned to the right of the card */}
          <Pressable onPress={() => handleShareList(list)} style={styles.shareListBtn}>
            <Image
              source={require('../../../../assets/image/unfillshare.png')}
              resizeMode="contain"
              style={styles.shareListIcon}
            />
          </Pressable>
        </View>

        {/* footer with expand button */}
        <View style={styles.cardFooter}>
          <Pressable onPress={() => toggleExpand(list.id)} style={styles.expandBtn}>
            <Text style={styles.expandText}>{expanded ? 'Hide items' : 'Show items'}</Text>
          </Pressable>
        </View>

        {expanded && (
          <View style={styles.itemsContainer}>
            {Array.isArray(list.items) && list.items.length ? (
              list.items.map(it => renderItemRow(it))
            ) : (
              <Text style={{ padding: 12, color: '#666' }}>No items in this list.</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Loader color="blue" visible={isLoading || isAdding} />
      <SafeAreaProvider>
        <StatusBar backgroundColor="#00C4FA" barStyle="light-content" />
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#00C4FA' }} />

        <View style={styles.header2}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backarrow}>
              <Image
                tintColor={'#fff'}
                resizeMode="contain"
                style={styles.img}
                source={require('../../../../assets/image/left-icon.png')}
              />
            </Pressable>

            <Text style={styles.headerTitle}>My List</Text>
            <View />
          </View>

          <View style={styles.serchmaincontainer}>
            <SearchBar placeholder="Search items..." />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ ...Homestyle.scrollcontainer, paddingTop: responsiveScreenHeight(2.25) }}
          >
            {/* Category chips - if you want, map categories here */}
          </ScrollView>
        </View>

        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <FlatList
            data={lists}
            keyExtractor={item => String(item.id ?? `${Math.random()}`)}
            renderItem={renderListCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: responsiveScreenWidth(4),
              paddingTop: responsiveScreenHeight(2),
            }}
            ListEmptyComponent={
              !isLoading && (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Image source={require('../../../../assets/image/notificationnotfount.jpg')} style={styles.emptyImg} />
                  <Text style={styles.emptyText}>No lists found</Text>

                  <TouchableOpacity style={styles.nextBtnLarge} onPress={handleCreateList}>
                    <Text style={styles.nextText}>Create List</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          />
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
