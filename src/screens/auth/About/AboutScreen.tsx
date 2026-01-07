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
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { useSaveUserProfileMutation } from '../../../features/auth/authApi';
import { styles } from './styles';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
import Loader from '../../../components/ui/Loader/Loader';
import { useRoute } from '@react-navigation/native';

export default function AboutScreen({ navigation }) {
  const [saveUserProfile, { isLoading: isSaving }] =
    useSaveUserProfileMutation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [hasDogs, setHasDogs] = useState(false);

  const [city, setCity] = useState('');
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const route = useRoute();
  const { userId } = route.params;

  /** AGE DATA */
  const Data = [
    { id: '1', agegroup: '18-24' },
    { id: '2', agegroup: '25-34' },
    { id: '3', agegroup: '35-44' },
    { id: '4', agegroup: '45+' },
  ];

  /** BUDGET DATA */
  const budgetData = [
    { id: '1', label: 'Under ₹2,000' },
    { id: '2', label: '₹2,000 – ₹5,000' },
    { id: '3', label: '₹5,000 – ₹10,000' },
    { id: '4', label: '₹10,000+' },
  ];

  /** CITY DATA */
  const cityData = [
    { id: '1', country: 'India', name: 'Delhi' },
    { id: '2', country: 'India', name: 'Mumbai' },
    { id: '3', country: 'India', name: 'Bangalore' },

    { id: '4', country: 'USA', name: 'New York' },
    { id: '5', country: 'USA', name: 'Los Angeles' },
    { id: '6', country: 'USA', name: 'Chicago' },

    { id: '7', country: 'Uk', name: 'London' },
    { id: '8', country: 'Uk', name: 'Dubai' },
    { id: '9', country: 'Uk', name: 'Sydney' },
  ];

  /** RENDER AGE */
  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => setSelectedId(item.id)}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedText]}>
          {item.agegroup}
        </Text>
      </TouchableOpacity>
    );
  };

  /** RENDER BUDGET */
  const renderBudgetItem = ({ item }) => {
    const isSelected = selectedBudget === item.id;
    return (
      <TouchableOpacity
        style={[styles.budgetItem, isSelected && styles.selectedItem]}
        onPress={() => setSelectedBudget(item.id)}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedText]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  /** SAVE PROFILE */
  const handleFinishSetup = async () => {
    if (!selectedId || !selectedBudget || !city) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    try {
      const ageBand = Data.find(d => d.id === selectedId)?.agegroup;
      const diningBudget = budgetData
        .find(b => b.id === selectedBudget)
        ?.label.replace(/\D/g, '_');

      const response = await saveUserProfile({
        user_id: userId,
        age_band: ageBand,
        city: city,
        dining_budget: diningBudget,
        has_dogs: hasDogs,
      }).unwrap();

      if (response?.success) {
        Alert.alert('Success', response.message);
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Loader visible={isSaving} />

      <AppHeader
        onLeftPress={() => navigation.goBack()}
        title="Tell Us About Yourself"
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <ScrollView
        contentContainerStyle={[styles.innercontainer, { paddingBottom: 80 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headtxt}>Help us personalize your experience</Text>

        {/* AGE */}
        <Text style={{ ...styles.headtxt, paddingTop: 12 }}>
          Age Group <Text style={{ color: 'red' }}>*</Text>
        </Text>

        <FlatList
          data={Data}
          renderItem={renderItem}
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
              label={
                <Text style={styles.labeltxt}>
                  City <Text style={{ color: 'red' }}>*</Text>
                </Text>
              }
              value={city}
            />
          </View>
        </TouchableOpacity>

        {/* DOG */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: responsiveScreenHeight(2),
          }}
        >
          <Text style={styles.headtxt}>Do you have dogs?</Text>
          <Switch value={hasDogs} onValueChange={setHasDogs} />
        </View>

        {/* BUDGET */}
        <Text style={styles.headtxt}>
          Monthly Budgeted Group <Text style={{ color: 'red' }}>*</Text>
        </Text>

        <FlatList
          data={budgetData}
          renderItem={renderBudgetItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <AppButton
          title="Finish Setup"
          onPress={handleFinishSetup}
          disabled={!selectedId || !selectedBudget || !city}
        />
      </View>

      {/* CITY MODAL */}
      <Modal visible={cityModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#00000070' }}>
          <View style={{ backgroundColor: '#fff', marginTop: 'auto', padding: 20 }}>
            <Text style={styles.headtxt}>Select City</Text>

            <FlatList
              data={cityData}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical: 12 }}
                  onPress={() => {
                    setCity(item.name);
                    setCityModalVisible(false);
                  }}
                >
                  <Text>{item.name} ({item.country})</Text>
                </TouchableOpacity>
              )}
            />

            <AppButton title="Close" onPress={() => setCityModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
