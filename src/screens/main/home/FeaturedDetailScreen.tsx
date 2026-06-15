import React, { useEffect, useState, useCallback } from 'react';
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
  Alert,
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


  const handleShare = () => Alert.alert('Share', `Share ${item.name}`);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <View style={styles.modalDragHandle} />

            {/* Scrollable Content */}
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {/* Hero Image Section */}
              <View style={styles.modalImageWrapper}>
                <Image
                  source={item.image ? { uri: item.image } : icons.placeholder}
                  style={styles.modalImage}
                  defaultSource={icons.placeholder}
                />
                <View style={styles.modalImageGradient} />

                {/* Position Badge */}
                <View style={styles.modalPositionBadge}>
                  <Text style={styles.modalPositionNumber}>
                    #{item.position}
                  </Text>
                  <Text style={styles.modalPositionLabel}>Rank</Text>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.modalCloseBtn}
                >
                  <Image source={icons.close} style={styles.modalCloseIcon} />
                </TouchableOpacity>
              </View>

              {/* Content Area */}
              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>{item.name}</Text>

                {/* Metadata Row */}
                <View style={styles.modalMetaRow}>
                  <View style={styles.modalMetaChip}>
                    <Image source={icons.user} style={styles.modalMetaIcon} />
                    <Text style={styles.modalMetaText}>Featured Selection</Text>
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
                  {item.description ||
                    'No description available for this item.'}
                </Text>

         
              </View>
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

/* ---------------- MAIN SCREEN ---------------- */
export default function FeaturedDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<FeaturedDetailRouteProp>();
  const { itemId } = route.params ?? {};

  const [selectedItem, setSelectedItem] = useState<FeaturedListItem | null>(
    null,
  );
  const [itemDetailVisible, setItemDetailVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [listTitle, setListTitle] = useState('Featured Items');

  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useGetFeaturedListItemsQuery(itemId ?? 0, {
    skip: !itemId,
  });

  useEffect(() => {
    if (items.length > 0 && items[0]?.featured_list?.title) {
      setListTitle(items[0].featured_list.title);
    }
  }, [items]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleItemPress = (item: FeaturedListItem) => {
    setSelectedItem(item);
    setItemDetailVisible(true);
  };

  const handleBackPress = () => navigation.goBack();

  const renderGridItem = ({
    item,
    index,
  }: {
    item: FeaturedListItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={item.image ? { uri: item.image } : icons.placeholder}
          style={styles.itemImage}
          defaultSource={icons.placeholder}
        />
        <View style={styles.imageOverlay} />

        {/* Premium Position Badge */}
        <View style={styles.positionBadge}>
          <Text style={styles.positionBadgeText}>#{index + 1}</Text>
        </View>

        {/* Catalog Indicator */}
        {item.catalog_item_id && (
          <View style={styles.catalogIndicator}>
            <Image source={icons.location} style={styles.catalogIcon} />
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <Image source={icons.clock} style={styles.tagIcon} />
            <Text style={styles.tagText}>Featured</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6B4EFF" />
        <Text style={styles.loadingText}>Curating beautiful items...</Text>
      </View>
    );
  }

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
              <View style={styles.itemCountBadge}>
                <Text style={styles.itemCountText}>{items.length}</Text>
              </View>
            </View>

            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </View>

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

      <ItemDetailModal
        visible={itemDetailVisible}
        onClose={() => setItemDetailVisible(false)}
        item={selectedItem}
      />
    </View>
  );
}

/* ---------------- PROFESSIONAL STYLES ---------------- */
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackIcon: {
    width: 22,
    height: 22,
    tintColor: '#1A2C3E',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    color: '#1A2C3E',
    letterSpacing: -0.3,
  },
  itemCountBadge: {
    backgroundColor: '#6B4EFF20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  itemCountText: {
    fontSize: 13,
    fontFamily: 'Quicksand-SemiBold',
    color: '#6B4EFF',
  },
  headerRight: {
    width: 44,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  listHeader: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  listHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1A2C3E',
    letterSpacing: -0.2,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
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
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  positionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#6B4EFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  positionBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Quicksand-Bold',
    letterSpacing: 0.5,
  },
  catalogIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
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
        elevation: 3,
      },
    }),
  },
  catalogIcon: {
    width: 16,
    height: 16,
    tintColor: '#6B4EFF',
  },
  cardContent: {
    padding: 14,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1A2C3E',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemDescription: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#5A6E7A',
    marginBottom: 10,
    lineHeight: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  tagIcon: {
    width: 12,
    height: 12,
    tintColor: '#6B4EFF',
    marginRight: 6,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'Quicksand-Medium',
    color: '#6B4EFF',
    letterSpacing: -0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    opacity: 0.6,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    color: '#1A2C3E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Quicksand-Regular',
    color: '#5A6E7A',
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
    color: '#1A2C3E',
    marginBottom: 20,
    textAlign: 'center',
  },
  backBtn: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  backBtnGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#6B4EFF',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.9,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  modalDragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E5EC',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 280,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalPositionBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#6B4EFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalPositionNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Quicksans-Bold',
  },
  modalPositionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    opacity: 0.9,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalCloseIcon: {
    width: 22,
    height: 22,
    tintColor: '#1A2C3E',
  },
  modalBody: {
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
    color: '#1A2C3E',
    marginBottom: 16,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  modalMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  modalMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    gap: 8,
  },
  modalMetaIcon: {
    width: 16,
    height: 16,
    tintColor: '#6B4EFF',
  },
  modalMetaText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    color: '#2C3E50',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFF3F8',
    marginVertical: 20,
  },
  modalSectionTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1A2C3E',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Quicksand-Regular',
    color: '#5A6E7A',
    marginBottom: 28,
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalActionBtn: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  modalActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  likeGradient: {
    backgroundColor: '#FF3B6F',
  },
  saveGradient: {
    backgroundColor: '#6B4EFF',
  },
  shareGradient: {
    backgroundColor: '#34C759',
  },
  modalActionIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
  },
  modalActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Quicksand-SemiBold',
    letterSpacing: 0.2,
  },
});
