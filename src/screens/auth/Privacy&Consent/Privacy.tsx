import React from 'react';
import { View, Text, Alert, Image } from 'react-native';
import { styles } from './styles';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { Switch } from 'react-native-paper';

// import Icon from 'react-native-vector-icons/Ionicons';

const Privacy = () => {
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
  const MyData = () => {
    return (
      <>
        {Data.map((item, index) => (
          <View style={styles.listcontainer} key={index}>
            <View style={styles.icon}>
              <Image
                tintColor={'#00C4FA'}
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
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Privacy & Consent"
        leftImage={require('../../../../assets/image/left-icon.png')}

        // onLeftPress={() => navigation.goBack()}
        // onRightPress={() => console.log('Settings')}
      />
      <View style={styles.innercontainer}>
        <Text style={styles.headtxt}>
          Manage your data & privacy preferences
        </Text>
        {/* //TARGET CAMPAIN CONTAINER// */}
        <View style={styles.targetcontainer}>
          <View style={styles.switchcontainer}>
            <Text style={styles.switchtxt}>Targeted Campaigns</Text>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
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

        {/* //DATA MANAGMENT CONTAINER// */}
        <View style={styles.targetcontainer}>
          <Text style={styles.switchtxt}>Data Managment</Text>
          <View style={styles.listmaincontainer}>
            <MyData />
          </View>
        </View>

              {/* //DATA USAGE CONTAINER// */}
        <View style={styles.targetcontainer}>
          <Text style={styles.switchtxt}>Data usage summary</Text>
          {/* <View style={styles.listmaincontainer}>
            <MyData />
          </View> */}
        </View>

        <AppButton title="Save Changes" onPress={() => Alert.alert('de')} />
        <Text style={{ ...styles.privacytxt }}>View Privacy Policy</Text>
      </View>
    </View>
  );
};

export default Privacy;
