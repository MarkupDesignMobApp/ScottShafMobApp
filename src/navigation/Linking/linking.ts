import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['markupdesigns://', 'https://www.markupdesigns.net'],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: {
            screens: {
              Home: '', // default route
              FeaturedDetail: 'scott-shafer/featured-lists/:itemId', // deep link path
            },
          },
          Discover: 'discover',
          Create: 'create',
          MyLists: 'mylists',
          Profile: 'profile',
        },
      },
      NotFound: '*',
    },
  },
  parse: {
    itemId: (itemId: string) => itemId,
  },
};
