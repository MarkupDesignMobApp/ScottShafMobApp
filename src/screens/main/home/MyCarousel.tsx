import * as React from 'react';
import { FlatList, View, Image, Text, Pressable, Share } from 'react-native';

import { styles } from './styles';
import {
  useGetFeaturedListsQuery,
  useLikeFeaturedItemMutation,
  useBookmarkFeaturedItemMutation,
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
  const { data = [] } = useGetFeaturedListsQuery(
    interestId ? { interestId } : undefined,
  );

  const renderItem = React.useCallback(
    ({ item }: { item: FeaturedListSummary }) => <Row item={item} />,
    [],
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

const Row = React.memo(({ item }: { item: FeaturedListSummary }) => {
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);

  const [likeFeaturedItem] = useLikeFeaturedItemMutation();
  const [bookmarkFeaturedItem] = useBookmarkFeaturedItemMutation();

  const onLikePress = async () => {
    try {
      const res = await likeFeaturedItem(item.id).unwrap();
      if (res.success) {
        setLiked(res.liked);
      }
    } catch (e) {
      console.log('Like error', e);
    }
  };

  const onBookmarkPress = async () => {
    try {
      const res = await bookmarkFeaturedItem(item.id).unwrap();
      if (res.success) {
        setBookmarked(res.saved);
      }
    } catch (e) {
      console.log('Bookmark error', e);
    }
  };

  /* -------- SHARE HANDLER -------- */

  const onSharePress = async () => {
    try {
      await Share.share({
        title: item.title,
        message: `${item.title}\n\nCheck this out!\nhttps://yourapp.com/item/${item.id}`,
        url: `https://yourapp.com/item/${item.id}`, // iOS support
      });
    } catch (error) {
      console.log('Share error', error);
    }
  };

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
            icon={liked ? icons.heartFilled : icons.heartOutline}
            value="355k"
            onPress={onLikePress}
          />

          <ActionButton
            icon={bookmarked ? icons.bookmarkFilled : icons.bookmarkOutline}
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
});

/* ---------------- ACTION BUTTON ---------------- */

const ActionButton = React.memo(
  ({
    icon,
    value,
    onPress,
  }: {
    icon: any;
    value: string;
    onPress: () => void;
  }) => {
    return (
      <Pressable onPress={onPress} style={styles.likecontainer} hitSlop={10}>
        <View style={styles.imgcontainer3}>
          <Image resizeMode="contain" style={styles.img} source={icon} />
        </View>
        <Text style={styles.liketxt}>{value}</Text>
      </Pressable>
    );
  },
);
