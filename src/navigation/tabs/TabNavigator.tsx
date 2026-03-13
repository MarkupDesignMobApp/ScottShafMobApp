import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, StyleSheet } from 'react-native';

import { TabParamList } from '../types/navigation';
import { CreateList, MyListScreen } from '../../screens';

import ProfileStackNavigator from '../stacks/InternalNavigator/ProfileStackNavigator';
import HomeStackNavigator from '../stacks/InternalNavigator/HomeStackNavigator';
import Recommend_Screen from '../../screens/main/home/Recommend_Screen';

const Tab = createBottomTabNavigator<TabParamList>();

const icons = {
  Home: require('../../../assets/image/home.png'),
  Discover: require('../../../assets/image/compass.png'),
  Create: require('../../../assets/image/add2.png'),
  MyLists: require('../../../assets/image/list.png'),
  Profile: require('../../../assets/image/users.png'),
};

const PRIMARY = '#2C3E50';
const INACTIVE = '#95A5A6';

const TabIcon = ({ routeName, focused }) => {
  const isCreate = routeName === 'Create';

  return (
    <View
      style={[
        styles.iconWrapper,
        focused && !isCreate && styles.activeIconWrapper,
        isCreate && styles.createWrapper,
      ]}
    >
      <Image
        source={icons[routeName]}
        resizeMode="contain"
        style={[
          styles.icon,
          {
            tintColor: isCreate ? '#FFFFFF' : focused ? PRIMARY : INACTIVE,
          },
        ]}
      />
    </View>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarLabelStyle: styles.label,

        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,

        tabBarIcon: ({ focused }) => (
          <TabIcon routeName={route.name} focused={focused} />
        ),

        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Discover" component={Recommend_Screen} />
      <Tab.Screen name="Create" component={CreateList} />
      <Tab.Screen name="MyLists" component={MyListScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,

    height: 70,
    borderRadius: 22,

    backgroundColor: '#FFFFFF',

    paddingTop: 6,
    paddingBottom: 6,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 10,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeIconWrapper: {
    backgroundColor: '#ECF0F1',
  },

  createWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2C3E50',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: -20,

    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,

    elevation: 8,
  },

  icon: {
    width: 24,
    height: 24,
  },

  label: {
    fontSize: 11,
    fontFamily: 'Ubuntu-Regular',
    marginTop: 2,
  },
});
