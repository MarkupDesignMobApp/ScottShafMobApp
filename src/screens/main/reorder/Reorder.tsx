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
  Alert,
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

import { useGetCatalogItemsOfListQuery /*, useSaveOrderMutation */ } from '../../../features/auth/authApi';
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

export default function CreateListScreen({ navigation, route }: any) {
  const { listId } = route.params;

  // state
  const [items, setItems] = useState<ListItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  // const [saveOrder] = useSaveOrderMutation(); // <- uncomment if you have a mutation

  // api
  const { data, isLoading , refetch} = useGetCatalogItemsOfListQuery(listId);

  
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      return () => {
      };
    }, [refetch])
  );
  // sync api -> state
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setItems(data);
    }
  }, [data]);


  const renderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<ListItem>) => {
      const index = getIndex?.() ?? 0;
      return (
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          style={[styles.card, isActive && styles.cardActive]}
        >
          {/* Index / ID */}
          <View style={styles.countwrap}>
            <Text style={styles.countxt}>{index + 1}</Text>
          </View>

          {/* Image */}
          <View style={styles.image}>
            {item.image_url ? (
              <Image
                resizeMode="contain"
                source={{ uri: item.image_url }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={require('../../../../assets/image/noimage.jpg')}
                style={{ width: '100%', height: '100%' }}
              />
            )}
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
    },
    []
  );

  // when drag ends, update local state
  const handleDragEnd = useCallback(({ data: newData }: { data: ListItem[] }) => {
    setItems(newData);
  }, []);

  // on Done -> optionally save order, then navigate
  const handleDone = async () => {
    try {
      setIsSaving(true);

      // Optional: call API to save new order
      // Example payload: [{ id: 123, position: 1 }, { id: 456, position: 2 }, ...]
      // const payload = items.map((it, idx) => ({ id: it.id, position: idx + 1 }));
      // await saveOrder({ listId, order: payload }).unwrap();

      // navigate after save (or immediately if you don't need to save)
      navigation.navigate('Invitescreen', { listId });
    } catch (e) {
      // handle error (alert/snackbar)
      console.warn('Save order failed', e);
    } finally {
      setIsSaving(false);
    }
  };

  // footer height padding to prevent last item hiding under footer
  const footerPadding = responsiveScreenHeight(18); // adjust if your footer height changes

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Status bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <AppHeader
        title="Reorder Items"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/left-icon.png')}
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

      {/* Loader */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {/* Draggable List (nested scroll container wraps the draggable flatlist) */}
          <NestableScrollContainer style={{ flex: 1 }}>
            <NestableDraggableFlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              onDragEnd={handleDragEnd}
              removeClippedSubviews={false}
              dragItemOverflow
              activationDistance={5}
              autoscrollThreshold={120}
              autoscrollSpeed={40}
              // ensure inner list can still scroll when nested
              nestedScrollEnabled
              // keep some padding so the last item is visible above footer
              contentContainerStyle={{
                paddingBottom: footerPadding,
                marginHorizontal: responsiveScreenWidth(4),
              }}
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
              <View style={{ height: responsiveScreenHeight(1) }} /> // small spacer
            )}
          </View>
        </>
      )}
    </SafeAreaView>
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
