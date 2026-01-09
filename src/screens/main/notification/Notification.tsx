import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Loader size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Notifications"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />
      <FlatList
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
              <View style={{ paddingLeft: '4%' }}>
                <Text style={styles.cardmaintitletxt}>{item.title}</Text>
                <Text style={[styles.cardsubtitletxt, styles.subtitletxt]}>
                  {item.body}
                </Text>
                <Text
                  style={[styles.cardsubtitletxt, styles.subtitletxt]}
                >{`${item.created_at} hours ago`}</Text>
                <View style={styles.btncontainer}>
                  {/* ACCEPT */}
                  {/* ACCEPT */}
                  <TouchableOpacity
                    disabled={isAccepting || isRejecting}
                    style={[
                      styles.btn,
                      selectedAction[item.id] === 'accept' && styles.activeBtn,
                      isAccepting && selectedAction[item.id] === 'accept' && { opacity: 0.6 },
                    ]}
                    onPress={() => handleAccept(item)}
                  >
                    {isAccepting && selectedAction[item.id] === 'accept' ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text
                        style={[
                          styles.btnText,
                          selectedAction[item.id] === 'accept' && styles.activeBtnText,
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
                      selectedAction[item.id] === 'decline' && styles.declineActiveBtn,
                      isRejecting && selectedAction[item.id] === 'decline' && { opacity: 0.6 },
                    ]}
                    onPress={() => handleDecline(item)}
                  >
                    {isRejecting && selectedAction[item.id] === 'decline' ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text
                        style={[
                          styles.btnText,
                          selectedAction[item.id] === 'decline' && styles.activeBtnText,
                        ]}
                      >
                        Decline
                      </Text>
                    )}
                  </TouchableOpacity>

                </View>
              </View>
              <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: '#FF04D7',
                  position: "absolute",
                  top: 0,
                  right: 10
                }}
              ></View>
            </View>

          </View>
        )}
        // onEndReached={() => loadData()}
        // onEndReachedThreshold={0.5}
        // ListFooterComponent={renderFooter}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true} // Helps performance
      />
    </View>
  );
}
