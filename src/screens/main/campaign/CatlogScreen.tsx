import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = ["All", "Restaurants", "Cafes", "Bars"];

const DATA = [
    {
        id: "1",
        name: "Blue Bottle Coffee",
        desc: "Specialty coffee roaster",
        image: "https://via.placeholder.com/60",
        selected: true,
    },
    {
        id: "2",
        name: "Stumptown Coffee",
        desc: "Specialty coffee roaster",
        image: "https://via.placeholder.com/60",
        selected: false,
    },
    {
        id: "3",
        name: "La Colombe",
        desc: "Specialty coffee roaster",
        image: "https://via.placeholder.com/60",
        selected: true,
    },
    {
        id: "4",
        name: "Intelligentsia Coffee",
        desc: "Specialty coffee roaster",
        image: "https://via.placeholder.com/60",
        selected: false,
    },
    {
        id: "5",
        name: "Counter Culture",
        desc: "Specialty coffee roaster",
        image: "https://via.placeholder.com/60",
        selected: false,
    },
];

export default function BrowseCatalogScreen() {
    const [activeCat, setActiveCat] = useState("All");
    const [items, setItems] = useState(DATA);

    const toggleSelect = id => {
        setItems(prev =>
            prev.map(i => (i.id === id ? { ...i, selected: !i.selected } : i))
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, item.selected && styles.cardActive]}
            onPress={() => toggleSelect(item.id)}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
            </View>

            <View style={styles.iconWrap}>
                <Text style={[styles.icon, item.selected && styles.iconActive]}>
                    {item.selected ? "✓" : "+"}
                </Text>
            </View>
        </TouchableOpacity>
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
                        <Text style={styles.headerTitle}>Browse Catalog</Text>

                        <View style={styles.searchWrap}>
                            <TextInput
                                placeholder="Search items…"
                                placeholderTextColor="#BEE9FF"
                                style={styles.search}
                            />
                        </View>

                        <View style={styles.categories}>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.chip, activeCat === cat && styles.chipActive]}
                                    onPress={() => setActiveCat(cat)}>
                                    <Text
                                        style={[styles.chipText, activeCat === cat && styles.chipTextActive]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* LIST */}
                    <FlatList
                        data={items}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 16 }}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4FBFF" },

    header: {
        backgroundColor: "#22B8F0",
        paddingTop: 16,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },

    searchWrap: {
        marginTop: 16,
        backgroundColor: "#3FC3F7",
        borderRadius: 24,
        paddingHorizontal: 16,
    },
    search: { height: 44, color: "#fff" },

    categories: {
        flexDirection: "row",
        marginTop: 12,
    },
    chip: {
        borderWidth: 1,
        borderColor: "#7DD3FC",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    chipActive: { backgroundColor: "#1EAAF1", borderColor: "#1EAAF1" },
    chipText: { color: "#E8F7FF", fontSize: 12 },
    chipTextActive: { color: "#fff", fontWeight: "600" },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E0F2FF",
    },
    cardActive: { borderColor: "#22B8F0" },

    image: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },

    title: { fontSize: 14, fontWeight: "600" },
    desc: { fontSize: 12, color: "#777", marginTop: 2 },

    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#22B8F0",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: { fontSize: 18, color: "#22B8F0" },
    iconActive: { fontWeight: "700" },
});
