import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { TabParamList } from '../types/navigation';
import {
  Profile,
  Home,
  FeaturedLists,
  CreateList,
  MyList,
  MyListScreen,
} from '../../screens';
import ProfileStackNavigator from '../stacks/InternalNavigator/ProfileStackNavigator';
import HomeStackNavigator from '../stacks/InternalNavigator/HomeStackNavigator';
import BrowseCatalogScreen from '../../screens/main/campaign/CatlogScreen';
import Recommend_Screen from '../../screens/main/home/Recommend_Screen';
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
          fontFamily: 'Ubuntu-Regular',
          marginTop: 4,
        },
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
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
