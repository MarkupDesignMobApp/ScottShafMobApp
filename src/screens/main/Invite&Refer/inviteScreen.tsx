import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useGetCatalogItemsOfListQuery,
  usePublishListMutation,
} from '../../../features/auth/authApi';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { CommonActions } from '@react-navigation/native';

export default function InviteScreen({ navigation, route }) {
  const { listId } = route.params;
  const { data, isLoading } = useGetCatalogItemsOfListQuery(listId);
  const [publishList, { isLoading: publishing }] = usePublishListMutation();
  const [title, setTitle] = useState('');

  const onPublish = async () => {
    const ids = [listId];
    if (!ids.length) {
      Alert.alert('Nothing to publish', 'No items found to publish.');
      return;
    }
    try {
      const res = await publishList({ list_ids: ids }).unwrap();
      const ok =
        res?.success === true ||
        res?.status === true ||
        res?.ok === true ||
        res?.code === 200;
      if (ok) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'ListPublishedScreen',
                params: { publishedIds: ids },
              },
            ],
          }),
        );
        return;
      }
      Alert.alert(
        'Publish failed',
        'Server did not confirm publish. Try again.',
      );
    } catch (err) {
      Alert.alert('Publish failed', 'Unable to publish list. Try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingWrap} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading items…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />

      {/* Header Container (dark) */}
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
          <Text style={styles.headerTitle}>List Preview</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      {/* Scrollable Content */}
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.cardTopBar}>
              <Text style={styles.cardHeader}>Your Ranked List</Text>
            </View>

            <Text style={styles.label}>List Title</Text>
            <View style={styles.titleInputContainer}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
                placeholder="Enter list title"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <FlatList
              data={Array.isArray(data) ? data : []}
              keyExtractor={item =>
                String(item?.id ?? item?.item_id ?? Math.random())
              }
              renderItem={({ item, index }) => (
                <View style={styles.row}>
                  <View style={styles.indexCircle}>
                    <Text style={styles.indexText}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>
                  <View style={styles.inputWrap}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item?.name ?? 'Untitled'}
                    </Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>📋</Text>
                  <Text style={styles.emptyText}>No items in this list</Text>
                </View>
              }
            />

            <TouchableOpacity
              style={[
                styles.publishBtn,
                publishing && styles.publishBtnDisabled,
              ]}
              onPress={onPublish}
              disabled={publishing}
              activeOpacity={0.8}
            >
              {publishing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.publishText}>Publish List</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>

      {/* Publishing Overlay */}
      {publishing && (
        <View style={styles.publishOverlay}>
          <View style={styles.publishLoader}>
            <ActivityIndicator size="large" color="#2C3E50" />
            <Text style={styles.publishLoaderText}>Publishing list…</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
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
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: responsiveScreenWidth(2),
  },
  headerRightPlaceholder: {
    width: responsiveScreenHeight(3),
    height: responsiveScreenHeight(3),
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(2),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: responsiveScreenWidth(4),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTopBar: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1.5),
    marginHorizontal: -responsiveScreenWidth(4),
    marginTop: -responsiveScreenWidth(4),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: responsiveScreenHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#2C3E50',
  },
  cardHeader: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'Quicksand-Bold',
  },
  label: {
    color: '#4A5568',
    marginBottom: responsiveScreenHeight(0.8),
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Quicksand-Regular',
  },
  titleInputContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: responsiveScreenWidth(3),
    backgroundColor: '#FFFFFF',
    marginBottom: responsiveScreenHeight(2),
  },
  titleInput: {
    fontSize: responsiveFontSize(1.7),
    color: '#1A202C',
    paddingVertical: responsiveScreenHeight(1.2),
    paddingHorizontal: responsiveScreenWidth(3),
    fontFamily: 'Quicksand-Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(1.5),
  },
  indexCircle: {
    width: responsiveScreenWidth(10),
    height: responsiveScreenWidth(10),
    borderRadius: responsiveScreenWidth(5),
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveScreenWidth(3),
  },
  indexText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Quicksand-Bold',
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: responsiveScreenWidth(3),
    paddingHorizontal: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.2),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: responsiveFontSize(1.7),
    color: '#2C3E50',
    fontFamily: 'Quicksand-Medium',
  },
  publishBtn: {
    backgroundColor: '#2C3E50',
    borderRadius: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenHeight(1.8),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveScreenHeight(2),
  },
  publishBtnDisabled: {
    backgroundColor: '#A0A0A0',
  },
  publishText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveFontSize(1.9),
  },
  publishOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishLoader: {
    width: 180,
    paddingVertical: responsiveScreenHeight(3),
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveScreenWidth(4),
  },
  publishLoaderText: {
    marginTop: responsiveScreenHeight(1.5),
    fontSize: responsiveFontSize(1.7),
    color: '#2C3E50',
    fontFamily: 'Quicksand-Regular',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: responsiveScreenHeight(1.5),
    fontSize: responsiveFontSize(1.8),
    color: '#2C3E50',
    fontFamily: 'Quicksand-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveScreenHeight(4),
  },
  emptyEmoji: {
    fontSize: responsiveFontSize(4),
    marginBottom: responsiveScreenHeight(1),
  },
  emptyText: {
    fontSize: responsiveFontSize(1.7),
    color: '#A0A0A0',
    fontFamily: 'Quicksand-Regular',
  },
  bottomPadding: {
    height: responsiveScreenHeight(2),
  },
});
