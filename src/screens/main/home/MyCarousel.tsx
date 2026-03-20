import * as React from 'react';
import { FlatList, View, Image, Text, Pressable, Share } from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
/* ICONS */

const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  bookmarkFilled: require('../../../../assets/image/bookmark.png'),
  bookmarkOutline: require('../../../../assets/image/unfillbookmark.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
};

/* MAIN LIST */

export default function OptimizedFlatList({ interestId }) {
  const { data = [], refetch } = useGetFeaturedListsQuery(
    interestId ? { interestId } : undefined,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const renderItem = React.useCallback(
    ({ item }) => <Row item={item} refetch={refetch} />,
    [refetch],
  );

  const keyExtractor = React.useCallback(item => item.id.toString(), []);

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
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
      snapToInterval={responsiveScreenWidth(75) + 14}
      decelerationRate="fast"
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews
    />
  );
}

/* ROW ITEM */

const Row = React.memo(
  ({ item, refetch }: { item: FeaturedListSummary; refetch: () => void }) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const [likeFeaturedItem] = useLikeFeaturedItemMutation();
    const [bookmarkFeaturedItem] = useBookmarkFeaturedItemMutation();
    const [shareFeaturedItem, { isLoading: isSharing }] =
      useShareFeaturedItemMutation();

    const [imageError, setImageError] = React.useState(false);

    const imageSource =
      item?.image && !imageError
        ? { uri: item.image }
        : require('../../../../assets/image/cofee.png');

    /* LIKE */

    const onLikePress = async () => {
      try {
        const res = await likeFeaturedItem(item.id).unwrap();
        if (res.success) refetch();
      } catch (e) {
        console.log(e);
      }
    };

    /* BOOKMARK */

    const onBookmarkPress = async () => {
      try {
        const res = await bookmarkFeaturedItem(item.id).unwrap();
        if (res.success) refetch();
      } catch (e) {
        console.log(e);
      }
    };

    /* SHARE */

    const onSharePress = async () => {
      if (isSharing) return;

      try {
        const res = await shareFeaturedItem(item.id).unwrap();

        if (!res?.share_url) return;

        await Share.share({
          title: item.title,
          message: `${item.title}\n\n${res.share_url}`,
          url: res.share_url,
        });
      } catch (e) {
        console.log(e);
      }
    };

    /* NAVIGATION */

    /* NAVIGATION */

    const onPressCard = () => {
      // Pass the item ID instead of the whole item object
      navigation.navigate('FeaturedDetail', { itemId: item.id });
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
                {item.title}
              </Text>

              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {item.category?.name} · {item.category?.interest?.name}
              </Text>
            </View>
          </View>

          {/* ACTIONS */}

          <View style={styles.actionsRow}>
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
      </Pressable>
    );
  },
);

/* ACTION BUTTON */

const ActionButton = React.memo(({ icon, value, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.actionButton}>
      <Image style={styles.actionIcon} source={icon} />
      <Text style={styles.actionText}>{value}</Text>
    </Pressable>
  );
});
