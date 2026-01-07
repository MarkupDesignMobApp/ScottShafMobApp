import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import { useGetCatalogItemsOfListQuery } from '../../../features/auth/authApi';

type ListItem = {
  id: number;
  type: 'catalog' | 'custom';
  item_id: number | null;
  name: string;
  category: string | null;
  description: string | null;
};

export default function CreateListScreen({ navigation, route }) {
  const { listId } = route.params;

  // 🔹 State for draggable list
  const [items, setItems] = useState<ListItem[]>([]);

  // 🔹 API call
  const { data, isLoading } = useGetCatalogItemsOfListQuery(listId);
 
  // 🔹 Sync API data → state
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setItems(data);
    }
  }, [data]);

  // 🔹 Render draggable item
  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={drag}
      style={[styles.card, isActive && styles.cardActive]}
    >
      {/* Index / ID */}
      <View style={styles.countwrap}>
        <Text style={styles.countxt}>{item.id}</Text>
      </View>

      {/* Image */}
      <View style={styles.image}>
        <Image
          resizeMode="contain"
          source={require('../../../../assets/image/glass.png')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc}>
          {item.description || item.category || 'No description'}
        </Text>
      </View>

      {/* Drag handle */}
      <View style={{ position: 'absolute', right: 10, top: '40%' }}>
        <Image
          style={{ width: 20, height: 20 }}
          source={require('../../../../assets/image/dots.png')}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />

      <AppHeader
        title="Reorder Items"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/close.png')}
      />

      {/* Info Box */}
      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(3),
          backgroundColor: '#FFFBFE',
          borderWidth: 1.5,
          borderColor: '#FF04D7',
          borderRadius: responsiveScreenWidth(2),
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: responsiveScreenWidth(4),
          marginVertical: responsiveScreenHeight(3),
        }}
      >
        <View style={styles.iconcontainer}>
          <Image
            style={styles.icon2}
            resizeMode="contain"
            source={require('../../../../assets/image/info.png')}
          />
        </View>
        <Text style={styles.switchtxt}>
        Hold to Drag items to reorder your list. Rankings update Automatically
        </Text>
      </View>

      {/* Draggable List */}
      <NestableScrollContainer style={{ flex: 1 }}>
        <NestableDraggableFlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          onDragEnd={({ data }) => setItems(data)}
          removeClippedSubviews={false}
          dragItemOverflow
          activationDistance={5}
          autoscrollThreshold={120}
          autoscrollSpeed={40}
          contentContainerStyle={{
            paddingBottom: responsiveScreenHeight(2),
            marginHorizontal: responsiveScreenWidth(4),
          }}
        />
      </NestableScrollContainer>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton
          title="Done"
          onPress={() => {
            // 🔜 later you can send reordered data to API here
            navigation.navigate('Invitescreen');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: responsiveScreenHeight(2),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1,
    borderColor: '#C5C5C5',
    paddingHorizontal: responsiveScreenWidth(1.5),
  },
  cardActive: {
    backgroundColor: '#ECF6FF',
    borderColor: '#0180FE',
  },
  image: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(6),
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    fontSize: responsiveScreenFontSize(1.85),
    fontFamily: 'Quicksand-Regular',
    color: '#000',
    fontWeight: '500',
  },
  desc: {
    fontSize: responsiveScreenFontSize(1.75),
    color: '#777',
    marginTop: responsiveScreenHeight(1),
    fontFamily: 'Quicksand-Regular',
  },
  footer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(4),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  countxt: {
    color: '#fff',
    fontFamily: 'Ubuntu-Regular',
  },
  countwrap: {
    height: responsiveScreenWidth(8),
    width: responsiveScreenWidth(8),
    borderRadius: responsiveScreenWidth(4),
    marginRight: responsiveScreenWidth(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0180FE',
  },
  switchtxt: {
    fontFamily: 'samsungsharpsans-medium',
    fontSize: responsiveScreenFontSize(1.5),
    letterSpacing: 0.5,
    color: '#FF04D7',
    paddingVertical: responsiveScreenHeight(1),
    paddingHorizontal: responsiveScreenWidth(4),
    lineHeight: responsiveScreenHeight(2.25),
  },
  icon2: {
    width: '100%',
    height: '100%',
  },
  iconcontainer: {
    width: responsiveScreenWidth(4),
    height: responsiveScreenHeight(3),
  },
});
