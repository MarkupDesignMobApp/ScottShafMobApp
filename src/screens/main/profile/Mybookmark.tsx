import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native'
import {
  responsiveScreenHeight as h,
  responsiveScreenWidth as w,
  responsiveScreenFontSize as f,
} from 'react-native-responsive-dimensions'
import AppHeader from '../../../components/ui/AppButton/AppHeader'

const DATA = [
  {
    id: '1',
    image: require('../../../../assets/image/bookmark1.png'),
    tag: '#Coffee',
    title: 'Top 5 Coffee Shops In NYC',
    author: 'By Sarah',
    category: 'Food & Drinks',
  },
  {
    id: '2',
    image: require('../../../../assets/image/bookmark3.png'),
    tag: '#Coffee',
    title: 'Top 5 Coffee Shops In NYC',
    author: 'By Sarah',
    category: 'Food & Drinks',
  },
  {
    id: '3',
    image: require('../../../../assets/image/bookmark4.png'),
    tag: '#Coffee',
    title: 'Top 5 Coffee Shops In NYC',
    author: 'By Sarah',
    category: 'Food & Drinks',
  },
]

export default function Mybookmark({ navigation }:any) {
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const openModal = (item: any) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const deleteItem = () => {
    console.log('Deleted:', selectedItem?.title)
    setShowModal(false)
  }

  const renderItem = ({ item }: any) => (
    <View>
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />

        <View style={styles.textContainer}>
          <Text style={styles.tag}>{item.tag}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.row}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => openModal(item)}>
          <Image
            source={require('../../../../assets/image/dots.png')}
            style={styles.moreIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />
    </View>
  )

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Bookmark"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Image
          source={require('../../../../assets/image/search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search articles"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      <FlatList data={DATA} renderItem={renderItem} />

      {/* Delete Modal */}
      <Modal transparent visible={showModal} animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Image
        source={require('../../../../assets/image/bookmarkdelete.png')}
        style={styles.deleteIcon}
      />

      <Text
        style={styles.modalTitle}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Delete {selectedItem?.title}
      </Text>

      <Text
        style={styles.modalDesc}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Are you sure you want to delete this bookmark?
      </Text>

      <View style={styles.modalRow}>
        <TouchableOpacity
          style={styles.keepBtn}
          onPress={() => setShowModal(false)}
        >
          <Text style={styles.keepText}>No, Keep It</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteItem}>
          <Text style={styles.deleteText}>Yes, Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: w(5),
    paddingTop: h(3),
  },

  /* Search */
  searchBox: {
    height: h(6),
    borderRadius: h(3),
    borderWidth: 1,
    borderColor: '#ACACAC',
    paddingHorizontal: w(4),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(2),
    marginTop: h(2),
  },

  searchIcon: {
    width: w(5),
    height: w(5),
    resizeMode: 'contain',
    tintColor: '#9CA3AF',
    marginRight: w(2),
  },

  searchInput: {
    fontSize: f(2),
    flex: 1,
  },

  /* Card */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: w(22),
    height: h(10),
    borderRadius: h(1),
  },

  textContainer: {
    flex: 1,
    marginLeft: w(4),
  },

  tag: {
    color: '#0180FE',
    fontSize: f(1.7),
    fontWeight: '600',
    fontFamily:'Quicksand-Regular',
    marginBottom:h(0.2)
  },

  title: {
    fontSize: f(2),
    fontWeight: '700',
   color:'#000000',
    fontFamily:'Quicksand-Bold',
    marginBottom:h(0.2)
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },

  author: {
    color: '#6B7280',
    fontFamily:'Quicksand-light',
    marginBottom:h(0.2)
  },

  dot: {
    marginHorizontal: 6,
    color: '#0180FE',
    fontSize: f(2),   
    fontWeight: '900', 
  },
  

  category: {
    color: '#6B7280',
    fontFamily:'Quicksand-light',
    marginBottom:h(0.2)
  },

  moreIcon: {
    width: w(4.5),
    height: w(4.5),
    resizeMode: 'contain',
    tintColor: '#9CA3AF',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: h(1.5),
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: w(80),
    backgroundColor: '#fff',
    borderRadius: h(2),
    padding: h(3),
    alignItems: 'center',
  },

  deleteIcon: {
    width: w(15),
    height: w(15),
    marginBottom: h(2),
  },

  modalTitle: {
    fontSize: f(2.2),
    fontWeight: '700',
    color: '#000000',
    marginBottom: h(0.5),
    width: '100%',
    textAlign: 'center',
    fontFamily:'Quicksand-Bold',
  },
  
  modalDesc: {
    fontSize: f(1.8),
    color: '#000000',
    textAlign: 'center',
    marginBottom: h(3),
    width: '100%',
    fontFamily:'Quicksand-light',
  },
  

  modalRow: {
    flexDirection: 'row',
  },

  keepBtn: {
    borderWidth: 1,
    borderColor: '#00C4FA',
    paddingVertical: h(1.2),
    paddingHorizontal: w(6),
    borderRadius: h(3),
    marginRight: w(3),
  },

  keepText: {
    color: '#00C4FA',
    fontFamily:'Quicksand-light',
  },

  deleteBtn: {
    backgroundColor: '#FF0000',
    paddingVertical: h(1.2),
    paddingHorizontal: w(6),
    borderRadius: h(3),
  },

  deleteText: {
    color: '#fff',
    fontFamily:'Quicksand-light',
  },
})
