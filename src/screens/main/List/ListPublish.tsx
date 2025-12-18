import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
import { responsiveScreenWidth } from "react-native-responsive-dimensions";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../../components/ui/AppButton/AppHeader";
import { AppButton } from "../../../components/ui/AppButton/AppButton";

export default function ListPublishedScreen() {
    return (
        <View style={styles.container}>
            <StatusBar hidden={false} barStyle='dark-content' />

            <AppHeader
                title="List Published"
                leftImage={require('../../../../assets/image/left-icon.png')}
            />
            <View style={{ flex: 1, padding: responsiveScreenWidth(4), backgroundColor: '#fff' }}>

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
                <AppButton style={{ backgroundColor: '#fff', borderColor: '#3478f6', borderWidth: 1, }} Textcolor="#3478f6" title='Share List' onPress={() => Alert.alert('hii')} />

                <AppButton title='Back To Home' Textcolor="#fff" onPress={() => Alert.alert('hii')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FBFF",
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
