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
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO IMAGE */}
        <View style={styles.imageWrapper}>

          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />

        </View>

        {/* CONTENT CARD */}

        <View style={styles.card}>

          <Text style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.category}>
            {item.category?.name} · {item.category?.interest?.name}
          </Text>

          {/* ACTIONS */}

          <View style={styles.actions}>

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

          {/* DESCRIPTION */}

          <View style={styles.descriptionWrapper}>

            <Text style={styles.descriptionText}>
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

  <Pressable onPress={onPress} style={styles.actionButton}>

    <Image
      source={icon}
      style={styles.actionIcon}
    />

    <Text style={styles.actionText}>
      {value}
    </Text>

  </Pressable>

);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F9FB"
  },

  imageWrapper: {
    width,
    height: width * 0.7,
    backgroundColor: "#EEE"
  },

  image: {
    width: "100%",
    height: "100%"
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginTop: -30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24
  },

  title: {
    fontSize: 22,
    fontFamily: "Quicksand-SemiBold",
    color: "#2C3E50"
  },

  category: {
    fontSize: 14,
    fontFamily: "Quicksand-Regular",
    color: "#7F8C8D",
    marginTop: 6
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E4E7EC"
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center"
  },

  actionIcon: {
    width: 22,
    height: 22,
    tintColor: "#2C3E50"
  },

  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    color: "#2C3E50"
  },

  descriptionWrapper: {
    marginTop: 20
  },

  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Quicksand-Regular",
    color: "#4B5563"
  }

});
