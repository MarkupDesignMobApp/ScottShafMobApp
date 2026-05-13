import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Share,               // ✅ built-in Share API
  Alert,
  Pressable,
  TouchableOpacity,
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
  useShareRecommendedMutation,
  useCloneListMutation,
} from '../../../features/auth/authApi';

const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
  clone: require('../../../../assets/image/copy.png'),
  // 'more' icon removed
};

const PLACEHOLDER_IMAGE = require('../../../../assets/image/movie3.png');

export default function Recommend() {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'original' | 'cloned'>('original');

  const { data, isLoading, error, refetch } = useGetRecommendItemsQuery();
  const [likeRecommended] = useLikeRecommendedMutation();
  const [shareRecommended] = useShareRecommendedMutation();
  const [cloneList, { isLoading: cloneLoading }] = useCloneListMutation();

  useEffect(() => {
    if (!data) return;

    const rawList = Array.isArray(data) ? data : data?.data ?? [];

    const mapped = rawList.map((apiItem: any) => {
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

      const isCloned = isClonedList(apiItem);

      return {
        id: String(apiItem.id),
        user: apiItem.user?.full_name ?? 'Unknown',
        time: formatTimeAgo(apiItem.created_at),
        title: apiItem.title ?? '',
        likes: Number(apiItem.likes_count ?? 0),
        isLiked: Boolean(apiItem.is_liked),
        items,
        isCloned,
        canClone: !isCloned,
      };
    });

    setPosts(mapped);
  }, [data]);

  const originalPosts = useMemo(
    () => posts.filter(item => !item.isCloned),
    [posts]
  );

  const clonedPosts = useMemo(
    () => posts.filter(item => item.isCloned),
    [posts]
  );

  const visiblePosts = activeTab === 'original' ? originalPosts : clonedPosts;

  const onLikePress = async (postId: string) => {
    try {
      await likeRecommended(postId).unwrap();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  // ✅ Using React Native's built-in Share API
  const onSharePress = async (postId: string, title: string) => {
    try {
      const res: any = await shareRecommended({ id: postId }).unwrap();
      const url = res?.share_url;

      if (!url) {
        Alert.alert('Error', 'Share link not available');
        return;
      }

      // Opens native share sheet (supports all social media platforms)
      await Share.share({
        title: title,
        message: `${title}\n\n${url}`,
        url: url,
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to share');
    }
  };

  const onClonePress = async (item: any) => {
    if (!item.canClone) {
      Alert.alert('Not allowed', 'You can clone only original lists.');
      return;
    }

    try {
      const res: any = await cloneList(item.id).unwrap();
      Alert.alert('Success', `${res.title} cloned successfully`);
      console.log('CLONED LIST', res);
      refetch();
    } catch (e: any) {
      console.log('CLONE ERROR', e);
      Alert.alert('Error', e?.data?.message || 'Failed to clone list');
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

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'original' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('original')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'original' && styles.tabTextActive,
            ]}
          >
            Original ({originalPosts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'cloned' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('cloned')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'cloned' && styles.tabTextActive,
            ]}
          >
            Cloned ({clonedPosts.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={visiblePosts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          visiblePosts.length === 0 ? styles.emptyList : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {activeTab === 'original'
                ? 'No original lists found'
                : 'No cloned lists found'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            item={item}
            onLikePress={onLikePress}
            onSharePress={onSharePress}
            onClonePress={onClonePress}
            cloneLoading={cloneLoading}
            showCloneButton={activeTab === 'original'}
          />
        )}
      />
    </View>
  );
}

// ------------------- PostCard Component -------------------
function PostCard({
  item,
  onLikePress,
  onSharePress,
  onClonePress,
  cloneLoading,
  showCloneButton,
}: any) {
  return (
    <View style={styles.card}>
      <View style={styles.userRow}>
        <Image
          source={require('../../../../assets/image/women1.png')}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <View style={styles.badgeWrap}>
          <Text
            style={[
              styles.badge,
              item.isCloned ? styles.badgeCloned : styles.badgeOriginal,
            ]}
          >
            {item.isCloned ? 'Cloned' : 'Original'}
          </Text>
        </View>

        {/* Three vertical dots removed */}
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

        <Pressable onPress={() => onSharePress(item.id, item.title)}>
          {/* <ActionButton icon={icons.shareOutline} value="Share" /> */}
        </Pressable>

        {showCloneButton && item.canClone ? (
          <TouchableOpacity
            style={styles.cloneButton}
            onPress={() => onClonePress(item)}
            disabled={cloneLoading}
          >
            {cloneLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Image source={icons.clone} style={styles.cloneIcon} />
                <Text style={styles.cloneText}>Clone</Text>
              </>
            )}
          </TouchableOpacity>
        ) : null}
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

function isClonedList(apiItem: any) {
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
    title.includes('copy')
  );
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EAF0F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: responsiveScreenHeight(2),
  },
  tabButton: {
    flex: 1,
    paddingVertical: responsiveScreenHeight(1.1),
    borderRadius: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#2C3E50',
  },
  tabText: {
    fontSize: responsiveScreenFontSize(1.6),
    fontFamily: 'Quicksand-SemiBold',
    color: '#5F6B7A',
  },
  tabTextActive: {
    color: '#FFFFFF',
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
  badgeWrap: {
    marginRight: responsiveScreenWidth(2),
  },
  badge: {
    fontSize: responsiveScreenFontSize(1.2),
    paddingHorizontal: responsiveScreenWidth(2.5),
    paddingVertical: responsiveScreenHeight(0.4),
    borderRadius: 999,
    overflow: 'hidden',
    fontFamily: 'Quicksand-SemiBold',
  },
  badgeOriginal: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  badgeCloned: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
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
  cloneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(0.8),
    borderRadius: 8,
    marginLeft: 'auto',
  },
  cloneIcon: {
    width: responsiveScreenWidth(4),
    height: responsiveScreenWidth(4),
    tintColor: '#FFF',
    marginRight: responsiveScreenWidth(1),
  },
  cloneText: {
    color: '#FFF',
    fontFamily: 'Quicksand-SemiBold',
    fontSize: responsiveScreenFontSize(1.5),
  },
});