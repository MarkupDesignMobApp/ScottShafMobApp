import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {
  useGetRecommendItemsQuery,
  useLikeRecommendedMutation,
} from '../../../features/auth/authApi';

const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
};

const PLACEHOLDER_IMAGE = require('../../../../assets/image/movie3.png');

// ---------- Avatar color helpers ----------
const AVATAR_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
  '#F8C471',
  '#82E0AA',
  '#F1948A',
  '#85929E',
  '#73C6B6',
  '#E59866',
  '#AF7AC5',
  '#5DADE2',
  '#58D68D',
  '#F4D03F',
];

function getAvatarColor(identifier: string | number): string {
  const str = String(identifier);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getInitials(name: string): string {
  if (!name) return '?';
  const first = name.trim().charAt(0).toUpperCase();
  return first || '?';
}

// ---------- Helper: detect cloned list ----------
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

export default function Recommend() {
  const [posts, setPosts] = useState<any[]>([]);
  const { data, isLoading, error, refetch } = useGetRecommendItemsQuery();
  const [likeRecommended] = useLikeRecommendedMutation();

  useEffect(() => {
    if (!data) return;
    const rawList = Array.isArray(data) ? data : data?.data ?? [];

    // Filter out cloned lists
    const filtered = rawList.filter((apiItem: any) => !isClonedList(apiItem));

    const mapped = filtered.map((apiItem: any) => {
      const items = (apiItem.items || [])
        .map((it: any, index: number) => {
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
        userId: apiItem.user?.id ?? apiItem.id, // for color consistency
        userImage: apiItem.user?.profile_image || null,
        time: formatTimeAgo(apiItem.created_at),
        title: apiItem.title ?? '',
        likes: Number(apiItem.likes_count ?? 0),
        isLiked: Boolean(apiItem.is_liked),
        items,
      };
    });
    setPosts(mapped);
  }, [data]);

  const onLikePress = async (postId: string) => {
    try {
      await likeRecommended(postId).unwrap();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2C3E50" />
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          posts.length === 0 ? styles.emptyList : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No recommendations found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard item={item} onLikePress={onLikePress} />
        )}
      />
    </View>
  );
}

// ------------------- PostCard Component -------------------
function PostCard({ item, onLikePress }: any) {
  // Avatar logic
  const profileImage = item.userImage;
  const initial = getInitials(item.user);
  const avatarColor = getAvatarColor(item.userId || item.user);

  return (
    <View style={styles.card}>
      <View style={styles.userRow}>
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: avatarColor },
              ]}
            >
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>

      <Text style={styles.title}>{item.title}</Text>

      {item.items.map((listItem: any) => (
        <View key={listItem.uid} style={styles.itemRow}>
          <Image
            source={listItem.image ?? PLACEHOLDER_IMAGE}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>{listItem.name}</Text>
        </View>
      ))}

      <View style={styles.actions}>
        <Pressable onPress={() => onLikePress(item.id)}>
          <ActionButton
            icon={item.isLiked ? icons.heartFilled : icons.heartOutline}
            value={formatNumber(item.likes)}
          />
        </Pressable>
      </View>
    </View>
  );
}

// ------------------- Helpers -------------------
const ActionButton = React.memo(({ icon, value }: any) => (
  <View style={styles.actionButton}>
    <Image source={icon} style={styles.actionIcon} />
    <Text style={styles.actionText}>{value}</Text>
  </View>
));

const formatNumber = (num: any) => {
  const n = Number(num ?? 0);
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
};

function formatTimeAgo(isoString: string) {
  if (!isoString) return '';
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: responsiveScreenWidth(0),
  },
  heading: {
    fontSize: responsiveScreenFontSize(2.4),
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
    marginTop: responsiveScreenHeight(1),
    marginBottom: responsiveScreenHeight(1.5),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveScreenHeight(8),
  },
  emptyText: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#7F8C8D',
    fontFamily: 'Quicksand-Medium',
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
  avatarContainer: {
    marginRight: responsiveScreenWidth(3),
  },
  avatar: {
    width: responsiveScreenWidth(9),
    height: responsiveScreenWidth(9),
    borderRadius: responsiveScreenWidth(4.5),
  },
  avatarPlaceholder: {
    width: responsiveScreenWidth(9),
    height: responsiveScreenWidth(9),
    borderRadius: responsiveScreenWidth(4.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
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
  title: {
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: responsiveScreenHeight(1),
    color: '#1F2937',
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
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#2C3E50',
  },
});
