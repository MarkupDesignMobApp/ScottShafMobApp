// screens/main/FeaturedDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Share,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetFeaturedListsQuery,
  useLikeFeaturedItemMutation,
  useBookmarkFeaturedItemMutation,
  useShareFeaturedItemMutation,
} from '../../../features/auth/authApi';
import { FeaturedListSummary } from '../../../features/auth/authTypes';
import { formatCount } from '../../../utils/numberFormatter';

const { width } = Dimensions.get('window');

/* ---------------- ICONS ---------------- */
const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  bookmarkFilled: require('../../../../assets/image/bookmark.png'),
  bookmarkOutline: require('../../../../assets/image/unfillbookmark.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
};

/* ---------------- ROUTE TYPE ---------------- */
type FeaturedDetailRouteProp = RouteProp<
  { FeaturedDetail: { item?: FeaturedListSummary; itemId?: number } },
  'FeaturedDetail'
>;

export default function FeaturedDetailScreen() {
const route = useRoute<FeaturedDetailRouteProp>();
const { item: passedItem, itemId } = route.params ?? {};




  const [item, setItem] = useState<FeaturedListSummary | null>(passedItem || null);

  // Fetch featured lists only if we need to find the item by itemId (deep link)
  const { data: allItems, isLoading } = useGetFeaturedListsQuery(undefined);

  useEffect(() => {
    if (!item && itemId && allItems) {
      const found = allItems.find(f => f.id.toString() === itemId.toString());
      setItem(found || null);
    }
  }, [allItems, itemId]);

  const [likeFeaturedItem] = useLikeFeaturedItemMutation();
  const [bookmarkFeaturedItem] = useBookmarkFeaturedItemMutation();
  const [shareFeaturedItem, { isLoading: isSharing }] =
    useShareFeaturedItemMutation();

  const onLikePress = async () => {
    if (!item) return;
    try {
      await likeFeaturedItem(item.id).unwrap();
    } catch (e) {
      console.log('Like error', e);
    }
  };

  const onBookmarkPress = async () => {
    if (!item) return;
    try {
      await bookmarkFeaturedItem(item.id).unwrap();
    } catch (e) {
      console.log('Bookmark error', e);
    }
  };

  const onSharePress = async () => {
    if (!item || isSharing) return;
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
  };

  if (isLoading && !item) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  if (!item) {
    return <Text style={{ padding: 20 }}>Item not found</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO IMAGE */}
        <View style={styles.detailImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.detailImage}
            resizeMode="cover"
          />
        </View>

        {/* CONTENT CARD */}
        <View style={styles.detailCard}>
          {/* TITLE */}
          <Text style={styles.detailTitle}>{item.title}</Text>

          {/* CATEGORY */}
          <Text style={styles.detailSubTitle}>
            {item.category?.name} · {item.category?.interest?.name}
          </Text>

          {/* ACTION BAR */}
          <View style={styles.detailActions}>
            <ActionButton
              icon={item.is_liked ? icons.heartFilled : icons.heartOutline}
              value={formatCount(item.likes_count)}
              onPress={onLikePress}
            />
            <ActionButton
              icon={item.is_saved ? icons.bookmarkFilled : icons.bookmarkOutline}
              value={formatCount(item.saves_count)}
              onPress={onBookmarkPress}
            />
            <ActionButton
              icon={icons.shareOutline}
              value={formatCount(item.shares_count)}
              onPress={onSharePress}
            />
          </View>

          {/* DESCRIPTION / BODY */}
          <View style={styles.detailDescription}>
            <Text style={styles.detailDescriptionText}>
              {item.description ??
                'Detailed information about this featured item will appear here.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- ACTION BUTTON ---------------- */
const ActionButton = ({
  icon,
  value,
  onPress,
}: {
  icon: any;
  value: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.detailActionBtn}>
    <Image source={icon} style={styles.detailActionIcon} resizeMode="contain" />
    <Text style={styles.detailActionText}>{value}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  detailImageContainer: { width, height: width * 0.9, backgroundColor: '#EEE' },
  detailImage: { width: '100%', height: '100%' },
  detailCard: {
    backgroundColor: '#FFF',
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  detailTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-SemiBold',
    color: '#111',
  },
  detailSubTitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  detailActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F1F1',
  },
  detailActionBtn: { flexDirection: 'row', alignItems: 'center' },
  detailActionIcon: { width: 20, height: 20 },
  detailActionText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    color: '#111',
  },
  detailDescription: { marginTop: 16 },
  detailDescriptionText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Quicksand-Regular',
    color: '#374151',
  },
});
