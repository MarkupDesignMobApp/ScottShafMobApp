import React from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, Image } from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import Share from 'react-native-share';
import { CommonActions } from '@react-navigation/native';

export default function ListPublishedScreen({ navigation }) {
  const handleShare = async () => {
    try {
      const shareOptions = {
        title: 'Check out my list!',
        message:
          'I just published a list: Best Coffee Spots in NYC ☕🔥\nCheck it out!',
        url: 'https://yourapp.com/list/123',
      };

      await Share.open(shareOptions);
    } catch (error) {
      if (error?.message !== 'User did not share') {
        Alert.alert('Error', 'Unable to open share dialog');
      }
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor="#00C4FA"
        barStyle="light-content"
      />

      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <AppHeader
          onLeftPress={() => navigation.goBack()}
          title="List Published"
          leftImage={require('../../../../assets/image/left-icon.png')}
        />

        <View style={styles.mainContent}>
          {/* SUCCESS CARD */}
          <View style={styles.card}>
            <View style={styles.checkCircle}>
              <Image
                source={require('../../../../assets/image/circlue.png')}
                style={styles.checkIconImg}
              />
            </View>
            <Text style={styles.title}>Your list is live!</Text>

            <Text style={styles.description}>
              Best Coffee Spots in NYC has been{'\n'}
              published and is now visible to your{'\n'}
              followers.
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Image
                  source={require('../../../../assets/image/eye.png')}
                  style={styles.statIconImg}
                />
                <Text style={styles.statText}>0 views</Text>
              </View>

              <View style={styles.statItem}>
                <Image
                  source={require('../../../../assets/image/like.png')}
                  style={styles.statIconImg}
                />
                <Text style={styles.statText}>0 likes</Text>
              </View>

              <View style={styles.statItem}>
                <Image
                  source={require('../../../../assets/image/share2.png')}
                  style={styles.statIconImg}
                />
                <Text style={styles.statText}>0 shares</Text>
              </View>
            </View>

          </View>

          {/* CAMPAIGN CONSENT CARD */}
          <View style={styles.consentCard}>
            <View style={styles.consentIconContainer}>
              <View style={styles.consentIconInner}>
                <Image
                  source={require('../../../../assets/image/Ellipse.png')}
                  style={styles.consentIconImg}
                />

              </View>
            </View>

            <View style={styles.consentTextContainer}>
              <Text style={styles.consentTitle}>Campaign Consent</Text>
              <Text style={styles.consentDescription}>
                You've applied for coffee offers.
              </Text>
            </View>

            <View style={styles.blueDot} />
          </View>

          {/* ACTION BUTTONS */}
          <View

          >
            <AppButton
              style={{
                backgroundColor: '#fff',
                borderColor: '#3478f6',
                borderWidth: 1,
              }}
              Textcolor="#3478f6"
              title="Share List"
              onPress={handleShare}
            />

            <AppButton
              title="Back To Home"
              Textcolor="#fff"
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }],
                  }),
                );
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBFF',
  },

  mainContent: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },

  // Success Card Styles
  card: {
    backgroundColor: '#EBF7FF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#B8E3FF',
    marginBottom: 16,
  },

  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },

  checkIconImg: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },


  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statIconImg: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 6,
  },
  consentIconImg: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },

  statText: {
    fontSize: 12,
     fontFamily:'Quicksand-medium'
  },


  checkIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },

  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: 0.2,
     fontFamily:'Quicksand-Bold'
  },

  description: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    letterSpacing: 0.1,
     fontFamily:'Quicksand-medium'
  },

  statIcon: {
    fontSize: 16,
  },


  // Consent Card Styles
  consentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF7FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#B8E3FF',
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },

  consentIconContainer: {
    marginRight: 12,
  },

  consentIconInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  consentIconText: {
    fontSize: 20,
  },

  consentTextContainer: {
    flex: 1,
  },

  consentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
    letterSpacing: 0.1,
     fontFamily:'Quicksand-Bold'
  },

  consentDescription: {
    fontSize: 13,
    color: '#6B7280',
    letterSpacing: 0.1,
     fontFamily:'Quicksand-Medium'
  },

  blueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B9DFF',
  },


});