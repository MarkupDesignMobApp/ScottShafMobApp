import {
  useResponsiveScreenHeight,
  useResponsiveScreenWidth,
  useResponsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

/** Responsive Height (%) */
export const RH = (value: number): number => useResponsiveScreenHeight(value);

/** Responsive Width (%) */
export const RW = (value: number): number => useResponsiveScreenWidth(value);

/** Responsive Font Size (%) */
export const RF = (value: number): number => useResponsiveScreenFontSize(value);
