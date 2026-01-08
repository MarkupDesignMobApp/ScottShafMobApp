import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ITEMS = [
  {
    id: '1',
    title: 'Blue Bottle Coffee',
    index: '01',
    status: 'Added By You',
    editing: true,
    reactions: 2,
  },
  {
    id: '2',
    title: 'Stumptown Coffee',
    index: '02',
    status: 'Emma is editing…',
    editing: true,
  },
  {
    id: '3',
    title: '',
    index: '03',
    placeholder: true,
  },
];

const Activity = [
  {
    id: 'a1',
    text: 'Emma reacted to 👍 ‘Blue Bottle Coffee’',
    time: '2m',
    avatar: require('../../../../assets/image/women1.png'),
  },
  {
    id: 'a2',
    text: 'You added ‘Blue Bottle Coffee’',
    time: '5m',
    avatar: require('../../../../assets/image/men.png'),
  },
];


export default function ListDetailScreen() {
  const renderItem = ({ item }: any) => (
    <View style={[styles.itemCard, item.editing && styles.editingBorder]}>
      <View style={styles.row}>
        <View style={styles.indexCircle}>
          <Text style={styles.indexText}>{item.index}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.itemTitle, item.placeholder && styles.placeholder]}>
            {item.placeholder ? 'Add third item…' : item.title}
          </Text>
        </View>

        {!item.placeholder && <Text style={styles.menu}>⋮</Text>}
      </View>

      {/* STATUS + REACTIONS — SAME ROW */}
      {!item.placeholder && (item.editing || item.reactions) && (
        <View style={styles.reactionRow}>
          {/* LEFT SIDE: avatar + text */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../../assets/image/women1.png')}
              style={styles.avatar}
            />
            <Text style={styles.subText}>
              {item.editing ? item.status : 'Emma Is editing'}
            </Text>
          </View>

          {/* RIGHT SIDE: reactions */}
          {item.reactions && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../../../assets/image/thumbs.png')}
                style={styles.reactionImage}
              />
              <Text style={styles.reactionCount}>{item.reactions}</Text>

              <Image
                source={require('../../../../assets/image/smile.png')}
                style={styles.reactionImage}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );


  return (
    <SafeAreaProvider>
      {/* make status bar background same color as header */}
      <StatusBar backgroundColor="#22B8F0" barStyle="light-content" />
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity>
                <Image
                  source={require('../../../../assets/image/left-icon.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Top 3 Pizza Place In NY</Text>
              <View></View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.headerSub}>2 Collaborators</Text>

              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  marginHorizontal: 10,
                  alignSelf: 'center',
                  marginTop: 18,
                }}
              />

              <Text style={styles.headerSub}>Live</Text>
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderColor: '#EFEFEF',
                marginVertical: 14,
              }}
            ></View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={require('../../../../assets/image/men.png')}
                  style={{ width: 25, height: 25 }}
                />
                <Image
                  source={require('../../../../assets/image/women1.png')}
                  style={{ width: 25, height: 25, right: 5 }}
                />
              </View>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  marginHorizontal: 6,
                  alignSelf: 'center',
                }}
              />
              <Text style={styles.typing}>Emma is typing…</Text>
            </View>
          </View>

          {/* LIST */}
          <FlatList
            data={ITEMS}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />

          {/* ADD FROM CATALOG */}
          <TouchableOpacity style={styles.addCatalog}>
            <View style={styles.plusCircle}>
              <Text style={styles.plusText}>＋</Text>
            </View>
            <Text style={styles.addCatalogText}>Add item from catalog</Text>
          </TouchableOpacity>

          {/* RECENT ACTIVITY */}
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>RECENT ACTIVITY</Text>

            {Activity.map(a => {
              const parts = a.text.split('👍');

              return (
                <View key={a.id} style={styles.activityRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {/* DYNAMIC AVATAR */}
                    <Image source={a.avatar} style={styles.avatar2} />

                    {/* INLINE TEXT + EMOJI */}
                    <Text style={styles.activityText}>
                      {parts[0]}
                      {a.text.includes('👍') && (
                        <Image
                          source={require('../../../../assets/image/thumbs.png')}
                          style={{
                            width: 16,
                            height: 16,
                            marginHorizontal: 2,
                            transform: [{ translateY: 2 }],
                          }}
                        />
                      )}
                      {parts[1]}
                    </Text>
                  </View>

                  <Text style={styles.time}>{a.time}</Text>
                </View>
              );
            })}
          </View>


        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {},

  header: {
    backgroundColor: '#22B8F0',
    padding: 16,
  },
  headerTitle: { color: '#000', fontSize: 18, fontWeight: '500' ,  fontFamily:'samsungsharpsans'},
  headerSub: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 18,
    marginLeft: 4,
    fontFamily:'samsungsharpsans-Regular'
  },
  typing: { color: '#fff', fontStyle: 'italic', left: 10, fontFamily:'Ubuntu-Regular'},

  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#00C4FA',
  },
  editingBorder: { borderColor: '#22B8F0', borderWidth: 1.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  indexCircle: {
    width: 30,
    height: 30,
    borderRadius: 17,
    backgroundColor: '#22B8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  indexText: { color: '#fff', fontWeight: '500' },
  itemTitle: { fontSize: 15, fontWeight: '500',fontFamily:'Quicksand-medium' },
  placeholder: { color: '#9CCEE5' },
  subText: { color: '#777', marginLeft: 6, fontSize: 13 , fontFamily:'Quicksand-medium'},
  menu: { fontSize: 18, color: '#999' },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  avatar: { width: 25, height: 25, borderRadius: 12 },
  reactionImage: { width: 18, height: 18, marginLeft: 12 },
  reactionCount: { marginLeft: 4, color: '#555', fontSize: 13 },

  reaction: {
    marginLeft: 12,
    color: '#555',
  },

  addCatalog: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#00C4FA',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F3FCFF',
    marginHorizontal: 16,
  },

  plusCircle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#00C4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  plusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },

  addCatalogText: {
    color: '#22B8F0',
    fontWeight: '500',
    fontSize: 14,
     fontFamily:'Quicksand-medium'
  },

  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    margin: 16,
    borderWidth: 1.5,
    borderColor: '#00C4FA',
  },

  activityTitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 14,
    fontWeight: '600',
     fontFamily:'Quicksand-Bold'
  },

  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  avatar2: {
    width: 25,
    height: 25,
    borderRadius: 12,
    marginRight: 8,
  },

  activityText: {
    color: '#000',
    fontSize: 14,
    flexWrap: 'wrap',
    flex: 1,
     fontFamily:'Quicksand-medium'
  },

  activityReactionImage: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },

  time: {
    color: '#999',
    fontSize: 12,
    marginLeft: 6,
     fontFamily:'Quicksand-medium'
  },
});
