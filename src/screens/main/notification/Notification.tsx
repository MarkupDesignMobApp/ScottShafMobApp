import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import {
  useGetNotificationsQuery,
  useAcceptNotificationMutation,
  useRejectNotificationMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
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
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  const [actionLoading, setActionLoading] = useState<
    Record<string | number, boolean>
  >({});
  const [selectedAction, setSelectedAction] = useState<
    Record<string | number, string>
  >({});
  const [singleActionLoading, setSingleActionLoading] = useState<
    Record<string | number, boolean>
  >({});

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // API returns: { success, data: { current_page, data: [], ... } }
  const notifications = Notify?.data?.data || [];

  const isUnread = (item: any) => item.is_read === false;

  const handleMarkAsRead = async (item: any) => {
    if (!isUnread(item)) return;
    setSingleActionLoading(prev => ({ ...prev, [item.id]: true }));
    try {
      await markAsRead(item.id).unwrap();
    } catch (err) {
      Alert.alert('Error', 'Failed to mark as read');
    } finally {
      setSingleActionLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleDelete = async (item: any) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setSingleActionLoading(prev => ({ ...prev, [item.id]: true }));
            try {
              await deleteNotification(item.id).unwrap();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete notification');
            } finally {
              setSingleActionLoading(prev => ({ ...prev, [item.id]: false }));
            }
          },
        },
      ],
    );
  };

  const handleMarkAllRead = () => {
    if (notifications.length === 0) return;
    Alert.alert('Mark All Read', 'Mark all notifications as read?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark All',
        onPress: async () => {
          try {
            await markAllAsRead().unwrap();
          } catch (err) {
            Alert.alert('Error', 'Failed to mark all as read');
          }
        },
      },
    ]);
  };

  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    Alert.alert(
      'Delete All Notifications',
      'Are you sure you want to delete ALL notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllNotifications().unwrap();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete all notifications');
            }
          },
        },
      ],
    );
  };

  const handleAccept = async (item: any) => {
    if (item.action_status === 'accepted') return;
    setSelectedAction(prev => ({ ...prev, [item.id]: 'accept' }));
    setActionLoading(prev => ({ ...prev, [item.id]: true }));
    try {
      await acceptNotification({ list_id: item.list_id }).unwrap();
      refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to accept invitation');
    } finally {
      setActionLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleDecline = async (item: any) => {
    if (item.action_status === 'declined') return;
    setSelectedAction(prev => ({ ...prev, [item.id]: 'decline' }));
    setActionLoading(prev => ({ ...prev, [item.id]: true }));
    try {
      await rejectNotification({ list_id: item.list_id }).unwrap();
      refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to decline invitation');
    } finally {
      setActionLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const getButtonState = (item: any) => {
    if (item.action_status === 'accepted')
      return { disabled: true, label: 'Accepted', active: true };
    if (item.action_status === 'declined')
      return { disabled: true, label: 'Declined', active: false };
    return { disabled: false, label: null, active: false };
  };

  if (isLoading) {
    return (
      <View style={styles.loaderWrap}>
        <Loader size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FC" />
      <View style={styles.container}>
        <AppHeader
          onLeftPress={() => navigation.goBack()}
          title="Notifications"
          leftImage={require('../../../../assets/image/left-icon.png')}
          leftImageTintColor="#000"
        />

        {notifications.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={handleMarkAllRead}
            >
              <Text style={styles.headerActionText}>Mark all read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={handleDeleteAll}
            >
              <Text style={[styles.headerActionText, styles.deleteAllText]}>
                Delete all
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {notifications.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Image
              source={require('../../../../assets/image/notificationnotfount.jpg')}
              style={styles.emptyImg}
            />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const isActionLoading = !!actionLoading[item.id];
              const isSingleLoading = !!singleActionLoading[item.id];
              const unread = isUnread(item);
              const acceptState = getButtonState(item);
              const declineState = getButtonState(item);
              const showButtons = item.can_respond === true;

              // Profile image fallback
              const profileImage = item.sender?.profile_image
                ? { uri: item.sender.profile_image }
                : require('../../../../assets/image/women1.png');

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleMarkAsRead(item)}
                  disabled={isSingleLoading || !unread}
                >
                  <View style={[styles.card, unread && styles.cardUnread]}>
                    <View style={styles.row}>
                      <View style={styles.avatar}>
                        <Image source={profileImage} style={styles.avatarImg} />
                      </View>

                      <View style={styles.content}>
                        <View style={styles.titleRow}>
                          <Text style={styles.title} numberOfLines={1}>
                            {item.title}
                          </Text>
                          {unread && <View style={styles.dot} />}
                        </View>
                        <Text style={styles.body} numberOfLines={2}>
                          {item.body}
                        </Text>
                        <Text style={styles.time}>{item.created_at}</Text>

                        {showButtons && (
                          <View style={styles.buttonGroup}>
                            <TouchableOpacity
                              disabled={isActionLoading || acceptState.disabled}
                              style={[
                                styles.actionBtn,
                                styles.acceptBtn,
                                (acceptState.active ||
                                  selectedAction[item.id] === 'accept') &&
                                  styles.acceptBtnActive,
                              ]}
                              onPress={() => handleAccept(item)}
                            >
                              {isActionLoading &&
                              selectedAction[item.id] === 'accept' ? (
                                <ActivityIndicator size="small" color="#fff" />
                              ) : (
                                <Text
                                  style={[
                                    styles.actionBtnText,
                                    (acceptState.active ||
                                      selectedAction[item.id] === 'accept') &&
                                      styles.actionBtnTextActive,
                                  ]}
                                >
                                  {acceptState.label ||
                                    (selectedAction[item.id] === 'accept'
                                      ? 'Accepted'
                                      : 'Accept')}
                                </Text>
                              )}
                            </TouchableOpacity>

                            <TouchableOpacity
                              disabled={
                                isActionLoading || declineState.disabled
                              }
                              style={[
                                styles.actionBtn,
                                styles.declineBtn,
                                declineState.active && styles.declineBtnActive,
                              ]}
                              onPress={() => handleDecline(item)}
                            >
                              {isActionLoading &&
                              selectedAction[item.id] === 'decline' ? (
                                <ActivityIndicator size="small" color="#fff" />
                              ) : (
                                <Text
                                  style={[
                                    styles.actionBtnText,
                                    declineState.active &&
                                      styles.actionBtnTextActive,
                                  ]}
                                >
                                  {declineState.label || 'Decline'}
                                </Text>
                              )}
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.deleteBtn}
                              onPress={() => handleDelete(item)}
                              disabled={isSingleLoading}
                            >
                              {isSingleLoading ? (
                                <ActivityIndicator
                                  size="small"
                                  color="#FF3B30"
                                />
                              ) : (
                                <Image
                                  source={require('../../../../assets/image/delete.png')}
                                  style={styles.deleteIcon}
                                />
                              )}
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
  },
  listContent: {
    paddingTop: hp(1),
    paddingBottom: hp(3),
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
    backgroundColor: '#F8F9FC',
  },
  headerActionBtn: {
    marginLeft: wp(5),
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(3),
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  headerActionText: {
    fontSize: fp(1.6),
    fontWeight: '500',
    color: '#00C4FA',
  },
  deleteAllText: {
    color: '#FF3B30',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -hp(10),
  },
  emptyImg: {
    width: wp(50),
    height: wp(50),
    resizeMode: 'contain',
    marginBottom: hp(2),
  },
  emptyText: {
    fontSize: fp(2),
    color: '#8E8E93',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp(5),
    marginBottom: hp(1.5),
    borderRadius: 16,
    padding: wp(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardUnread: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#FF04D7',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
    overflow: 'hidden',
  },
  avatarImg: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(0.4),
  },
  title: {
    flex: 1,
    fontSize: fp(2),
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: -0.3,
  },
  dot: {
    width: wp(1.8),
    height: wp(1.8),
    borderRadius: wp(0.9),
    backgroundColor: '#FF04D7',
    marginLeft: wp(2),
  },
  body: {
    fontSize: fp(1.7),
    color: '#6C6C70',
    lineHeight: fp(2.2),
    marginBottom: hp(0.5),
  },
  time: {
    fontSize: fp(1.4),
    color: '#8E8E93',
    marginBottom: hp(1.2),
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(4),
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginRight: wp(2.5),
    minWidth: wp(18),
    alignItems: 'center',
  },
  acceptBtn: {
    borderColor: '#00C4FA',
  },
  acceptBtnActive: {
    backgroundColor: '#00C4FA',
    borderColor: '#00C4FA',
  },
  declineBtn: {
    borderColor: '#FF3B30',
  },
  declineBtnActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  actionBtnText: {
    fontSize: fp(1.6),
    fontWeight: '500',
    color: '#00C4FA',
  },
  actionBtnTextActive: {
    color: '#FFFFFF',
  },
  deleteBtn: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: '#FF3B30',
    resizeMode: 'contain',
  },
});
