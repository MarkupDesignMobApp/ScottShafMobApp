import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  Pressable,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './styles';

import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import Button from '../../../components/ui/SocialButton/Button';

import ImageCarousel2 from './MyCarousel2';
import Recommend from './Recommend';
import FeaturedListsPreview from '../feature/FeaturedListsPreview';

import {
  useGetUserProfileQuery,
  useGetUserInterestsQuery,
} from '../../../features/auth/authApi';
import { MainStackParamList } from '../../../navigation/types/navigation';

const { width: screenWidth } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Home'>;
}

interface HintStep {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedInterestId, setSelectedInterestId] = useState<number | null>(
    null,
  );
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { data: profileData } = useGetUserProfileQuery();
  const { data: interestsData, isLoading: interestsLoading } =
    useGetUserInterestsQuery();

  const safeInterestsData = Array.isArray(interestsData) ? interestsData : [];

  const interestsWithForYou = [
    { id: null, name: 'For You' },
    ...safeInterestsData,
  ];

  const user = profileData?.data?.user;

  const hintSteps: HintStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to the App!',
      description: 'Let us show you around and help you get started',
      emoji: '👋',
    },
    {
      id: 'search',
      title: 'Search Anything',
      description:
        "Find lists, users, topics, or anything you're interested in",
      emoji: '🔍',
    },
    {
      id: 'interests',
      title: 'Your Interests',
      description:
        'Select your interests to see personalized content just for you',
      emoji: '🎯',
    },
    {
      id: 'create',
      title: 'Create Your First List',
      description:
        'Share your top picks and recommendations with the community',
      emoji: '✍️',
    },
    {
      id: 'featured',
      title: 'Featured Lists',
      description: 'Explore hand-picked lists from top creators',
      emoji: '⭐',
    },
    {
      id: 'sponsored',
      title: 'Sponsored Campaigns',
      description: 'Discover amazing offers and exclusive deals',
      emoji: '💝',
    },
  ];

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        console.log('First launch - showing onboarding');
        setShowOnboarding(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      } else {
        console.log('Not first launch');
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleNext = useCallback(() => {
    if (currentStep < hintSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
      setCurrentStep(0);
    }
  }, [currentStep, hintSteps.length]);

  const handleSkip = useCallback(() => {
    setShowOnboarding(false);
    setCurrentStep(0);
  }, []);

  const handleSelectInterest = useCallback(
    (index: number, interestId: number | null) => {
      setActiveIndex(index);
      setSelectedInterestId(interestId);
    },
    [],
  );

  const currentHint = hintSteps[currentStep];

  // Main content of the screen
  const MainContent = () => (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileContainer}
          >
            <Image
              style={styles.profileImage}
              source={
                user?.profile?.profile_image
                  ? { uri: user.profile.profile_image }
                  : require('../../../../assets/image/nophoto.jpg')
              }
            />
          </Pressable>

          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require('../../../../assets/image/logo2.png')}
          />

          <Pressable
            onPress={() => navigation.navigate('Notification')}
            style={styles.notificationButton}
          >
            <Image
              resizeMode="contain"
              style={styles.notificationIcon}
              source={require('../../../../assets/image/bell.png')}
            />
          </Pressable>
        </View>

        <SafeAreaView
          edges={['left', 'right', 'bottom']}
          style={styles.innercontainer}
        >
          <View style={styles.topSection}>
            <SearchBar placeholder="Search lists, users, topics..." />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.interestScroll}
            >
              {interestsLoading && (
                <View style={styles.loadingInterests}>
                  <ActivityIndicator size="small" color="#00C4FA" />
                  <Text style={styles.loadingText}>Loading interests...</Text>
                </View>
              )}

              {!interestsLoading &&
                interestsWithForYou.map((item: any, index: number) => {
                  const isActive = index === activeIndex;
                  if (!item || typeof item !== 'object') return null;

                  return (
                    <Pressable
                      key={item.id ?? `interest-${index}`}
                      onPress={() => handleSelectInterest(index, item.id)}
                      style={[
                        styles.interestPill,
                        isActive && styles.activeInterestPill,
                      ]}
                    >
                      <Text
                        style={[
                          styles.interestText,
                          isActive && styles.activeInterestText,
                        ]}
                      >
                        {item.name || 'Unnamed Interest'}
                      </Text>
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>

          <View style={styles.contentContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              <View style={styles.createCard}>
                <Text style={styles.createTitle}>Create Your First List</Text>
                <Text style={styles.createSubtitle}>
                  Share your top picks with the world.
                </Text>
                <Button
                  onPress={() => navigation.navigate('Create')}
                  buttonStyle={styles.createButton}
                  textStyle={styles.createButtonText}
                  source={require('../../../../assets/image/add.png')}
                  title="Start Creating"
                />
              </View>

              <View style={styles.cardHeading}>
                <Text style={styles.headingText}>Featured Lists</Text>
                <Text
                  onPress={() => navigation.navigate('Feature')}
                  style={styles.seeAll}
                >
                  See All
                </Text>
              </View>

              <FeaturedListsPreview
                interestId={selectedInterestId}
                navigation={navigation}
              />

              <View style={styles.cardHeading}>
                <Text style={styles.headingText}>Sponsored Campaign</Text>
              </View>

              <ImageCarousel2 />
              <Recommend />
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );

  // Separate Onboarding Modal component with its OWN SafeAreaProvider
  const OnboardingModal = () => (
    <Modal
      visible={showOnboarding}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={handleSkip}
    >
      {/* CRITICAL FIX: iOS needs its own SafeAreaProvider inside the Modal */}
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: screenWidth * 0.85,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 16 }}>
              {currentHint.emoji}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#2C3E50',
                marginBottom: 12,
                textAlign: 'center',
              }}
            >
              {currentHint.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#666666',
                textAlign: 'center',
                marginBottom: 24,
                lineHeight: 22,
              }}
            >
              {currentHint.description}
            </Text>

            {/* Progress indicator */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              {hintSteps.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      index === currentStep ? '#00C4FA' : '#D1D1D6',
                    marginHorizontal: 4,
                  }}
                />
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <TouchableOpacity
                onPress={handleSkip}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  marginRight: 8,
                  borderRadius: 8,
                  backgroundColor: '#F5F5F5',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: '600', color: '#666666' }}
                >
                  Skip
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  marginLeft: 8,
                  borderRadius: 8,
                  backgroundColor: '#00C4FA',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}
                >
                  {currentStep === hintSteps.length - 1
                    ? 'Get Started'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaProvider>
    </Modal>
  );

  return (
    <>
      <MainContent />
      <OnboardingModal />
    </>
  );
}
