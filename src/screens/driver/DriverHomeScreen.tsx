import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { useDriver } from '../../context/DriverContext';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';

interface DriverHomeScreenProps {
  onNavigateToMonitor: () => void;
  onNavigateToEarnings: () => void;
  onNavigateToProfile: () => void;
}

export const DriverHomeScreen: React.FC<DriverHomeScreenProps> = ({
  onNavigateToMonitor,
  onNavigateToEarnings,
  onNavigateToProfile,
}) => {
  const {
    profile,
    vehicle,
    isOnline,
    totalEarnings,
    totalBalance,
    currentCampaign,
    toggleScreenOnline,
  } = useDriver();

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(15)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered cascade
    Animated.parallel([
      Animated.timing(fadeAnim1, { toValue: 1, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim1, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    const t1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim2, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideAnim2, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }, 100);

    return () => {
      clearTimeout(t1);
    };
  }, [fadeAnim1, slideAnim1, fadeAnim2, slideAnim2]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══════ 1. TOP HEADER (SAFE SYSTEM BAR CLEARANCE) ═══════ */}
        <Animated.View style={[styles.topHeader, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <View style={styles.headerBadgeRow}>
              <View style={styles.vehiclePill}>
                <Text style={styles.vehiclePillText} numberOfLines={1}>
                  {vehicle.make} {vehicle.model} • {vehicle.plate}
                </Text>
              </View>
              {profile.fleetType === 'fleet' && (
                <View style={styles.fleetHeaderPill}>
                  <Text style={styles.fleetHeaderPillText}>
                    FLEET: {profile.fleetName ? profile.fleetName.split(' ')[0] : 'PARTNER'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.greetingTitle} numberOfLines={1}>Hello, {profile.fullName.split(' ')[0]}</Text>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={onNavigateToProfile} style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{profile.avatarInitials}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ═══════ 2. SCREEN BROADCAST MASTER SWITCH ═══════ */}
        <Animated.View style={[styles.broadcastControlCard, !isOnline && styles.broadcastControlCardOffline, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
          <View style={styles.broadcastLeft}>
            <View style={styles.broadcastIndicatorRow}>
              <Text style={[styles.broadcastTag, !isOnline && { color: COLORS.slate }]}>
                {isOnline ? '[ SCREENS ONLINE ]' : '[ SCREENS STANDBY ]'}
              </Text>
            </View>
            <Text style={[styles.broadcastHeading, !isOnline && { color: COLORS.navy }]}>
              {isOnline ? 'Screens Active & Earning' : 'Turn On Screens to Earn'}
            </Text>
            <Text style={[styles.broadcastSub, !isOnline && { color: COLORS.slate }]}>
              {isOnline ? 'Ad loops streaming live in your vehicle.' : 'Toggle switch to start streaming ads and earning.'}
            </Text>
          </View>

          <Switch
            value={isOnline}
            onValueChange={toggleScreenOnline}
            trackColor={{ false: COLORS.slateUltraLight, true: COLORS.tealDark }}
            thumbColor={isOnline ? COLORS.teal : '#FFFFFF'}
          />
        </Animated.View>

        {/* ═══════ 3. EARNINGS HERO CARD ═══════ */}
        <Animated.View style={[styles.earningsCard, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}>
          <View style={styles.earningsTopRow}>
            <View>
              <Text style={styles.earningsMicroTag}>TOTAL PLATFORM EARNINGS</Text>
              <AnimatedCounter
                value={totalEarnings}
                prefix="£"
                decimals={2}
                duration={900}
                style={styles.earningsAmount}
              />
            </View>

            <View style={styles.payoutBalanceBox}>
              <Text style={styles.payoutBalanceLabel}>AVAILABLE PAYOUT</Text>
              <AnimatedCounter
                value={totalBalance}
                prefix="£"
                decimals={2}
                duration={900}
                style={styles.payoutBalanceValue}
              />
            </View>
          </View>

          <View style={styles.earningsDivider} />

          <View style={styles.earningsBottomRow}>
            <Text style={styles.payoutBankText}>
              Direct Deposit: {profile.paymentDetails.bankName || 'Verified Bank'}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onNavigateToEarnings}
              style={styles.viewEarningsLink}
            >
              <Text style={styles.viewEarningsLinkText}>Wallet & Payouts</Text>
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path d="M5 12h14M12 5l7 7-7 7" stroke={COLORS.goldWarm} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ═══════ 4. LIVE SCREEN PREVIEW CARD ═══════ */}
        <Animated.View style={{ opacity: fadeAnim2 }}>
          <AnimatedPressable
            onPress={onNavigateToMonitor}
            activeScale={0.97}
            style={styles.liveScreenCard}
          >
            <View style={styles.liveScreenHeader}>
              <View style={styles.screenTagRow}>
                <Text style={styles.screenTagText}>[ IN-CABIN SMART DISPLAY ]</Text>
              </View>
              <Text style={styles.screenResolutionText}>1080P UHD • 60 FPS</Text>
            </View>

            <Text style={styles.activeCampaignBrand}>{currentCampaign.brand}</Text>
            <Text style={styles.activeCampaignHeadline}>{currentCampaign.headline}</Text>

            <View style={styles.liveScreenFooter}>
              <Text style={styles.liveStatusText}>
                {isOnline ? 'Rotating Broadcast Active' : 'Screens Standby'}
              </Text>
              <View style={styles.openMonitorLink}>
                <Text style={styles.openMonitorText}>Open Dual Display Monitor</Text>
                <Svg width={16} height={16} viewBox="0 0 24 24">
                  <Path d="M5 12h14M12 5l7 7-7 7" stroke={COLORS.navy} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </View>
          </AnimatedPressable>
        </Animated.View>

        {/* ═══════ 5. HARDWARE & FLEET AUDIT ═══════ */}
        <Animated.View style={[styles.telemetryCard, { opacity: fadeAnim2 }]}>
          <Text style={styles.telemetrySectionTitle}>SYSTEM TELEMETRY</Text>
          <View style={styles.telemetryGrid}>
            <View style={styles.telemetryCol}>
              <Text style={styles.telemetryKey}>HARDWARE</Text>
              <Text style={styles.telemetryVal}>Dual Touchscreens</Text>
            </View>
            <View style={styles.telemetryCol}>
              <Text style={styles.telemetryKey}>FIRMWARE</Text>
              <Text style={styles.telemetryVal}>{vehicle.firmwareVersion}</Text>
            </View>
            <View style={styles.telemetryCol}>
              <Text style={styles.telemetryKey}>NETWORK</Text>
              <Text style={[styles.telemetryVal, { color: COLORS.tealDark }]}>5G Connected</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: SAFE_TOP_PADDING,
    paddingBottom: 32,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  vehiclePill: {
    flexShrink: 1,
  },
  vehiclePillText: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  fleetHeaderPill: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  fleetHeaderPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  greetingTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.navy,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  broadcastControlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    ...SHADOWS.soft,
  },
  broadcastControlCardOffline: {
    backgroundColor: COLORS.backgroundOff,
    borderColor: COLORS.border,
  },
  broadcastLeft: {
    flex: 1,
    marginRight: 14,
  },
  broadcastIndicatorRow: {
    marginBottom: 4,
  },
  broadcastTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.tealDark,
    fontSize: 12,
    letterSpacing: 1,
  },
  broadcastHeading: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 3,
  },
  broadcastSub: {
    fontSize: 13.5,
    color: COLORS.slate,
    lineHeight: 18,
  },
  earningsCard: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    padding: 20,
    marginBottom: 18,
    ...SHADOWS.medium,
  },
  earningsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  earningsMicroTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slateLight,
    fontSize: 11.5,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  payoutBalanceBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    flexShrink: 1,
  },
  payoutBalanceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.goldWarm,
    letterSpacing: 1,
    marginBottom: 2,
  },
  payoutBalanceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  earningsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 14,
  },
  earningsBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  payoutBankText: {
    fontSize: 13,
    color: COLORS.slateLight,
    flexShrink: 1,
  },
  viewEarningsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewEarningsLinkText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.goldWarm,
  },
  liveScreenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 18,
    ...SHADOWS.soft,
  },
  liveScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  screenTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  screenTagText: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11.5,
    letterSpacing: 1.2,
  },
  screenResolutionText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.slateLight,
  },
  activeCampaignBrand: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 4,
  },
  activeCampaignHeadline: {
    fontSize: 14.5,
    color: COLORS.slate,
    marginBottom: 16,
  },
  liveScreenFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  liveStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.tealDark,
    flexShrink: 1,
  },
  openMonitorLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openMonitorText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.navy,
  },
  telemetryCard: {
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
  },
  telemetrySectionTitle: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  telemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  telemetryCol: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  telemetryKey: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.slateLight,
    letterSpacing: 0.8,
  },
  telemetryVal: {
    color: COLORS.navy,
  },
});
