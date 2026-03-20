import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, StyleSheet, Text } from 'react-native';

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

  if (isCreate) {
    return (
      <View style={styles.createTabItem}>
        <View style={styles.createWrapper}>
          <Image
            source={icons[routeName]}
            resizeMode="contain"
            style={[styles.icon, { tintColor: '#FFFFFF' }]}
          />
        </View>
        <Text style={[styles.label, { color: focused ? PRIMARY : INACTIVE }]}>
          Create
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.tabItem, focused && styles.activeTabItem]}>
      <Image
        source={icons[routeName]}
        resizeMode="contain"
        style={[styles.icon, { tintColor: focused ? PRIMARY : INACTIVE }]}
      />
      <Text style={[styles.label, { color: focused ? PRIMARY : INACTIVE }]}>
        {routeName === 'MyLists' ? 'My Lists' : routeName}
      </Text>
    </View>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarIcon: ({ focused }) => (
          <TabIcon routeName={route.name} focused={focused} />
        ),
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
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
    // bottom: 18,
    height: 70,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    // Remove paddingBottom/paddingTop — they push items off-center
    paddingBottom: 0,
    paddingTop: 10,
  },

  // ✅ KEY FIX: tabBarItemStyle centers each tab slot in the bar
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
  },

  activeTabItem: {
    backgroundColor: '#ECF0F1',

    paddingVertical: 18,
  },

  // ✅ Create button: same gap/alignment as other tabs, circle sits centered
  createTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 16, // ✅ circle ऊपर है तो text को नीचे push करो
  },

  createWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    top: -35,
  },

  icon: {
    width: 22,
    height: 22,
  },

  label: {
    fontSize: 11,
    fontFamily: 'Ubuntu-Regular',
    textAlign: 'center',
    width: 60,
  },
});
