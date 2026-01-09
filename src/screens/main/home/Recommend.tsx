import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Share,
  Pressable,
} from 'react-native'
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions'
import {useGetRecommendItemsQuery} from '../../../features/auth/authApi'

/* -------- ICONS -------- */
const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
  more: require('../../../../assets/image/dots.png'),
}

/* -------- STATIC DATA -------- */
const DATA = [
  {
    id: '1',
    user: 'Alex Chen',
    time: '2 hour ago',
    title: 'Top 5 Sci-Fi Movies of 2024',
    likes: 355000,
    isLiked: false,
    items: [
      {
        id: 'a',
        name: 'Dune: Part Two',
        image: require('../../../../assets/image/movie1.png'),
      },
      {
        id: 'b',
        name: 'Civil War',
        image: require('../../../../assets/image/movie2.png'),
      },
    ],
  },
  {
    id: '2',
    user: 'Alex Chen',
    time: '2 hour ago',
    title: "3 Coding tools I can’t live without",
    likes: 1200,
    isLiked: false,
    items: [
      {
        id: 'c',
        name: 'VS Code',
        image: require('../../../../assets/image/movie3.png'),
      },
    ],
  },
]

/* -------- MAIN -------- */
export default function Recommend() {
  const [posts, setPosts] = useState(DATA)

  const { data, isLoading, error, refetch } = useGetRecommendItemsQuery();
  console.log(data)

  const onLikePress = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newLike = !p.isLiked
          return {
            ...p,
            isLiked: newLike,
            likes: newLike ? p.likes + 1 : p.likes - 1,
          }
        }
        return p
      }),
    )
  }, [])

  const onSharePress = async (title: string) => {
    try {
      await Share.share({
        message: `Check this out: ${title}`,
      })
    } catch (error) {
      console.log(error)
    }
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
          <Image source={listItem.image} style={styles.itemImage} />
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

        <Pressable onPress={() => onSharePress(item.title)}>
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
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
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
