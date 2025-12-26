import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { AppButton } from '../../../components/ui/AppButton/AppButton';

import { styles as Catlogstyle } from '../campaign/CatlogScreen';
import { styles as Homestyle } from '../home/styles';
export default function FeaturedLists({ navigation }) {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

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
      <View style={Catlogstyle.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ ...Catlogstyle.backarrow }}
        >
          <Image
            tintColor={'#fff'}
            resizeMode="contain"
            style={Catlogstyle.img}
            source={require('../../../../assets/image/left-icon.png')}
          />
        </Pressable>

        <Text
          style={{
            ...Catlogstyle.headerTitle,
            marginRight: responsiveScreenWidth(6),
          }}
        >
          Feature List
        </Text>
        <View></View>
      </View>
      <View style={styles.contentcontainer}>
        <SearchBar
          rightIconSource={require('../../../../assets/image/filter.png')}
          placeholder="Search lists, users, topics..."
        />
      </View>
      <View
        style={{ paddingHorizontal: responsiveScreenWidth(4), paddingTop: 24 }}
      >
        <View style={styles.card2}>
          <View style={{ height: responsiveScreenWidth(45), width: '100%' }}>
            <Image
              resizeMode="cover"
              style={{ ...styles.img2 }}
              source={require('../../../../assets/image/cofee.png')}
            />
          </View>

          <View style={styles.cardtitlecontainer}>
            <View
              style={{
                borderWidth: 1.75,
                borderTopWidth: 0,
                borderColor: '#0180FE',
                paddingTop: responsiveScreenHeight(1.5),
                paddingHorizontal: responsiveScreenWidth(4),
                borderBottomLeftRadius: responsiveScreenWidth(5),
                borderBottomRightRadius: responsiveScreenWidth(5),
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    paddingVertical: responsiveScreenHeight(0.75),
                    backgroundColor: '#00C4FA',
                    width: '30%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: responsiveScreenWidth(20),
                    // marginVertical: 10,
                    flexDirection: 'row',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Ubuntu-Regular',
                      color: '#fff',
                      fontSize: responsiveScreenFontSize(1.65),
                    }}
                  >
                    Sponsored
                  </Text>
                </View>

                <Text style={styles.byText}>By Brand Name</Text>
              </View>

              <View
                style={{
                  paddingLeft: '2%',
                  paddingTop: responsiveScreenHeight(1.5),
                }}
              >
                <Text style={styles.cardmaintitletxt}>
                  Get 20% off your next coffee
                </Text>
                <Text
                  style={{
                    ...styles.cardsubtitletxt,
                    fontSize: responsiveScreenFontSize(1.65),
                    color: 'black',
                  }}
                >
                  Exclusive offer for Top List members. Valid at participating
                  locations.
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => navigation.navigate('Offer')}
                  style={{ ...styles.offerbtn }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Ubuntu-Regular',
                      fontSize: responsiveScreenFontSize(1.75),
                    }}
                  >
                    View Offer
                  </Text>
                </Pressable>

                <TouchableOpacity style={styles.closeBtn}>
                  <Image
                    resizeMode="contain"
                    source={require('../../../../assets/image/cross.png')}
                    style={{ width: '55%', height: '55%' }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.footerRow}>
                <Text style={styles.expireText}>Expires Dec 31, 2025</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: responsiveScreenWidth(3),
                      height: responsiveScreenWidth(3),
                      marginRight: 4,
                    }}
                  >
                    <Image
                      style={styles.img}
                      resizeMode="contain"
                      source={require('../../../../assets/image/info.png')}
                    />
                  </View>
                  <Text style={styles.whyText}>Why am I seeing this?</Text>
                </View>
              </View>
            </View>
          </View>
          {/* <Image source={{ uri: item.image }} />
      <Text>{item.title}</Text> */}
        </View>

        {/* List Card */}
        {/* <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>Sarah's Top 5 Brunch Spots</Text>
            <Text style={styles.listSub}>Food & Drinks · 255 Saved</Text>
          </View>
          <Image
            source={require('../../../../assets/image/info.png')}
            style={{ width: 18, height: 18 }}
          />
        </View>

        <View style={styles.imageRow}>
          {[1, 2, 3].map((_, i) => (
            <Image
              key={i}
              source={{
                uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
              }}
              style={styles.listImage}
            />
          ))}
        </View>
      </View> */}

        <View style={{ height: 30 }} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  img2: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: responsiveScreenWidth(4),
    borderTopRightRadius: responsiveScreenWidth(4),
  },
  cardmaintitletxt: {
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(2),
  },
  cardsubtitletxt: {
    fontFamily: 'Quicksand-Light',
    color: '#000000',
    paddingTop: responsiveScreenHeight(1),

    lineHeight: responsiveScreenHeight(2),
  },
  header: {
    backgroundColor: '#00C4FA',
    paddingHorizontal: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardimgcontainer: {
    borderRadius: responsiveScreenWidth(4),
    height: '100%',
    width: '100%',
  },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card2: {
    height: responsiveScreenHeight(48),

    margin: responsiveScreenWidth(1),
    borderRadius: responsiveScreenWidth(4),
    borderColor: '#CFCFCF',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    marginHorizontal: 8,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 16,
    padding: 16,
  },
  cardImagePlaceholder: {
    height: 140,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },

  sponsoredRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sponsoredBadge: {
    backgroundColor: '#38BDF8',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  sponsoredText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  byText: {
    fontSize: responsiveScreenFontSize(1.65),
    color: '#64748B',
    left: responsiveScreenWidth(2),
    fontFamily: 'Quicksand-Regular',
  },

  offerTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  offerDesc: { fontSize: 12, color: '#64748B', marginBottom: 12 },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveScreenHeight(1.75),
  },
  viewBtn: {
    flex: 1,
    backgroundColor: '#0EA5E9',
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  imgcontainer: {
    width: responsiveScreenWidth(8),
    height: responsiveScreenHeight(3),
  },
  imgcontainerlogo: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(8),
  },
  img: {
    width: '100%',
    height: '100%',
  },

  innercontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentcontainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    backgroundColor: '#00C4FA',
    paddingVertical: responsiveScreenHeight(2),
  },
  scrollcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: responsiveScreenHeight(2),
  },

  scrollbox: {
    borderWidth: 1,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(0.75),
    borderRadius: responsiveScreenWidth(20),
    borderColor: '#fff',
    marginRight: responsiveScreenWidth(2.5),
    backgroundColor: 'transparent',
  },

  activeScrollBox: {
    backgroundColor: '#0180FE',
    borderColor: '#0180FE',
  },

  boxtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.75),
  },

  activeBoxTitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
  },
  checkcontainer: {
    backgroundColor: '#0180FE',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenWidth(4),
    borderRadius: responsiveScreenWidth(4),
  },
  offerbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00C4FA',
    paddingHorizontal: responsiveScreenWidth(25),
    height: responsiveScreenHeight(5),
    borderRadius: responsiveScreenWidth(10),
  },
  viewBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  closeBtn: {
    width: responsiveScreenWidth(8),
    height: responsiveScreenWidth(8),
    borderRadius: responsiveScreenWidth(4),
    borderColor: '#C1C1C1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderColor: 'lightgrey',
    alignItems: 'center',
    paddingVertical: responsiveScreenHeight(2),
  },
  expireText: {
    fontSize: responsiveScreenFontSize(1.5),

    fontFamily: 'Ubuntu-Regular',
    color: '#000',
  },
  whyText: {
    fontSize: responsiveScreenFontSize(1.5),
    color: '#000',
    fontFamily: 'Ubuntu-Regular',
  },

  cardtitlecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  listCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 14,
  },
  listHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  listTitle: { fontSize: 14, fontWeight: '600' },
  listSub: { fontSize: 11, color: '#64748B' },

  imageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  listImage: { width: '32%', height: 70, borderRadius: 10 },
});
