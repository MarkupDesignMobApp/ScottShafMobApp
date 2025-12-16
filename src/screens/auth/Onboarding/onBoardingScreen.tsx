import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  Text,
} from 'react-native';
import OnboardingItem from './onBoardingItem';
import Pagination from './Pagination';
import { onboardingData } from './data';
import { styles } from './styles';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import { useNavigation } from '@react-navigation/native';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { AppStorage } from '../../../services/storage/storage.services';
interface Props {
  onFinish: () => void;
}
const OnboardingScreen: React.FC<Props> = ({ onFinish }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const finishOnboarding = async () => {
    await AppStorage.setItem('HAS_SEEN_ONBOARDING', 'true');
    onFinish();
  };
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width,
    );
    setActiveIndex(index);
  };
  const handleNext = () => {
    if (activeIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <FlatList
        ref={flatListRef}
        bounces={false}
        data={onboardingData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: responsiveScreenWidth(100),
          offset: responsiveScreenWidth(100) * index,
          index,
        })}
      />

      {/* Stable Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title={
            activeIndex === onboardingData.length - 1 ? 'Get Explore' : 'Next'
          }
          onPress={handleNext}
        />

        {/* Always render, just hide */}
        <Text
          onPress={handleBack}
          style={[styles.bottomtxt, { opacity: activeIndex === 0 ? 0 : 1 }]}
        >
          Step back
        </Text>
      </View>

      <Pagination
        dataLength={onboardingData.length}
        activeIndex={activeIndex}
      />
    </View>
  );
};

export default OnboardingScreen;
