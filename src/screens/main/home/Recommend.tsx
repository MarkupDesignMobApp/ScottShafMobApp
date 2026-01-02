import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native'
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions'

/* -------- ICONS (same as OptimizedFlatList) -------- */
const icons = {
  heartFilled: require('../../../../assets/image/heart.png'),
  bookmarkFilled: require('../../../../assets/image/bookmark.png'),
  shareOutline: require('../../../../assets/image/unfillshare.png'),
}

/* -------- STATIC DATA -------- */
const DATA = [
  {
    id: '1',
    user: 'Alex Chen',
    time: '2 hour ago',
    title: 'Top 5 Sci-Fi Movies of 2024',
    items: [
      {
        id: 'a',
        name: 'Dune: Part Two',
        image: 'https://via.placeholder.com/50',
      },
      {
        id: 'b',
        name: 'Civil War',
        image: 'https://via.placeholder.com/50',
      },
    ],
  },
  {
    id: '2',
    user: 'Alex Chen',
    time: '2 hour ago',
    title: "3 Coding tools I can’t live without",
    items: [
      {
        id: 'c',
        name: 'VS Code',
        image: 'https://via.placeholder.com/50',
      },
    ],
  },
]

/* -------- MAIN COMPONENT -------- */
export default function Recommend() {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <View style={styles.cardheading}>
        <Text style={styles.cardheadingtxt}>Recommended For You</Text>
      </View>

      {/* Feed */}
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PostCard item={item} />}
      />
    </View>
  )
}

/* -------- POST CARD -------- */
function PostCard({ item }) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.userRow}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.menu}>⋮</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Items */}
      {item.items.map(listItem => (
        <View key={listItem.id} style={styles.itemRow}>
          <Image source={{ uri: listItem.image }} style={styles.itemImage} />
          <Text style={styles.itemText}>{listItem.name}</Text>
        </View>
      ))}

      {/* ACTION BAR (SAME AS OPTIMIZED FLATLIST UI) */}
      <View style={styles.cardlike}>
        <ActionButton icon={icons.heartFilled} value="355k" />
        <ActionButton icon={icons.bookmarkFilled} value="120" />
        <ActionButton icon={icons.shareOutline} value="200" />
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

/* -------- STYLES -------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
 
  },

  /* Heading */
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

  /* Card */
  card: {
    borderWidth: 1.5,
    borderColor: '#2F6BFF',
    borderRadius: 10,
    padding: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(2),
  },

  /* Header */
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
  menu: {
    fontSize: responsiveScreenFontSize(2.4),
  },

  /* Content */
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

  /* Action Bar */
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
