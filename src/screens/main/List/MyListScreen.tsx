import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Alert,
  Share as RNShare,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
} from 'react-native-draggable-flatlist';

import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import Loader from '../../../components/ui/Loader/Loader';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import {
  useGetListsQuery,
  useReorderListItemsMutation,
  useGetUserProfileQuery,
} from '../../../features/auth/authApi';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ─────────────────────────────────────────────
   BADGE helpers
───────────────────────────────────────────── */
const STATUS_COLORS = {
  published: { bg: '#D1FAE5', text: '#065F46' },
  draft: { bg: '#FEF3C7', text: '#92400E' },
  default: { bg: '#F3F4F6', text: '#374151' },
};

const VISIBILITY_COLORS = {
  public: { bg: '#DBEAFE', text: '#1E40AF' },
  private: { bg: '#F3E8FF', text: '#6B21A8' },
  default: { bg: '#F3F4F6', text: '#374151' },
};

const Badge = ({ label, colorMap }) => {
  const scheme = colorMap[label?.toLowerCase()] || colorMap.default;
  return (
    <View style={[styles.badge, { backgroundColor: scheme.bg }]}>
      <Text style={[styles.badgeText, { color: scheme.text }]}>
        {label?.charAt(0).toUpperCase() + label?.slice(1)}
      </Text>
    </View>
  );
};

/* ─────────────────────────────────────────────
   DRAGGABLE ITEMS LIST - COMPLETE FIX
───────────────────────────────────────────── */
const DraggableItemsList = ({
  listId,
  initialItems,
  userId,
  refetch,
  onDragStateChange,
}) => {
  const [items, setItems] = useState([]);
  const [reorderItems, { isLoading: isReordering }] =
    useReorderListItemsMutation();
  const flatListRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  /* ── CRITICAL FIX: Get user position from user_positions JSON ── */
  const getUserPosition = useCallback(
    item => {
      try {
        console.log(`\n🔍 [Item ${item.id}] Getting user position...`);
        console.log(`   Raw user_positions:`, item.user_positions);
        console.log(`   Type: ${typeof item.user_positions}`);

        if (!item?.user_positions) {
          console.log(`   ❌ No user_positions field`);
          return 999;
        }

        // Parse the JSON string - IMPORTANT: Handle if it's already parsed
        let parsed;
        if (typeof item.user_positions === 'string') {
          console.log(`   📝 Parsing JSON string...`);
          parsed = JSON.parse(item.user_positions);
        } else if (typeof item.user_positions === 'object') {
          console.log(`   📝 Already an object`);
          parsed = item.user_positions;
        } else {
          console.log(`   ❌ Unexpected type: ${typeof item.user_positions}`);
          return 999;
        }

        console.log(`   📊 Parsed object:`, parsed);

        // Try to get position with different key formats
        const userIdStr = String(userId);
        const userIdNum = Number(userId);

        let position = parsed[userIdStr];
        if (position === undefined) {
          position = parsed[userIdNum];
        }
        if (position === undefined) {
          // Try all keys to see what's available
          const keys = Object.keys(parsed);
          console.log(`   🔑 Available keys:`, keys);
          if (keys.length > 0) {
            position = parsed[keys[0]];
            console.log(
              `   📌 Using first available key: ${keys[0]} = ${position}`,
            );
          }
        }

        console.log(`   ✅ Final position: ${position}`);

        if (position === undefined || position === null) {
          console.log(`   ⚠️ No position found`);
          return 999;
        }

        return Number(position);
      } catch (error) {
        console.error(`❌ Error parsing for item ${item.id}:`, error);
        return 999;
      }
    },
    [userId],
  );

  /* ── Sort items by user position (ascending - lower number comes first) ── */
  const sortItemsByUserPosition = useCallback(
    itemsToSort => {
      if (!Array.isArray(itemsToSort) || itemsToSort.length === 0) {
        return [];
      }

      console.log(`\n🔍 ===== SORTING ITEMS FOR LIST ${listId} =====`);
      console.log(`User ID: ${userId}`);

      const sorted = [...itemsToSort].sort((a, b) => {
        const posA = getUserPosition(a);
        const posB = getUserPosition(b);

        console.log(
          `   Compare: Item ${a.id} (pos: ${posA}) vs Item ${b.id} (pos: ${posB})`,
        );

        if (posA !== posB) {
          return posA - posB;
        }

        return (a.id || 0) - (b.id || 0);
      });

      console.log('\n✅ Sorted result:');
      sorted.forEach((item, idx) => {
        const pos = getUserPosition(item);
        console.log(
          `   ${idx + 1}. Item ID ${item.id}: "${item.catalog_item?.name || item.custom_item_name
          }" - Position: ${pos}`,
        );
      });
      console.log('');

      return sorted;
    },
    [getUserPosition, listId, userId],
  );

  /* ── Initialize items from GET API (always sort by user_positions) ── */
  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      setItems([]);
      return;
    }

    console.log(`\n🔄 ===== INITIALIZING LIST ${listId} =====`);
    console.log(`User ID: ${userId}`);
    console.log('Raw items count:', initialItems.length);

    // Log raw items
    initialItems.forEach(item => {
      console.log(`\n📦 Item ${item.id}:`);
      console.log(
        `   Name: ${item.catalog_item?.name || item.custom_item_name}`,
      );
      console.log(`   user_positions raw:`, item.user_positions);
      console.log(`   user_positions type: ${typeof item.user_positions}`);
    });

    // Sort items by user position from GET API
    const sortedItems = sortItemsByUserPosition(initialItems);
    setItems(sortedItems);
  }, [initialItems, listId, userId, sortItemsByUserPosition]);

  /* ── Drag handlers ── */
  const handleDragBegin = useCallback(() => {
    setIsDragging(true);
    onDragStateChange?.(true);
    console.log('🎯 Drag started');
  }, [onDragStateChange]);

  const handleDragEnd = useCallback(
    async ({ data, from, to }) => {
      console.log(`\n🏁 Drag ended - From index: ${from}, To index: ${to}`);

      setIsDragging(false);
      onDragStateChange?.(false);

      if (!data || data.length === 0) return;

      if (from === to) {
        console.log('⚠️ No position change detected');
        return;
      }

      const previousItems = [...items];

      // Update UI immediately
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setItems(data);

      // Prepare payload
      const itemsPayload = data.map((item, index) => ({
        id: Number(item.id),
        position: index + 1,
      }));

      console.log(
        '🚀 Sending reorder payload:',
        JSON.stringify(itemsPayload, null, 2),
      );

      try {
        const result = await reorderItems({
          listId: Number(listId),
          items: itemsPayload,
        }).unwrap();

        console.log('✅ Reorder API success:', result);

        // Refetch
        console.log('📡 Refetching lists...');
        await refetch();
        console.log('✅ Refetch completed!');
      } catch (error) {
        console.error('❌ Reorder failed:', error);

        Alert.alert(
          'Reorder Failed',
          error?.data?.message || error?.message || 'Failed to reorder items',
        );

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setItems(previousItems);
      }
    },
    [items, listId, reorderItems, refetch, onDragStateChange],
  );

  if (!items || items.length === 0) {
    return (
      <View style={styles.noItemsContainer}>
        <Text style={styles.noItemsText}>No items in this list</Text>
      </View>
    );
  }

  return (
    <View style={styles.draggableListContainer}>
      {isReordering && (
        <View style={styles.reorderingBar}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.reorderingText}>Saving order...</Text>
        </View>
      )}

      <NestableDraggableFlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item, index) => `item-${item.id}-${index}`}
        renderItem={({ item, drag, isActive, getIndex }) => {
          const index = getIndex?.() ?? 0;
          const userPosition = getUserPosition(item);

          const imageUrl = item.catalog_item?.image_url || null;
          const itemName =
            item.catalog_item?.name || item.custom_item_name || 'Unnamed Item';
          const itemDescription = item.catalog_item?.description || null;

          return (
            <TouchableOpacity
              onLongPress={drag}
              disabled={isActive}
              activeOpacity={0.7}
              style={[
                styles.itemRow,
                isActive && styles.itemRowActive,
                isDragging && !isActive && styles.itemRowDragging,
              ]}
              delayLongPress={150}
            >
              <View style={styles.itemHandle}>
                <View style={styles.indexCircle}>
                  <Text style={styles.itemIndex}>{index + 1}</Text>
                </View>
                <View style={styles.dragHandleIcon}>
                  <Text style={styles.dragIcon}>⋮⋮</Text>
                </View>
              </View>

              <View style={styles.itemThumbnail}>
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.itemThumbPlaceholder}>
                    <Text style={styles.itemPlaceholderIcon}>📦</Text>
                  </View>
                )}
              </View>

              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {itemName}
                  </Text>
                  <View style={styles.itemIdContainer}>
                    <Text style={styles.itemIdLabel}>ID:</Text>
                    <Text style={styles.itemId}>{item.id}</Text>
                    <View
                      style={[
                        styles.positionBadge,
                        userPosition === 1
                          ? styles.positionFirst
                          : userPosition === 2
                            ? styles.positionSecond
                            : styles.positionOther,
                      ]}
                    >
                      <Text style={styles.positionBadgeText}>
                        Pos: {userPosition}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.itemBadges}>
                  {item.custom_item_name && !item.catalog_item && (
                    <View style={styles.customBadge}>
                      <Text style={styles.customBadgeText}>Custom</Text>
                    </View>
                  )}
                  {item.catalog_item && (
                    <View style={styles.catalogBadge}>
                      <Text style={styles.catalogBadgeText}>Catalog</Text>
                    </View>
                  )}
                </View>

                {item.custom_text ? (
                  <View style={styles.itemNoteContainer}>
                    <Text style={styles.noteIcon}>📝</Text>
                    <Text style={styles.itemNote} numberOfLines={2}>
                      {item.custom_text}
                    </Text>
                  </View>
                ) : (
                  itemDescription && (
                    <Text style={styles.itemDescription} numberOfLines={1}>
                      {itemDescription}
                    </Text>
                  )
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        onDragBegin={handleDragBegin}
        onDragEnd={handleDragEnd}
        activationDistance={5}
        dragHitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        autoscrollThreshold={30}
        autoscrollSpeed={200}
        containerStyle={styles.draggableContainer}
        contentContainerStyle={styles.draggableContent}
        scrollEnabled={true}
      />
    </View>
  );
};

/* ─────────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────────── */
export default function MyListScreen({ navigation }) {
  const { data, isLoading, isFetching, refetch } = useGetListsQuery();
  const { data: userProfile } = useGetUserProfileQuery();
  const userId = userProfile?.id;

  console.log('\n👤 ===== USER INFO =====');
  console.log(`User ID: ${userId}`);
  console.log(`User ID type: ${typeof userId}`);
  console.log(`Full user profile:`, userProfile);

  const [lists, setLists] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchText, setSearchText] = useState('');
  const scrollViewRef = useRef(null);
  const [isAnyDragging, setIsAnyDragging] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('\n📱 Screen focused - Refetching...');
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    const raw = Array.isArray(data) ? data : [];

    console.log('\n📡 ===== GET API RESPONSE =====');
    console.log(`Total lists: ${raw.length}`);

    if (raw.length > 0 && raw[0]?.items) {
      console.log(`\n📋 First list "${raw[0].title}" items:`);
      raw[0].items.forEach(item => {
        console.log(
          `   Item ${item.id}: ${item.catalog_item?.name || item.custom_item_name
          }`,
        );
        console.log(`      user_positions: ${item.user_positions}`);
      });
    }

    if (!raw.length) {
      setLists([]);
      return;
    }

    setLists(
      raw.map(list => ({
        ...list,
        selected: false,
        items: Array.isArray(list?.items) ? list.items : [],
      })),
    );
  }, [data]);

  const filteredLists = useMemo(() => {
    if (!searchText.trim()) return lists;
    return lists.filter(l =>
      l?.title?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, lists]);

  const toggleSelect = useCallback(id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLists(prev =>
      prev.map(l => (l.id === id ? { ...l, selected: !l.selected } : l)),
    );
  }, []);

  const toggleExpand = useCallback(id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  }, []);

  const handleShare = async list => {
    try {
      const url = list?.share_url || list?.share_link || '';
      if (!url) {
        Alert.alert('Error', 'Share link not available');
        return;
      }
      await RNShare.share({
        title: list?.title || 'My List',
        message: `Check out my list "${list?.title}"\n${url}`,
        url,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Unable to share list');
    }
  };

  const getListThumbnail = useCallback(items => {
    if (!items || items.length === 0) return null;
    const catalogItem = items.find(item => item?.catalog_item?.image_url);
    return catalogItem?.catalog_item?.image_url || null;
  }, []);

  const handleDragStateChange = useCallback(isDragging => {
    setIsAnyDragging(isDragging);
  }, []);

  const renderListCard = useCallback(
    ({ item }) => {
      const expanded = expandedIds.includes(item.id);
      const thumbnailUrl = getListThumbnail(item.items);
      const itemCount = item.items?.length || 0;
      const totalSize = Number(item.list_size) || 0;

      return (
        <View style={[styles.card, item.selected && styles.cardActive]}>
          <Pressable
            onPress={() => toggleSelect(item.id)}
            style={styles.cardTop}
          >
            <View style={styles.cardThumb}>
              {thumbnailUrl ? (
                <Image
                  source={{ uri: thumbnailUrl }}
                  style={styles.cardThumbImg}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.cardThumbEmpty}>
                  <Text style={styles.emptyThumbIcon}>📋</Text>
                </View>
              )}
              {item.is_group && (
                <View style={styles.groupBadge}>
                  <Text style={styles.groupBadgeText}>👥 Group</Text>
                </View>
              )}
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {totalSize > 0 && itemCount >= totalSize && (
                  <View style={styles.completeBadge}>
                    <Text style={styles.completeBadgeText}>✓ Complete</Text>
                  </View>
                )}
              </View>

              <View style={styles.badgeRow}>
                <Badge label={item.status} colorMap={STATUS_COLORS} />
                <Badge label={item.visibility} colorMap={VISIBILITY_COLORS} />
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width:
                          totalSize > 0
                            ? `${Math.min((itemCount / totalSize) * 100, 100)}%`
                            : '0%',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {itemCount}/{totalSize} items
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaPill}>📁 Cat {item.category_id}</Text>
                {item.sub_category_id && (
                  <Text style={styles.metaPill}>🔖 {item.sub_category_id}</Text>
                )}
              </View>

              <Text style={styles.cardDate}>
                📅{' '}
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  : ''}
              </Text>
            </View>

            <Pressable
              onPress={() => handleShare(item)}
              style={styles.shareBtn}
              hitSlop={8}
            >
              <Image
                source={require('../../../../assets/image/unfillshare.png')}
                style={styles.shareIcon}
              />
            </Pressable>
          </Pressable>

          <Pressable
            onPress={() => toggleExpand(item.id)}
            style={styles.expandRow}
          >
            <View style={styles.expandContent}>
              <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
              <Text style={styles.expandLabel}>
                {expanded
                  ? 'Hide items'
                  : `Show ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              </Text>
              {!expanded && itemCount > 0 && (
                <View style={styles.itemCountBadge}>
                  <Text style={styles.itemCountText}>{itemCount}</Text>
                </View>
              )}
            </View>
          </Pressable>

          {expanded && (
            <View style={styles.itemsWrapper}>
              <View style={styles.itemsHeader}>
                <Text style={styles.itemsHeaderTitle}>List Items</Text>
                <Text style={styles.itemsHeaderSubtitle}>
                  Long press ⋮⋮ to reorder
                </Text>
              </View>
              <DraggableItemsList
                listId={item.id}
                initialItems={item.items}
                userId={userId}
                refetch={refetch}
                onDragStateChange={handleDragStateChange}
              />
            </View>
          )}
        </View>
      );
    },
    [
      expandedIds,
      toggleSelect,
      toggleExpand,
      userId,
      getListThumbnail,
      handleDragStateChange,
      refetch,
    ],
  );

  return (
    <>
      <Loader visible={(isLoading || isFetching) && !lists.length} />

      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#1A2B3C' }} />

        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Image
                source={require('../../../../assets/image/left-icon.png')}
                style={styles.backIcon}
              />
            </Pressable>

            <View>
              <Text style={styles.headerTitle}>My Lists</Text>
              <Text style={styles.headerSubtitle}>
                {filteredLists.length} list
                {filteredLists.length !== 1 ? 's' : ''}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => navigation.navigate('Create')}
            >
              <Text style={styles.createBtnText}>+ New</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrap}>
            <SearchBar
              inputStyle={{ color: '#fff', fontWeight: '600' }}
              placeholder="Search lists..."
              placeholderTextColor="#94A3B8"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <NestableScrollContainer
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          scrollEnabled={!isAnyDragging}
          nestedScrollEnabled={true}
          bounces={false}
        >
          {!isLoading && filteredLists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../../../assets/image/notificationnotfount.jpg')}
                style={styles.emptyImg}
              />
              <Text style={styles.emptyTitle}>No lists found</Text>
              <Text style={styles.emptySubtitle}>
                {searchText
                  ? 'Try a different search term'
                  : 'Create your first list to get started'}
              </Text>
              {!searchText && (
                <TouchableOpacity
                  style={styles.emptyCreateBtn}
                  onPress={() => navigation.navigate('Create')}
                >
                  <Text style={styles.emptyCreateText}>Create List</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredLists.map(item => (
              <View key={String(item.id)}>{renderListCard({ item })}</View>
            ))
          )}
        </NestableScrollContainer>
      </SafeAreaProvider>
    </>
  );
}

/* ─────────────────────────────────────────────
   STYLES - UPDATED
───────────────────────────────────────────── */
export const styles = StyleSheet.create({
  /* Header */
  header: {
    backgroundColor: '#1A2B3C',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(1.5),
    paddingBottom: responsiveScreenHeight(2.2),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: responsiveScreenFontSize(2.4),
    color: '#F8FAFC',
    fontFamily: 'Quicksand-Bold',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: responsiveScreenFontSize(1.5),
    color: '#94A3B8',
    fontFamily: 'Quicksand-Regular',
    marginTop: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { width: 18, height: 18, tintColor: '#fff' },
  createBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createBtnText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(1.7),
  },
  searchWrap: { marginTop: responsiveScreenHeight(1.8) },

  /* List content */
  listContent: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(12),
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#1A2B3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: '#3B82F6',
    borderWidth: 1.5,
    backgroundColor: '#F8FBFF',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: responsiveScreenHeight(2),
  },
  cardThumb: {
    width: responsiveScreenWidth(17),
    height: responsiveScreenHeight(8.5),
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginRight: 14,
    position: 'relative',
  },
  cardThumbImg: { width: '100%', height: '100%' },
  cardThumbEmpty: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyThumbIcon: { fontSize: responsiveScreenFontSize(3) },
  groupBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: '#1A2B3C',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  groupBadgeText: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(1.2),
    fontFamily: 'Quicksand-Bold',
  },
  cardInfo: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'Quicksand-Bold',
    color: '#0F172A',
    flex: 1,
  },
  completeBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  completeBadgeText: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(1.2),
    fontFamily: 'Quicksand-Bold',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: {
    fontSize: responsiveScreenFontSize(1.4),
    fontFamily: 'Quicksand-Bold',
  },
  progressContainer: { marginBottom: 8 },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: responsiveScreenFontSize(1.2),
    color: '#6B7280',
    fontFamily: 'Quicksand-Regular',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 5,
  },
  metaPill: {
    fontSize: responsiveScreenFontSize(1.3),
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    fontFamily: 'Quicksand-SemiBold',
  },
  cardDate: {
    fontSize: responsiveScreenFontSize(1.3),
    color: '#94A3B8',
    fontFamily: 'Quicksand-Regular',
    marginTop: 2,
  },
  shareBtn: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 12,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  shareIcon: { width: 18, height: 18, tintColor: '#1A2B3C' },
  expandRow: {
    marginHorizontal: responsiveScreenHeight(2),
    paddingVertical: responsiveScreenHeight(1.2),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  expandContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandIcon: { fontSize: responsiveScreenFontSize(1.6), color: '#3B82F6' },
  expandLabel: {
    color: '#3B82F6',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(1.5),
  },
  itemCountBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  itemCountText: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(1.2),
    fontFamily: 'Quicksand-Bold',
  },

  /* Items wrapper */
  itemsWrapper: {
    paddingHorizontal: responsiveScreenWidth(3),
    paddingBottom: responsiveScreenHeight(1.5),
    paddingTop: responsiveScreenHeight(1.2),
    backgroundColor: '#FAFBFD',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  itemsHeaderTitle: {
    fontSize: responsiveScreenFontSize(1.6),
    fontFamily: 'Quicksand-Bold',
    color: '#1F2937',
  },
  itemsHeaderSubtitle: {
    fontSize: responsiveScreenFontSize(1.2),
    color: '#9CA3AF',
    fontFamily: 'Quicksand-Regular',
  },
  draggableListContainer: { flex: 1, minHeight: 100 },
  draggableContainer: { flex: 1 },
  draggableContent: { paddingBottom: 8 },

  /* Reordering bar */
  reorderingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 7,
    marginBottom: 8,
  },
  reorderingText: {
    fontSize: responsiveScreenFontSize(1.5),
    color: '#3B82F6',
    fontFamily: 'Quicksand-SemiBold',
  },

  /* Draggable item row */
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: responsiveScreenHeight(1.2),
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemRowActive: {
    backgroundColor: '#F8FBFF',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.15,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  itemRowDragging: { opacity: 0.9 },
  itemHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  indexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  itemIndex: {
    fontSize: responsiveScreenFontSize(1.4),
    fontFamily: 'Quicksand-Bold',
    color: '#6B7280',
  },
  dragHandleIcon: { padding: 4 },
  dragIcon: { fontSize: 20, color: '#9CA3AF' },
  itemThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: { width: '100%', height: '100%' },
  itemThumbPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPlaceholderIcon: { fontSize: responsiveScreenFontSize(2.2) },
  itemContent: { flex: 1 },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  itemName: {
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'Quicksand-SemiBold',
    color: '#111827',
    flex: 1,
  },
  itemIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemIdLabel: {
    fontSize: responsiveScreenFontSize(1.1),
    fontFamily: 'Quicksand-Regular',
    color: '#9CA3AF',
  },
  itemId: {
    fontSize: responsiveScreenFontSize(1.2),
    fontFamily: 'Quicksand-Bold',
    color: '#3B82F6',
  },
  positionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  positionFirst: {
    backgroundColor: '#10B981',
  },
  positionSecond: {
    backgroundColor: '#3B82F6',
  },
  positionOther: {
    backgroundColor: '#E5E7EB',
  },
  positionBadgeText: {
    fontSize: responsiveScreenFontSize(1),
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
  },
  itemBadges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  customBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  customBadgeText: {
    fontSize: responsiveScreenFontSize(1),
    color: '#D97706',
    fontFamily: 'Quicksand-Bold',
  },
  catalogBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  catalogBadgeText: {
    fontSize: responsiveScreenFontSize(1),
    color: '#1E40AF',
    fontFamily: 'Quicksand-Bold',
  },
  itemNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    gap: 4,
  },
  noteIcon: { fontSize: responsiveScreenFontSize(1.3) },
  itemNote: {
    fontSize: responsiveScreenFontSize(1.3),
    color: '#6B7280',
    fontFamily: 'Quicksand-Regular',
    flex: 1,
    lineHeight: 16,
  },
  itemDescription: {
    fontSize: responsiveScreenFontSize(1.2),
    color: '#9CA3AF',
    fontFamily: 'Quicksand-Regular',
    marginTop: 2,
  },
  noItemsContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noItemsText: {
    color: '#9CA3AF',
    fontSize: responsiveScreenFontSize(1.5),
    fontFamily: 'Quicksand-Regular',
  },

  /* Empty state */
  emptyContainer: {
    alignItems: 'center',
    paddingTop: responsiveScreenHeight(6),
    paddingHorizontal: responsiveScreenWidth(8),
  },
  emptyImg: {
    width: responsiveScreenWidth(55),
    height: responsiveScreenHeight(22),
    resizeMode: 'contain',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: responsiveScreenFontSize(2.2),
    fontFamily: 'Quicksand-Bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'Quicksand-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyCreateBtn: {
    backgroundColor: '#1A2B3C',
    paddingHorizontal: responsiveScreenWidth(12),
    paddingVertical: responsiveScreenHeight(1.6),
    borderRadius: 30,
    shadowColor: '#1A2B3C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyCreateText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(1.9),
  },

});
