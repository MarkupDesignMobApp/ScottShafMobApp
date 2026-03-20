import React, { useCallback, memo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Share,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from  '../home/styles';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';

import {
  useGetFeaturedListsQuery,
  useLikeFeaturedItemMutation,
  useBookmarkFeaturedItemMutation,
  useShareFeaturedItemMutation,
} from '../../../features/auth/authApi';
import { FeaturedListSummary } from '../../../features/auth/authTypes';
import { MainStackParamList } from '../../../navigation/types/navigation';

import { formatCount } from '../../../utils/numberFormatter';

/* ICONS */
const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  bookmarkFilled: require('../../../../assets/image/bookmark.png'),
  bookmarkOutline: require('../../../../assets/image/unfillbookmark.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
};

interface FeaturedListsPreviewProps {
  interestId: number | null;
  navigation: NativeStackNavigationProp<MainStackParamList, 'Home'>;
}

export default function FeaturedListsPreview({
  interestId,
  navigation,
}: FeaturedListsPreviewProps) {
  const {
    data = [],
    refetch,
    isFetching,
  } = useGetFeaturedListsQuery(interestId ? { interestId } : undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Remove duplicates based on id and only show first 3 unique items
  const uniqueData = data.filter(
    (item, index, self) => index === self.findIndex(t => t.id === item.id),
  );

  const previewData = uniqueData.slice(0, 3);

  // Handle See All navigation
  const handleSeeAll = () => {
    navigation.navigate('Feature', {
      interestId: interestId,
      initialData: uniqueData,
    });
  };

  const renderItem = useCallback(
    ({ item }: { item: FeaturedListSummary }) => (
      <Row item={item} refetch={refetch} />
    ),
    [refetch],
  );

  const keyExtractor = useCallback(
    (item: FeaturedListSummary) => item.id.toString(),
    [],
  );

  if (isFetching && previewData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C4FA" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        horizontal
        data={previewData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
        snapToInterval={responsiveScreenWidth(75) + 14}
        decelerationRate="fast"
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews
        ListFooterComponent={
          previewData.length > 0 && uniqueData.length > 3 ? (
            <Pressable onPress={handleSeeAll} style={styles.seeAllCard}>
              <Text style={styles.seeAllCardText}>See All</Text>
              <Text style={styles.seeAllCardSubtext}>
                {uniqueData.length - 3} more items
              </Text>
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}

/* ROW ITEM */
interface RowProps {
  item: FeaturedListSummary;
  refetch: () => void;
}

const Row = memo(({ item, refetch }: RowProps) => {
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

  // Update local item when prop changes
  React.useEffect(() => {
    setLocalItem(item);
  }, [item]);

  const imageSource: ImageSourcePropType =
    localItem?.image && !imageError
      ? { uri: localItem.image }
      : require('../../../../assets/image/cofee.png');

  /* LIKE */
  const onLikePress = async () => {
    if (isLiking) return;

    setIsLiking(true);
    const previousState = localItem.is_liked;
    const previousCount = localItem.likes_count;

    // Optimistic update
    setLocalItem({
      ...localItem,
      is_liked: !localItem.is_liked,
      likes_count: localItem.is_liked
        ? localItem.likes_count - 1
        : localItem.likes_count + 1,
    });

    try {
      const res = await likeFeaturedItem(localItem.id).unwrap();
      if (!res.success) {
        // Revert on failure
        setLocalItem({
          ...localItem,
          is_liked: previousState,
          likes_count: previousCount,
        });
      } else {
        refetch();
      }
    } catch (e) {
      // Revert on error
      setLocalItem({
        ...localItem,
        is_liked: previousState,
        likes_count: previousCount,
      });
      console.log('Like error:', e);
    } finally {
      setIsLiking(false);
    }
  };

  /* BOOKMARK */
  const onBookmarkPress = async () => {
    if (isBookmarking) return;

    setIsBookmarking(true);
    const previousState = localItem.is_saved;
    const previousCount = localItem.saves_count;

    // Optimistic update
    setLocalItem({
      ...localItem,
      is_saved: !localItem.is_saved,
      saves_count: localItem.is_saved
        ? localItem.saves_count - 1
        : localItem.saves_count + 1,
    });

    try {
      const res = await bookmarkFeaturedItem(localItem.id).unwrap();
      if (!res.success) {
        // Revert on failure
        setLocalItem({
          ...localItem,
          is_saved: previousState,
          saves_count: previousCount,
        });
      } else {
        refetch();
      }
    } catch (e) {
      // Revert on error
      setLocalItem({
        ...localItem,
        is_saved: previousState,
        saves_count: previousCount,
      });
      console.log('Bookmark error:', e);
    } finally {
      setIsBookmarking(false);
    }
  };

  /* SHARE */
  const onSharePress = async () => {
    if (isSharing) return;

    try {
      const res = await shareFeaturedItem(localItem.id).unwrap();

      if (!res?.share_url) return;

      await Share.share({
        title: localItem.title,
        message: `${localItem.title}\n\n${res.share_url}`,
        url: res.share_url,
      });

      // Optimistic update for share count
      setLocalItem({
        ...localItem,
        shares_count: localItem.shares_count + 1,
      });

      refetch();
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  /* NAVIGATION */
  const onPressCard = () => {
    navigation.navigate('FeaturedDetail', { itemId: localItem.id });
  };

  return (
    <Pressable onPress={onPressCard} style={styles.card}>
      {/* IMAGE */}
      <Image
        style={styles.cardImage}
        source={imageSource}
        onError={() => setImageError(true)}
      />

      {/* BODY */}
      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Image
            style={styles.categoryIcon}
            source={require('../../../../assets/image/cofeeshop.png')}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {localItem.title}
            </Text>

            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {localItem.category?.name} · {localItem.category?.interest?.name}
            </Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actionsRow}>
          <ActionButton
            icon={localItem.is_liked ? icons.heartFilled : icons.heartOutline}
            value={formatCount(localItem.likes_count)}
            onPress={onLikePress}
            disabled={isLiking}
          />

          <ActionButton
            icon={
              localItem.is_saved ? icons.bookmarkFilled : icons.bookmarkOutline
            }
            value={formatCount(localItem.saves_count)}
            onPress={onBookmarkPress}
            disabled={isBookmarking}
          />

          <ActionButton
            icon={icons.shareOutline}
            value={formatCount(localItem.shares_count)}
            onPress={onSharePress}
            disabled={isSharing}
          />
        </View>
      </View>
    </Pressable>
  );
});

Row.displayName = 'FeaturedRow';

/* ACTION BUTTON */
interface ActionButtonProps {
  icon: ImageSourcePropType;
  value: string;
  onPress: () => void;
  disabled?: boolean;
}

const ActionButton = memo(
  ({ icon, value, onPress, disabled = false }: ActionButtonProps) => {
    return (
      <Pressable
        onPress={onPress}
        style={styles.actionButton}
        disabled={disabled}
      >
        <Image
          style={[styles.actionIcon, disabled && { opacity: 0.5 }]}
          source={icon}
        />
        <Text style={[styles.actionText, disabled && { opacity: 0.5 }]}>
          {value}
        </Text>
      </Pressable>
    );
  },
);

ActionButton.displayName = 'ActionButton';
