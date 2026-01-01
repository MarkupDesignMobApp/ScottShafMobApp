import * as React from 'react';
import { FlatList, View, Image, Text, Pressable, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import {
  useGetFeaturedListsQuery,
  useLikeFeaturedItemMutation,
  useBookmarkFeaturedItemMutation,
  useShareFeaturedItemMutation,
} from '../../../features/auth/authApi';
import { FeaturedListSummary } from '../../../features/auth/authTypes';
import { formatCount } from '../../../utils/numberFormatter';
import { MainStackParamList } from '../../../navigation/types/navigation';

/* ---------------- ICONS ---------------- */
const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  bookmarkFilled: require('../../../../assets/image/bookmark.png'),
  bookmarkOutline: require('../../../../assets/image/unfillbookmark.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
};

/* ---------------- TYPES ---------------- */
type OptimizedFlatListProps = {
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  interestId: number | null;
};

/* ---------------- MAIN LIST ---------------- */
export default function OptimizedFlatList({
  ListHeaderComponent,
  ListFooterComponent,
  interestId,
}: OptimizedFlatListProps) {
  const {
    data = [],
    refetch,
    isLoading,
  } = useGetFeaturedListsQuery(interestId ? { interestId } : undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const renderItem = React.useCallback(
    ({ item }: { item: FeaturedListSummary }) => (
      <Row item={item} refetch={refetch} />
    ),
    [refetch],
  );

  const keyExtractor = React.useCallback(
    (item: FeaturedListSummary) => item.id.toString(),
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews
    />
  );
}

/* ---------------- ROW ITEM ---------------- */
const Row = React.memo(
  ({ item, refetch }: { item: FeaturedListSummary; refetch: () => void }) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const [likeFeaturedItem] = useLikeFeaturedItemMutation();
    const [bookmarkFeaturedItem] = useBookmarkFeaturedItemMutation();
    const [shareFeaturedItem, { isLoading: isSharing }] =
      useShareFeaturedItemMutation();

    /* ----------- HANDLERS ----------- */
    const onLikePress = React.useCallback(async () => {
      try {
        const res = await likeFeaturedItem(item.id).unwrap();
        if (res.success) refetch();
      } catch (e) {
        console.log('Like error', e);
      }
    }, [item.id, likeFeaturedItem, refetch]);

    const onBookmarkPress = React.useCallback(async () => {
      try {
        const res = await bookmarkFeaturedItem(item.id).unwrap();
        if (res.success) refetch();
      } catch (e) {
        console.log('Bookmark error', e);
      }
    }, [item.id, bookmarkFeaturedItem, refetch]);

    const onSharePress = React.useCallback(async () => {
      if (isSharing) return; // 🔒 PREVENT MULTI TAP

      try {
        const res = await shareFeaturedItem(item.id).unwrap();
        if (!res?.share_url) return;

        await Share.share({
          title: item.title,
          message: `${item.title}\n\n${res.share_url}`,
          url: res.share_url,
        });
      } catch (e) {
        console.log('Share error', e);
      }
    }, [isSharing, item.id, item.title, shareFeaturedItem]);

    const onPressCard = () => {
      navigation.navigate('FeaturedDetail', { item }); // <-- Navigate to detail screen
    };

    /* ----------- UI ----------- */
    return (
      <Pressable onPress={onPressCard}>
        <View style={styles.card}>
          {/* IMAGE */}
          <View style={styles.cardimgcontainer}>
            <Image
              resizeMode="cover"
              style={styles.img2}
              source={{ uri: item.image }}
            />
          </View>

          {/* DETAILS */}
          <View>
            <View style={styles.cardtitlecontainer}>
              <View style={styles.imgcontainer4}>
                <Image
                  resizeMode="contain"
                  style={styles.img}
                  source={require('../../../../assets/image/cofeeshop.png')}
                />
              </View>

              <View style={{ paddingLeft: '2%' }}>
                <Text style={styles.cardmaintitletxt}>{item.title}</Text>
                <Text style={styles.cardsubtitletxt}>
                  {item.category?.name} · {item.category?.interest?.name}
                </Text>
              </View>
            </View>

            {/* ACTIONS */}
            <View style={styles.cardlike}>
              <ActionButton
                icon={item.is_liked ? icons.heartFilled : icons.heartOutline}
                value={formatCount(item.likes_count)}
                onPress={onLikePress}
              />

              <ActionButton
                icon={
                  item.is_saved ? icons.bookmarkFilled : icons.bookmarkOutline
                }
                value={formatCount(item.saves_count)}
                onPress={onBookmarkPress}
              />

              <ActionButton
                icon={icons.shareOutline}
                value={formatCount(item.shares_count)}
                onPress={onSharePress}
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  },
);

/* ---------------- ACTION BUTTON ---------------- */
const ActionButton = React.memo(
  ({
    icon,
    value,
    onPress,
    disabled = false,
  }: {
    icon: any;
    value: string;
    onPress: () => void;
    disabled?: boolean;
  }) => (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[styles.likecontainer, disabled && { opacity: 0.5 }]}
      hitSlop={10}
    >
      <View style={styles.imgcontainer3}>
        <Image resizeMode="contain" style={styles.img} source={icon} />
      </View>
      <Text style={styles.liketxt}>{value}</Text>
    </Pressable>
  ),
);
