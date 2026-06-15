import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {
  useGetCatalogItemsOfListQuery,
  useAddCatalogItemsMutation,
  useReorderListItemsMutation,
  useUpdateListItemMutation, // 👈 add this
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
  const [isReordering, setIsReordering] = useState(false);

  // Add Item Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  // Edit Item Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const { data, isLoading, refetch } = useGetCatalogItemsOfListQuery(listId);
  const [addListItem, { isLoading: isAdding }] = useAddCatalogItemsMutation();
  const [reorderItems] = useReorderListItemsMutation();
  const [updateListItem, { isLoading: isUpdating }] =
    useUpdateListItemMutation();

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

  // Open edit modal with current item data
  const openEditModal = (item: ListItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditDescription(item.description || '');
    setEditModalVisible(true);
  };

  // Save edited item
  const handleUpdateItem = async () => {
    if (!editingItem) return;
    if (!editName.trim()) {
      Alert.alert('Required', 'Item name is required');
      return;
    }

    try {
      const res = await updateListItem({
        listId: Number(listId),
        itemId: editingItem.id,
        custom_item_name: editName.trim(),
        custom_text: editDescription.trim() || null,
      }).unwrap();

      if (res?.success) {
        Alert.alert('Success', 'Item updated successfully');
        setEditModalVisible(false);
        setEditingItem(null);
        await refetch(); // refresh list
      } else {
        Alert.alert('Error', res?.message || 'Could not update item');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Something went wrong');
    }
  };

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
            <Text style={[styles.countxt, isActive && styles.countxtActive]}>
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
              style={styles.imageInner}
            />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text
              style={[styles.title, isActive && styles.titleActive]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.description || item.category || 'No description'}
            </Text>
          </View>

          {/* Edit Button (Three Dots) */}
          <TouchableOpacity
            style={styles.dragIconContainer}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}
          >
            <Image
              style={styles.dragIcon}
              source={require('../../../../assets/image/dots.png')}
              tintColor={isActive ? '#FFFFFF' : '#2C3E50'}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [items],
  );

  // ... (handleDragEnd, handleDone, handleAddItem remain unchanged)

  const handleDragEnd = useCallback(
    async ({
      data,
      from,
      to,
    }: {
      data: ListItem[];
      from: number;
      to: number;
    }) => {
      if (from === to) return;

      const previousItems = [...items];
      setItems(data);

      const itemsPayload = data.map((item, index) => ({
        id: Number(item.id),
        position: index + 1,
      }));

      try {
        setIsReordering(true);
        await reorderItems({
          listId: Number(listId),
          items: itemsPayload,
        }).unwrap();
        await refetch();
      } catch (error: any) {
        Alert.alert(
          'Reorder Failed',
          error?.data?.message || error?.message || 'Failed to reorder items',
        );
        setItems(previousItems);
      } finally {
        setIsReordering(false);
      }
    },
    [items, listId, reorderItems, refetch],
  );

  const handleDone = async () => {
    try {
      setIsSaving(true);
      navigation.navigate('Invitescreen', { listId });
    } finally {
      setIsSaving(false);
    }
  };

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
        await refetch();
      } else {
        Alert.alert('Error', res?.message || 'Could not add item');
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.data?.message || err?.error || 'Something went wrong',
      );
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#2C3E50' }} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Image
              tintColor="#fff"
              resizeMode="contain"
              style={styles.backIcon}
              source={require('../../../../assets/image/left-icon.png')}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reorder Items</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addButtonHeader}
            activeOpacity={0.7}
          >
            <Image
              tintColor="#fff"
              resizeMode="contain"
              style={styles.plusIcon}
              source={require('../../../../assets/image/plus.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentArea}>
        {/* Info Card */}
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

        {isReordering && (
          <View style={styles.reorderingBar}>
            <ActivityIndicator size="small" color="#2C3E50" />
            <Text style={styles.reorderingText}>Saving order...</Text>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2C3E50" />
          </View>
        ) : (
          <>
            <NestableScrollContainer style={styles.scrollContainer}>
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
      </View>

      {/* ========== ADD ITEM MODAL (unchanged) ========== */}
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
            style={styles.modalKeyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          >
            <View style={styles.modalContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Item</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCloseButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

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

      {/* ========== EDIT ITEM MODAL ========== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setEditModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
              style={styles.modalContainer}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Item</Text>
                  <TouchableOpacity
                    onPress={() => setEditModalVisible(false)}
                    style={styles.modalCloseButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalInputWrapper}>
                  <Text style={styles.modalInputLabel}>
                    Item Name <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.modalInputContainer}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Enter item name"
                      placeholderTextColor="#A0A0A0"
                      value={editName}
                      onChangeText={setEditName}
                    />
                  </View>
                </View>

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
                      value={editDescription}
                      onChangeText={setEditDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.modalSaveButton,
                      (isUpdating || !editName.trim()) &&
                        styles.modalSaveButtonDisabled,
                    ]}
                    onPress={handleUpdateItem}
                    disabled={isUpdating || !editName.trim()}
                  >
                    {isUpdating ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.modalSaveButtonText}>
                        Save Changes
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveScreenHeight(1.5),
  },
  backButton: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
  },
  backIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(2.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  addButtonHeader: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    marginHorizontal: responsiveScreenWidth(4),
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(1.5),
    padding: responsiveScreenWidth(3),
  },
  infoIconContainer: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenWidth(5),
    marginRight: responsiveScreenWidth(2),
    justifyContent: 'center',
    alignItems: 'center',
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
  reorderingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 7,
    marginHorizontal: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(1),
  },
  reorderingText: {
    fontSize: responsiveScreenFontSize(1.5),
    color: '#2C3E50',
    fontFamily: 'Quicksand-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  listContainer: {
    paddingTop: responsiveScreenHeight(1),
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(1),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: responsiveScreenHeight(1.5),
    paddingHorizontal: responsiveScreenWidth(3),
    borderRadius: 12,
    marginBottom: responsiveScreenHeight(1.5),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardActive: {
    backgroundColor: '#2C3E50',
    borderColor: '#2C3E50',
  },
  countwrap: {
    width: responsiveScreenWidth(7),
    height: responsiveScreenWidth(7),
    borderRadius: responsiveScreenWidth(3.5),
    marginRight: responsiveScreenWidth(2.5),
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
    fontSize: responsiveScreenFontSize(1.8),
  },
  countxtActive: {
    color: '#2C3E50',
  },
  image: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenWidth(12),
    borderRadius: 8,
    marginRight: responsiveScreenWidth(3),
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  imageInner: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    marginRight: responsiveScreenWidth(3),
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
    fontSize: responsiveScreenFontSize(1.5),
    color: '#718096',
    fontFamily: 'Quicksand-Regular',
    lineHeight: responsiveScreenHeight(2),
  },
  dragIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveScreenWidth(6),
    height: responsiveScreenWidth(6),
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
    borderWidth: 1,
    borderColor: '#2C3E50',
    borderStyle: 'dashed',
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
  },
  doneButton: {
    backgroundColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonDisabled: {
    backgroundColor: '#A0A0A0',
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
  modalKeyboardView: {
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
    borderWidth: 1,
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
  },
  modalSaveButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
  },
});
