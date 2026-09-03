/**
 * DOOH Design System — Editorial Mobility & Digital Art Direction
 *
 * Combination of:
 * - Premium mobility brand
 * - Digital art platform (clean typography, generous whitespace)
 * - Modern advertising technology
 *
 * Core Palette:
 * - Deep navy blue: #0B132B / #111D38 / #1B2A4A
 * - Muted slate/blue-grey: #475569 / #64748B / #94A3B8 / #E2E8F0
 * - Teal/turquoise: #00A896 / #028090 / #E6F8F6
 * - Magenta/pink accents: #D4145A / #C71F5E / #FDF0F5
 * - Controlled warm yellow/gold accents: #D4A373 / #E9C46A / #FEF8EC
 * - Primarily white/off-white backgrounds: #FFFFFF / #FAFAFC / #F4F5F7
 */

export const COLORS = {
  // Foundation (Crisp White & Off-White)
  background: '#FFFFFF',
  backgroundOff: '#FAFAFC',
  backgroundMuted: '#F4F5F8',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  cardBg: '#FFFFFF',

  // Deep Navy Blue (Primary Foundation & High-Contrast Typography)
  navy: '#0B132B',
  navyDeep: '#060B18',
  navyMedium: '#111D38',
  navyLight: '#1C2E52',
  primary: '#0B132B',
  black: '#0A0E1A',

  // Muted Slate / Blue-Grey (Structure & High-Contrast Boundaries)
  slate: '#475569',
  slateMuted: '#64748B',
  slateLight: '#94A3B8',
  slateUltraLight: '#E2E8F0',
  slateBorder: '#CBD5E1', // High-contrast clean boundary
  borderHairline: '#CBD5E1', // Clear high-contrast hairline
  borderLight: '#E2E8F0',
  border: '#CBD5E1', // Strong crisp card/box border
  borderStrong: '#94A3B8',
  cardBorder: '#CBD5E1',
  boxBorder: '#CBD5E1',
  inputBorder: '#94A3B8',
  inputBorderActive: '#0B132B',

  // Teal / Turquoise (Interactive Signals & Clean Tech Highlights)
  teal: '#00A896',
  tealDark: '#028090',
  tealLight: '#E6F8F6',
  tealMuted: '#33B9AA',
  tealAccent: '#00A896',

  // Magenta / Pink Accents (Promotional Vouchers & Point Accents)
  magenta: '#D4145A',
  magentaDark: '#AD1048',
  magentaLight: '#FDF0F5',
  magentaMuted: '#E03D76',
  magentaAccent: '#D4145A',

  // Controlled Warm Yellow / Gold Accents (Badges, Ratings, Value Multipliers)
  gold: '#D4A373',
  goldWarm: '#E9C46A',
  goldLight: '#FEF8EC',
  goldDark: '#B8824C',
  goldMuted: '#C49142',
  goldAccent: '#D4A373',

  // Semantic States
  success: '#10B981',
  warning: '#F59E0B',
  error: '#E63946',

  // Typography
  textPrimary: '#0B132B',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
} as const;

import { Platform, StatusBar } from 'react-native';

export const SAFE_TOP_PADDING =
  Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight : 44) : 54;

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
  xxxl: 60,
} as const;

export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 26,
  full: 999,
} as const;

/**
 * Editorial Typography Hierarchy
 * Clear, readable, confident headline weights, strong body text.
 */
export const TYPOGRAPHY = {
  // Hero Display (Editorial Title)
  heroDisplay: {
    fontSize: 34,
    fontWeight: '900' as const,
    letterSpacing: -0.8,
    lineHeight: 40,
    color: '#0B132B',
  },
  // Section Headings
  editorialTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
    lineHeight: 34,
    color: '#0B132B',
  },
  h1: {
    fontSize: 26,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 32,
    color: '#0B132B',
  },
  h2: {
    fontSize: 21,
    fontWeight: '800' as const,
    letterSpacing: -0.3,
    lineHeight: 27,
    color: '#0B132B',
  },
  h3: {
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    lineHeight: 23,
    color: '#0B132B',
  },
  // Subtitle / Tracked Metadata Stamp
  subtitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 1.4,
    lineHeight: 18,
    textTransform: 'uppercase' as const,
    color: '#64748B',
  },
  microTag: {
    fontSize: 11.5,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: '#475569',
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
    color: '#0B132B',
  },
  bodySmall: {
    fontSize: 13.5,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 19,
    color: '#475569',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
    lineHeight: 16,
    color: '#94A3B8',
  },
  amount: {
    fontSize: 30,
    fontWeight: '900' as const,
    letterSpacing: -0.8,
    color: '#0B132B',
  },
} as const;

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#0B132B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0B132B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#0B132B',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 7,
  },
} as const;
