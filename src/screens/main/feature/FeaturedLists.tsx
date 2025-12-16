import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function FeaturedLists() {
    return (
        <SafeAreaProvider>
            <SafeAreaView
                edges={['top', 'left', 'right']}
                style={{ flex: 1, backgroundColor: '#fff' }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity>
                            <Image source={require('../../../../assets/image/left-icon.png')} style={{ width: 22, height: 22 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Featured Lists</Text>
                        <View style={{ width: 22 }} />
                    </View>

                    {/* Search */}
                    <View style={styles.searchBox}>
                        <Image source={require('../../../../assets/image/search.png')} style={{ width: 16, height: 16 }} />

                        {/* <Ionicons name="search" size={16} color="#fff" /> */}
                        <TextInput
                            placeholder="Search lists, users, topics…"
                            placeholderTextColor="#E0F2FE"
                            style={styles.searchInput}
                        />
                        <Image source={require('../../../../assets/image/filter.png')} style={{ width: 16, height: 16 }} />
                    </View>
                </View>

                {/* Sponsored Card */}
                <View style={styles.card}>
                    <View style={styles.cardImagePlaceholder} />

                    <View style={styles.sponsoredRow}>
                        <View style={styles.sponsoredBadge}>
                            <Text style={styles.sponsoredText}>Sponsored</Text>
                        </View>
                        <Text style={styles.byText}>By Brand Name</Text>
                    </View>

                    <Text style={styles.offerTitle}>Get 20% off your next coffee</Text>
                    <Text style={styles.offerDesc}>
                        Exclusive offer for Top List members. Valid at participating locations.
                    </Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View Offer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeBtn}>
                            <Image source={require('../../../../assets/image/cross.png')} style={{ width: 16, height: 16 }} />

                        </TouchableOpacity>
                    </View>

                    <View style={{ borderTopWidth: 1, borderColor: '#C1C1C1', marginVertical: 10 }}></View>

                    <View style={styles.footerRow}>
                        <Text style={styles.expireText}>Expires Dec 31, 2025</Text>
                        <Text style={styles.whyText}>Why am I seeing this?</Text>
                    </View>
                </View>

                {/* List Card */}
                <View style={styles.listCard}>
                    <View style={styles.listHeader}>
                        <Image
                            source={{ uri: "https://i.pravatar.cc/100" }}
                            style={styles.avatar}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.listTitle}>Sarah's Top 5 Brunch Spots</Text>
                            <Text style={styles.listSub}>Food & Drinks · 255 Saved</Text>
                        </View>
                        <Image source={require('../../../../assets/image/info.png')} style={{ width: 18, height: 18 }} />

                    </View>

                    <View style={styles.imageRow}>
                        {[1, 2, 3].map((_, i) => (
                            <Image
                                key={i}
                                source={{ uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5" }}
                                style={styles.listImage}
                            />
                        ))}
                    </View>
                </View>

                <View style={{ height: 30 }} />
            </SafeAreaView>
        </SafeAreaProvider>


    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },

    header: {
        backgroundColor: "#0EA5E9",
        paddingTop: 48,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.25)",
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    searchInput: {
        flex: 1,
        color: "#fff",
        fontSize: 13,
        marginHorizontal: 8,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        margin: 16,
        padding: 16,
    },
    cardImagePlaceholder: {
        height: 140,
        borderRadius: 14,
        backgroundColor: "#E5E7EB",
        marginBottom: 12,
    },

    sponsoredRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
    sponsoredBadge: {
        backgroundColor: "#38BDF8",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 6,
    },
    sponsoredText: { fontSize: 10, color: "#fff", fontWeight: "600" },
    byText: { fontSize: 11, color: "#64748B" },

    offerTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
    offerDesc: { fontSize: 12, color: "#64748B", marginBottom: 12 },

    actionRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    viewBtn: {
        flex: 1,
        backgroundColor: "#0EA5E9",
        borderRadius: 24,
        paddingVertical: 10,
        alignItems: "center",
    },
    viewBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderColor: "#C1C1C1",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },

    footerRow: { flexDirection: "row", justifyContent: "space-between" },
    expireText: { fontSize: 10, color: "#64748B" },
    whyText: { fontSize: 10, color: "#0EA5E9" },

    listCard: {
        backgroundColor: "#fff",
        borderRadius: 18,
        marginHorizontal: 16,
        padding: 14,
    },
    listHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
    listTitle: { fontSize: 14, fontWeight: "600" },
    listSub: { fontSize: 11, color: "#64748B" },

    imageRow: { flexDirection: "row", justifyContent: "space-between" },
    listImage: { width: "32%", height: 70, borderRadius: 10 },
});
