import { Text as RNText, StyleSheet, type TextProps } from 'react-native';

import { InstrumentSans } from '@/constants/theme';

/**
 * Text component with Instrument Sans as default font family.
 * Use across all screens for consistent typography.
 */
export function Text({ style, ...props }: TextProps) {
  const flatStyle = StyleSheet.flatten(style);
  const fontWeight = flatStyle?.fontWeight;

  const fontFamily =
    fontWeight === '700' || fontWeight === 'bold'
      ? InstrumentSans.bold
      : fontWeight === '600'
        ? InstrumentSans.semiBold
        : fontWeight === '500'
          ? InstrumentSans.medium
          : InstrumentSans.regular;

  return (
    <RNText
      style={[{ fontFamily }, style]}
      {...props}
    />
  );
}
