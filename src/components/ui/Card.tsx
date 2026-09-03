import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'outlined',
  padding = 'md',
  style,
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: COLORS.surface,
          ...SHADOWS.soft,
          borderWidth: 1.2,
          borderColor: COLORS.border,
        };
      case 'flat':
        return {
          backgroundColor: COLORS.surfaceMuted,
          borderWidth: 1,
          borderColor: COLORS.borderLight,
        };
      case 'outlined':
      default:
        return {
          backgroundColor: COLORS.surface,
          borderWidth: 1.2,
          borderColor: COLORS.border,
        };
    }
  };

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: SPACING.sm };
      case 'lg':
        return { padding: SPACING.lg };
      case 'md':
      default:
        return { padding: SPACING.md };
    }
  };

  return (
    <View
      style={[
        styles.baseCard,
        getVariantStyle(),
        getPaddingStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
});
