import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'teal' | 'navy' | 'magenta' | 'gold' | 'neutral' | 'dark';
  size?: 'sm' | 'md';
  dot?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  style,
  textStyle,
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'teal':
        return {
          bg: COLORS.tealLight,
          border: 'rgba(0, 180, 216, 0.3)',
          text: '#0369A1',
          dot: COLORS.tealAccent,
        };
      case 'magenta':
        return {
          bg: COLORS.magentaLight,
          border: 'rgba(217, 70, 239, 0.3)',
          text: '#BE185D',
          dot: COLORS.magentaAccent,
        };
      case 'gold':
        return {
          bg: COLORS.goldLight,
          border: 'rgba(245, 158, 11, 0.3)',
          text: '#B45309',
          dot: COLORS.goldAccent,
        };
      case 'navy':
        return {
          bg: '#E2E8F0',
          border: '#CBD5E1',
          text: COLORS.navyDeep,
          dot: COLORS.navyDeep,
        };
      case 'dark':
        return {
          bg: COLORS.textPrimary,
          border: COLORS.textPrimary,
          text: COLORS.textWhite,
          dot: COLORS.tealAccent,
        };
      default:
        return {
          bg: COLORS.surfaceMuted,
          border: COLORS.borderLight,
          text: COLORS.textSecondary,
          dot: COLORS.textMuted,
        };
    }
  };

  const colors = getBadgeColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        size === 'sm' ? styles.sizeSm : styles.sizeMd,
        style,
      ]}
    >
      {dot && (
        <View style={[styles.dotIndicator, { backgroundColor: colors.dot }]} />
      )}
      <Text
        style={[
          styles.text,
          { color: colors.text },
          size === 'sm' ? styles.textSm : styles.textMd,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: RADIUS.full,
  },
  sizeSm: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    gap: 4,
  },
  sizeMd: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 6,
  },
  dotIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    ...TYPOGRAPHY.editorialLabel,
  },
  textSm: {
    fontSize: 8.5,
    letterSpacing: 1.2,
  },
  textMd: {
    fontSize: 9.5,
    letterSpacing: 1.5,
  },
});
