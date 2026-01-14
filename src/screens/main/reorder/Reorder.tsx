import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
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
import { useFocusEffect } from '@react-navigation/native';

type ListItem = {
  id: number;
  type: 'catalog' | 'custom';
  item_id: number | null;
  name: string;
  category: string | null;
  description: string | null;
  image_url?: string | null;
};

const DRAG_BUFFER = responsiveScreenHeight(25);

export default function CreateListScreen({ navigation, route }: any) {
  const { listId } = route.params;

  const [items, setItems] = useState<ListItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, refetch } =
    useGetCatalogItemsOfListQuery(listId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      setItems(data);
    }
  }, [data]);

  /** ✅ BULLETPROOF RENDER ITEM */
  const renderItem = useCallback(
    ({ item, drag, isActive, index }: RenderItemParams<ListItem>) => {
      const safeIndex =
        typeof index === 'number'
          ? index
          : items.findIndex(i => i.id === item.id);

      return (
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          style={[styles.card, isActive && styles.cardActive]}
        >
          {/* Index */}
          <View style={styles.countwrap}>
            <Text style={styles.countxt}>
              {safeIndex >= 0 ? safeIndex + 1 : ''}
            </Text>
          </View>

          {/* Image */}
          <View style={styles.image}>
            <Image
              resizeMode="contain"
              source={
                item.image_url
                  ? { uri: item.image_url }
                  : require('../../../../assets/image/noimage.jpg')
              }
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

          {/* Drag Icon */}
          <View style={{ position: 'absolute', right: 10, top: '40%' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../../../assets/image/dots.png')}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [items]
  );

  const handleDragEnd = useCallback(
    ({ data }: { data: ListItem[] }) => {
      setItems(data);
    },
    []
  );

  const handleDone = async () => {
    try {
      setIsSaving(true);
      navigation.navigate('Invitescreen', { listId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AppHeader
        title="Reorder Items"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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
            marginVertical: responsiveScreenHeight(2),
          }}
        >
          <View style={styles.iconcontainer}>
            <Image
              resizeMode="contain"
              source={require('../../../../assets/image/info.png')}
              style={styles.icon2}
            />
          </View>
          <Text style={styles.switchtxt}>
            Hold to drag items to reorder your list. Rankings update automatically.
          </Text>
        </View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            {/* ✅ FIXED SCROLL + DRAG */}
            <NestableScrollContainer style={{ flex: 1 }}>
              <NestableDraggableFlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onDragEnd={handleDragEnd}

                /** SCROLL FIX */
                scrollEnabled
                activationDistance={20}

                /** CUTTING FIX */
                removeClippedSubviews={false}
                dragItemOverflow={false}

                autoscrollThreshold={80}
                autoscrollSpeed={60}

                contentContainerStyle={{
                  paddingTop: responsiveScreenHeight(2),
                  paddingBottom: DRAG_BUFFER,
                  marginHorizontal: responsiveScreenWidth(4),
                }}

                /** REAL SPACE FOR LAST ITEM */
                ListFooterComponent={
                  <View style={{ height: DRAG_BUFFER }} />
                }
              />
            </NestableScrollContainer>

            {/* Footer */}
            <View style={styles.footer}>
              <AppButton
                title={isSaving ? 'Saving...' : 'Done'}
                onPress={handleDone}
                disabled={isSaving}
              />
              {Platform.OS === 'android' && (
                <View style={{ height: responsiveScreenHeight(1) }} />
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </>
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
    overflow: 'hidden',
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
