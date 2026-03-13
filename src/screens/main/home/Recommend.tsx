import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Share,
  Pressable,
  Alert,
} from 'react-native';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {
  useGetRecommendItemsQuery,
  useLikeRecommendedMutation,
  useShareRecommendedMutation,
} from '../../../features/auth/authApi';

/* ICONS */

const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
  more: require('../../../../assets/image/dots.png'),
};

const PLACEHOLDER_IMAGE = require('../../../../assets/image/movie3.png');

/* MAIN */

export default function Recommend() {
  const [posts, setPosts] = useState([]);

  const { data, isLoading, error, refetch } = useGetRecommendItemsQuery();
  const [likeRecommended] = useLikeRecommendedMutation();
  const [shareRecommended] = useShareRecommendedMutation();

  useEffect(() => {
    if (!data) return;

    const rawList = Array.isArray(data) ? data : data?.data ?? [];

    const mapped = rawList.map(apiItem => {
      const items = (apiItem.items || [])
        .map((it, index) => {
          const ci = it.catalog_item;
          if (!ci) return null;

          return {
            uid: `${apiItem.id}-${ci.id}-${index}`,
            id: String(ci.id),
            name: ci.name ?? 'Unknown',
            image: ci.image_url ? { uri: ci.image_url } : null,
          };
        })
        .filter(Boolean);

      return {
        id: String(apiItem.id),
        user: apiItem.user?.full_name ?? 'Unknown',
        time: formatTimeAgo(apiItem.created_at),
        title: apiItem.title ?? '',
        likes: Number(apiItem.likes_count ?? 0),
        isLiked: Boolean(apiItem.is_liked),
        items,
      };
    });

    setPosts(mapped);
  }, [data]);

  const onLikePress = async postId => {
    try {
      await likeRecommended(postId).unwrap();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  const onSharePress = async (postId, title) => {
    try {
      const res = await shareRecommended({ id: postId }).unwrap();

      const url = res?.share_url;
      if (!url) {
        Alert.alert('Error', 'Share link not available');
        return;
      }

      await Share.share({
        title,
        message: `${title}\n\n${url}`,
        url,
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Text>Loading recommendations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Pressable onPress={refetch}>
          <Text style={{ color: '#3498DB' }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recommended For You</Text>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            onLikePress={onLikePress}
            onSharePress={onSharePress}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* POST CARD */

function PostCard({ item, onLikePress, onSharePress }) {
  return (
    <View style={styles.card}>
      {/* USER ROW */}

      <View style={styles.userRow}>
        <Image
          source={require('../../../../assets/image/women1.png')}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <Image source={icons.more} style={styles.menuIcon} />
      </View>

      {/* TITLE */}

      <Text style={styles.title}>{item.title}</Text>

      {/* ITEMS */}

      {item.items.map(listItem => (
        <View key={listItem.uid} style={styles.itemRow}>
          <Image
            source={listItem.image ?? PLACEHOLDER_IMAGE}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>{listItem.name}</Text>
        </View>
      ))}

      {/* ACTION BAR */}

      <View style={styles.actions}>
        <Pressable onPress={() => onLikePress(item.id)}>
          <ActionButton
            icon={item.isLiked ? icons.heartFilled : icons.heartOutline}
            value={formatNumber(item.likes)}
          />
        </Pressable>

        <Pressable onPress={() => onSharePress(item.id, item.title)}>
          <ActionButton icon={icons.shareOutline} value="Share" />
        </Pressable>
      </View>
    </View>
  );
}

/* ACTION BUTTON */

const ActionButton = React.memo(({ icon, value }) => (
  <View style={styles.actionButton}>
    <Image source={icon} style={styles.actionIcon} />
    <Text style={styles.actionText}>{value}</Text>
  </View>
));

/* HELPERS */

const formatNumber = num => {
  const n = Number(num ?? 0);
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
};

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/* STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },

  heading: {
    fontSize: responsiveScreenFontSize(2.4),
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
    marginVertical: responsiveScreenHeight(2),
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(2),

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(1),
  },

  avatar: {
    width: responsiveScreenWidth(9),
    height: responsiveScreenWidth(9),
    borderRadius: responsiveScreenWidth(4.5),
    marginRight: responsiveScreenWidth(3),
  },

  username: {
    fontFamily: 'Quicksand-SemiBold',
    fontSize: responsiveScreenFontSize(1.8),
    color: '#2C3E50',
  },

  time: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#7F8C8D',
  },

  menuIcon: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenWidth(5),
  },

  title: {
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: responsiveScreenHeight(1),
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: responsiveScreenWidth(3),
    borderRadius: 10,
    marginBottom: responsiveScreenHeight(1),
  },

  itemImage: {
    width: responsiveScreenWidth(10),
    height: responsiveScreenWidth(10),
    borderRadius: 8,
    marginRight: responsiveScreenWidth(3),
  },

  itemText: {
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'Quicksand-Medium',
    color: '#2C3E50',
  },

  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#EEF2F6',
    paddingTop: responsiveScreenHeight(1.2),
    marginTop: responsiveScreenHeight(1),
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: responsiveScreenWidth(5),
  },

  actionIcon: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenWidth(5),
  },

  actionText: {
    marginLeft: responsiveScreenWidth(1),
    fontFamily: 'Quicksand-Medium',
    fontSize: responsiveScreenFontSize(1.6),
  },
});
