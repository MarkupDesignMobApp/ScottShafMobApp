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
import { KeyboardAvoidingView } from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {
  useGetCatalogItemsOfListQuery,
  useAddCatalogItemsMutation,
} from '../../../features/auth/authApi';
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
    }, [refetch]),
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      setItems(data);
    } else {
      setItems([]);
    }
  }, [data]);

  /** BULLETPROOF RENDER ITEM */
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
          <View style={[styles.countwrap, isActive && styles.countwrapActive]}>
            <Text style={styles.countxt}>
              {safeIndex >= 0 ? safeIndex + 1 : ''}
            </Text>
          </View>

          {/* Image */}
          <View style={styles.image}>
            <Image
              resizeMode="cover"
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
            <Text style={[styles.title, isActive && styles.titleActive]}>
              {item.name}
            </Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.description || item.category || 'No description'}
            </Text>
          </View>

          {/* Drag Icon */}
          <View style={styles.dragIconContainer}>
            <Image
              style={styles.dragIcon}
              source={require('../../../../assets/image/dots.png')}
              tintColor={isActive ? '#FFFFFF' : '#2C3E50'}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [items],
  );

  const handleDragEnd = useCallback(({ data }: { data: ListItem[] }) => {
    setItems(data);
  }, []);

  const handleDone = async () => {
    try {
      setIsSaving(true);
      navigation.navigate('Invitescreen', { listId });
    } finally {
      setIsSaving(false);
    }
  };

  // Add Item modal logic
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
      Alert.alert(
        'Error',
        err?.data?.message || err?.error || 'Something went wrong',
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../../assets/image/left-icon.png')}
            style={styles.headerIcon}
            tintColor="#FFFFFF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reorder Items</Text>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../../assets/image/plus.png')}
            style={styles.headerIcon}
            tintColor="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        {/* Info Box */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Image
              resizeMode="contain"
              source={require('../../../../assets/image/info.png')}
              style={styles.infoIcon}
              tintColor="#2C3E50"
            />
          </View>
          <Text style={styles.infoText}>
            Hold and drag items to reorder your list. Rankings update
            automatically.
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2C3E50" />
          </View>
        ) : (
          <>
            <NestableScrollContainer style={{ flex: 1 }}>
              <NestableDraggableFlatList
                data={items}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                onDragEnd={handleDragEnd}
                scrollEnabled
                activationDistance={20}
                removeClippedSubviews={false}
                dragItemOverflow={false}
                autoscrollThreshold={80}
                autoscrollSpeed={60}
                contentContainerStyle={styles.listContainer}
              />

              {/* Add More Button */}
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
              >
                <Image
                  style={styles.addMoreIcon}
                  resizeMode="contain"
                  source={require('../../../../assets/image/plus.png')}
                  tintColor="#2C3E50"
                />
                <Text style={styles.addMoreText}>Add More Items</Text>
              </TouchableOpacity>
            </NestableScrollContainer>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.doneButton,
                  isSaving && styles.doneButtonDisabled,
                ]}
                onPress={handleDone}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.doneButtonText}>Done</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Add Item Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          statusBarTranslucent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ justifyContent: 'flex-end' }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
              <View style={styles.modalContainer}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Add New Item</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.modalCloseButton}
                    >
                      <Text style={styles.modalCloseText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Item Name Input */}
                  <View style={styles.modalInputWrapper}>
                    <Text style={styles.modalInputLabel}>
                      Item Name <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <View style={styles.modalInputContainer}>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Enter item name"
                        placeholderTextColor="#A0A0A0"
                        value={newItemName}
                        onChangeText={setNewItemName}
                      />
                    </View>
                  </View>

                  {/* Item Description Input */}
                  <View style={styles.modalInputWrapper}>
                    <Text style={styles.modalInputLabel}>
                      Description (Optional)
                    </Text>
                    <View
                      style={[
                        styles.modalInputContainer,
                        styles.modalTextAreaContainer,
                      ]}
                    >
                      <TextInput
                        style={[styles.modalInput, styles.modalTextArea]}
                        placeholder="Enter description"
                        placeholderTextColor="#A0A0A0"
                        value={newItemDescription}
                        onChangeText={setNewItemDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>

                  {/* Save Button */}
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.modalSaveButton,
                        (isAdding || !newItemName.trim()) &&
                        styles.modalSaveButtonDisabled,
                      ]}
                      onPress={handleAddItem}
                      disabled={isAdding || !newItemName.trim()}
                    >
                      {isAdding ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={styles.modalSaveButtonText}>Add Item</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
  },
  headerLeft: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
  },
  headerRight: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
  },
  headerIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderWidth: 1.5,
    borderColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    marginHorizontal: responsiveScreenWidth(4),
    marginVertical: responsiveScreenHeight(2),
    padding: responsiveScreenWidth(3),
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIconContainer: {
    width: responsiveScreenWidth(6),
    height: responsiveScreenHeight(3),
    marginRight: responsiveScreenWidth(2),
  },
  infoIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#2C3E50',
  },
  infoText: {
    flex: 1,
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.5),
    color: '#4A5568',
    lineHeight: responsiveScreenHeight(2.2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingTop: responsiveScreenHeight(1),
    paddingHorizontal: responsiveScreenWidth(4),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: responsiveScreenHeight(1.5),
    paddingHorizontal: responsiveScreenWidth(3),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(1.5),
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardActive: {
    backgroundColor: '#2C3E50',
    borderColor: '#2C3E50',
    shadowColor: '#2C3E50',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  countwrap: {
    height: responsiveScreenWidth(7),
    width: responsiveScreenWidth(7),
    borderRadius: responsiveScreenWidth(3.5),
    marginRight: responsiveScreenWidth(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C3E50',
  },
  countwrapActive: {
    backgroundColor: '#FFFFFF',
  },
  countxt: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(1.6),
  },
  image: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(6),
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: responsiveScreenFontSize(1.85),
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: responsiveScreenHeight(0.3),
  },
  titleActive: {
    color: '#FFFFFF',
  },
  desc: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#718096',
    fontFamily: 'Quicksand-Regular',
    lineHeight: responsiveScreenHeight(2.1),
  },
  dragIconContainer: {
    position: 'absolute',
    right: 10,
    top: '40%',
  },
  dragIcon: {
    width: 20,
    height: 20,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: responsiveScreenHeight(2),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(2),
    marginHorizontal: responsiveScreenWidth(4),
    borderWidth: 1.5,
    borderColor: '#2C3E50',
    borderStyle: 'dashed',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addMoreIcon: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenWidth(5),
    marginRight: responsiveScreenWidth(2),
    tintColor: '#2C3E50',
  },
  addMoreText: {
    fontSize: responsiveScreenFontSize(1.85),
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(2),
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  doneButton: {
    backgroundColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.9),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: responsiveScreenWidth(5),
    borderTopRightRadius: responsiveScreenWidth(5),
    paddingHorizontal: responsiveScreenWidth(5),
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
    fontSize: responsiveScreenFontSize(2.2),
    fontFamily: 'Quicksand-Bold',
    color: '#2C3E50',
    fontWeight: '600',
  },
  modalCloseButton: {
    width: responsiveScreenWidth(8),
    height: responsiveScreenWidth(8),
    borderRadius: responsiveScreenWidth(4),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: responsiveScreenFontSize(2),
    color: '#666',
    fontWeight: '400',
  },
  modalInputWrapper: {
    marginBottom: responsiveScreenHeight(2.5),
  },
  modalInputLabel: {
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'Quicksand-Regular',
    color: '#4A5568',
    marginBottom: responsiveScreenHeight(0.8),
  },
  requiredStar: {
    color: '#E53E3E',
  },
  modalInputContainer: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: responsiveScreenWidth(3),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: responsiveScreenWidth(3),
    minHeight: responsiveScreenHeight(6),
    justifyContent: 'center',
  },
  modalTextAreaContainer: {
    minHeight: responsiveScreenHeight(12),
    paddingVertical: responsiveScreenHeight(1),
  },
  modalInput: {
    fontSize: responsiveScreenFontSize(1.7),
    color: '#1A202C',
    fontFamily: 'Quicksand-Regular',
    padding: 0,
  },
  modalTextArea: {
    height: responsiveScreenHeight(10),
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(2),
  },
  modalSaveButton: {
    backgroundColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalSaveButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
});
