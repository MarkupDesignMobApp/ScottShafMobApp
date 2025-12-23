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

} from '../../screens';

import OfferDetail from '../../screens/main/offers/OfferDetail';
import AddCustomItem from '../../screens/main/List/AddCustomItem';
import CreateListScreen from '../../screens/main/List/CreateList';
import BrowseCatalogScreen from '../../screens/main/campaign/CatlogScreen';
import ListDetailScreen from '../../screens/main/List/AddItems';
import inviteScreen from '../../screens/main/Invite&Refer/inviteScreen';
import ListPublishedScreen from '../../screens/main/List/ListPublish';
import ProfileQuestion from '../../screens/main/feature/ProfileQuestion';
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
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Discover" component={BrowseCatalogScreen} />
      <Tab.Screen name="Create" component={CreateList} />
      <Tab.Screen name="MyLists" component={MyList} />
      <Tab.Screen name="Profile" component={Profile} />
     
    </Tab.Navigator>
  );
}
