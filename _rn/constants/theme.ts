/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/** Instrument Sans font family - used across all screens */
export const InstrumentSans = {
  regular: 'InstrumentSans_400Regular',
  medium: 'InstrumentSans_500Medium',
  semiBold: 'InstrumentSans_600SemiBold',
  bold: 'InstrumentSans_700Bold',
  regularItalic: 'InstrumentSans_400Regular_Italic',
  mediumItalic: 'InstrumentSans_500Medium_Italic',
  semiBoldItalic: 'InstrumentSans_600SemiBold_Italic',
  boldItalic: 'InstrumentSans_700Bold_Italic',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: InstrumentSans.regular,
    serif: InstrumentSans.regular,
    rounded: InstrumentSans.regular,
    mono: 'ui-monospace',
  },
  default: {
    sans: InstrumentSans.regular,
    serif: InstrumentSans.regular,
    rounded: InstrumentSans.regular,
    mono: 'monospace',
  },
  web: {
    sans: "InstrumentSans_400Regular, 'Instrument Sans', system-ui, sans-serif",
    serif: "InstrumentSans_400Regular, 'Instrument Sans', Georgia, serif",
    rounded: "InstrumentSans_400Regular, 'Instrument Sans', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
