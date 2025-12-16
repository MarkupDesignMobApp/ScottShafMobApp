import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Switch,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from 'react-native-dropdown-picker';




export default function CreateListScreen() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Select Category");
    const [listType, setListType] = useState("Select the top from list");
    const [isGroup, setIsGroup] = useState(true);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                edges={['top', 'left', 'right']}
                style={{ flex: 1, backgroundColor: '#fff' }}
            >
                <View style={styles.container}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Create List</Text>
                    </View>

                    {/* FORM */}
                    <View style={styles.form}>
                        {/* LIST TITLE */}
                        <View style={styles.fieldWrapper}>
                            <Text style={styles.floatingLabel}>List Title</Text>
                            <TextInput
                                placeholder="e.g. Top 5 coffee shops in NYC"
                                placeholderTextColor="#B5B5B5"
                                style={styles.input}
                            />
                        </View>



                        <View style={styles.fieldWrapper}>
                            <Text style={styles.floatingLabel}>Category *</Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={styles.input}
                            />
                        </View>

                        {/* GROUP TOGGLE */}
                        <View style={styles.groupBox}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.groupTitle}>Make it a group list?</Text>
                                <Text style={styles.groupDesc}>
                                    Let friends collaborate & add their own picks to your list.
                                </Text>
                            </View>
                            <Switch value={isGroup} onValueChange={setIsGroup} />
                        </View>

                        {/* LIST TYPE */}
                        <View style={styles.fieldWrapper}>
                            <Text style={styles.floatingLabel}>List Type *</Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={styles.input}
                            />
                        </View>

                        {/* BUTTON */}
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Create Group List</Text>
                        </TouchableOpacity>

                        {/* INVITED */}
                        <View style={styles.invitedBox}>
                            <Text style={styles.invitedTitle}>Invited (2)</Text>
                            <View style={styles.invitedRow}>
                                <View style={styles.chip}>
                                    <Text style={styles.chipText}>Sarah M.</Text>
                                    <Text style={styles.close}>✕</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Text style={styles.chipText}>Alex K.</Text>
                                    <Text style={styles.close}>✕</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, },

    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
    },
    headerTitle: { fontSize: 16, fontWeight: "600", textAlign: "center" },

    form: { padding: 16 },

    label: { fontSize: 13, color: "#555", marginBottom: 6 },

    fieldWrapper: {
        marginBottom: 18,
        zIndex: 10,
    },

    floatingLabel: {
        position: "absolute",
        top: -9,
        left: 18,
        backgroundColor: "#FFFFFF", // must be solid
        paddingHorizontal: 6,
        fontSize: 12,
        color: "#8A8A8A",
        zIndex: 20,              // ⭐ label ABOVE everything
    },

    input: {
        height: 52,
        borderRadius: 26,
        borderWidth: 1.2,
        borderColor: "#E4E6EB",
        paddingHorizontal: 18,
        fontSize: 14,
        color: "#1A1A1A",
        backgroundColor: "#FFFFFF",
        zIndex: 1,
    },

    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 48,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    dropdownText: { color: "#999" },
    arrow: { color: "#999" },

    groupBox: {
        flexDirection: "row",
        backgroundColor: "#F0FAFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#BFE7FF",
    },
    groupTitle: { color: "#1DA1F2", fontWeight: "600" },
    groupDesc: { color: "#666", fontSize: 12, marginTop: 4 },

    button: {
        backgroundColor: "#1DA1F2",
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 24,
    },
    buttonText: { color: "#fff", fontWeight: "600" },

    invitedBox: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#CFE9FF",
    },
    invitedTitle: { fontSize: 13, color: "#1DA1F2", marginBottom: 10 },

    invitedRow: { flexDirection: "row" },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CFE9FF",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    chipText: { marginRight: 6 },
    close: { color: "#999" },
});
