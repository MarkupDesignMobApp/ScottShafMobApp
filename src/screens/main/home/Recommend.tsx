import React, { useState, useCallback, useEffect } from 'react'
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
import { useGetRecommendItemsQuery , useLikeRecommendedMutation, useShareRecommendedMutation,useShareListQuery} from '../../../features/auth/authApi'

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
const { data:sharedata } = useShareListQuery(5);

  
  useEffect(() => {
    if (!data) return
    const rawList = Array.isArray(data) ? data : data?.data ?? []
    const mapped = rawList.map(apiItem => {
      const items = (apiItem.items || [])
        .map(it => {
          const ci = it.catalog_item
          if (!ci) return null 
          return {
            id: String(ci.id),
            name: ci.name ?? 'Unknown',
            image: { uri: ci.image_url },
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

  const onLikePress = async (itemId) => {
    console.log(itemId)
    if (!itemId) return;
    try {
      await likeRecommended(itemId).unwrap();
      refetch(); 
    } catch (e) {
      console.log('Like error', e);
    }
  };
  
  const onSharePress = async (itemId, title) => {
    try {
      // 1️⃣ Notify backend (must be valid platform)
      await shareRecommended({
        id: itemId,
     
      }).unwrap();
  
      // 2️⃣ Get real share link
      const res = await getShareLink(6).unwrap();
      console.log(res)
      const url = res?.share_url 
    alert(url)
  
      if (!url) {
        console.log('No share URL from API');
        return;
      }
  
      // 3️⃣ Open system share (Instagram, WhatsApp etc)
      await Share.share({
        title,
        message: `${title}\n\n${url}`,
        url,
      });
  
    } catch (e) {
      console.log('Share error', JSON.stringify(e, null, 2));
    }
  };
  
  
  if (isLoading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text>Loading recommendations...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, {padding: 16}]}>
        
        <Pressable onPress={() => refetch()}>
          <Text style={{ color: '#2F6BFF' }}>Try again</Text>
        </Pressable>
      </View>
    )
  }

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

      {item.items.map(listItem => (
        <View key={listItem.id} style={styles.itemRow}>
          <Image
            source={listItem.image && listItem.image.uri ? listItem.image : PLACEHOLDER_IMAGE}
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
          <ActionButton icon={icons.shareOutline} value={`Share`} />
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
  const then = new Date(isoString)
  const now = new Date()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return `${diff}s ago`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return then.toLocaleDateString()
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
