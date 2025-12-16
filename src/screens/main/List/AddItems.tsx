import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ITEMS = [
  {
    id: "1",
    title: "Blue Bottle Coffee",
    index: "01",
    status: "Added by You",
    reactions: 2,
  },
  {
    id: "2",
    title: "Stumptown Coffee",
    index: "02",
    status: "Emma is editing…",
    editing: true,
  },
  {
    id: "3",
    title: "",
    index: "03",
    placeholder: true,
  },
];

const Activity = [
  { id: "a1", text: "Emma reacted 👍 to ‘Blue Bottle Coffee’", time: "2m" },
  { id: "a2", text: "You added ‘Blue Bottle Coffee’", time: "5m" },
];

export default function ListDetailScreen() {

  const renderItem = ({ item }) => (
    <View style={[styles.itemCard, item.editing && styles.editingBorder]}>
      <View style={styles.row}>
        <View style={styles.indexCircle}>
          <Text style={styles.indexText}>{item.index}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.itemTitle, item.placeholder && styles.placeholder]}>
            {item.placeholder ? "Add third item…" : item.title}
          </Text>

        </View>

        {!item.placeholder && <Text style={styles.menu}>⋮</Text>}
      </View>

      {!item.placeholder && item.reactions && (
        <View style={styles.reactionRow}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../../../../assets/image/women1.png')} style={{ width: 25, height: 25, right: 5 }} />
            {!item.placeholder && (
              <Text style={styles.subText}>{item.status}</Text>
            )}
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.reaction}>👍 {item.reactions}</Text>
            <Text style={styles.reaction}>😊</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity>
                <Image source={require('../../../../assets/image/left-icon.png')} style={{ width: 22, height: 22 }} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Top 3 Pizza Place In NY</Text>
              <View></View>
            </View>

            <Text style={styles.headerSub}>2 Collaborators    <Text style={{ color: '#fff', }}>•</Text>  Live</Text>
            <View style={{ borderTopWidth: 1, borderColor: '#EFEFEF', marginVertical: 10 }}></View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../../assets/image/men.png')} style={{ width: 25, height: 25 }} />
                <Image source={require('../../../../assets/image/women1.png')} style={{ width: 25, height: 25, right: 5 }} />
              </View>
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
            <Text style={styles.addCatalogText}>＋ Add item from catalog</Text>
          </TouchableOpacity>

          {/* RECENT ACTIVITY */}
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>RECENT ACTIVITY</Text>
            {Activity.map(a => (
              <View key={a.id} style={styles.activityRow}>
                <View style={{ flexDirection: 'row', }}>
                  <Image source={require('../../../../assets/image/women1.png')} style={{ width: 25, height: 25, right: 5 }} />
                  <Text style={styles.activityText}>{a.text}</Text>
                </View>
                <Text style={styles.time}>{a.time}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4FBFF" },

  header: {
    backgroundColor: "#22B8F0",
    padding: 16,
  },
  headerTitle: { color: "#000", fontSize: 16, fontWeight: "600" },
  headerSub: { color: "#000", marginTop: 4 },
  typing: { color: "#fff", fontStyle: "italic", left: 10 },

  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D6ECFF",
  },
  editingBorder: { borderColor: "#22B8F0" },

  row: { flexDirection: "row", alignItems: "center" },
  indexCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#22B8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  indexText: { color: "#fff", fontWeight: "600" },

  itemTitle: { fontSize: 15, fontWeight: "500" },
  placeholder: { color: "#9CCEE5" },
  subText: { color: "#777", marginTop: 2, fontSize: 12 },

  menu: { fontSize: 18, color: "#999" },

  reactionRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reaction: {
    marginLeft: 12,
    color: "#555",
  },

  addCatalog: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9ADAF5",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  addCatalogText: { color: "#22B8F0", fontWeight: "600" },

  activityCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 14,
    borderRadius: 12,
  },
  activityTitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  activityText: { color: "#333", width: '85%' },
  time: { color: "#999", fontSize: 12, },
});
