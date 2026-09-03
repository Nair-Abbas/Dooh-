import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryContainer;
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      default:
        return styles.sizeMd;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : COLORS.textPrimary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.baseText,
              getTextStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  baseText: {
    ...TYPOGRAPHY.subheading,
    letterSpacing: 0.2,
  },

  // Variants
  primaryContainer: {
    backgroundColor: COLORS.textPrimary, // Clean Obsidian Black
  },
  primaryText: {
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  secondaryContainer: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  secondaryText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.2,
    borderColor: COLORS.borderDark,
  },
  outlineText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Sizes
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: RADIUS.md,
  },
  sizeLg: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: RADIUS.lg,
  },

  // Disabled
  disabledContainer: {
    opacity: 0.45,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
});
