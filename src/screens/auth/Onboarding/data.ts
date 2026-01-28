import { ImageSourcePropType } from 'react-native';

export interface OnboardingItemType {
  id: string;
  description: string;
  title: string;
  image: ImageSourcePropType;
  image2: ImageSourcePropType;
}

export const onboardingData: OnboardingItemType[] = [
  {
    id: '1',
    description:
      'Effortlessly organize your ideas and projects, Boost productivity with smart, intuitive tools.',
    title: 'Unlock Your Creative Potential',

    image: require('../../../../assets/image/banner2.png'),
    image2: require('../../../../assets/image/blur.png'),
  },
  {
    id: '2',
    description:
      'Find your next favorite with our featured collections and intuitive browsing.',
    title: 'Explore Curated Lists & Discover New Ideas',
    image: require('../../../../assets/image/banner3.png'),
    image2: require('../../../../assets/image/blur.png'),
  },
  {
    id: '3',
    description:
      "Organize ideas, track progress, and personalize your journey. We'll ask for necessary permissions to enhance your experience.",
    title: 'Unlock Your Potential. Create Your First List.',
    image: require('../../../../assets/image/banner1.png'),
    image2: require('../../../../assets/image/blur.png'),
  },
];
