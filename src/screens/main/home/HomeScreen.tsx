import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';

import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import Button from '../../../components/ui/SocialButton/Button';

import ImageCarousel from './MyCarousel';
import ImageCarousel2 from './MyCarousel2';
import Recommend from './Recommend';

import {
  useGetUserProfileQuery,
  useGetUserInterestsQuery,
} from '../../../features/auth/authApi';

export default function HomeScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedInterestId, setSelectedInterestId] = useState<number | null>(
    null,
  );

  const { data: profileData } = useGetUserProfileQuery();

  const { data: interestsData, isLoading: interestsLoading } =
    useGetUserInterestsQuery();

  const interestsWithForYou = [
    { id: null, name: 'For You' },
    ...(interestsData ?? []),
  ];

  const user = profileData?.data?.user;

  const handleSelectInterest = (index: number, interestId: number | null) => {
    setActiveIndex(index);
    setSelectedInterestId(interestId);
  };

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />

      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

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
          source={require('../../../../assets/image/logo.png')}
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
        {/* SEARCH + INTEREST */}

        <View style={styles.topSection}>
          <SearchBar placeholder="Search lists, users, topics..." />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.interestScroll}
          >
            {interestsLoading && <Text>Loading...</Text>}

            {!interestsLoading &&
              interestsWithForYou.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <Pressable
                    key={item.id ?? 'for-you'}
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
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
          </ScrollView>
        </View>

        {/* MAIN CONTENT */}

        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* CREATE LIST */}

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

            {/* FEATURED */}

            <View style={styles.cardHeading}>
              <Text style={styles.headingText}>Featured Lists</Text>

              <Text
                onPress={() => navigation.navigate('Feature')}
                style={styles.seeAll}
              >
                See All
              </Text>
            </View>

            <ImageCarousel interestId={selectedInterestId} />

            {/* SPONSORED */}

            <View style={styles.cardHeading}>
              <Text style={styles.headingText}>Sponsored Campaign</Text>
            </View>

            <ImageCarousel2 />

            {/* RECOMMENDED */}

            <Recommend />
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
