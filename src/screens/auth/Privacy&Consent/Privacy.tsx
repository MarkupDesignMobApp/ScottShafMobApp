import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { styles } from './styles';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { Switch } from 'react-native-paper';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { OpenLinkInApp } from '../../../components/ui/Browser/browser';

const Privacy = ({ navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const Data = [
    {
      id: '1',
      icon: require('../../../../assets/image/delete.png'),
      Heading: 'Request Data Export',
      Subheading: 'Download all your data',
    },
    {
      id: '2',
      icon: require('../../../../assets/image/delete.png'),
      Heading: 'Request Account Deletion',
      Subheading: 'Permanently delete your account',
    },
  ];

  const data2 = [
    { id: '1', key: 'List created', val: 12 },
    { id: '2', key: 'Profile data', val: 'Complete' },
    { id: '3', key: 'Campaign consent', val: 'Active' },
  ];

  const MyData = () =>
    Data.map((item, index) => (
      <View style={styles.cardContainer} key={index}>
        <View style={styles.icon}>
          <Image
            tintColor="#00C4FA"
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
            source={item.icon}
          />
        </View>
        <View style={styles.headcontainer}>
          <Text style={styles.listheadtxt}>{item.Heading}</Text>
          <Text style={styles.listsubheadtxt}>{item.Subheading}</Text>
        </View>
      </View>
    ));

  const MyData2 = () =>
    data2.map((item, index) => (
      <View style={styles.list2container} key={index}>
        <Text style={styles.listitem}>{item.key}</Text>
        <Text style={styles.listitem2}>{item.val}</Text>
      </View>
    ));

  // Custom button component
  const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <Text style={styles.customButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      {/* Header */}
      <AppHeader
        title="Privacy & Consent"
        leftImage={require('../../../../assets/image/left-icon.png')}
        onLeftPress={() => navigation.goBack()}
        backgroundColor="#2C3E50" // theme color
        titleColor="#FFFFFF" // white text
      />

      {/* Scrollable Content */}
      <ScrollView
        bounces={false}
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: responsiveScreenHeight(10) }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headtxt}>
          Manage your data & privacy preferences
        </Text>

        {/* Targeted Campaign */}
        <View style={styles.sectionCard}>
          <View style={styles.switchRow}>
            <Text style={styles.switchtxt}>Targeted Campaigns</Text>
            <Switch
              color="#00C4FA"
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          </View>
          <Text style={styles.privacytxt2}>
            Show personalized offers based on your activity
          </Text>
          <Text style={styles.privacytxt2}>
            Last Updated:
            <Text style={{ fontFamily: 'Quicksand-Medium', color: '#0180FE' }}>
              {' '}
              Jan 01, 2026 at 2:30 PM
            </Text>
          </Text>
        </View>

        {/* Data Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.switchtxt}>Data Management</Text>
          <View style={styles.listmaincontainer}>
            <MyData />
          </View>
        </View>

        {/* Data Usage */}
        <View style={styles.sectionCard}>
          <Text style={styles.switchtxt}>Data Usage Summary</Text>
          <View style={styles.listmaincontainer}>
            <MyData2 />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View style={styles.fixedBottom}>
        <CustomButton
          title="Save Changes"
          onPress={() => navigation.navigate('Login')}
        />
        <Text
          onPress={() =>
            OpenLinkInApp(
              'https://www.markupdesigns.net/scott-shafer/api/termsandpolicy',
            )
          }
          style={styles.privacyLink}
        >
          View Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default Privacy;
