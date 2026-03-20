import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetFeaturedListItemsQuery } from '../../../features/auth/authApi';
import { FeaturedListItem } from '../../../features/auth/authTypes';
import { MainStackParamList } from '../../../navigation/types/navigation';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

/* ---------------- ICONS ---------------- */
const icons = {
  close: require('../../../../assets/image/close.png'),
  back: require('../../../../assets/image/left-icon.png'),
  placeholder: require('../../../../assets/image/cofee.png'),
  clock: require('../../../../assets/image/clock.png'),
  user: require('../../../../assets/image/user.png'),
  location: require('../../../../assets/image/location.png'),
  heart: require('../../../../assets/image/heart.png'),
  heartOutline: require('../../../../assets/image/unfillheart.png'),
  bookmark: require('../../../../assets/image/bookmark.png'),
  bookmarkOutline: require('../../../../assets/image/unfillbookmark.png'),
  share: require('../../../../assets/image/unfillshare.png'),
};

/* ---------------- ROUTE TYPE ---------------- */
type FeaturedDetailRouteProp = RouteProp<
  { FeaturedDetail: { itemId?: number } },
  'FeaturedDetail'
>;

/* ---------------- ITEM DETAIL MODAL ---------------- */
const ItemDetailModal = ({
  visible,
  onClose,
  item,
}: {
  visible: boolean;
  onClose: () => void;
  item: FeaturedListItem | null;
}) => {
  if (!item) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header with close button */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Image source={icons.close} style={styles.modalCloseIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Image with overlay */}
            <View style={styles.modalImageContainer}>
              <Image
                source={item.image ? { uri: item.image } : icons.placeholder}
                style={styles.modalImage}
                defaultSource={icons.placeholder}
              />
              <View style={styles.modalImageOverlay} />

              {/* Position badge on image */}
              <View style={styles.modalPositionBadge}>
                <Text style={styles.modalPositionText}>#{item.position}</Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{item.name}</Text>

              {/* Meta Info Chips */}
              <View style={styles.modalMetaContainer}>
                <View style={styles.modalMetaChip}>
                  <Image source={icons.user} style={styles.modalMetaIcon} />
                  <Text style={styles.modalMetaText}>Featured</Text>
                </View>

                {item.catalog_item_id && (
                  <View style={styles.modalMetaChip}>
                    <Image
                      source={icons.location}
                      style={styles.modalMetaIcon}
                    />
                    <Text style={styles.modalMetaText}>Catalog Item</Text>
                  </View>
                )}
              </View>

              <View style={styles.divider} />

              {/* Description */}
              <Text style={styles.modalSectionTitle}>Description</Text>
              <Text style={styles.modalDescription}>
                {item.description || 'No description available for this item.'}
              </Text>

              {/* Action Buttons */}
              {/* <View style={styles.modalActionContainer}>
                <TouchableOpacity style={styles.modalActionBtn}>
                  <View style={[styles.modalActionGradient, { backgroundColor: '#FF1493' }]}>
                    <Image source={icons.heart} style={styles.modalActionIcon} />
                    <Text style={styles.modalActionText}>Like</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalActionBtn}>
                  <View style={[styles.modalActionGradient, { backgroundColor: '#6B4EFF' }]}>
                    <Image source={icons.bookmark} style={styles.modalActionIcon} />
                    <Text style={styles.modalActionText}>Save</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalActionBtn}>
                  <View style={[styles.modalActionGradient, { backgroundColor: '#34C759' }]}>
                    <Image source={icons.share} style={styles.modalActionIcon} />
                    <Text style={styles.modalActionText}>Share</Text>
                  </View>
                </TouchableOpacity>
              </View> */}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* ---------------- MAIN SCREEN ---------------- */
export default function FeaturedDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<FeaturedDetailRouteProp>();
  const { itemId } = route.params ?? {};

  console.log('FeaturedDetail - Received itemId:', itemId);

  // States
  const [selectedItem, setSelectedItem] = useState<FeaturedListItem | null>(
    null,
  );
  const [itemDetailVisible, setItemDetailVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [listTitle, setListTitle] = useState('Featured Items');

  // Fetch featured list items
  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useGetFeaturedListItemsQuery(itemId ?? 0, {
    skip: !itemId,
  });

  // Update title if items exist
  useEffect(() => {
    if (items.length > 0 && items[0]?.featured_list?.title) {
      setListTitle(items[0].featured_list.title);
    }
  }, [items]);

  // Handlers
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleItemPress = (item: FeaturedListItem) => {
    setSelectedItem(item);
    setItemDetailVisible(true);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Render each grid item
  const renderGridItem = ({
    item,
    index,
  }: {
    item: FeaturedListItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={item.image ? { uri: item.image } : icons.placeholder}
          style={styles.itemImage}
          defaultSource={icons.placeholder}
        />

        {/* Position Badge */}
        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>#{index + 1}</Text>
        </View>

        {/* Category indicator (instead of showing ID) */}
        {item.catalog_item_id && (
          <View style={styles.categoryIndicator}>
            <Image source={icons.location} style={styles.categoryIcon} />
          </View>
        )}
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>

        {item.description ? (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : (
          <Text style={styles.itemDescription} numberOfLines={2}>
            No description available
          </Text>
        )}

        {/* Tags instead of ID text */}
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <Image source={icons.clock} style={styles.tagIcon} />
            <Text style={styles.tagText}>Featured</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6B4EFF" />
        <Text style={styles.loadingText}>Curating beautiful items...</Text>
      </View>
    );
  }

  // Error or no ID state
  if (error || !itemId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {!itemId ? 'No collection selected' : 'Failed to load collection'}
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
          <View
            style={[styles.backBtnGradient, { backgroundColor: '#6B4EFF' }]}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />

      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.headerBackBtn}
            >
              <Image source={icons.back} style={styles.headerBackIcon} />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{listTitle}</Text>
              <Text style={styles.headerSubtitle}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Text>
            </View>

            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </View>

      {/* Items Grid */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderGridItem}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6B4EFF']}
              tintColor="#6B4EFF"
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>All Items</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={icons.placeholder} style={styles.emptyImage} />
          <Text style={styles.emptyTitle}>No items found</Text>
          <Text style={styles.emptyText}>
            This collection doesn't have any items yet.
          </Text>
        </View>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        visible={itemDetailVisible}
        onClose={() => setItemDetailVisible(false)}
        item={selectedItem}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    padding: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackIcon: {
    width: 20,
    height: 20,
    tintColor: '#2C3E50',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Quicksand-Medium',
    color: '#6B4EFF',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  listHeader: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  listHeaderTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.9,
    backgroundColor: '#F0F2F5',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  positionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  positionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
  },
  categoryIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryIcon: {
    width: 16,
    height: 16,
    tintColor: '#6B4EFF',
  },
  itemContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemDescription: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#7F8C8D',
    marginBottom: 8,
    lineHeight: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagIcon: {
    width: 10,
    height: 10,
    tintColor: '#6B4EFF',
    marginRight: 4,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Quicksand-Medium',
    color: '#6B4EFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    opacity: 0.5,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    color: '#6B4EFF',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  backBtn: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  backBtnGradient: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#6B4EFF',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 12,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalCloseIcon: {
    width: 18,
    height: 18,
    tintColor: '#2C3E50',
  },
  modalImageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalPositionBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalPositionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  modalBody: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 26,
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  modalMetaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  modalMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalMetaIcon: {
    width: 14,
    height: 14,
    tintColor: '#6B4EFF',
    marginRight: 6,
  },
  modalMetaText: {
    fontSize: 13,
    fontFamily: 'Quicksand-Medium',
    color: '#4B5563',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginVertical: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'Quicksand-Regular',
    color: '#4B5563',
    marginBottom: 24,
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalActionBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 25,
    overflow: 'hidden',
  },
  modalActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  modalActionIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
    marginRight: 6,
  },
  modalActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Quicksand-SemiBold',
  },
});
