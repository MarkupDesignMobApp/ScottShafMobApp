import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Tabs',
            state: {
              routes: [{ name: 'Home' }],
            },
          },
        ],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >

        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Published</Text>
        <View style={styles.headerButtonPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.mainContent}>
          {/* Success Card */}
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
          </View>

          {/* Action Buttons */}
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
      </View>
    </SafeAreaView>
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
  headerButton: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonPlaceholder: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
  },
  headerIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(5),
    paddingTop: responsiveScreenHeight(3),
    justifyContent: 'space-between',
    paddingBottom: responsiveScreenHeight(4),
  },
  card: {
    backgroundColor: '#F0F4F8',
    borderRadius: 24,
    padding: responsiveScreenWidth(6),
    alignItems: 'center',
    borderWidth: 1,
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
  buttonContainer: {
    width: '100%',
    marginBottom: 0,
    gap: responsiveScreenHeight(1.5),
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C3E50',
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
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.9),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
});
