import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { useSaveUserProfileMutation } from '../../../features/auth/authApi';
import { styles } from './styles';
import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';
import { useLoginLogic } from '../Login/useLoginLogic';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
import Loader from '../../../components/ui/Loader/Loader';
import { useRoute } from '@react-navigation/native';
export default function AboutScreen({ navigation }) {
  const {
    country,
    modalVisible,
    countries,
    setModalVisible,
    handleSelectCountry,
  } = useLoginLogic();

  const [saveUserProfile, { isLoading: isSaving }] =
    useSaveUserProfileMutation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [hasDogs, setHasDogs] = useState(false);
  const route = useRoute();
  const { userId } = route.params;
  const Data = [
    { id: '1', agegroup: '18-24' },
    { id: '2', agegroup: '25-34' },
    { id: '3', agegroup: '35-44' },
    { id: '4', agegroup: '45+' },
  ];

  const budgetData = [
    { id: '1', label: 'Under ₹2,000' },
    { id: '2', label: '₹2,000 – ₹5,000' },
    { id: '3', label: '₹5,000 – ₹10,000' },
    { id: '4', label: '₹10,000+' },
  ];

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.8}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedText]}>
          {item.agegroup}
        </Text>
      </TouchableOpacity>
    );
  };

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

  const handleFinishSetup = async () => {
    if (!selectedId || !selectedBudget || !country) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    try {
      const ageBand = Data.find(d => d.id === selectedId)?.agegroup;
      const diningBudget = budgetData
        .find(b => b.id === selectedBudget)
        ?.label.replace(/\D/g, '_');

      if (!ageBand || !diningBudget) {
        Alert.alert('Error', 'Invalid selection. Please try again.');
        return;
      }

      const response = await saveUserProfile({
        user_id: userId,
        age_band: ageBand,
        city: country,
        dining_budget: diningBudget,
        has_dogs: hasDogs,
      }).unwrap();

      if (response?.success) {
        Alert.alert('Success', response.message);

        // ✅ Best practice after setup
        navigation.reset({
          index: 0,
          routes: [{ name: 'Socialauth' }],
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

      {/* ✅ FULL SCREEN SCROLL */}
      <ScrollView
        bounces={false}
        contentContainerStyle={[styles.innercontainer, { paddingBottom: 80 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headtxt}>Help us personalize your experience</Text>

        {/* AGE GROUP */}
        <Text style={{ ...styles.headtxt, paddingTop: 12 }}>
          Age Group <Text style={{ color: 'red' }}>*</Text>
        </Text>

        <FlatList
          bounces={false}
          data={Data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />

        {/* CITY */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => setModalVisible(true), 150);
          }}
        >
          <View pointerEvents="none">
            <AppInput
              placeholder="Enter your city"
              label={
                <Text style={styles.labeltxt}>
                  City <Text style={{ color: 'red' }}>*</Text>
                </Text>
              }
              value={country}
            />
          </View>
        </TouchableOpacity>

        {/* DOGS SWITCH */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: responsiveScreenHeight(2),
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.headtxt}>Do you have dogs?</Text>
          <Switch value={hasDogs} onValueChange={setHasDogs} />
        </View>

        {/* BUDGET */}
        <Text style={{ ...styles.headtxt, paddingBottom: 10 }}>
          Monthly Budgeted Group <Text style={{ color: 'red' }}>*</Text>
        </Text>

        <FlatList
          data={budgetData}
          renderItem={renderBudgetItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.budgetList}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* ✅ FIXED FOOTER */}
      <View style={styles.footer}>
        <AppButton
          title={isSaving ? 'Saving...' : 'Finish Setup'}
          onPress={handleFinishSetup}
          disabled={!selectedId || !selectedBudget || !country}
        />
      </View>

      <CountryPickerModal
        visible={modalVisible}
        countries={countries}
        onClose={() => setModalVisible(false)}
        onSelectCountry={handleSelectCountry}
      />
    </View>
  );
}
