import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import OnboardingItem from './onBoardingItem';
import Pagination from './Pagination';
import { onboardingData } from './data';
import { styles } from './styles';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
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
    <View style={{ backgroundColor: '#F8F9FA', flex: 1 }}>
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

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.nextButton,
            {
              backgroundColor: '#2C3E50',
              borderRadius: responsiveScreenWidth(3),
              paddingVertical: responsiveScreenHeight(1.8),
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#2C3E50',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
              width: '100%',
            },
          ]}
          onPress={handleNext}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: responsiveScreenFontSize(1.9),
              fontWeight: '600',
              fontFamily: 'Quicksand-Bold',
            }}
          >
            {activeIndex === onboardingData.length - 1 ? 'Get Explore' : 'Next'}
          </Text>
        </TouchableOpacity>

        {/* Step Back Button */}
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.bottomtxt, { opacity: activeIndex === 0 ? 0 : 1 }]}
          disabled={activeIndex === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.bottomtxt}>Step back</Text>
        </TouchableOpacity>
      </View>

      <Pagination
        dataLength={onboardingData.length}
        activeIndex={activeIndex}
      />
    </View>
  );
};

export default OnboardingScreen;
