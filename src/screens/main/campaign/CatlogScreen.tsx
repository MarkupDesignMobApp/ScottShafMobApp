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

export default function BrowseCatalogScreen({navigation}) {
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
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'red' }}>
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
      <View style={styles.header2}>
        <View style={styles.header}>
          <Pressable onPress={()=>navigation.goBack()} style={styles.backarrow}>
            <Image
              tintColor={'#fff'}
              resizeMode="contain"
              style={styles.img}
              source={require('../../../../assets/image/left-icon.png')}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Browser Catalogue</Text>
          <View></View>
        </View>
        <View style={styles.serchmaincontainer}>
          <SearchBar
            placeholder="Search items..."
            style={{ backgroundColor: '#00C4FA' }}
            inputStyle={{}}
          />
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
      <View
        style={{
          backgroundColor: '#fff',
          paddingTop: responsiveScreenHeight(2),
        }}
      >
        <FlatList
        showsVerticalScrollIndicator={false}
          bounces={false}
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: responsiveScreenWidth(4),
            paddingBottom: responsiveScreenHeight(25),
          }}
        />
      </View>
      <SafeAreaView />
    </SafeAreaProvider>
    // <SafeAreaProvider>
    //   <SafeAreaView
    //     edges={['top', 'left', 'right']}
    //     style={{ flex: 1, backgroundColor: '#fff' }}
    //   >
    //     <View style={styles.container}>
    //       {/* HEADER */}
    //       <View style={styles.header}>
    //         <Text style={styles.headerTitle}>Browse Catalog</Text>

    //         <View style={styles.searchWrap}>
    //           <TextInput
    //             placeholder="Search items…"
    //             placeholderTextColor="#BEE9FF"
    //             style={styles.search}
    //           />
    //         </View>

    //         <View style={styles.categories}>
    //           {CATEGORIES.map(cat => (
    //             <TouchableOpacity
    //               key={cat}
    //               style={[styles.chip, activeCat === cat && styles.chipActive]}
    //               onPress={() => setActiveCat(cat)}
    //             >
    //               <Text
    //                 style={[
    //                   styles.chipText,
    //                   activeCat === cat && styles.chipTextActive,
    //                 ]}
    //               >
    //                 {cat}
    //               </Text>
    //             </TouchableOpacity>
    //           ))}
    //         </View>
    //       </View>

    //       {/* LIST */}
    //       <FlatList
    //         data={items}
    //         keyExtractor={item => item.id}
    //         renderItem={renderItem}
    //         contentContainerStyle={{ padding: 16 }}
    //       />
    //     </View>
    //   </SafeAreaView>
    // </SafeAreaProvider>
  );
}

export const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: '#00C4FA',
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:"space-between",
   

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
