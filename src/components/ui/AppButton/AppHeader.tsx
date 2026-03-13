import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ViewStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { responsiveScreenFontSize } from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title: string;
  leftImage?: ImageSourcePropType;
  rightImage?: ImageSourcePropType;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  containerStyle?: ViewStyle;
  backgroundColor?: string; // NEW PROP
  titleColor?: string; // NEW PROP
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftImage,
  rightImage,
  onLeftPress,
  onRightPress,
  containerStyle,
  backgroundColor = '#FFFFFF', // default white
  titleColor = '#000000', // default black
}) => {
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor }]}
    >
      <View style={[styles.container, containerStyle, { backgroundColor }]}>
        {/* Left */}
        <View style={styles.sideContainer}>
          {leftImage && (
            <TouchableOpacity
              onPress={onLeftPress}
              hitSlop={10}
              style={styles.iconWrapper}
            >
              <Image
                tintColor={'#fff'}
                source={leftImage}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Center */}
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={[styles.title, { color: titleColor }]}>
            {title}
          </Text>
        </View>

        {/* Right */}
        <View style={styles.sideContainer}>
          {rightImage && (
            <TouchableOpacity
              onPress={onRightPress}
              hitSlop={10}
              style={styles.iconWrapper}
            >
              <Image source={rightImage} style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF', // default, overridden by prop
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // default, overridden by prop
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  sideContainer: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveScreenFontSize(2),
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: '#000',
    fontFamily: 'samsungsharpsans',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
