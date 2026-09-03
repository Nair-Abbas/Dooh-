import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { AnimatedPressable } from '../ui/AnimatedPressable';

export type PassengerTab = 'home' | 'scan' | 'points' | 'offers' | 'history' | 'profile';

interface PassengerTabBarProps {
  activeTab: PassengerTab;
  onTabChange: (tab: PassengerTab) => void;
}

export const PassengerTabBar: React.FC<PassengerTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const isOffersActive = activeTab === 'offers' || activeTab === 'history';

  return (
    <View style={styles.container}>
      {/* 1. HOME */}
      <AnimatedPressable
        onPress={() => onTabChange('home')}
        activeScale={0.92}
        style={styles.tabItem}
      >
        <View style={styles.iconWrapper}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              stroke={activeTab === 'home' ? COLORS.navy : COLORS.slateLight}
              strokeWidth="2.2"
              fill={activeTab === 'home' ? COLORS.tealLight : 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 22V12h6v10"
              stroke={activeTab === 'home' ? COLORS.navy : COLORS.slateLight}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
          Explore
        </Text>
      </AnimatedPressable>

      {/* 2. SCAN (Center Action) */}
      <AnimatedPressable
        onPress={() => onTabChange('scan')}
        activeScale={0.9}
        style={styles.centerTabItem}
      >
        <View style={[styles.centerIconBubble, activeTab === 'scan' && styles.centerIconBubbleActive]}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8 12h8" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          </Svg>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'scan' && styles.tabLabelActive, { marginTop: 4 }]}>
          Scan
        </Text>
      </AnimatedPressable>

      {/* 3. POINTS */}
      <AnimatedPressable
        onPress={() => onTabChange('points')}
        activeScale={0.92}
        style={styles.tabItem}
      >
        <View style={styles.iconWrapper}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Circle
              cx="12"
              cy="12"
              r="9"
              stroke={activeTab === 'points' ? COLORS.navy : COLORS.slateLight}
              strokeWidth="2.2"
              fill={activeTab === 'points' ? COLORS.tealLight : 'none'}
            />
            <Path
              d="M12 7v10M9 9.5h6M9.5 14.5h5"
              stroke={activeTab === 'points' ? COLORS.navy : COLORS.slateLight}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'points' && styles.tabLabelActive]}>
          Points
        </Text>
      </AnimatedPressable>

      {/* 4. ADS & OFFERS */}
      <AnimatedPressable
        onPress={() => onTabChange('offers')}
        activeScale={0.92}
        style={styles.tabItem}
      >
        <View style={styles.iconWrapper}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Rect
              x="2"
              y="4"
              width="20"
              height="15"
              rx="3"
              stroke={isOffersActive ? COLORS.navy : COLORS.slateLight}
              strokeWidth="2.2"
              fill={isOffersActive ? COLORS.magentaLight : 'none'}
            />
            <Polygon
              points="10 8 16 11.5 10 15 10 8"
              fill={isOffersActive ? COLORS.navy : COLORS.slateLight}
            />
          </Svg>
        </View>
        <Text style={[styles.tabLabel, isOffersActive && styles.tabLabelActive]}>
          Ads & Offers
        </Text>
      </AnimatedPressable>

      {/* 5. PROFILE */}
      <AnimatedPressable
        onPress={() => onTabChange('profile')}
        activeScale={0.92}
        style={styles.tabItem}
      >
        <View style={styles.iconWrapper}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke={activeTab === 'profile' ? COLORS.navy : COLORS.slateLight}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={activeTab === 'profile' ? COLORS.tealLight : 'none'}
            />
            <Circle
              cx="12"
              cy="7"
              r="4"
              stroke={activeTab === 'profile' ? COLORS.navy : COLORS.slateLight}
              strokeWidth="2.2"
              fill={activeTab === 'profile' ? COLORS.tealLight : 'none'}
            />
          </Svg>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
          Account
        </Text>
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    paddingHorizontal: 8,
    ...SHADOWS.soft,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  centerTabItem: {
    alignItems: 'center',
    flex: 1,
    marginTop: -14,
  },
  centerIconBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  centerIconBubbleActive: {
    backgroundColor: COLORS.teal,
  },
  iconWrapper: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slateLight,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: COLORS.navy,
    fontWeight: '900',
  },
});
