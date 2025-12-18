import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { Data } from './data';
import { styles } from './styles';

export default function Notification({navigation}) {
  const [selectedAction, setSelectedAction] = useState({});
  // example: { 1: 'accept', 2: 'decline' }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader
      onLeftPress={()=>navigation.goBack()}
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
                  {item.subtitle}
                </Text>
                <Text
                  style={[styles.cardsubtitletxt, styles.subtitletxt]}
                >{`${item.time} hours ago`}</Text>
                <View style={styles.btncontainer}>
                  {/* ACCEPT */}
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      selectedAction[item.id] === 'accept' && styles.activeBtn,
                    ]}
                    onPress={() =>
                      setSelectedAction(prev => ({
                        ...prev,
                        [item.id]: 'accept',
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.btnText,
                        selectedAction[item.id] === 'accept' &&
                          styles.activeBtnText,
                      ]}
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>

                  {/* DECLINE */}
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      { marginLeft: '2%' },
                      selectedAction[item.id] === 'decline' &&
                        styles.declineActiveBtn,
                    ]}
                    onPress={() =>
                      setSelectedAction(prev => ({
                        ...prev,
                        [item.id]: 'decline',
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.btnText,
                        selectedAction[item.id] === 'decline' &&
                          styles.activeBtnText,
                      ]}
                    >
                      Decline
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
                 <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: '#FF04D7',
                position:"absolute",
                top:0,
                right:10
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
