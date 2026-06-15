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
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal,
  TextInput,
  Switch,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
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
  useCloneListMutation,
  useDeleteListMutation,
  useLazyShareListQuery,
  useUpdateListMutation,
} from '../../../features/auth/authApi';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ------------------- Helper: detect cloned list -------------------
function isClonedList(apiItem: any): boolean {
  const title = String(apiItem?.title ?? '').toLowerCase();
  return Boolean(
    apiItem?.is_clone ||
    apiItem?.is_cloned ||
    apiItem?.cloned ||
    apiItem?.parent_id ||
    apiItem?.parent_list_id ||
    apiItem?.original_list_id ||
    apiItem?.copied_from_list_id ||
    apiItem?.clone_of ||
    apiItem?.source_list_id ||
    apiItem?.from_list_id ||
    title.includes('(copy)') ||
    title.endsWith(' copy') ||
    title.includes('copy'),
  );
}

// ------------------- Badge helpers -------------------
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

// ------------------- DraggableItemsList -------------------
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

  const getUserPosition = useCallback(
    item => {
      try {
        if (!item?.user_positions) return 999;
        let parsed =
          typeof item.user_positions === 'string'
            ? JSON.parse(item.user_positions)
            : item.user_positions;
        const userIdStr = String(userId);
        const userIdNum = Number(userId);
        let position = parsed[userIdStr];
        if (position === undefined) position = parsed[userIdNum];
        if (position === undefined) {
          const keys = Object.keys(parsed);
          if (keys.length > 0) position = parsed[keys[0]];
        }
        return position !== undefined && position !== null
          ? Number(position)
          : 999;
      } catch {
        return 999;
      }
    },
    [userId],
  );

  const sortItemsByUserPosition = useCallback(
    itemsToSort => {
      if (!itemsToSort.length) return [];
      return [...itemsToSort].sort((a, b) => {
        const posA = getUserPosition(a);
        const posB = getUserPosition(b);
        if (posA !== posB) return posA - posB;
        return (a.id || 0) - (b.id || 0);
      });
    },
    [getUserPosition],
  );

  useEffect(() => {
    if (!initialItems?.length) {
      setItems([]);
      return;
    }
    setItems(sortItemsByUserPosition(initialItems));
  }, [initialItems, sortItemsByUserPosition]);

  const handleDragBegin = useCallback(() => {
    setIsDragging(true);
    onDragStateChange?.(true);
  }, [onDragStateChange]);

  const handleDragEnd = useCallback(
    async ({ data, from, to }) => {
      setIsDragging(false);
      onDragStateChange?.(false);
      if (from === to) return;
      const previousItems = [...items];
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setItems(data);
      const itemsPayload = data.map((item, idx) => ({
        id: Number(item.id),
        position: idx + 1,
      }));
      try {
        await reorderItems({
          listId: Number(listId),
          items: itemsPayload,
        }).unwrap();
        await refetch();
      } catch (error) {
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

  if (!items?.length) {
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

// ------------------- MAIN SCREEN -------------------
export default function MyListScreen({ navigation }) {
  const { data, isLoading, isFetching, refetch } = useGetListsQuery();
  const { data: userProfile } = useGetUserProfileQuery();
  const userId = userProfile?.id;
  const [cloneList, { isLoading: cloneLoading }] = useCloneListMutation();
  const [deleteList] = useDeleteListMutation();
  const [getShareLink] = useLazyShareListQuery();
  const [updateList, { isLoading: isUpdating }] = useUpdateListMutation();

  const [lists, setLists] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'original' | 'cloned'>('original');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuLayout, setMenuLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const scrollViewRef = useRef(null);
  const [isAnyDragging, setIsAnyDragging] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const actionBtnRefs = useRef<Record<string, View | null>>({});

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingList, setEditingList] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editListSize, setEditListSize] = useState('');
  const [editIsGroup, setEditIsGroup] = useState(false);

  const closeMenu = useCallback(() => {
    setOpenMenuId(null);
    setMenuLayout(null);
  }, []);

  const openDotsMenu = useCallback(
    (item: any) => {
      if (openMenuId === item.id) {
        closeMenu();
        return;
      }

      const node = actionBtnRefs.current[String(item.id)];

      if (node?.measureInWindow) {
        node.measureInWindow((x, y, width, height) => {
          setMenuLayout({ x, y, width, height });
          setOpenMenuId(item.id);
        });
      } else {
        setMenuLayout({ x: 0, y: 0, width: 0, height: 0 });
        setOpenMenuId(item.id);
      }
    },
    [openMenuId, closeMenu],
  );

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

  const menuPositionStyle = useMemo(() => {
    if (!menuLayout) return { top: 0, left: 0 };
    const menuWidth = 155;
    const left = Math.max(
      12,
      Math.min(
        menuLayout.x + menuLayout.width - menuWidth,
        SCREEN_WIDTH - menuWidth - 12,
      ),
    );
    const top = Math.min(
      menuLayout.y + menuLayout.height + 8,
      SCREEN_HEIGHT - 220,
    );
    return { top, left };
  }, [menuLayout, SCREEN_HEIGHT, SCREEN_WIDTH]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    const raw = Array.isArray(data) ? data : [];
    if (!raw.length) {
      setLists([]);
      return;
    }

    const mapped = raw.map(list => {
      const isCloned = isClonedList(list);
      return {
        ...list,
        selected: false,
        items: Array.isArray(list?.items) ? list.items : [],
        isCloned,
        canClone: !isCloned,
      };
    });
    setLists(mapped);
  }, [data]);

  const originalLists = useMemo(
    () => lists.filter(item => !item.isCloned),
    [lists],
  );
  const clonedLists = useMemo(
    () => lists.filter(item => item.isCloned),
    [lists],
  );

  const filteredOriginal = useMemo(() => {
    if (!searchText.trim()) return originalLists;
    return originalLists.filter(l =>
      l?.title?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, originalLists]);

  const filteredCloned = useMemo(() => {
    if (!searchText.trim()) return clonedLists;
    return clonedLists.filter(l =>
      l?.title?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, clonedLists]);

  const visibleLists =
    activeTab === 'original' ? filteredOriginal : filteredCloned;
  const visibleCount = visibleLists.length;

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

  const openEditModal = list => {
    setEditingList(list);
    setEditTitle(list.title || '');
    setEditCategoryId(String(list.category_id || ''));
    setEditListSize(String(list.list_size || ''));
    setEditIsGroup(
      list.is_group === true || list.is_group === 'true' || list.is_group === 1,
    );
    setEditModalVisible(true);
    closeMenu();
  };

  const handleUpdateSubmit = async () => {
    Keyboard.dismiss();

    if (!editTitle.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    const parsedCategoryId = parseInt(editCategoryId, 10);
    const parsedListSize = parseInt(editListSize, 10);
    if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
      Alert.alert('Error', 'Valid Category ID is required');
      return;
    }
    if (isNaN(parsedListSize) || parsedListSize < 0) {
      Alert.alert('Error', 'Valid List Size is required');
      return;
    }

    const payload = {
      title: editTitle.trim(),
      category_id: parsedCategoryId,
      list_size: parsedListSize,
      is_group: editIsGroup,
    };

    try {
      await updateList({ listId: editingList.id, data: payload }).unwrap();
      Alert.alert('Success', 'List updated successfully');
      setEditModalVisible(false);
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to update list');
    }
  };

  const handleDelete = async list => {
    closeMenu();
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoadingId(list.id);
            try {
              await deleteList(list.id).unwrap();
              await refetch();
              Alert.alert('Success', 'List deleted successfully');
            } catch (error: any) {
              Alert.alert(
                'Error',
                error?.data?.message || 'Failed to delete list',
              );
            } finally {
              setActionLoadingId(null);
            }
          },
        },
      ],
    );
  };

  const handleShare = async list => {
    closeMenu();
    setActionLoadingId(list.id);
    try {
      const res = await getShareLink(list.id).unwrap();
      const shareUrl =
        res?.share_url || res?.share_link || res?.data?.share_link;
      if (!shareUrl) {
        Alert.alert('Error', 'Share link not available');
        return;
      }
      await RNShare.share({
        title: list.title,
        message: `Check out my list "${list.title}"\n${shareUrl}`,
        url: shareUrl,
      });
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to get share link');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleClone = async list => {
    closeMenu();
    if (!list.canClone) {
      Alert.alert('Not allowed', 'You can only clone original lists.');
      return;
    }
    setActionLoadingId(list.id);
    try {
      const res = await cloneList(list.id).unwrap();
      Alert.alert('Success', `${res.title || 'List'} cloned successfully`);
      await refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to clone list');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getListThumbnail = useCallback(items => {
    if (!items?.length) return null;
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
      const isActionLoading = actionLoadingId === item.id;

      return (
        <View style={[styles.card, item.selected && styles.cardActive]}>
          <Pressable
            onPress={() => {
              toggleSelect(item.id);
              closeMenu();
            }}
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

            <View style={styles.cardActions}>
              <View
                ref={el => {
                  actionBtnRefs.current[String(item.id)] = el;
                }}
                collapsable={false}
              >
                <Pressable
                  onPress={() => openDotsMenu(item)}
                  style={styles.actionIconBtn}
                  hitSlop={8}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <ActivityIndicator size="small" color="#1A2B3C" />
                  ) : (
                    <Image
                      source={require('../../../../assets/image/dots.png')}
                      style={styles.actionIcon}
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              toggleExpand(item.id);
              closeMenu();
            }}
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
      actionLoadingId,
      openDotsMenu,
      closeMenu,
    ],
  );

  const isMenuVisible = Boolean(openMenuId);

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
                {visibleCount}{' '}
                {activeTab === 'original' ? 'original' : 'cloned'} list
                {visibleCount !== 1 ? 's' : ''}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => navigation.navigate('Create')}
            >
              <Text style={styles.createBtnText}>+ New</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'original' && styles.tabButtonActive,
              ]}
              onPress={() => {
                setActiveTab('original');
                closeMenu();
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'original' && styles.tabTextActive,
                ]}
              >
                My Lists ({originalLists.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'cloned' && styles.tabButtonActive,
              ]}
              onPress={() => {
                setActiveTab('cloned');
                closeMenu();
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'cloned' && styles.tabTextActive,
                ]}
              >
                Cloned ({clonedLists.length})
              </Text>
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
          {!isLoading && visibleLists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../../../assets/image/notificationnotfount.jpg')}
                style={styles.emptyImg}
              />
              <Text style={styles.emptyTitle}>
                No {activeTab === 'original' ? 'original' : 'cloned'} lists
                found
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchText
                  ? 'Try a different search term'
                  : activeTab === 'original'
                    ? 'Create your first list to get started'
                    : 'Clone an original list to see it here'}
              </Text>
              {!searchText && activeTab === 'original' && (
                <TouchableOpacity
                  style={styles.emptyCreateBtn}
                  onPress={() => navigation.navigate('Create')}
                >
                  <Text style={styles.emptyCreateText}>Create List</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            visibleLists.map(item => (
              <View key={String(item.id)}>{renderListCard({ item })}</View>
            ))
          )}
        </NestableScrollContainer>
      </SafeAreaProvider>

      {/* Dots menu modal */}
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={styles.menuBackdropContainer}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closeMenu} />
          {menuLayout && (
            <View style={[styles.floatingMenu, menuPositionStyle]}>
              <Pressable
                style={styles.optionMenuItem}
                onPress={() => {
                  const currentItem = lists.find(l => l.id === openMenuId);
                  if (currentItem) handleShare(currentItem);
                  else closeMenu();
                }}
              >
                <Text style={styles.optionMenuText}>Share</Text>
              </Pressable>

              <Pressable
                style={styles.optionMenuItem}
                onPress={() => {
                  const currentItem = lists.find(l => l.id === openMenuId);
                  if (currentItem) openEditModal(currentItem);
                  else closeMenu();
                }}
              >
                <Text style={styles.optionMenuText}>Edit</Text>
              </Pressable>

              {lists.find(l => l.id === openMenuId)?.canClone &&
                activeTab === 'original' && (
                  <Pressable
                    style={styles.optionMenuItem}
                    onPress={() => {
                      const currentItem = lists.find(l => l.id === openMenuId);
                      if (currentItem) handleClone(currentItem);
                      else closeMenu();
                    }}
                  >
                    <Text style={styles.optionMenuText}>Clone</Text>
                  </Pressable>
                )}

              <Pressable
                style={styles.optionMenuItem}
                onPress={() => {
                  const currentItem = lists.find(l => l.id === openMenuId);
                  if (currentItem) handleDelete(currentItem);
                  else closeMenu();
                }}
              >
                <Text
                  style={[styles.optionMenuText, styles.optionMenuDeleteText]}
                >
                  Delete
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              style={styles.modalKeyboardWrapper}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
              <TouchableWithoutFeedback onPress={() => { }}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeaderRow}>
                    <Text style={styles.modalTitle}>Edit List</Text>
                    <Pressable
                      onPress={() => setEditModalVisible(false)}
                      style={styles.modalCloseBtn}
                      hitSlop={10}
                    >
                      <Text style={styles.modalCloseText}>✕</Text>
                    </Pressable>
                  </View>

                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modalScrollContent}
                  >
                    <Text style={styles.modalLabel}>Title</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editTitle}
                      onChangeText={setEditTitle}
                      placeholder="Enter title"
                      placeholderTextColor="#999"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />

                    <Text style={styles.modalLabel}>Category ID</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editCategoryId}
                      onChangeText={setEditCategoryId}
                      keyboardType="numeric"
                      placeholder="e.g., 5"
                      placeholderTextColor="#999"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />

                    <Text style={styles.modalLabel}>List Size</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editListSize}
                      onChangeText={setEditListSize}
                      keyboardType="numeric"
                      placeholder="Number of items"
                      placeholderTextColor="#999"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />

                    <View style={styles.modalSwitchRow}>
                      <Text style={styles.modalLabel}>Group List</Text>
                      <Switch
                        value={editIsGroup}
                        onValueChange={setEditIsGroup}
                        trackColor={{ false: '#ccc', true: '#3B82F6' }}
                      />
                    </View>

                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalCancelButton]}
                        onPress={() => setEditModalVisible(false)}
                      >
                        <Text style={styles.modalCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalUpdateButton]}
                        onPress={handleUpdateSubmit}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.modalUpdateText}>Update</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

// ------------------- STYLES -------------------
export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1A2B3C',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(1.5),
    paddingBottom: responsiveScreenHeight(1),
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
    marginBottom: responsiveScreenHeight(1.5),
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

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#2D3E4E',
    borderRadius: 14,
    padding: 4,
    marginBottom: responsiveScreenHeight(1.5),
  },
  tabButton: {
    flex: 1,
    paddingVertical: responsiveScreenHeight(0.8),
    borderRadius: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: responsiveScreenFontSize(1.6),
    fontFamily: 'Quicksand-SemiBold',
    color: '#CBD5E1',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  searchWrap: { marginBottom: responsiveScreenHeight(0.5) },

  listContent: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(12),
  },

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
    overflow: 'visible',
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
  cardActions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginLeft: 8,
    position: 'relative',
    zIndex: 20,
  },
  actionIconBtn: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    minWidth: 36,
    alignItems: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#1A2B3C',
  },

  menuBackdropContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  floatingMenu: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
    minWidth: 155,
    overflow: 'hidden',
  },
  optionMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  optionMenuText: {
    fontSize: responsiveScreenFontSize(1.5),
    fontFamily: 'Quicksand-SemiBold',
    color: '#111827',
  },
  optionMenuDeleteText: {
    color: '#DC2626',
  },

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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalKeyboardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScrollContent: {
    paddingBottom: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '700',
  },
  modalLabel: {
    fontSize: responsiveScreenFontSize(1.6),
    fontWeight: '500',
    color: '#334155',
    marginBottom: 5,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: responsiveScreenFontSize(1.6),
    backgroundColor: '#F8FAFC',
    color: '#111827',
  },
  modalSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    color: '#64748B',
    fontSize: responsiveScreenFontSize(1.6),
    fontWeight: '500',
  },
  modalUpdateButton: {
    backgroundColor: '#3B82F6',
  },
  modalUpdateText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.6),
    fontWeight: '500',
  },
});