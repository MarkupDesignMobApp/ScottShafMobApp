import * as React from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { useGetCampaignsQuery } from '../../../features/auth/authApi';

/* ---------------- PROPS ---------------- */
type OptimizedFlatListProps = {
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
};

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = Math.min(screenWidth * 0.5, 320);
const CARD_GAP = responsiveScreenWidth(3.5);
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const CONTENT_RIGHT_PADDING = responsiveScreenWidth(4);
const FALLBACK_IMAGE = require('../../../../assets/image/cofee.png');

/* ---------------- MAIN CAROUSEL LIST ---------------- */
export default function OptimizedFlatList2({
  ListHeaderComponent,
  ListFooterComponent,
}: OptimizedFlatListProps) {
  const { data, isLoading, isError } = useGetCampaignsQuery();
  const [selectedCampaign, setSelectedCampaign] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalImageError, setModalImageError] = React.useState(false);

  const openModal = (item: any) => {
    setSelectedCampaign(item);
    setModalImageError(false); // reset error when opening new campaign
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCampaign(null);
  };

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => <CarouselCard item={item} onPress={() => openModal(item)} />,
    []
  );

  const keyExtractor = React.useCallback(
    (item: any, index: number) => item?.id?.toString() ?? index.toString(),
    []
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00C4FA" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load campaigns.</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No campaigns available</Text>
      </View>
    );
  }

  // Modal image source (same logic as carousel card)
  const modalImageSource =
    selectedCampaign?.image_url && !modalImageError
      ? { uri: `https://www.markupdesigns.net/scott-shafer/${selectedCampaign.image_url}` }
      : FALLBACK_IMAGE;

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContentContainer}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
        updateCellsBatchingPeriod={50}
        scrollEventThrottle={16}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        snapToAlignment="start"
        bounces={false}
      />

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.bigCard}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.bigCardScrollContent}
                >
                  <TouchableOpacity style={styles.bigCardClose} onPress={closeModal}>
                    <Text style={styles.bigCardCloseText}>✕</Text>
                  </TouchableOpacity>

                  {/* Modal Image with error handling */}
                  <View style={styles.bigCardImageContainer}>
                    <Image
                      resizeMode="cover"
                      style={styles.bigCardImage}
                      source={modalImageSource}
                      onError={() => setModalImageError(true)}
                    />
                    <View style={styles.bigCardImageOverlay} />
                  </View>

                  <View style={styles.bigCardContent}>
                    <View style={styles.bigCardBadge}>
                      <Text style={styles.bigCardBadgeText}>Sponsored</Text>
                    </View>
                    <Text style={styles.bigCardTitle}>
                      {selectedCampaign?.title ?? 'Untitled Campaign'}
                    </Text>
                    <Text style={styles.bigCardSubtitle}>
                      {selectedCampaign?.subtitle ??
                        'Discover amazing offers and experiences tailored just for you.'}
                    </Text>
                    {selectedCampaign?.description && (
                      <Text style={styles.bigCardDescription}>
                        {selectedCampaign.description}
                      </Text>
                    )}
                    {/* Optional: Add any additional campaign details here */}
                    {selectedCampaign?.start_date && (
                      <View style={styles.bigCardDetailRow}>
                        <Text style={styles.bigCardDetailLabel}>Start Date:</Text>
                        <Text style={styles.bigCardDetailValue}>
                          {new Date(selectedCampaign.start_date).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    {selectedCampaign?.end_date && (
                      <View style={styles.bigCardDetailRow}>
                        <Text style={styles.bigCardDetailLabel}>End Date:</Text>
                        <Text style={styles.bigCardDetailValue}>
                          {new Date(selectedCampaign.end_date).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    {selectedCampaign?.location && (
                      <View style={styles.bigCardDetailRow}>
                        <Text style={styles.bigCardDetailLabel}>Location:</Text>
                        <Text style={styles.bigCardDetailValue}>{selectedCampaign.location}</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

/* ---------------- CAROUSEL CARD (SMALL) ---------------- */
type CarouselCardProps = {
  item: any;
  onPress: () => void;
};

const CarouselCard = React.memo(({ item, onPress }: CarouselCardProps) => {
  const [imageError, setImageError] = React.useState(false);

  const imageSource =
    item?.image_url && !imageError
      ? { uri: `https://www.markupdesigns.net/scott-shafer/${item.image_url}` }
      : FALLBACK_IMAGE;

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.cardTouchable}
        >
          <View style={styles.cardImageContainer}>
            <Image
              resizeMode="cover"
              style={styles.cardImage}
              source={imageSource}
              onError={() => setImageError(true)}
            />
            <View style={styles.cardImageOverlay} />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>Sponsored</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item?.title ?? 'Untitled Campaign'}
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              {item?.subtitle ?? 'Discover amazing offers and experiences tailored just for you.'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Learn More Button */}
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.learnMoreButtonText}>Learn More →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  loaderContainer: {
    paddingVertical: responsiveScreenHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    paddingVertical: responsiveScreenHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    marginHorizontal: responsiveScreenWidth(4),
  },
  errorText: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#DC2626',
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#9CA3AF',
  },
  emptyContainer: {
    paddingVertical: responsiveScreenHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: responsiveScreenWidth(4),
  },
  emptyText: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#6B7280',
    fontWeight: '500',
  },
  carouselContentContainer: {
    paddingLeft: 0,
    paddingRight: CONTENT_RIGHT_PADDING,
    paddingVertical: responsiveScreenHeight(1.5),
    gap: CARD_GAP,
  },
  cardWrapper: {
    marginRight: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardTouchable: {
    width: '100%',
  },
  cardImageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.6,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardContent: {
    paddingHorizontal: responsiveScreenWidth(3.5),
    paddingTop: responsiveScreenHeight(1.5),
    paddingBottom: responsiveScreenHeight(1),
  },
  cardBadge: {
    backgroundColor: '#00C4FA',
    paddingHorizontal: responsiveScreenWidth(2.5),
    paddingVertical: responsiveScreenHeight(0.4),
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginBottom: responsiveScreenHeight(0.6),
    shadowColor: '#00C4FA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBadgeText: {
    fontSize: responsiveScreenFontSize(1.2),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: responsiveScreenFontSize(1.75),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: responsiveScreenHeight(0.4),
    lineHeight: responsiveScreenFontSize(2.4),
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#6B7280',
    lineHeight: responsiveScreenFontSize(1.9),
    marginBottom: responsiveScreenHeight(0.5),
  },
  learnMoreButton: {
    backgroundColor: '#00C4FA',
    marginHorizontal: responsiveScreenWidth(3.5),
    marginBottom: responsiveScreenHeight(1.5),
    marginTop: responsiveScreenHeight(0.5),
    paddingVertical: responsiveScreenHeight(1),
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00C4FA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  learnMoreButtonText: {
    fontSize: responsiveScreenFontSize(1.4),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigCard: {
    width: screenWidth * 0.9,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  bigCardScrollContent: {
    paddingBottom: responsiveScreenHeight(2),
  },
  bigCardClose: {
    position: 'absolute',
    top: responsiveScreenHeight(1.5),
    right: responsiveScreenWidth(4),
    zIndex: 10,
    width: responsiveScreenWidth(8),
    height: responsiveScreenWidth(8),
    borderRadius: responsiveScreenWidth(4),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCardCloseText: {
    color: '#FFF',
    fontSize: responsiveScreenFontSize(2),
    fontWeight: '600',
  },
  bigCardImageContainer: {
    width: '100%',
    height: screenWidth * 0.7,
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  bigCardImage: {
    width: '100%',
    height: '100%',
  },
  bigCardImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  bigCardContent: {
    padding: responsiveScreenWidth(5),
  },
  bigCardBadge: {
    backgroundColor: '#00C4FA',
    paddingHorizontal: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(0.5),
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginBottom: responsiveScreenHeight(1.2),
    shadowColor: '#00C4FA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bigCardBadgeText: {
    fontSize: responsiveScreenFontSize(1.4),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bigCardTitle: {
    fontSize: responsiveScreenFontSize(2.5),
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: responsiveScreenHeight(0.8),
    lineHeight: responsiveScreenFontSize(3.2),
  },
  bigCardSubtitle: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#4B5563',
    lineHeight: responsiveScreenFontSize(2.4),
    marginBottom: responsiveScreenHeight(1.5),
  },
  bigCardDescription: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#6B7280',
    lineHeight: responsiveScreenFontSize(2.2),
    marginBottom: responsiveScreenHeight(2),
  },
  bigCardDetailRow: {
    flexDirection: 'row',
    marginBottom: responsiveScreenHeight(1),
    paddingVertical: responsiveScreenHeight(0.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  bigCardDetailLabel: {
    fontSize: responsiveScreenFontSize(1.6),
    fontWeight: '600',
    color: '#4B5563',
    width: '30%',
  },
  bigCardDetailValue: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#1F2937',
    fontWeight: '500',
    width: '70%',
  },
});