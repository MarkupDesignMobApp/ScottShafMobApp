import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';
import { Profile, Home, FeaturedLists } from '../../screens';
import CampaignAnalytics from '../../screens/main/campaign/CampaignAnalytics';
import OfferDetail from '../../screens/main/offers/OfferDetail';
import AddCustomItem from '../../screens/main/List/AddCustomItem';
import CreateListScreen from '../../screens/main/List/CreateList';
import BrowseCatalogScreen from '../../screens/main/campaign/CatlogScreen';
import ListDetailScreen from '../../screens/main/List/AddItems';
import inviteScreen from '../../screens/main/Invite&Refer/inviteScreen';
const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="CampaignAnalytics" component={CampaignAnalytics} />
      <Tab.Screen name="OfferDetail" component={OfferDetail} />
      <Tab.Screen name="FeaturedLists" component={FeaturedLists} />
      <Tab.Screen name="inviteScreen" component={inviteScreen} />
      <Tab.Screen name="ListDetailScreen" component={ListDetailScreen} />
      <Tab.Screen name="BrowseCatalogScreen" component={BrowseCatalogScreen} />
      <Tab.Screen name="CreateListScreen" component={CreateListScreen} />
      <Tab.Screen name="AddCustomItem" component={AddCustomItem} />

    </Tab.Navigator>
  );
}
