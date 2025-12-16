import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ListPublishedScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView
                edges={['top', 'left', 'right']}
                style={{ flex: 1, backgroundColor: '#fff' }}
            >
                <View style={styles.container}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>List Published</Text>
                    </View>

                    {/* SUCCESS CARD */}
                    <View style={styles.card}>
                        <View style={styles.checkCircle}>
                            <Text style={styles.check}>✓</Text>
                        </View>

                        <Text style={styles.title}>Your list is live!</Text>
                        <Text style={styles.desc}>
                            Best Coffee Spots in NYC has been published and is now visible to your
                            followers.
                        </Text>

                        <View style={styles.statsRow}>
                            <Text style={styles.stat}>👁 0 views</Text>
                            <Text style={styles.stat}>👍 0 likes</Text>
                            <Text style={styles.stat}>🔗 0 shares</Text>
                        </View>
                    </View>

                    {/* CAMPAIGN CONSENT */}
                    <View style={styles.consentCard}>
                        <View style={styles.consentIcon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.consentTitle}>Campaign Consent</Text>
                            <Text style={styles.consentDesc}>
                                You've applied for coffee offers.
                            </Text>
                        </View>
                        <View style={styles.dot} />
                    </View>

                    {/* ACTION BUTTONS */}
                    <TouchableOpacity style={styles.outlineBtn}>
                        <Text style={styles.outlineText}>Share List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryBtn}>
                        <Text style={styles.primaryText}>Back To Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FBFF",
        padding: 16,
    },

    header: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#EEE",
        backgroundColor: "#FFF",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
    },

    card: {
        backgroundColor: "#F0FAFF",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#BFE7FF",
        marginBottom: 16,
    },
    checkCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#1DA1F2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    check: {
        color: "#FFF",
        fontSize: 26,
        fontWeight: "700",
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    desc: {
        textAlign: "center",
        color: "#6B7280",
        fontSize: 13,
        marginBottom: 16,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    stat: {
        fontSize: 12,
        color: "#374151",
    },

    consentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#CFE9FF",
        marginBottom: 32,
    },
    consentIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#E6F6FF",
        marginRight: 12,
    },
    consentTitle: {
        fontWeight: "600",
        fontSize: 14,
    },
    consentDesc: {
        fontSize: 12,
        color: "#6B7280",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#1DA1F2",
    },

    outlineBtn: {
        height: 52,
        borderRadius: 26,
        borderWidth: 1.5,
        borderColor: "#1DA1F2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    outlineText: {
        color: "#1DA1F2",
        fontWeight: "600",
    },

    primaryBtn: {
        height: 52,
        borderRadius: 26,
        backgroundColor: "#1DA1F2",
        alignItems: "center",
        justifyContent: "center",
    },
    primaryText: {
        color: "#FFF",
        fontWeight: "600",
    },
});
