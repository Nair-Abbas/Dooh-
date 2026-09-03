import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { AnimatedPressable } from '../ui/AnimatedPressable';

export type DriverTab = 'home' | 'monitor' | 'earnings' | 'profile';

interface DriverTabBarProps {
  activeTab: DriverTab;
  onTabChange: (tab: DriverTab) => void;
}

export const DriverTabBar: React.FC<DriverTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. DASHBOARD */}
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
          Dashboard
        </Text>
      </AnimatedPressable>

      {/* 2. LIVE SCREEN */}
      <AnimatedPressable
        onPress={() => onTabChange('monitor')}
        activeScale={0.92}
        style={styles.tabItem}
      >
        <View style={styles.iconWrapper}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Rect x="2" y="3" width="20" height="14" rx="2" stroke={activeTab === 'monitor' ? COLORS.navy : COLORS.slateLight} strokeWidth="2.2" fill={activeTab === 'monitor' ? COLORS.tealLight : 'none'} />
            <Path d="M8 21h8M12 17v4" stroke={activeTab === 'monitor' ? COLORS.navy : COLORS.slateLight} strokeWidth="2.2" strokeLinecap="round" />
          </Svg>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'monitor' && styles.tabLabelActive]}>
          Live Screen
        </Text>
      </AnimatedPressable>

      {/* 3. EARNINGS */}
      <AnimatedPressable
        onPress={() => onTabChange('earnings')}
        activeScale={0.92}
        style={styles.tabItem}
      >
        <View style={styles.iconWrapper}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path
              d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              stroke={activeTab === 'earnings' ? COLORS.navy : COLORS.slateLight}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'earnings' && styles.tabLabelActive]}>
          Earnings
        </Text>
      </AnimatedPressable>

      {/* 4. VEHICLE & ACCOUNT */}
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
          Vehicle
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
