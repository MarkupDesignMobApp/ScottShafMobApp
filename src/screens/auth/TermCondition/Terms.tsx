import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { styles } from './styles';
import CustomCheckBox from '../../../components/ui/Checkbox/Checkbox';
import Loader from '../../../components/ui/Loader/Loader';
import { useUpdateTermsAndPrivacyMutation } from '../../../features/auth/authApi';

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
  const { userId } = route.params;

  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

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
        user_id: userId,
      }).unwrap();

      navigation.navigate('Intrestpick', { userId });

    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <Loader color="#0180FE" visible={isLoading} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../../assets/image/left-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.formCard}>

          {/* HEADER */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Terms & Privacy</Text>
            <Text style={styles.headerSubtitle}>
              Please review and accept to continue
            </Text>
          </View>

          {/* TERMS BOX */}
          <View style={styles.termsBox}>
            <Text style={styles.termsDescription}>
              What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
              printing and typesetting industry.
            </Text>
          </View>

          {/* CHECKBOXES */}
          <View style={styles.checkboxContainer}>

            <View style={styles.checkboxRow}>
              <CustomCheckBox
                checked={checked}
                onPress={() => setChecked(!checked)}
              />

              <Text style={styles.checkboxLabel}>
                I accept the Terms & Privacy Policy
              </Text>
            </View>

            <View style={styles.checkboxRow}>
              <CustomCheckBox
                checked={checked2}
                onPress={() => setChecked2(!checked2)}
              />

              <Text style={styles.checkboxLabel}>
                Use my responses for targeted campaigns
              </Text>
            </View>

          </View>

          {/* BUTTON */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled
              ]}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Submitting...' : 'Submit & Continue'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing you agree to our{' '}
              <Text style={styles.link}>Terms</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}