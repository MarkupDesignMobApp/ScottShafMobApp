import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import CustomCheckBox from '../../../components/ui/Checkbox/Checkbox';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { useUpdateTermsAndPrivacyMutation } from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';
import { useRoute, RouteProp } from '@react-navigation/native';
export default function Terms() {
  type RouteParams = {
    TermCondition: {
      userId: number;
      phone: string;
      country: string;
    };
  };

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'TermCondition'>>();
  // const { userId } = route.params;
  const [checked, setChecked] = useState(false); // terms & privacy
  const [checked2, setChecked2] = useState(false); // marketing

  const [updateTermsAndPrivacy, { isLoading }] =
    useUpdateTermsAndPrivacyMutation();

  const handleSubmit = async () => {
    if (!checked) {
      Alert.alert('Required', 'Please accept Terms & Privacy Policy');
      return;
    }

    try {
      await updateTermsAndPrivacy({
        accepted_terms_privacy: checked,
        campaign_marketing: checked2,
        // user_id: userId,
        user_id: 7,
      }).unwrap();

      // ✅ Navigate only after successful API call
      navigation.navigate('Intrestpick');
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.maincontainer}>
      <Loader color="blue" visible={isLoading} />
      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Terms & Privacy"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <View style={styles.innercontainer}>
        <View style={styles.targetcontainer}>
          <Text style={styles.switchtxt}>
            What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
            printing and typesetting industry...
          </Text>
        </View>

        <View style={styles.checkboxconatiner}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomCheckBox
              checked={checked}
              onPress={() => setChecked(!checked)}
            />
            <Text style={styles.title}>
              I accept the terms & Privacy Policy
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <CustomCheckBox
              checked={checked2}
              onPress={() => setChecked2(!checked2)}
            />
            <Text style={styles.title}>
              Use my responses for targeted campaigns
            </Text>
          </View>
        </View>

        <View style={styles.btncontainer}>
          <AppButton
            title={isLoading ? 'Submitting...' : 'Submit And Continue'}
            onPress={handleSubmit}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
}
