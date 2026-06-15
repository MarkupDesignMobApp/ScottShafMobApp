import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { styles } from './styles';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import { useGetTermsAndPrivacyListQuery } from '../../../features/auth/authApi';

const Privacy = ({ navigation }) => {
  const {
    data: policyItems,
    isLoading,
    error,
  } = useGetTermsAndPrivacyListQuery();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00C4FA" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load policies. Please try again.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => { }}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      <AppHeader
        title="Privacy Policy"
        leftImage={require('../../../../assets/image/left-icon.png')}
        onLeftPress={() => navigation.goBack()}
        backgroundColor="#2C3E50"
        titleColor="#FFFFFF"
        leftImageTintColor={"#FFF"}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.mainHeading}>Privacy & Data Protection</Text>

        <View style={styles.card}>
          {policyItems?.map((item) => (
            <View key={item.id} style={styles.policyItem}>
              <Text style={styles.policyName}>{item.name}</Text>
              <Text style={styles.policyDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Privacy;