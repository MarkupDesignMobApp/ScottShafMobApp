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
  StatusBar,
} from 'react-native';
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title: string;
  leftImage?: ImageSourcePropType;
  rightImage?: ImageSourcePropType;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  containerStyle?: ViewStyle;
}

const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : responsiveScreenHeight(8);

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftImage,
  rightImage,
  onLeftPress,
  onRightPress,
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight,
          height: HEADER_HEIGHT + (Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0),
        },
        containerStyle,
      ]}
    >
      {/* Left */}
      <View style={styles.sideContainer}>
        {leftImage && (
          <TouchableOpacity style={styles.imgcontainer} onPress={onLeftPress} hitSlop={10}>
            <Image resizeMode='contain' source={leftImage} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center */}
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      {/* Right */}
      <View style={styles.sideContainer}>
        {rightImage && (
          <TouchableOpacity style={styles.imgcontainer} onPress={onRightPress} hitSlop={10}>
            <Image resizeMode='contain' source={rightImage} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveScreenFontSize(2),
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: '#000000',
    fontFamily: 'samsungsharpsans',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imgcontainer: {
    width: responsiveScreenWidth(6),
    height: responsiveScreenHeight(6)
  }
});
