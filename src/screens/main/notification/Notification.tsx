import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetNotificationsQuery,
  useAcceptNotificationMutation,
  useRejectNotificationMutation,
} from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';
import { useFocusEffect } from '@react-navigation/native';

export default function Notification({ navigation }) {
  const { data: Notify, isLoading, refetch } = useGetNotificationsQuery();

  const [acceptNotification, { isLoading: isAccepting }] =
    useAcceptNotificationMutation();
  const [rejectNotification, { isLoading: isRejecting }] =
    useRejectNotificationMutation();

  const [selectedAction, setSelectedAction] = useState({});

  /* ✅ Refresh on screen focus */
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const Data = Notify?.data?.data || [];

  /* ✅ ACCEPT */
  const handleAccept = async item => {
    setSelectedAction(prev => ({ ...prev, [item.id]: 'accept' }));
    try {
      await acceptNotification({ list_id: item.list_id }).unwrap();
      refetch();
    } catch (err) {
      console.log('Accept error', err);
    }
  };

  /* ✅ DECLINE */
  const handleDecline = async item => {
    setSelectedAction(prev => ({ ...prev, [item.id]: 'decline' }));
    try {
      await rejectNotification({ list_id: item.list_id }).unwrap();
      refetch();
    } catch (err) {
      console.log('Decline error', err);
    }
  };

  /* ✅ LOADER */
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Loader size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER */}
      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Notifications"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      {/* BODY */}
      <View style={{ flex: 1 }}>
        {Data.length === 0 ? (
          /* ✅ EMPTY STATE */
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Image
              source={require('../../../../assets/image/notificationnotfount.jpg')}
              style={{ width: 280, height: 280, resizeMode: 'contain' }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#666',
                textAlign: 'center',
                marginTop: 10,
              }}
            >
              No notifications found
            </Text>
          </View>
        ) : (
          /* ✅ LIST */
          <FlatList
            data={Data}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingVertical: 10 }}
            removeClippedSubviews
            initialNumToRender={10}
            renderItem={({ item }) => {
              const isAcceptActive =
                selectedAction[item.id] === 'accept' && isAccepting;
              const isDeclineActive =
                selectedAction[item.id] === 'decline' && isRejecting;

              return (
                <View style={styles.listcontainer}>
                  <View style={{ flexDirection: 'row' }}>
                    {/* IMAGE */}
                    <View style={styles.imgcontainer}>
                      <Image
                        style={styles.img}
                        resizeMode="contain"
                        source={require('../../../../assets/image/women1.png')}
                      />
                    </View>

                    {/* CONTENT */}
                    <View style={{ paddingLeft: '4%', flex: 1 }}>
                      <Text style={styles.cardmaintitletxt}>{item.title}</Text>

                      <Text style={styles.cardsubtitletxt}>{item.body}</Text>

                      <Text style={styles.timesmalltxt}>
                        {item.time_ago || 'Just now'}
                      </Text>

                      {/* BUTTONS */}
                      <View style={styles.btncontainer}>
                        {/* ACCEPT */}
                        <TouchableOpacity
                          disabled={isAccepting || isRejecting}
                          style={[
                            styles.btn,
                            selectedAction[item.id] === 'accept' &&
                              styles.activeBtn,
                          ]}
                          onPress={() => handleAccept(item)}
                        >
                          {isAcceptActive ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text
                              style={[
                                styles.btnText,
                                selectedAction[item.id] === 'accept' &&
                                  styles.activeBtnText,
                              ]}
                            >
                              Accept
                            </Text>
                          )}
                        </TouchableOpacity>

                        {/* DECLINE */}
                        <TouchableOpacity
                          disabled={isAccepting || isRejecting}
                          style={[
                            styles.btn,
                            { marginLeft: '2%' },
                            selectedAction[item.id] === 'decline' &&
                              styles.declineActiveBtn,
                          ]}
                          onPress={() => handleDecline(item)}
                        >
                          {isDeclineActive ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text
                              style={[
                                styles.btnText,
                                selectedAction[item.id] === 'decline' &&
                                  styles.activeBtnText,
                              ]}
                            >
                              Decline
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* DOT */}
                    <View
                      style={{
                        height: 8,
                        width: 8,
                        borderRadius: 4,
                        backgroundColor: '#FF04D7',
                        position: 'absolute',
                        top: 10,
                        right: 10,
                      }}
                    />
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
