import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
} from "react-native";

const COLORS = {
    primary: "#1DA1F2",
    lightBlue: "#E8F4FF",
    border: "#D6ECFF",
    text: "#1A1A1A",
    muted: "#7A7A7A",
};

export default function inviteScreen() {
    const [title, setTitle] = useState("Top 3 Pizza Place in NY");
    const [items, setItems] = useState([
        { id: 1, text: "Joe’s Pizza" },
        { id: 2, text: "Scarr’s Pizza" },
        { id: 3, text: "" },
    ]);
    const [showSuccess, setShowSuccess] = useState(false);

    const updateItem = (id, value) => {
        setItems(list => list.map(i => (i.id === id ? { ...i, text: value } : i)));
    };

    const removeItem = id => {
        setItems(list => list.filter(i => i.id !== id));
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.row}>
            <View style={styles.indexCircle}>
                <Text style={styles.indexText}>{String(index + 1).padStart(2, "0")}</Text>
            </View>

            <View style={styles.inputWrap}>
                <TextInput
                    value={item.text}
                    onChangeText={t => updateItem(item.id, t)}
                    placeholder={`Item ${index + 1}`}
                    placeholderTextColor={COLORS.muted}
                    style={styles.input}
                />
                {item.text.length > 0 && (
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <Text style={styles.clear}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* CARD */}
            <View style={styles.card}>
                <Text style={styles.cardHeader}>New List</Text>

                <Text style={styles.label}>List Title</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={styles.titleInput}
                />

                <FlatList
                    data={items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                />

                <TouchableOpacity
                    style={styles.publishBtn}
                    onPress={() => setShowSuccess(true)}>
                    <Text style={styles.publishText}>Publish List</Text>
                </TouchableOpacity>
            </View>

            {/* SUCCESS MODAL */}
            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.successCard}>
                        <View style={styles.successBadge}>
                            <Text style={styles.successText}>SUCCESS!</Text>
                        </View>

                        <Text style={styles.inviteTitle}>Invite Friends?</Text>
                        <Text style={styles.inviteDesc}>
                            Lists are better with friends. Invite 2 friends to unlock the
                            community Badge
                        </Text>

                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Text>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Text>SMS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Text>Copy link</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => setShowSuccess(false)}>
                            <Text style={styles.skip}>Skip for now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F6FAFF", padding: 16 },

    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    cardHeader: { fontSize: 16, fontWeight: "600", marginBottom: 12 },

    label: { color: COLORS.muted, marginBottom: 4 },
    titleInput: {
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
        fontSize: 15,
    },

    row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    indexCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    indexText: { color: "#fff", fontWeight: "600" },

    inputWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 22,
        paddingHorizontal: 14,
        height: 42,
    },
    input: { flex: 1, fontSize: 14 },
    clear: { color: COLORS.muted, marginLeft: 8 },

    publishBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 22,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 16,
    },
    publishText: { color: "#fff", fontWeight: "600" },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
    successCard: {
        width: "88%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
    },
    successBadge: {
        backgroundColor: COLORS.lightBlue,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    successText: { color: COLORS.primary, fontWeight: "700" },

    inviteTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
    inviteDesc: {
        textAlign: "center",
        color: COLORS.muted,
        marginBottom: 16,
    },

    socialRow: { flexDirection: "row", marginBottom: 16 },
    socialBtn: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginHorizontal: 4,
    },
    skip: { color: COLORS.muted },
});

