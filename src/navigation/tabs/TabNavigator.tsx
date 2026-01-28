import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { TabParamList } from '../types/navigation';
import { Profile, Home } from '../../screens';

const Tab = createBottomTabNavigator<TabParamList>();

const getTabIcon = (routeName: string, focused: boolean) => {
  let icon;

  switch (routeName) {
    case 'Home':
      icon = require('../../../assets/image/home.png');
      break;
    case 'Discover':
      icon = require('../../../assets/image/compass.png');
      break;
    case 'Create':
      icon = require('../../../assets/image/add2.png');
      break;
    case 'MyLists':
      icon = require('../../../assets/image/list.png');
      break;
    case 'Profile':
      icon = require('../../../assets/image/users.png');
      break;
  }

  return (
    <Image
      source={icon}
      style={{
        width: 24,
        height: 24,
        tintColor: focused ? '#0180FE' : '#999',
      }}
      resizeMode="contain"
    />
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily:"Ubunty-Regular",
          marginTop:4
        },
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Discover" component={Profile} />
      <Tab.Screen name="Create" component={Home} />
      <Tab.Screen name="MyLists" component={Profile} />
      <Tab.Screen name="Profile" component={Home} />
    </Tab.Navigator>
  );
}
