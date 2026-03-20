import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Share from 'react-native-share';
import { CommonActions } from '@react-navigation/native';
import { usePostCurrentPublishedListMutation } from '../../../features/auth/authApi';

export default function ListPublishedScreen({ navigation, route }) {
  const { publishedIds } = route.params || {};

  const [getPublishedList, { data, isLoading }] =
    usePostCurrentPublishedListMutation();

  useEffect(() => {
    if (publishedIds?.length) {
      getPublishedList({ list_ids: publishedIds });
    }
  }, [publishedIds]);

  const list = data?.data?.[0];

  const title = list?.title || 'Your list';
  const likes = list?.likes_count || 0;
  const shares = list?.shares_count || 0;
  const shareUrl = list?.share_url;

  const handleShare = async () => {
    try {
      if (!shareUrl) {
        Alert.alert('Error', 'Share link not available');
        return;
      }

      const shareOptions = {
        title: 'Check out my list!',
        message: `I just published my list "${title}"`,
        url: shareUrl,
      };

      await Share.open(shareOptions);
    } catch (error) {
      if (error?.message !== 'User did not share') {
        Alert.alert('Error', 'Unable to open share dialog');
      }
    }
  };

  const handleBackToHome = () => {
    // Reset navigation to Tabs (home screen)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Tabs',
            state: {
              routes: [{ name: 'Home' }] // This ensures Home tab is selected
            }
          }
        ],
      })
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../../assets/image/left-icon.png')}
            style={styles.headerIcon}
            tintColor="#FFFFFF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Published</Text>
        <View style={styles.headerRight} />
      </View>

      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.mainContent}>
          {/* SUCCESS CARD */}
          <View style={styles.card}>
            <View style={styles.checkCircle}>
              <View style={styles.checkIconContainer}>
                <Image
                  source={require('../../../../assets/image/circlue.png')}
                  style={styles.checkIconImg}
                  tintColor="#2C3E50"
                />
              </View>
            </View>

            <Text style={styles.title}>{title} is live!</Text>

            <Text style={styles.description}>
              {title} has been{'\n'}
              published and is now visible to your{'\n'}
              followers.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Image
                  source={require('../../../../assets/image/like.png')}
                  style={styles.statIconImg}
                  tintColor="#2C3E50"
                />
                <Text style={styles.statText}>{likes} likes</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Image
                  source={require('../../../../assets/image/share2.png')}
                  style={styles.statIconImg}
                  tintColor="#2C3E50"
                />
                <Text style={styles.statText}>{shares} shares</Text>
              </View>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Text style={styles.shareButtonText}>Share List</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.homeButton}
              onPress={handleBackToHome}
            >
              <Text style={styles.homeButtonText}>Back To Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
  },
  headerLeft: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
  },
  headerRight: {
    width: responsiveScreenHeight(3),
  },
  headerIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(5),
    paddingTop: responsiveScreenHeight(3),
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#F0F4F8',
    borderRadius: 24,
    padding: responsiveScreenWidth(6),
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2C3E50',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginTop: responsiveScreenHeight(2),
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 2,
    borderColor: '#2C3E50',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  checkIconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: '#2C3E50',
  },
  title: {
    fontSize: responsiveScreenFontSize(2.4),
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: responsiveScreenHeight(1),
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: '#4A5568',
    fontSize: responsiveScreenFontSize(1.8),
    lineHeight: responsiveScreenHeight(2.6),
    marginBottom: responsiveScreenHeight(3),
    fontFamily: 'Quicksand-Regular',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: responsiveScreenHeight(1.5),
    paddingHorizontal: responsiveScreenWidth(6),
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(3),
  },
  statDivider: {
    width: 1,
    height: responsiveScreenHeight(3),
    backgroundColor: '#E2E8F0',
    marginHorizontal: responsiveScreenWidth(2),
  },
  statIconImg: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: responsiveScreenWidth(2),
    tintColor: '#2C3E50',
  },
  statText: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#2C3E50',
    fontFamily: 'Quicksand-Medium',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: responsiveScreenHeight(4),
    gap: responsiveScreenHeight(1.5),
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2C3E50',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shareButtonText: {
    color: '#2C3E50',
    fontSize: responsiveScreenFontSize(1.9),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
  homeButton: {
    backgroundColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.9),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
});