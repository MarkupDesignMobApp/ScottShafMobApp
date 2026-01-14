import React, { useState } from 'react';
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
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { styles as Homestyle } from '../home/styles';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { useGetMyPublishedListsQuery } from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';

export default function MyListScreen({ navigation }) {
  /* ================= API ================= */
  const { data, isLoading } = useGetMyPublishedListsQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: false,
  });

  const lists = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  /* ================= UI STATE ================= */
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  /* ================= ACTIONS ================= */
  const toggleSelectList = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleShareList = async (list: any) => {
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

  const handleCreateList = () => navigation.navigate('Create');

  /* ================= RENDER ITEM ================= */
  const renderItemRow = (item: any) => {
    const catalog = item.catalog_item;
    const imageUrl = catalog?.image_url;

    return (
      <View key={item.id} style={styles.itemRow}>
        <View style={styles.itemImage}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.fullImg} />
          ) : (
            <View style={styles.placeholderImg} />
          )}
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>
            {catalog?.name ?? item.custom_item_name ?? 'Unnamed'}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {catalog?.description ?? item.custom_text ?? ''}
          </Text>
        </View>
      </View>
    );
  };

  /* ================= RENDER LIST CARD ================= */
  const renderListCard = ({ item: list }: any) => {
    const expanded = expandedIds.includes(list.id);
    const selected = selectedIds.includes(list.id);

    const firstImage =
      list.items?.find((i: any) => i?.catalog_item?.image_url)?.catalog_item
        ?.image_url ?? null;

    return (
      <View style={[styles.card, selected && styles.cardActive]}>
        {/* TOP ROW */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => toggleSelectList(list.id)}
            style={{ flexDirection: 'row', flex: 1 }}
          >
            <View style={styles.image}>
              {firstImage ? (
                <Image source={{ uri: firstImage }} style={styles.fullImg} />
              ) : (
                <View style={styles.placeholderImg} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{list.title ?? 'Untitled List'}</Text>
              <Text style={styles.desc}>
                {list.items?.length ?? 0} items •{' '}
                {new Date(list.created_at).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>

          {/* SHARE ICON */}
          <Pressable
            onPress={() => handleShareList(list)}
            style={styles.shareListBtn}
          >
            <Image
              source={require('../../../../assets/image/unfillshare.png')}
              style={styles.shareListIcon}
            />
          </Pressable>
        </View>

        {/* FOOTER */}
        <View style={styles.cardFooter}>
          <Pressable onPress={() => toggleExpand(list.id)}>
            <Text style={styles.expandText}>
              {expanded ? 'Hide items' : 'Show items'}
            </Text>
          </Pressable>
        </View>

        {/* EXPANDED ITEMS */}
        {expanded && (
          <View style={styles.itemsContainer}>
            {list.items?.length ? (
              list.items.map(renderItemRow)
            ) : (
              <Text style={{ padding: 12 }}>No items in this list</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  /* ================= UI ================= */
  return (
    <SafeAreaProvider>
      <Loader visible={isLoading} color="blue" />

      <StatusBar backgroundColor="#00C4FA" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#00C4FA' }} />

      <View style={styles.header2}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backarrow}
          >
            <Image
              tintColor="#fff"
              source={require('../../../../assets/image/left-icon.png')}
              style={styles.img}
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
        contentContainerStyle={{
          paddingHorizontal: responsiveScreenWidth(4),
          paddingTop: responsiveScreenHeight(2),
        }}
        ListEmptyComponent={
          !isLoading && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text>No lists found</Text>
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
  );
}

/* ================= STYLES ================= */
export const styles = StyleSheet.create({
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
  backarrow: {
    width: responsiveScreenHeight(4),
    height: responsiveScreenHeight(3),
  },
  img: { width: '100%', height: '100%' },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(2),
    fontWeight: '600',
  },
  serchmaincontainer: {
    paddingTop: responsiveScreenHeight(2),
  },

  card: {
    backgroundColor: '#fff',
    padding: responsiveScreenHeight(2),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1,
    borderColor: '#C5C5C5',
  },
  cardActive: {
    borderColor: '#0180FE',
    backgroundColor: '#ECF6FF',
  },

  image: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(6),
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  fullImg: { width: '100%', height: '100%' },
  placeholderImg: { flex: 1, backgroundColor: '#eee' },

  title: {
    fontSize: responsiveScreenFontSize(1.85),
    fontWeight: '500',
    color: '#000',
  },
  desc: {
    fontSize: responsiveScreenFontSize(1.7),
    color: '#777',
  },

  shareListBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  shareListIcon: {
    width: 22,
    height: 22,
    tintColor: '#0180FE',
  },

  cardFooter: {
    marginTop: 10,
  },
  expandText: {
    color: '#0180FE',
    fontWeight: '600',
  },

  itemsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },

  itemRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(6),
    borderRadius: 8,
    overflow: 'hidden',
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
  nextText: {
    color: '#fff',
    fontWeight: '600',
  },
});
