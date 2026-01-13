import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import {
  useGetNotificationsQuery,
  useAcceptNotificationMutation,
  useRejectNotificationMutation,
} from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';
import {
  responsiveScreenFontSize as fp,
  responsiveScreenHeight as hp,
  responsiveScreenWidth as wp,
} from 'react-native-responsive-dimensions';
import { useFocusEffect } from '@react-navigation/native';

export default function Notification({ navigation }: any) {
  const { data: Notify, isLoading, refetch } = useGetNotificationsQuery();
  const [acceptNotification] = useAcceptNotificationMutation();
  const [rejectNotification] = useRejectNotificationMutation();

  // per-item loading state: { [id]: boolean }
  const [actionLoading, setActionLoading] = useState<Record<string | number, boolean>>(
    {}
  );
  // selectedAction for styling (accept/decline active look)
  const [selectedAction, setSelectedAction] = useState<Record<string | number, string>>(
    {}
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const Data = Notify?.data?.data || [];

  const handleAccept = async (item: any) => {
    setSelectedAction((prev) => ({ ...prev, [item.id]: 'accept' }));
    setActionLoading((prev) => ({ ...prev, [item.id]: true }));
    try {
      await acceptNotification({ list_id: item.list_id }).unwrap();
      // refresh list
      refetch();
    } catch (err) {
      console.log('Accept error', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleDecline = async (item: any) => {
    setSelectedAction((prev) => ({ ...prev, [item.id]: 'decline' }));
    setActionLoading((prev) => ({ ...prev, [item.id]: true }));
    try {
      await rejectNotification({ list_id: item.list_id }).unwrap();
      refetch();
    } catch (err) {
      console.log('Decline error', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderWrap}>
        <Loader size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Notifications"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      {Data.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Image
            source={require('../../../../assets/image/notificationnotfount.jpg')}
            style={styles.emptyImg}
          />
          <Text style={styles.emptyText}>No notifications found</Text>
        </View>
      ) : (
        <FlatList
        data={Data}
        contentContainerStyle={{ paddingTop: hp(1.5), paddingBottom: hp(1.5) }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const isLoadingThis = !!actionLoading[item.id];
          return (
            <View>
              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.imgWrap}>
                    <Image
                      source={require('../../../../assets/image/women1.png')}
                      style={styles.profileImg}
                    />
                  </View>
      
                  <View style={styles.textWrap}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.sub}>{item.body}</Text>
                    <Text style={styles.time}>{item.created_at} hours ago</Text>
      
                    <View style={styles.btnRow}>
                      <TouchableOpacity
                        disabled={isLoadingThis}
                        style={[
                          styles.btn,
                          selectedAction[item.id] === 'accept' && styles.acceptActive,
                        ]}
                        onPress={() => handleAccept(item)}
                      >
                        {isLoadingThis && selectedAction[item.id] === 'accept' ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text
                            style={[
                              styles.btnText,
                              selectedAction[item.id] === 'accept' && styles.activeText,
                            ]}
                          >
                            Accept
                          </Text>
                        )}
                      </TouchableOpacity>
      
                      <TouchableOpacity
                        disabled={isLoadingThis}
                        style={[
                          styles.btn,
                          styles.declineBtn,
                          selectedAction[item.id] === 'decline' && styles.declineActive,
                        ]}
                        onPress={() => handleDecline(item)}
                      >
                        {isLoadingThis && selectedAction[item.id] === 'decline' ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text
                            style={[
                              styles.btnText,
                              selectedAction[item.id] === 'decline' && styles.activeText,
                            ]}
                          >
                            Decline
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
      
                  <View style={styles.dot} />
                </View>
              </View>
      
              {/* Divider below every item, including last */}
              <View style={styles.divider} />
            </View>
          );
        }}
      />
      
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -hp(20),
  },

  emptyImg: {
    width: wp(70),
    height: wp(70),
    resizeMode: 'contain',
  },

  emptyText: {
    fontSize: fp(2),
    color: '#666',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: wp(4.3),
    marginBottom: hp(1.6),
    borderRadius: wp(3.2),
    padding: wp(3.2),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  imgWrap: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImg: {
    width: wp(10),
    height: wp(10),
    resizeMode: 'contain',
  },

  textWrap: {
    flex: 1,
    marginLeft: wp(3.2),
  },

  title: {
    fontSize: fp(2),
    fontWeight: '600',
    color: '#000',
  },

  sub: {
    fontSize: fp(1.8),
    color: '#777',
    marginTop: hp(0.5),
  },

  time: {
    fontSize: fp(1.6),
    color: '#999',
    marginTop: hp(0.5),
  },

  btnRow: {
    flexDirection: 'row',
    marginTop: hp(1.2),
  },

  btn: {
    borderWidth: 1,
    borderColor: '#00C4FA',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4.5),
    borderRadius: wp(5),
    minWidth: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  declineBtn: {
    marginLeft: wp(2.7),
    borderColor: '#00C4FA',
  },

  btnText: {
    fontSize: fp(1.8),
    color: '#00C4FA',
  },

  acceptActive: {
    backgroundColor: '#00C4FA',
  },

  declineActive: {
    backgroundColor: '#FF0000',
  },

  activeText: {
    color: '#fff',
  },

  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#FF04D7',
    position: 'absolute',
    top: hp(1),
    right: wp(2),
  },

  separator: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: wp(4.3),
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: wp(4.3),
    marginBottom:hp(0.5)
  },
  
});
