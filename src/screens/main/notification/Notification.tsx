import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator , SafeAreaView} from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { styles } from './styles';
import {
  useGetNotificationsQuery,
  useAcceptNotificationMutation,
  useRejectNotificationMutation,
} from '../../../features/auth/authApi'
import Loader from '../../../components/ui/Loader/Loader';

export default function Notification({ navigation }) {
  const { data: Notify, isLoading, refetch } = useGetNotificationsQuery();
  const [acceptNotification, { isLoading: isAccepting }] = useAcceptNotificationMutation();
  const [rejectNotification, { isLoading: isRejecting }] = useRejectNotificationMutation();
  const [selectedAction, setSelectedAction] = useState({});

    useFocusEffect(()=>{
      refetch();
    })
  const Data = Notify?.data?.data || [];

  const handleAccept = async (item) => {
    setSelectedAction(prev => ({ ...prev, [item.id]: 'accept' }));
    try {
      await acceptNotification({
        list_id: item.list_id,
      }).unwrap();
      refetch();
    } catch (err) {
      console.log('Accept error', err);
    }
  };

  const handleDecline = async (item) => {
    setSelectedAction(prev => ({ ...prev, [item.id]: 'decline' }));
    try {
      await rejectNotification({
        list_id: item.list_id,
      }).unwrap();
      refetch();
    } catch (err) {
      console.log('Decline error', err);
    }
  };

  if (isLoading) {
    return (
      <View style={{ justifyContent: 'center' }}>
        <Loader size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

    {/* HEADER */}
    <View style={{ zIndex: 10 }}>
      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Notifications"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
    </View>

    {/* BODY */}
    <View style={{ flex: 1 }}>
      {(!Data || Data.length === 0) ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , marginTop:-150}}>
          <Image
            source={require('../../../../assets/image/notificationnotfount.jpg')}
            style={{ width: 300, height: 300, resizeMode: 'contain' }}
          />
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            No notifications found
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingTop: 10 }}
          data={Data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listcontainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.imgcontainer}>
                  <Image
                    style={styles.img}
                    resizeMode="contain"
                    source={require('../../../../assets/image/women1.png')}
                  />
                </View>

                <View style={{ paddingLeft: '4%', flex: 1 }}>
                  <Text style={styles.cardmaintitletxt}>{item.title}</Text>
                  <Text style={[styles.cardsubtitletxt, styles.subtitletxt]}>
                    {item.body}
                  </Text>
                  <Text style={[styles.cardsubtitletxt, styles.subtitletxt]}>
                    {`${item.created_at} hours ago`}
                  </Text>

                  <View style={styles.btncontainer}>
                    {/* ACCEPT */}
                    <TouchableOpacity
                      disabled={isAccepting || isRejecting}
                      style={[
                        styles.btn,
                        selectedAction[item.id] === 'accept' && styles.activeBtn,
                      ]}
                      onPress={() => handleAccept(item)}
                    >
                      <Text
                        style={[
                          styles.btnText,
                          selectedAction[item.id] === 'accept' && styles.activeBtnText,
                        ]}
                      >
                        Accept
                      </Text>
                    </TouchableOpacity>

                    {/* DECLINE */}
                    <TouchableOpacity
                      disabled={isAccepting || isRejecting}
                      style={[
                        styles.btn,
                        { marginLeft: '2%' },
                        selectedAction[item.id] === 'decline' && styles.declineActiveBtn,
                      ]}
                      onPress={() => handleDecline(item)}
                    >
                      <Text
                        style={[
                          styles.btnText,
                          selectedAction[item.id] === 'decline' && styles.activeBtnText,
                        ]}
                      >
                        Decline
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Dot */}
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
          )}
        />
      )}
    </View>

  </SafeAreaView>
  );
}
