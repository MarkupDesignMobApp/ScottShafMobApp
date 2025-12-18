import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import { AppButton } from '../../../components/ui/AppButton/AppButton';

import { styles } from './styles';
import CountryPickerModal from '../../../components/ui/CountryPicker/CountryPickerModal';
import { useLoginLogic } from '../Login/useLoginLogic';
import { AppInput } from '../../../components/ui/AppInput/AppInput';
export default function AboutScreen({navigation}) {
  const {
    country,
    countryCode,
    phone,
    modalVisible,
    phoneInputRef,
    countries,
    setPhone,
    setModalVisible,
    handleSelectCountry,
    handleLogin,
    isLoading,
  } = useLoginLogic();

  const [selectedId, setSelectedId] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
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
  
  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          isSelected && styles.selectedItem,
        ]}
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.itemText,
            isSelected && styles.selectedText,
          ]}
        >
          {item.agegroup}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <AppHeader
    onLeftPress={()=>navigation.goBack()}
      title="Tell Us About Yourself"
      leftImage={require('../../../../assets/image/left-icon.png')}
    />
  
    {/* CONTENT */}
    <View style={styles.innercontainer}>
      <Text style={styles.headtxt}>
        Help us personalize your experience
      </Text>
  
      <Text style={{...styles.headtxt,paddingTop:12}}>
     Age Group<Text style={{color:'red'}}>*</Text>
      </Text>
      {/* AGE GROUP GRID */}
      <FlatList
  data={Data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  numColumns={2}
  columnWrapperStyle={styles.row}
  contentContainerStyle={styles.listContainer}
  showsVerticalScrollIndicator={false}
  
  ListFooterComponent={
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        Keyboard.dismiss();
        setTimeout(() => setModalVisible(true), 150);
      }}
    >
      <View pointerEvents="none">
        <AppInput
          label={
            <Text style={styles.labeltxt}>
              Country <Text style={{ color: 'red' }}>*</Text>
            </Text>
          }
          value={country}
        />
      </View>
    </TouchableOpacity>
  }
/>

   {/* MONTHLY BUDGET */}
   <Text style={{...styles.headtxt,paddingBottom:10}}>
     Monthly Budgeted Group<Text style={{color:'red'}}>*</Text>
      </Text>

  <FlatList
    data={budgetData}
    renderItem={renderBudgetItem}
    keyExtractor={(item) => item.id}
    numColumns={1}
    contentContainerStyle={styles.budgetList}
    showsVerticalScrollIndicator={false}
  />

    
    </View>
  
    {/* FIXED BUTTON */}
    <View style={styles.footer}>
      <AppButton
        title="Finish Setup"
        onPress={() => navigation.navigate('Privacy')}
        disabled={!selectedId}
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
