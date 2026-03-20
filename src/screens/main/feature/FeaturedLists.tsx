import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Share,
  ImageSourcePropType,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import {
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import {
  useGetFeaturedListsQuery,
  useLikeFeaturedItemMutation,
  useBookmarkFeaturedItemMutation,
  useShareFeaturedItemMutation,
} from '../../../features/auth/authApi';
import { FeaturedListSummary } from '../../../features/auth/authTypes';
import { MainStackParamList } from '../../../navigation/types/navigation';
import { formatCount } from '../../../utils/numberFormatter';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - responsiveScreenWidth(3);
const IMAGE_HEIGHT = 100;

interface FeaturedListsProps {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Feature'>;
  route: {
    params: {
      interestId?: number | null;
      initialData?: FeaturedListSummary[];
    };
  };
}

// Icons
const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  bookmarkFilled: require('../../../../assets/image/bookmark.png'),
  bookmarkOutline: require('../../../../assets/image/unfillbookmark.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
  leftIcon: require('../../../../assets/image/left-icon.png'),
  filterIcon: require('../../../../assets/image/filter.png'),
  defaultImage: require('../../../../assets/image/cofee.png'),
  searchIcon: require('../../../../assets/image/search.png'),
  emptyState: require('../../../../assets/image/notificationnotfount.jpg'),
  closeIcon: require('../../../../assets/image/close.png'),
};

export default function FeaturedLists({
  navigation,
  route,
}: FeaturedListsProps) {
  const { interestId, initialData } = route.params || {};
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allData, setAllData] = useState<FeaturedListSummary[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  const dataMapRef = useRef<Map<number, FeaturedListSummary>>(new Map());

  // Initialize data from initialData or empty array
  useEffect(() => {
    if (initialData && Array.isArray(initialData) && initialData.length > 0) {
      const newMap = new Map();
      initialData.forEach(item => {
        if (item?.id) {
          newMap.set(item.id, item);
        }
      });
      dataMapRef.current = newMap;
      setAllData(initialData);
    }
  }, [initialData]);

  const { data, refetch, isFetching, error, isSuccess } =
    useGetFeaturedListsQuery(
      {
        ...(interestId ? { interestId } : {}),
        page,
        ...(searchQuery ? { search: searchQuery } : {}),
      },
      {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      },
    );

  // Handle initial loading state
  useEffect(() => {
    if (!isFetching && isSuccess) {
      setIsInitialLoading(false);
    }
  }, [isFetching, isSuccess]);

  // Process data to maintain consistency
  useEffect(() => {
    // CRITICAL FIX: Ensure data is always a plain array
    let safeData: FeaturedListSummary[] = [];

    if (data) {
      if (Array.isArray(data)) {
        safeData = data;
      } else if (data && typeof data === 'object' && 'data' in data) {
        // Handle case where API returns { data: [...] }
        safeData = (data as any).data || [];
      } else if (data && typeof data === 'object') {
        // Try to convert object to array if possible
        safeData = Object.values(data).filter(item => item && typeof item === 'object');
      }
    }

    if (safeData.length > 0) {
      if (page === 1) {
        const newMap = new Map();
        safeData.forEach(item => {
          if (item?.id) {
            newMap.set(item.id, item);
          }
        });
        dataMapRef.current = newMap;
        setAllData(safeData);
        setHasMore(safeData.length > 0);
      } else {
        setAllData(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const existingIds = new Set(prevArray.map(item => item.id));
          const newItems = safeData.filter(item => !existingIds.has(item.id));

          newItems.forEach(item => {
            if (item?.id) {
              dataMapRef.current.set(item.id, item);
            }
          });

          return [...prevArray, ...newItems];
        });
        setHasMore(safeData.length > 0);
      }
    } else if (page === 1) {
      setAllData([]);
      dataMapRef.current.clear();
      setHasMore(false);
    }

    setLoadingMore(false);
    setRefreshing(false);
  }, [data, page]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !isFetching) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [loadingMore, hasMore, isFetching]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setSearchQuery('');
    dataMapRef.current.clear();
    refetch();
  }, [refetch]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setPage(1);
    dataMapRef.current.clear();

    if (text.trim().length > 0) {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setPage(1);
    dataMapRef.current.clear();
    setIsSearchActive(false);
  }, []);

  const handleItemUpdate = useCallback((updatedItem: FeaturedListSummary) => {
    if (updatedItem?.id) {
      dataMapRef.current.set(updatedItem.id, updatedItem);
      setAllData(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map(item => (item.id === updatedItem.id ? updatedItem : item));
      });
    }
  }, []);

  // CRITICAL FIX: Always return a plain array for FlatList
  const flatListData = useMemo(() => {
    // Start with a base empty array
    let result: FeaturedListSummary[] = [];

    // Add allData if it's an array
    if (Array.isArray(allData)) {
      result = allData;
    }

    // Apply search filter if needed
    if (searchQuery.trim() && result.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const categoryMatch = item.category?.name?.toLowerCase().includes(query);
        const interestMatch = item.category?.interest?.name?.toLowerCase().includes(query);
        return titleMatch || categoryMatch || interestMatch;
      });
    }

    // Final safety check - ensure it's a plain array
    return Array.isArray(result) ? result : [];
  }, [allData, searchQuery]);

  const renderItem = useCallback(
    ({ item, index }: { item: FeaturedListSummary; index: number }) => {
      if (!item?.id) return null;

      return (
        <Animated.View
          entering={FadeInDown.delay(index * 30)
            .springify()
            .mass(0.5)
            .damping(12)}
          style={styles.animatedContainer}
        >
          <FullRow item={item} onUpdate={handleItemUpdate} />
        </Animated.View>
      );
    },
    [handleItemUpdate],
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2C3E50" />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  }, [loadingMore]);

  const renderEmpty = useCallback(() => {
    if (isInitialLoading || (isFetching && page === 1)) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2C3E50" />
          <Text style={styles.loadingText}>Loading featured lists...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <Animated.View entering={FadeIn} style={styles.emptyContainer}>
          <Image source={icons.emptyState} style={styles.emptyImage} />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>Unable to load featured lists</Text>
          <Pressable onPress={handleRefresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </Animated.View>
      );
    }

    return (
      <Animated.View entering={FadeIn} style={styles.emptyContainer}>
        <Image source={icons.emptyState} style={styles.emptyImage} />
        <Text style={styles.emptyTitle}>No Lists Found</Text>
        <Text style={styles.emptyText}>
          {searchQuery
            ? `No results for "${searchQuery}"`
            : 'There are no featured lists available'}
        </Text>
        {searchQuery && (
          <Pressable
            onPress={clearSearch}
            style={styles.clearSearchButton}
          >
            <Text style={styles.clearSearchText}>Clear Search</Text>
          </Pressable>
        )}
      </Animated.View>
    );
  }, [
    isInitialLoading,
    isFetching,
    page,
    error,
    searchQuery,
    handleRefresh,
    clearSearch,
  ]);

  // Safe key extractor
  const keyExtractor = useCallback(
    (item: FeaturedListSummary, index: number) => {
      return item?.id ? `list-${item.id}` : `list-${index}`;
    },
    [],
  );

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
        >
          <Image
            source={icons.leftIcon}
            style={[styles.backIcon, { tintColor: '#FFF' }]}
          />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Featured Lists
        </Text>

        {/* <Pressable
          style={styles.filterButton}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
        >
          <Image
            source={icons.filterIcon}
            style={[styles.filterIcon, { tintColor: '#FFF' }]}
          />
        </Pressable> */}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Image source={icons.searchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lists..."
            placeholderTextColor="#95A5A6"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <Image source={icons.closeIcon} style={styles.clearIcon} />
            </Pressable>
          )}
        </View>
        {isSearchActive && (
          <Text style={styles.searchResultsText}>
            {flatListData.length} {flatListData.length === 1 ? 'result' : 'results'}
          </Text>
        )}
      </View>

      {/* CRITICAL FIX: FlatList with guaranteed plain array */}
      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2C3E50']}
            tintColor="#2C3E50"
            progressBackgroundColor="#FFFFFF"
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={6}
      />
    </SafeAreaProvider>
  );
}

/* Full Row Component */
interface FullRowProps {
  item: FeaturedListSummary;
  onUpdate: (updatedItem: FeaturedListSummary) => void;
}

const FullRow = React.memo(({ item, onUpdate }: FullRowProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [likeFeaturedItem] = useLikeFeaturedItemMutation();
  const [bookmarkFeaturedItem] = useBookmarkFeaturedItemMutation();
  const [shareFeaturedItem, { isLoading: isSharing }] =
    useShareFeaturedItemMutation();

  const [imageError, setImageError] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);
  const [localItem, setLocalItem] = useState<FeaturedListSummary>(item);

  useEffect(() => {
    setLocalItem(item);
  }, [item]);

  const onLikePress = useCallback(async () => {
    if (isLiking || !localItem?.id) return;

    setIsLiking(true);
    const previousState = localItem.is_liked;
    const previousCount = localItem.likes_count || 0;

    const optimisticItem = {
      ...localItem,
      is_liked: !localItem.is_liked,
      likes_count: localItem.is_liked
        ? Math.max(0, previousCount - 1)
        : previousCount + 1,
    };

    setLocalItem(optimisticItem);
    onUpdate(optimisticItem);

    try {
      const res = await likeFeaturedItem(localItem.id).unwrap();
      if (!res?.success) {
        const revertedItem = {
          ...localItem,
          is_liked: previousState,
          likes_count: previousCount,
        };
        setLocalItem(revertedItem);
        onUpdate(revertedItem);
      }
    } catch (error) {
      const revertedItem = {
        ...localItem,
        is_liked: previousState,
        likes_count: previousCount,
      };
      setLocalItem(revertedItem);
      onUpdate(revertedItem);
    } finally {
      setIsLiking(false);
    }
  }, [localItem, isLiking, likeFeaturedItem, onUpdate]);

  const onBookmarkPress = useCallback(async () => {
    if (isBookmarking || !localItem?.id) return;

    setIsBookmarking(true);
    const previousState = localItem.is_saved;
    const previousCount = localItem.saves_count || 0;

    const optimisticItem = {
      ...localItem,
      is_saved: !localItem.is_saved,
      saves_count: localItem.is_saved
        ? Math.max(0, previousCount - 1)
        : previousCount + 1,
    };

    setLocalItem(optimisticItem);
    onUpdate(optimisticItem);

    try {
      const res = await bookmarkFeaturedItem(localItem.id).unwrap();
      if (!res?.success) {
        const revertedItem = {
          ...localItem,
          is_saved: previousState,
          saves_count: previousCount,
        };
        setLocalItem(revertedItem);
        onUpdate(revertedItem);
      }
    } catch (error) {
      const revertedItem = {
        ...localItem,
        is_saved: previousState,
        saves_count: previousCount,
      };
      setLocalItem(revertedItem);
      onUpdate(revertedItem);
    } finally {
      setIsBookmarking(false);
    }
  }, [localItem, isBookmarking, bookmarkFeaturedItem, onUpdate]);

  const onSharePress = useCallback(async () => {
    if (isSharing || !localItem?.id) return;

    try {
      const res = await shareFeaturedItem(localItem.id).unwrap();

      if (res?.share_url) {
        await Share.share({
          title: localItem.title,
          message: `Check out this list: ${localItem.title}\n\n${res.share_url}`,
        });

        const updatedItem = {
          ...localItem,
          shares_count: (localItem.shares_count || 0) + 1,
        };

        setLocalItem(updatedItem);
        onUpdate(updatedItem);
      }
    } catch (error) {
      console.log('Share error:', error);
    }
  }, [localItem, isSharing, shareFeaturedItem, onUpdate]);

  const handlePress = useCallback(() => {
    if (localItem?.id) {
      navigation.navigate('FeaturedDetail', { itemId: localItem.id });
    }
  }, [localItem?.id, navigation]);

  const imageSource: ImageSourcePropType =
    localItem?.image && !imageError && localItem.image.trim() !== ''
      ? { uri: localItem.image }
      : icons.defaultImage;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.fullCard,
        pressed && styles.fullCardPressed,
      ]}
      android_ripple={{ color: 'rgba(44, 62, 80, 0.05)', borderless: false }}
    >
      <Image
        source={imageSource}
        style={styles.fullCardImage}
        onError={() => setImageError(true)}
      />

      <View style={styles.fullCardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.fullCardTitle} numberOfLines={1}>
            {localItem.title || 'Untitled List'}
          </Text>
          {localItem.category?.name && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {localItem.category.name}
              </Text>
            </View>
          )}
        </View>

        {localItem.category?.interest?.name && (
          <Text style={styles.interestText} numberOfLines={1}>
            {localItem.category.interest.name}
          </Text>
        )}

        <View style={styles.actionsContainer}>
          <Pressable
            onPress={onLikePress}
            style={styles.actionButton}
            disabled={isLiking}
          >
            <Image
              source={localItem.is_liked ? icons.heartFilled : icons.heartOutline}
              style={[
                styles.actionIcon,
                localItem.is_liked && styles.likedIcon,
              ]}
            />
            <Text style={[styles.actionText, localItem.is_liked && styles.likedText]}>
              {formatCount(localItem.likes_count || 0)}
            </Text>
          </Pressable>

          <Pressable
            onPress={onBookmarkPress}
            style={styles.actionButton}
            disabled={isBookmarking}
          >
            <Image
              source={localItem.is_saved ? icons.bookmarkFilled : icons.bookmarkOutline}
              style={[
                styles.actionIcon,
                localItem.is_saved && styles.bookmarkedIcon,
              ]}
            />
            <Text style={[styles.actionText, localItem.is_saved && styles.bookmarkedText]}>
              {formatCount(localItem.saves_count || 0)}
            </Text>
          </Pressable>

          <Pressable
            onPress={onSharePress}
            style={styles.actionButton}
            disabled={isSharing}
          >
            <Image
              source={icons.shareOutline}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>
              {formatCount(localItem.shares_count || 0)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

FullRow.displayName = 'FullRow';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
  },
  backIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  filterButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
  },
  filterIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F7',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFD',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#95A5A6',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    fontFamily: 'Quicksand-Regular',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: '#95A5A6',
  },
  searchResultsText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontFamily: 'Quicksand-Medium',
    marginTop: 6,
    marginLeft: 4,
  },
  listContent: {
    padding: 8,
    paddingBottom: 16,
    flexGrow: 1,
  },
  animatedContainer: {
    width: '100%',
  },
  fullCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F3F7',
    minHeight: 100,
  },
  fullCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  fullCardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  fullCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fullCardTitle: {
    fontSize: 15,
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
    flex: 1,
    marginRight: 6,
  },
  categoryBadge: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1EFFE',
    maxWidth: 80,
  },
  categoryText: {
    fontSize: 10,
    color: '#2C3E50',
    fontFamily: 'Quicksand-SemiBold',
    textAlign: 'center',
  },
  interestText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontFamily: 'Quicksand-Regular',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFD',
  },
  actionIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: '#95A5A6',
  },
  likedIcon: {
    tintColor: '#E74C3C',
  },
  bookmarkedIcon: {
    tintColor: '#F39C12',
  },
  actionText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontFamily: 'Ubuntu-Regular',
  },
  likedText: {
    color: '#E74C3C',
    fontFamily: 'Ubuntu-Medium',
  },
  bookmarkedText: {
    color: '#F39C12',
    fontFamily: 'Ubuntu-Medium',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 12,
    color: '#95A5A6',
    fontFamily: 'Quicksand-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#95A5A6',
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#7F8C8D',
    fontFamily: 'Quicksand-Medium',
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#E74C3C',
    marginBottom: 6,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#95A5A6',
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  clearSearchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F3F7',
    borderRadius: 20,
  },
  clearSearchText: {
    color: '#2C3E50',
    fontSize: 13,
    fontFamily: 'Quicksand-SemiBold',
  },
});