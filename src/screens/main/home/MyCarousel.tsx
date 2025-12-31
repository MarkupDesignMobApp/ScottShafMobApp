import * as React from 'react';
import { FlatList, View, Image, Text, Pressable, Share } from 'react-native';

import { styles } from './styles';
import {
  useGetFeaturedListsQuery,
  useLikeFeaturedItemMutation,
  useBookmarkFeaturedItemMutation,
  useShareFeaturedItemMutation,
} from '../../../features/auth/authApi';
import { FeaturedListSummary } from '../../../features/auth/authTypes';

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
  const { data = [], refetch } = useGetFeaturedListsQuery(
    interestId ? { interestId } : undefined,
  );

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

    /* ----------- UI ----------- */

    return (
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
              value="355k"
              onPress={onLikePress}
            />

            <ActionButton
              icon={
                item.is_saved ? icons.bookmarkFilled : icons.bookmarkOutline
              }
              value="89"
              onPress={onBookmarkPress}
            />

            <ActionButton
              icon={icons.shareOutline}
              value="15"
              onPress={onSharePress}
            />
          </View>
        </View>
      </View>
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
