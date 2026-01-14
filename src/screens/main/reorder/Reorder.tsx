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
  Modal,
  TextInput,
  ScrollView,
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
import { useGetCatalogItemsOfListQuery, useAddCatalogItemsMutation } from '../../../features/auth/authApi';
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

  const [items, setItems] = useState<ListItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // modal & inputs
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  // api hooks
  const { data, isLoading, refetch } = useGetCatalogItemsOfListQuery(listId);
  const [addListItem, { isLoading: isAdding }] = useAddCatalogItemsMutation();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      setItems(data);
    } else {
      setItems([]);
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

  // --------- Add Item modal logic ----------
  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Required', 'Item name is required');
      return;
    }

    try {
      const res: any = await addListItem({
        listId,
        custom_item_name: newItemName.trim(),
        custom_text: newItemDescription.trim(),
      }).unwrap();

      // Support various API shapes
      if (res?.success || res?.status === 'success' || res?.id) {
        Alert.alert('Success', 'Item added successfully.');
        setModalVisible(false);
        setNewItemName('');
        setNewItemDescription('');

        try {
          await refetch();
        } catch (rfErr) {
          console.warn('Refetch failed after add item:', rfErr);
        }
      } else {
        Alert.alert('Error', res?.message || 'Could not add item');
      }
    } catch (err: any) {
      console.warn('Add item error', err);
      Alert.alert('Error', err?.data?.message || err?.error || 'Something went wrong');
    }
  };

  return (
    <>
      <AppHeader
        title="Reorder Items"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/left-icon.png')}
        rightImage={require('../../../../assets/image/plus.png')}
        onRightPress={() => setModalVisible(true)}
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
                  marginHorizontal: responsiveScreenWidth(4),
                }}
              />
              {/* Add More Button */}
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={() => setModalVisible(true)}
        >
          <Image
            style={styles.addMoreIcon}
            resizeMode="contain"
            source={require('../../../../assets/image/plus.png')}
          />
          <Text style={styles.addMoreText}>Add More</Text>
        </TouchableOpacity>

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

        {/* ---------- Add Item Modal ---------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Item</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Item Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Item Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter item name"
                    placeholderTextColor="#999"
                    value={newItemName}
                    onChangeText={setNewItemName}
                  />
                </View>

                {/* Item Description Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter description (optional)"
                    placeholderTextColor="#999"
                    value={newItemDescription}
                    onChangeText={setNewItemDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Save Button */}
                <View style={styles.modalButtonContainer}>
                  <AppButton
                    title={isAdding ? 'Saving...' : 'Save Item'}
                    onPress={handleAddItem}
                    disabled={isAdding}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  // Add / modal styles (kept same as requested)
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: responsiveScreenHeight(2),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(2),
    borderWidth: 1.5,
    borderColor: '#0180FE',
    borderStyle: 'dashed',
    marginHorizontal: responsiveScreenWidth(4),
  },
  addMoreIcon: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenWidth(5),
    marginRight: responsiveScreenWidth(2),
    tintColor: '#0180FE',
  },
  addMoreText: {
    fontSize: responsiveScreenFontSize(1.85),
    fontFamily: 'Quicksand-Regular',
    color: '#0180FE',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: responsiveScreenWidth(5),
    borderTopRightRadius: responsiveScreenWidth(5),
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(3),
    paddingBottom: responsiveScreenHeight(4),
    maxHeight: responsiveScreenHeight(70),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(3),
  },
  modalTitle: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'Quicksand-Regular',
    color: '#000',
    fontWeight: '600',
  },
  closeButton: {
    width: responsiveScreenWidth(8),
    height: responsiveScreenWidth(8),
    borderRadius: responsiveScreenWidth(4),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: responsiveScreenFontSize(2.5),
    color: '#666',
    fontWeight: '400',
  },
  inputContainer: {
    marginBottom: responsiveScreenHeight(2.5),
  },
  inputLabel: {
    fontSize: responsiveScreenFontSize(1.75),
    fontFamily: 'Quicksand-Regular',
    color: '#000',
    fontWeight: '500',
    marginBottom: responsiveScreenHeight(1),
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1.5),
    fontSize: responsiveScreenFontSize(1.75),
    fontFamily: 'Quicksand-Regular',
    color: '#000',
  },
  textArea: {
    height: responsiveScreenHeight(12),
    paddingTop: responsiveScreenHeight(1.5),
  },
  modalButtonContainer: {
    marginTop: responsiveScreenHeight(2),
  },
});
