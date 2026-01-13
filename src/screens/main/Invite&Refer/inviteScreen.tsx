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
} from 'react-native';

import {
  useGetCatalogItemsOfListQuery,
  usePublishListMutation,
} from '../../../features/auth/authApi';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#0A7AFF',
  lightBlue: '#E8F5FF',
  border: '#E0E0E0',
  cardBorder: '#B8E0FF',
  text: '#000000',
  muted: '#999999',
  background: '#F5F5F5',
  white: '#FFFFFF',
  successBg: '#00D4D4',
  cardbg: '#DBEDFF',
  Circle: '#00C4FA',
  cardborder: '#A8A8A8',
  Iconbg: '#E3F9FF',
};

export default function InviteScreen({ navigation, route }) {
  const { listId } = route.params;
  const { data, isLoading } = useGetCatalogItemsOfListQuery(listId);

  const [publishList, { isLoading: publishing }] = usePublishListMutation();

  const [title, setTitle] = useState('My Ranked List');

  const onPublish = async () => {
    const ids = [listId];
    console.log(ids);
  
    if (!ids.length) {
      Alert.alert('Nothing to publish', 'No items found to publish.');
      return;
    }
  
    try {
      const res = await publishList({ list_ids: ids }).unwrap();
      console.log(res);
      const ok = res?.success === true || res?.status === true || res?.ok === true || res?.code === 200;
      if (ok) {
        navigation.replace('ListPublishedScreen', { publishedIds: ids }); 
        return;
      }
      console.warn('Publish response (unexpected):', res);
      Alert.alert('Publish failed', 'Server did not confirm publish. Try again.');
    } catch (err) {
      console.warn('Publish error', err);
      Alert.alert('Publish failed', 'Unable to publish list. Try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading items…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
        <AppHeader
        onLeftPress={() => navigation.goBack()}
        title='List Preview'
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* CARD */}
        <View style={styles.card}>
          <View style={styles.cardTopBar}>
            <Text style={styles.cardHeader}>Your Ranked List</Text>
          </View>

          <Text style={styles.label}>List Title</Text>
          <TextInput value={title} onChangeText={setTitle} style={styles.titleInput} />

          <FlatList
            data={Array.isArray(data) ? data : []}
            keyExtractor={(item) => String(item?.id ?? item?.item_id ?? Math.random())}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <View style={styles.indexCircle}>
                  <Text style={styles.indexText}>{String(index + 1).padStart(2, '0')}</Text>
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.input}>{item?.name ?? 'Untitled'}</Text>

                  {item?.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={{ width: 32, height: 32, borderRadius: 6 }}
                    />
                  ) : null}
                </View>
              </View>
            )}
            scrollEnabled={false}
          />

          <TouchableOpacity
            style={[styles.publishBtn, publishing && { opacity: 0.6 }]}
            onPress={onPublish}
            disabled={publishing}
          >
            <Text style={styles.publishText}>
              {publishing ? 'Publishing…' : 'Publish List'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fullscreen loader overlay while publishing */}
      {publishing && (
        <View style={styles.publishOverlay}>
          <View style={styles.publishLoader}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10 }}>Publishing list…</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  backImage: {
    width: 20,
    height: 20,
    tintColor: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardborder,
    marginBottom: 20,
  },

  cardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardbg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: -16,
    marginTop: -16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 16,
  },

  cardHeader: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    fontFamily: 'Quicksand-bold',
  },
  menuImage: {
    width: 20,
    height: 20,
    tintColor: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },

  label: {
    color: COLORS.text,
    marginBottom: 6,
    fontSize: 13,
    fontFamily: 'Quicksand-Regular',
  },
  titleInput: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  indexCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.Circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    fontFamily: 'Quicksand-Regular',
  },
  indexText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },

  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#00C4FA',
    fontFamily: 'Quicksand-Medium',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginLeft: 8,
    tintColor: COLORS.muted,
  },
  clearImage: {
    width: 10,
    height: 10,
    marginLeft: 8,
    tintColor: COLORS.muted,
  },

  publishBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  publishText: {
    color: COLORS.white,
    fontWeight: '400',
    fontFamily: 'Quicksand-Regular',
    fontSize: 18,
  },

  publishOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishLoader: {
    width: 160,
    height: 110,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    elevation: 6,
  },

  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    paddingTop: 36,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },

  successBadge: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 4,
  },

  successText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.Iconbg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  socialIconImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.Iconbg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  peopleImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },

  inviteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
    fontFamily: 'Quicksand-Bold',
  },
  inviteDesc: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 10,
    fontFamily: 'Quicksand-medium',
  },

  socialRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  socialBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',

    minWidth: 80,
  },

  socialText: {
    fontSize: 11,
    color: COLORS.text,
  },
  skip: {
    color: COLORS.muted,
    fontSize: 14,
    fontFamily: 'Quicksand-medium',
  },
});
