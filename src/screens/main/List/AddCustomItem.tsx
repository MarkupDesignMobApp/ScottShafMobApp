import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Switch,
    Image,
    StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from 'react-native-dropdown-picker';
import { AppButton } from "../../../components/ui/AppButton/AppButton";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import AppHeader from "../../../components/ui/AppButton/AppHeader";


export default function AddCustomItem() {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar hidden={false} barStyle='dark-content' backgroundColor='#000' />
            <AppHeader
                title="Add Custom Item"
                leftImage={require('../../../../assets/image/left-icon.png')}
            />

            <View style={styles.container}>

                {/* FORM */}
                {/* LIST TITLE */}
                <View style={[styles.fieldWrapper]}>
                    <Text style={styles.floatingLabel}>List Title</Text>
                    <TextInput
                        placeholder="e.g. Top 5 coffee shops in NYC"
                        placeholderTextColor="#B5B5B5"
                        style={styles.input}
                    />
                </View>

                <View style={[styles.fieldWrapper, { marginVertical: 0 }]}>
                    <Text style={styles.descriptionLabel}>Description (Optional)</Text>
                    <TextInput multiline
                        placeholder="Add a short description"
                        placeholderTextColor="#B5B5B5"
                        style={[styles.input, { borderRadius: 10, height: responsiveScreenHeight(15), textAlignVertical: 'top', }]}
                    />
                </View>

                {/* GROUP TOGGLE */}
                <View style={styles.targetcontainer}>
                    <View style={styles.switchcontainer}>
                        <Image source={require('../../../../assets/image/info.png')} style={{ width: 15, height: 15 }} />
                        <Text style={styles.switchtxt}>Custom Item</Text>

                    </View>

                    <Text style={styles.privacytxt2}>
                        This item will be marked as custom and will only appear in your list.
                    </Text>

                </View>

                {/* BUTTON */}
                <AppButton title="Create Group List" onPress={() => { }} />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: responsiveScreenWidth(4),
    },

    fieldWrapper: {
        marginTop: 18,
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
    descriptionLabel: {
        paddingHorizontal: 18,
        marginBottom: 6,
        backgroundColor: "#FFFFFF", // must be solid
        fontSize: 12,
        color: "#8A8A8A",
    },

    targetcontainer: {
        borderWidth: 1,
        paddingHorizontal: responsiveScreenWidth(4),
        paddingVertical: responsiveScreenHeight(2),
        borderColor: '#0180FE',
        borderRadius: responsiveScreenWidth(4),
        marginVertical: responsiveScreenHeight(2),
        backgroundColor: '#EFFCFF',
    },
    switchcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchtxt: {
        fontFamily: 'samsungsharpsans-medium',
        fontSize: responsiveScreenFontSize(1.9),
        letterSpacing: 0.5,
        left: responsiveScreenWidth(3)
    },
    privacytxt2: {
        fontFamily: 'Quicksand-Regular',
        fontSize: responsiveScreenFontSize(1.68),
        paddingTop: responsiveScreenHeight(2),
        left: responsiveScreenWidth(7),
        color: '#000000',
        width: responsiveScreenWidth(75)
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

});
