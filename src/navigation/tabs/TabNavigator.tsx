import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';
import { Profile, Home, FeaturedLists } from '../../screens';
import CampaignAnalytics from '../../screens/main/campaign/CampaignAnalytics';
import OfferDetail from '../../screens/main/offers/OfferDetail';
const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName='FeaturedLists'>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="CampaignAnalytics" component={CampaignAnalytics} />
      <Tab.Screen name="OfferDetail" component={OfferDetail} />
      <Tab.Screen name="FeaturedLists" component={FeaturedLists} />

    </Tab.Navigator>
  );
}
