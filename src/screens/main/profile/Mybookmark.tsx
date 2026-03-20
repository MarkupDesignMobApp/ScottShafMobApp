import React, { useState, useMemo } from 'react';
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
  StatusBar,
} from 'react-native';
import {
  responsiveScreenHeight as h,
  responsiveScreenWidth as w,
  responsiveScreenFontSize as f,
} from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetMyBookFeaturedQuery,
  useDeleteMyBookFeaturedMutation,
} from '../../../features/auth/authApi';
import { useFocusEffect } from '@react-navigation/native';

export default function Mybookmark({ navigation }: any) {
  const { data, isLoading, refetch } = useGetMyBookFeaturedQuery();
  const [deleteMyBookFeatured] = useDeleteMyBookFeaturedMutation();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      return () => { };
    }, [refetch])
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // search state
  const [searchText, setSearchText] = useState('');

  const openModal = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const deleteItem = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    try {
      await deleteMyBookFeatured(selectedItem.id).unwrap();
      setShowModal(false);
      refetch();
    } catch (err) {
      console.log('Delete error', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // show search only when original data exists and has items
  const hasData = !!(
    data?.data &&
    Array.isArray(data.data) &&
    data.data.length > 0
  );

  // filtered data based on search input
  const filteredData = useMemo(() => {
    const items = data?.data || [];
    if (!searchText) return items;
    const q = searchText.toLowerCase();
    return items.filter(item => {
      const title = (item.title || '').toString().toLowerCase();
      const category = (item.category?.name || '').toString().toLowerCase();
      const interest = (item.interest?.name || '').toString().toLowerCase();
      return title.includes(q) || category.includes(q) || interest.includes(q);
    });
  }, [data?.data, searchText]);


  const renderItem = ({ item }: any) => (
    <View>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FeaturedDetail', { itemId: item.id })}
          style={styles.cardTouchable}
          activeOpacity={0.7}
        >
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
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openModal(item)}
          style={styles.moreButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../../../../assets/image/dots.png')}
            style={styles.moreIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
    </View>
  );

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />

      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      {/* Custom Header with Theme Color */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={require('../../../../assets/image/left-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookmark</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.container}>
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
        {console.log("Sumitra", filteredData)}
        {/* Loader */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#2C3E50" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: w(4),
              paddingBottom: h(4),
            }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: h(10) }}>
                <Image
                  source={require('../../../../assets/image/notificationnotfount.jpg')}
                  style={{ width: 300, height: 300, resizeMode: 'contain' }}
                />

                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: h(2),
                    color: '#6B7280',
                  }}
                >
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

              <Text
                style={styles.modalTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C3E50',
    paddingHorizontal: w(4),
    paddingVertical: h(1.5),
  },
  backButton: {
    padding: w(1),
  },
  cardContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: w(1),
  },
  moreButton: {
    padding: w(2),
    marginLeft: w(2),
    zIndex: 1,
  },
  backIcon: {
    width: w(6),
    height: w(6),
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: f(2.2),
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
  },
  headerRight: {
    width: w(6),
  },
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
    paddingVertical: 0,
    fontFamily: 'Quicksand-Regular',
  },
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
    color: '#2C3E50',
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
    fontFamily: 'Quicksand-Light',
    marginBottom: h(0.2),
  },
  dot: {
    marginHorizontal: 6,
    color: '#2C3E50',
    fontSize: f(2),
    fontWeight: '900',
  },
  category: {
    color: '#6B7280',
    fontFamily: 'Quicksand-Light',
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
    fontFamily: 'Quicksand-Light',
  },
  modalRow: {
    flexDirection: 'row',
  },
  keepBtn: {
    borderWidth: 1,
    borderColor: '#2C3E50',
    paddingVertical: h(1.2),
    paddingHorizontal: w(6),
    borderRadius: h(3),
    marginRight: w(3),
  },
  keepText: {
    color: '#2C3E50',
    fontFamily: 'Quicksand-Regular',
  },
  deleteBtn: {
    backgroundColor: '#FF0000',
    paddingVertical: h(1.2),
    paddingHorizontal: w(6),
    borderRadius: h(3),
  },
  deleteText: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
  },
});