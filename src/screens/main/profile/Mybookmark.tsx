import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native'
import {
  responsiveScreenHeight as h,
  responsiveScreenWidth as w,
  responsiveScreenFontSize as f,
} from 'react-native-responsive-dimensions'
import AppHeader from '../../../components/ui/AppButton/AppHeader'
import {
  useGetMyBookFeaturedQuery,
  useDeleteMyBookFeaturedMutation,
} from '../../../features/auth/authApi'
import { useFocusEffect } from '@react-navigation/native'

export default function Mybookmark({ navigation }: any) {
  const { data, isLoading, refetch } = useGetMyBookFeaturedQuery()
  const [deleteMyBookFeatured] = useDeleteMyBookFeaturedMutation()
  useFocusEffect(()=>{
    refetch();
  })

  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)


  // search state
  const [searchText, setSearchText] = useState('')

  const openModal = (item: any) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const deleteItem = async () => {
    if (!selectedItem) return
    setIsDeleting(true)
    try {
      await deleteMyBookFeatured(selectedItem.id).unwrap()
      setShowModal(false)
      refetch()
    } catch (err) {
      console.log('Delete error', err)
    } finally {
      setIsDeleting(false)
    }
  }
  
  // show search only when original data exists and has items
  const hasData = !!(data?.data && Array.isArray(data.data) && data.data.length > 0)

  // filtered data based on search input
  const filteredData = useMemo(() => {
    const items = data?.data || []
    if (!searchText) return items
    const q = searchText.toLowerCase()
    return items.filter(item => {
      const title = (item.title || '').toString().toLowerCase()
      const category = (item.category?.name || '').toString().toLowerCase()
      const interest = (item.interest?.name || '').toString().toLowerCase()
      return title.includes(q) || category.includes(q) || interest.includes(q)
    })
  }, [data?.data, searchText])

  const renderItem = ({ item }: any) => (
    <View>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.textContainer}>
          <Text style={styles.tag}>#{item.interest?.name}</Text>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.row}>
            <Text style={styles.author}>{item.status} items</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.category}>{item.category?.name}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => openModal(item)}>
          <Image
            source={require('../../../../assets/image/dots.png')}
            style={styles.moreIcon}
          />
        </TouchableOpacity>
      </View>

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

      {/* Search -> only render when we have data */}
      {hasData && (
        <View style={styles.searchBox}>
          <Image
            source={require('../../../../assets/image/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search articles"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            underlineColorAndroid="transparent"
          />
        </View>
      )}

      {/* Loader */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0180FE" style={{ flex:1 }} />
      ) : (
        <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: w(4), paddingBottom: h(4) }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: h(10) }}>
            <Image
              source={require('../../../../assets/image/notificationnotfount.jpg')}
              style={{ width: 300, height: 300, resizeMode: 'contain' }}
            />
            <Text style={{ textAlign: 'center', marginTop: h(2), color: '#6B7280' }}>
              {hasData ? 'No results found' : 'No Bookmarks Found'}
            </Text>
          </View>
        }
      />
      
      )}

      {/* Delete Modal */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Image
              source={require('../../../../assets/image/bookmarkdelete.png')}
              style={styles.deleteIcon}
            />

            <Text style={styles.modalTitle} numberOfLines={1}>
              Delete {selectedItem?.title}
            </Text>

            <Text style={styles.modalDesc}>
              Are you sure you want to delete this bookmark?
            </Text>

            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.keepBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.keepText}>No, Keep It</Text>
              </TouchableOpacity>

              <TouchableOpacity
  style={styles.deleteBtn}
  onPress={deleteItem}
  disabled={isDeleting}
>
  {isDeleting ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.deleteText}>Yes, Delete</Text>
  )}
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
  },

  searchBox: {
    height: h(6),
    borderRadius: h(3),
    borderWidth: 1,
    borderColor: '#ACACAC',
    paddingHorizontal: w(3), 
    marginHorizontal: w(4), 
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
    paddingVertical: 0, // keep vertical padding consistent on Android/iOS
  },

  /* Card */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: w(1), 
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
    fontFamily: 'Quicksand-Regular',
    marginBottom: h(0.2),
  },

  title: {
    fontSize: f(2),
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Quicksand-Bold',
    marginBottom: h(0.2),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  author: {
    color: '#6B7280',
    fontFamily: 'Quicksand-light',
    marginBottom: h(0.2),
  },

  dot: {
    marginHorizontal: 6,
    color: '#0180FE',
    fontSize: f(2),
    fontWeight: '900',
  },

  category: {
    color: '#6B7280',
    fontFamily: 'Quicksand-light',
    marginBottom: h(0.2),
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
    fontFamily: 'Quicksand-Bold',
  },

  modalDesc: {
    fontSize: f(1.8),
    color: '#000000',
    textAlign: 'center',
    marginBottom: h(3),
    width: '100%',
    fontFamily: 'Quicksand-light',
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
    fontFamily: 'Quicksand-light',
  },

  deleteBtn: {
    backgroundColor: '#FF0000',
    paddingVertical: h(1.2),
    paddingHorizontal: w(6),
    borderRadius: h(3),
  },

  deleteText: {
    color: '#fff',
    fontFamily: 'Quicksand-light',
  },
})
