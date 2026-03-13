import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Alert,
  Switch,
  ScrollView,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { useSaveUserProfileMutation } from '../../../features/auth/authApi';
import { styles } from './styles';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import Loader from '../../../components/ui/Loader/Loader';
import { useRoute } from '@react-navigation/native';

export default function AboutScreen({ navigation }) {

  const [saveUserProfile, { isLoading }] =
    useSaveUserProfileMutation();

  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [hasDogs, setHasDogs] = useState(false);

  const [city, setCity] = useState('');
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const route = useRoute();
  const { userId } = route.params;

  const ageData = [
    { id: '1', label: '18-24' },
    { id: '2', label: '25-34' },
    { id: '3', label: '35-44' },
    { id: '4', label: '45+' },
  ];

  const budgetData = [
    { id: '1', label: 'Under ₹2,000' },
    { id: '2', label: '₹2,000 – ₹5,000' },
    { id: '3', label: '₹5,000 – ₹10,000' },
    { id: '4', label: '₹10,000+' },
  ];

  const cityData = [
    { id: '1', country: 'India', name: 'Delhi' },
    { id: '2', country: 'India', name: 'Mumbai' },
    { id: '3', country: 'India', name: 'Bangalore' },
    { id: '4', country: 'USA', name: 'New York' },
    { id: '5', country: 'USA', name: 'Los Angeles' },
    { id: '6', country: 'USA', name: 'Chicago' },
  ];

  const renderAge = ({ item }) => {

    const selected = selectedAge === item.id;

    return (
      <TouchableOpacity
        style={[styles.optionCard, selected && styles.optionSelected]}
        onPress={() => setSelectedAge(item.id)}
      >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBudget = ({ item }) => {

    const selected = selectedBudget === item.id;

    return (
      <TouchableOpacity
        style={[styles.budgetCard, selected && styles.optionSelected]}
        onPress={() => setSelectedBudget(item.id)}
      >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleFinishSetup = async () => {

    if (!selectedAge || !selectedBudget || !city) {
      Alert.alert('Error', 'Please complete all required fields');
      return;
    }

    try {

      const ageBand = ageData.find(a => a.id === selectedAge)?.label;

      const budget = budgetData
        .find(b => b.id === selectedBudget)
        ?.label.replace(/\D/g, '_');

      const response = await saveUserProfile({
        user_id: userId,
        age_band: ageBand,
        city,
        dining_budget: budget,
        has_dogs: hasDogs,
      }).unwrap();

      if (response?.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }

    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Failed to save profile');
    }

  };

  return (

    <View style={styles.container}>

      <Loader visible={isLoading} />

      <AppHeader
        title="Tell Us About Yourself"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <ScrollView
        contentContainerStyle={styles.innercontainer}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.subtitle}>
          Help us personalize your experience
        </Text>

        {/* AGE */}
        <Text style={styles.label}>
          Age Group *
        </Text>

        <FlatList
          data={ageData}
          renderItem={renderAge}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
        />

        {/* CITY */}
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setCityModalVisible(true);
          }}
        >
          <View pointerEvents="none">
            <AppInput
              placeholder="Select your city"
              label="City *"
              value={city}
            />
          </View>
        </TouchableOpacity>

        {/* DOG */}
        <View style={styles.switchRow}>

          <Text style={styles.label}>
            Do you have dogs?
          </Text>

          <Switch
            value={hasDogs}
            onValueChange={setHasDogs}
            trackColor={{ true: '#2C3E50' }}
          />

        </View>

        {/* BUDGET */}
        <Text style={styles.label}>
          Monthly Budget *
        </Text>

        <FlatList
          data={budgetData}
          renderItem={renderBudget}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />

      </ScrollView>

      {/* BUTTON */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedAge || !selectedBudget || !city) && styles.disabledButton
          ]}
          disabled={!selectedAge || !selectedBudget || !city}
          onPress={handleFinishSetup}
        >
          <Text style={styles.submitText}>
            Finish Setup
          </Text>
        </TouchableOpacity>

      </View>

      {/* CITY MODAL */}

      <Modal visible={cityModalVisible} transparent animationType="slide">

        <View style={styles.modalWrapper}>

          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Select City
            </Text>

            <FlatList
              data={cityData}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (

                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => {
                    setCity(item.name);
                    setCityModalVisible(false);
                  }}
                >

                  <Text style={styles.cityText}>
                    {item.name} ({item.country})
                  </Text>

                </TouchableOpacity>

              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCityModalVisible(false)}
            >
              <Text style={styles.closeText}>
                Close
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </View>
  );
}