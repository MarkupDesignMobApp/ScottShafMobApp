import {
  View,
  Text,
  StatusBar,
  Platform,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { removeTokenFromKeychain } from '../../../app/keychain';
import { TokenService } from '../../../services/storage/keychain.services';
import { styles } from './styles';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import Button from '../../../components/ui/SocialButton/Button';
import ImageCarousel from './MyCarousel';
import ImageCarousel2 from './MyCarousel2';
import ImageCarousel3 from './MyCarousel3';
import { useGetUserProfileQuery } from '../../../features/auth/authApi';
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export default function HomeScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { data, isLoading, refetch } = useGetUserProfileQuery();

  const user = data?.data?.user;
  async function Gettoken() {
    let mytoken = await TokenService.get();
  }

  async function Removetoken() {
    await removeTokenFromKeychain();
  }
  const Data = [
    {
      id: '1',
      title: 'For You',
    },
    {
      id: '2',
      title: 'Movies',
    },
    {
      id: '3',
      title: 'Tech',
    },
    {
      id: '4',
      title: 'Books',
    },
    {
      id: '5',
      title: 'Movie',
    },
  ];
  return (
    <SafeAreaProvider>
      {/* STATUS BAR */}
      <StatusBar
        backgroundColor="#00C4FA" // ✅ Android
        barStyle="light-content" // ✅ iOS text color
      />

      {/* iOS STATUS BAR BACKGROUND */}
      <SafeAreaView
        edges={['top']}
        style={{
          backgroundColor: '#00C4FA',
        }}
      />
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={{
            ...styles.profilecontainer,
            borderWidth: 1,
            borderColor: '#fff',
          }}
        >
          <Image
            style={{
              width: '100%',
              height: '100%',
              borderRadius: responsiveScreenWidth(5),
            }}
            resizeMode="cover"
            source={
              user?.profile?.profile_image
                ? { uri: user.profile.profile_image }
                : require('../../../../assets/image/women1.png')
            }
          />
        </Pressable>
        <View style={styles.imgcontainerlogo}>
          <Image
            tintColor={'#fff'}
            resizeMode="contain"
            style={styles.img}
            source={require('../../../../assets/image/logo.png')}
          />
        </View>
        <Pressable
          onPress={() => navigation.navigate('Notification')}
          style={styles.imgcontainer}
        >
          <Image
            tintColor={'#fff'}
            resizeMode="contain"
            style={styles.img}
            source={require('../../../../assets/image/bell.png')}
          />
        </Pressable>
      </View>
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        style={styles.innercontainer}
      >
        <View style={styles.contentcontainer}>
          <SearchBar placeholder="Search lists, users, topics..." />
          <ScrollView
            scrollEventThrottle={16}
            bounces={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollcontainer}
          >
            {Data.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setActiveIndex(index)}
                  style={[styles.scrollbox, isActive && styles.activeScrollBox]}
                >
                  <Text
                    style={[styles.boxtitle, isActive && styles.activeBoxTitle]}
                  >
                    {item.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        <View style={{ ...styles.checkmaincontainer }}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={styles.innerscrollcontainer}
          >
            <View style={styles.checkcontainer}>
              <Text
                style={{
                  ...styles.btnheadertxt,
                  paddingTop: 0,
                  fontFamily: 'Quicksand-Medium',
                  fontSize: responsiveScreenFontSize(2),
                }}
              >
                Create Your First List
              </Text>
              <Text style={styles.btnheadertxt}>
                Share your top picks with the world.
              </Text>

              <Button
                onPress={() => navigation.navigate('Create')}
                buttonStyle={styles.btncontainer}
                textStyle={styles.btntxt}
                source={require('../../../../assets/image/add.png')}
                title="Start Creating"
              />
            </View>
            <View style={styles.cardheading}>
              <Text style={{ ...styles.cardheadingtxt }}>Featured Lists</Text>
              <Text
                onPress={() => navigation.navigate('Feature')}
                style={{
                  ...styles.cardheadingtxt,
                  color: '#0180FE',
                  fontSize: responsiveScreenFontSize(1.75),
                }}
              >
                See All
              </Text>
            </View>
            <ImageCarousel />

            <View style={styles.cardheading}>
              <Text style={{ ...styles.cardheadingtxt, fontWeight: '500' }}>
                Sponsored Campaign
              </Text>
            </View>
            <ImageCarousel2 />

            <View style={styles.cardheading}>
              <Text style={{ ...styles.cardheadingtxt, fontWeight: '500' }}>
                Recommended For You
              </Text>
            </View>
            <ImageCarousel3 />
          </ScrollView>
        </View>

        {/* <ImageCarousel /> */}
        {/* <Button onPress={Removetoken} title="RemoveValue" />
        <Button onPress={Gettoken} title="GetValue" /> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
