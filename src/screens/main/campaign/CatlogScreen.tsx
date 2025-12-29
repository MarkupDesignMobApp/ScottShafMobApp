import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { styles as Homestyle } from '../home/styles';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const CATEGORIES = ['All', 'Restaurants', 'Cafes', 'Bars'];

const DATA = [
  {
    id: '1',
    name: 'Blue Bottle Coffee',
    desc: 'Specialty coffee roaster',
    image: 'https://via.placeholder.com/60',
    selected: true,
  },
  {
    id: '2',
    name: 'Stumptown Coffee',
    desc: 'Specialty coffee roaster',
    image: 'https://via.placeholder.com/60',
    selected: false,
  },
  {
    id: '3',
    name: 'La Colombe',
    desc: 'Specialty coffee roaster',
    image: 'https://via.placeholder.com/60',
    selected: true,
  },
  {
    id: '4',
    name: 'Intelligentsia Coffee',
    desc: 'Specialty coffee roaster',
    image: 'https://via.placeholder.com/60',
    selected: false,
  },
  {
    id: '5',
    name: 'Counter Culture',
    desc: 'Specialty coffee roaster',
    image: 'https://via.placeholder.com/60',
    selected: false,
  },
  {
    id: '6',
    name: 'Counter Culture',
    desc: 'Specialty coffee roaster',
    image: 'https://via.placeholder.com/60',
    selected: false,
  },
];

export default function BrowseCatalogScreen({ navigation }) {
  const handleSkip = () => {
    // Optional: clear selections
    const clearedItems = items.map(item => ({
      ...item,
      selected: false,
    }));

    setItems(clearedItems);

    // Navigate to next screen
    navigation.navigate('Addcustom');
  };

  const handleNext = () => {
    const selectedItems = items.filter(item => item.selected);

    if (selectedItems.length === 0) {
      Alert.alert(
        'No items selected',
        'Please select at least one item to continue.',
      );
      return;
    }

    // Pass selected items to next screen
    navigation.navigate('Addcustom', {
      selectedItems,
    });
  };

  const [activeCat, setActiveCat] = useState('All');
  const [items, setItems] = useState(DATA);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const toggleSelect = id => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, selected: !i.selected } : i)),
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, item.selected && styles.cardActive]}
      onPress={() => toggleSelect(item.id)}
    >
      <View style={styles.image}>
        <Image
          resizeMode="contain"
          source={require('../../../../assets/image/glass.png')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
      </View>

      <View style={styles.iconWrap}>
        <Text style={[styles.icon, item.selected && styles.iconActive]}>
          {item.selected ? '✓' : '+'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {/* STATUS BAR */}
      <StatusBar backgroundColor="#00C4FA" barStyle="light-content" />

      {/* iOS STATUS BAR BACKGROUND */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#00C4FA' }} />

      {/* HEADER */}
      <View style={styles.header2}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backarrow}
          >
            <Image
              tintColor={'#fff'}
              resizeMode="contain"
              style={styles.img}
              source={require('../../../../assets/image/left-icon.png')}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Browser Catalogue</Text>
          <View />
        </View>

        <View style={styles.serchmaincontainer}>
          <SearchBar placeholder="Search items..." />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            ...Homestyle.scrollcontainer,
            paddingTop: responsiveScreenHeight(2.25),
          }}
        >
          {CATEGORIES.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <Pressable
                key={item}
                onPress={() => setActiveIndex(index)}
                style={[
                  Homestyle.scrollbox,
                  isActive && Homestyle.activeScrollBox,
                ]}
              >
                <Text
                  style={[
                    Homestyle.boxtitle,
                    isActive && Homestyle.activeBoxTitle,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* CONTENT + FOOTER */}
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* LIST */}
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: responsiveScreenWidth(4),
            paddingTop: responsiveScreenHeight(2),
            paddingBottom: responsiveScreenHeight(16), // 👈 space for buttons
          }}
        />

        {/* FIXED BOTTOM BUTTONS */}
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <Pressable style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>

          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>Next</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

export const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: '#00C4FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header2: {
    backgroundColor: '#00C4FA',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(2),

    //  borderWidth:1
  },
  serchmaincontainer: {
    paddingTop: responsiveScreenHeight(2.25),
  },
  backarrow: {
    width: responsiveScreenHeight(4),
    height: responsiveScreenHeight(3),
  },
  img: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    color: '#fff',

    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  searchWrap: {
    marginTop: 16,
    backgroundColor: '#3FC3F7',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  search: { height: 44, color: '#fff' },

  categories: {
    flexDirection: 'row',
    marginTop: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#7DD3FC',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#1EAAF1', borderColor: '#1EAAF1' },
  chipText: { color: '#E8F7FF', fontSize: 12 },
  chipTextActive: { color: '#fff', fontWeight: '600' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: responsiveScreenHeight(2.35),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1,
    borderColor: '#C5C5C5',
  },
  cardActive: { borderColor: '#0180FE', backgroundColor: '#ECF6FF' },

  image: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(6),
    borderRadius: 8,
    marginRight: 12,
  },

  title: {
    fontSize: responsiveScreenFontSize(1.85),
    fontFamily: 'Quicksand-Regular',
    color: 'black',
    fontWeight: '500',
  },
  desc: {
    fontSize: responsiveScreenFontSize(1.75),
    color: '#777',
    marginTop: responsiveScreenHeight(1.25),
    fontFamily: 'Quicksand-Regular',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  skipBtn: {
    flex: 1,
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#00C4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  skipText: {
    color: '#00C4FA',
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
  },

  nextBtn: {
    flex: 1,
    height: responsiveScreenHeight(6),
    borderRadius: 30,
    backgroundColor: '#00C4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsiveScreenFontSize(1.8),
  },

  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#22B8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18, color: '#22B8F0' },
  iconActive: { fontWeight: '700' },
});
