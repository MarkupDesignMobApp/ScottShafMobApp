import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Share,
  Pressable,
  Alert,
} from 'react-native'
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions'
import {
  useGetRecommendItemsQuery,
  useLikeRecommendedMutation,
  useShareRecommendedMutation,
} from '../../../features/auth/authApi'

/* -------- ICONS / PLACEHOLDER -------- */
const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
  more: require('../../../../assets/image/dots.png'),
}

const PLACEHOLDER_IMAGE = require('../../../../assets/image/movie3.png')

/* -------- MAIN -------- */
export default function Recommend() {
  const [posts, setPosts] = useState([])

  const { data, isLoading, error, refetch } = useGetRecommendItemsQuery()
  const [likeRecommended] = useLikeRecommendedMutation()
  const [shareRecommended] = useShareRecommendedMutation()

  /* -------- MAP API DATA -------- */
  useEffect(() => {
    if (!data) return

    const rawList = Array.isArray(data) ? data : data?.data ?? []

    const mapped = rawList.map(apiItem => {
      const items = (apiItem.items || [])
        .map((it, index) => {
          const ci = it.catalog_item
          if (!ci) return null

          return {
            uid: `${apiItem.id}-${ci.id}-${index}`, // ✅ UNIQUE KEY
            id: String(ci.id),
            name: ci.name ?? 'Unknown',
            image: ci.image_url ? { uri: ci.image_url } : null,
          }
        })
        .filter(Boolean)

      return {
        id: String(apiItem.id),
        user: apiItem.user?.full_name ?? 'Unknown',
        time: formatTimeAgo(apiItem.created_at),
        title: apiItem.title ?? '',
        likes: Number(apiItem.likes_count ?? 0),
        isLiked: Boolean(apiItem.is_liked),
        items,
      }
    })

    setPosts(mapped)
  }, [data])

  /* -------- ACTIONS -------- */
  const onLikePress = async postId => {
    try {
      await likeRecommended(postId).unwrap()
      refetch()
    } catch (e) {
      console.log('Like error', e)
    }
  }

  const onSharePress = async (postId, title) => {
    try {
      const res = await shareRecommended({ id: postId }).unwrap()
      const url = res?.share_url

      if (!url) {
        Alert.alert('Error', 'Share link not available')
        return
      }

      await Share.share({
        title,
        message: `${title}\n\n${url}`,
        url,
      })
    } catch (e) {
      console.log('Share error', e)
    }
  }

  /* -------- STATES -------- */
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading recommendations...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { padding: 16 }]}>
        <Pressable onPress={refetch}>
          <Text style={{ color: '#2F6BFF' }}>Try again</Text>
        </Pressable>
      </View>
    )
  }

  /* -------- RENDER -------- */
  return (
    <View style={styles.container}>
      <View style={styles.cardheading}>
        <Text style={styles.cardheadingtxt}>Recommended For You</Text>
      </View>

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
        ListEmptyComponent={<Text style={{ padding: 16 }}>No recommendations yet.</Text>}
      />
    </View>
  )
}

/* -------- POST CARD -------- */
function PostCard({ item, onLikePress, onSharePress }) {
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
        <Image source={icons.more} style={styles.menuIcon} />
      </View>

      <Text style={styles.title}>{item.title}</Text>

      {item.items.map((listItem, index) => (
        <View
          key={listItem.uid} // ✅ FIXED UNIQUE KEY
          style={styles.itemRow}
        >
          <Image
            source={listItem.image ?? PLACEHOLDER_IMAGE}
            style={styles.itemImage}
            resizeMode="cover"
          />
          <Text style={styles.itemText}>{listItem.name}</Text>
        </View>
      ))}

      <View style={styles.cardlike}>
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
  )
}

/* -------- ACTION BUTTON -------- */
const ActionButton = React.memo(({ icon, value }) => (
  <View style={styles.likecontainer}>
    <View style={styles.imgcontainer3}>
      <Image resizeMode="contain" style={styles.img} source={icon} />
    </View>
    <Text style={styles.liketxt}>{value}</Text>
  </View>
))

/* -------- HELPERS -------- */
const formatNumber = num => {
  const n = Number(num ?? 0)
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

function formatTimeAgo(isoString) {
  if (!isoString) return ''
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000)
  if (diff < 60) return `${diff}s ago`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/* -------- STYLES (UNCHANGED) -------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  cardheading: {
    paddingTop: responsiveScreenHeight(2.5),
    paddingBottom: responsiveScreenHeight(2),
  },
  cardheadingtxt: {
    fontFamily: 'Quicksand-Regular',
    color: '#000',
    fontSize: responsiveScreenFontSize(2.25),
    fontWeight: '500',
  },

  menuIcon: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenWidth(5),
    resizeMode: 'contain',
  },

  card: {
    borderWidth: 1.5,
    borderColor: '#2F6BFF',
    borderRadius: 10,
    padding: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(2),
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
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
  },
  time: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#777',
  },

  title: {
    fontSize: responsiveScreenFontSize(1.9),
    fontWeight: '600',
    marginVertical: responsiveScreenHeight(1),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06B6F0',
    padding: responsiveScreenWidth(3),
    borderRadius: 8,
    marginBottom: responsiveScreenHeight(1),
  },
  itemImage: {
    width: responsiveScreenWidth(10),
    height: responsiveScreenWidth(10),
    borderRadius: 6,
    marginRight: responsiveScreenWidth(3),
  },
  itemText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.7),
  },

  cardlike: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
    paddingTop: responsiveScreenHeight(1.5),
    marginTop: responsiveScreenHeight(1),
  },
  likecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: responsiveScreenWidth(5),
  },
  imgcontainer3: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenWidth(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  liketxt: {
    fontSize: responsiveScreenFontSize(1.6),
    marginLeft: responsiveScreenWidth(1),
    color: '#000',
    fontFamily: 'Quicksand-Regular',
  },
})
