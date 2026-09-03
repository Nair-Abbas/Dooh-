import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';
import { useDriver } from '../../context/DriverContext';

const { width: SW } = Dimensions.get('window');

export const DriverScanAnalyticsScreen: React.FC = () => {
  const {
    todayScansCount,
    todayEarnings,
    avgPayoutPerScan,
    scanEvents,
    campaignRates,
  } = useDriver();

  const [activeFilter, setActiveFilter] = useState<'all' | 'verified'>('all');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══════ TOP HEADER ═══════ */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTag}>PASSENGER ENGAGEMENTS</Text>
          <Text style={styles.headerTitle}>Ad Scans & Rates.</Text>
          <Text style={styles.headerSubtitle}>
            You get paid every time a rear passenger scans a QR code or interacts with an ad on your headrest screens.
          </Text>
        </View>

        {/* ═══════ SCAN PERFORMANCE METRICS ═══════ */}
        <View style={styles.metricsCard}>
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>SCANS DELIVERED TODAY</Text>
              <Text style={styles.metricValNumber}>{todayScansCount}</Text>
              <Text style={styles.metricSubText}>Verified Interactions</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>SCAN COMMISSION EARNED</Text>
              <Text style={[styles.metricValNumber, { color: COLORS.magenta }]}>
                £{todayEarnings.toFixed(2)}
              </Text>
              <Text style={styles.metricSubText}>Avg. £{avgPayoutPerScan} / Scan</Text>
            </View>
          </View>
        </View>

        {/* ═══════ CAMPAIGN PAY-PER-SCAN RATES ═══════ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Brand Scan Bounty Rates</Text>
          <Text style={styles.sectionCount}>Live Advertisers</Text>
        </View>

        <View style={styles.campaignRatesList}>
          {campaignRates.map((camp) => (
            <View key={camp.id} style={styles.campaignRateCard}>
              <View style={[styles.campColorDot, { backgroundColor: camp.themeColor }]} />
              <View style={styles.campInfoCol}>
                <View style={styles.campBadgeRow}>
                  <Text style={styles.campBrandName}>{camp.brand}</Text>
                  {camp.activeStatus === 'boosted' && (
                    <View style={styles.boostedPill}>
                      <Text style={styles.boostedPillText}>BOOSTED BOUNTY</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.campCategoryText}>{camp.category} • {camp.totalScansThisWeek} scans this week</Text>
              </View>

              <View style={styles.campRateCol}>
                <Text style={styles.rateGbp}>+£{camp.payoutPerScanGbp.toFixed(2)}</Text>
                <Text style={styles.rateLabel}>Per Scan</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ═══════ REAL-TIME SCAN ACTIVITY LOG ═══════ */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Live Passenger Scan Log</Text>
          <Text style={styles.sectionCount}>{scanEvents.length} Recorded</Text>
        </View>

        <View style={styles.scanLogList}>
          {scanEvents.map((scan) => (
            <View key={scan.id} style={styles.scanLogItem}>
              <View style={[styles.scanDotBubble, { backgroundColor: scan.themeColor }]}>
                <Svg width={16} height={16} viewBox="0 0 24 24">
                  <Path d="M20 6L9 17l-5-5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>

              <View style={styles.scanLogDetails}>
                <Text style={styles.scanBrandName}>{scan.brand}</Text>
                <Text style={styles.scanLocationText}>📍 {scan.screenLocation}</Text>
                <Text style={styles.scanTimeText}>⏰ {scan.timestamp}</Text>
              </View>

              <View style={styles.scanPayoutCol}>
                <Text style={styles.scanPayoutVal}>+£{scan.payoutGbp.toFixed(2)}</Text>
                <View style={styles.scanVerifiedBadge}>
                  <Text style={styles.scanVerifiedText}>VERIFIED</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ═══════ DRIVER EARNING TIPS ═══════ */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips to Maximize Passenger Scans:</Text>
          <Text style={styles.tipsText}>• Keep headrest screen brightness on Auto-Sensor so QR codes are sharp & easy to scan.</Text>
          <Text style={styles.tipsText}>• Passenger scan chimes alert you when a passenger claims a discount coupon.</Text>
          <Text style={styles.tipsText}>• Boosted bounty campaigns (e.g. Kyoto Travel) pay up to £2.00 for a single scan.</Text>
        </View>
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
    paddingTop: 54,
    paddingBottom: 30,
  },
  topHeader: {
    marginBottom: 20,
  },
  headerTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.magenta,
    letterSpacing: 2,
    marginBottom: 6,
  },
  headerTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.navy,
    marginBottom: 6,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.slate,
    lineHeight: 18,
  },

  // Performance Card
  metricsCard: {
    backgroundColor: COLORS.navyDeep,
    borderRadius: RADIUS.md,
    padding: 18,
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slateLight,
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
  },
  metricValNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'serif',
    marginBottom: 2,
  },
  metricSubText: {
    fontSize: 10.5,
    color: COLORS.slateLight,
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginHorizontal: 8,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
    color: COLORS.navy,
  },
  sectionCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.slate,
    fontWeight: '600',
  },

  // Campaign Rates List
  campaignRatesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 14,
    ...SHADOWS.soft,
  },
  campaignRateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  campColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  campInfoCol: {
    flex: 1,
  },
  campBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  campBrandName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.navy,
  },
  boostedPill: {
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#FFE4EC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  boostedPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.magenta,
  },
  campCategoryText: {
    fontSize: 11,
    color: COLORS.slate,
  },
  campRateCol: {
    alignItems: 'flex-end',
  },
  rateGbp: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.teal,
  },
  rateLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.slate,
  },

  // Scan Log
  scanLogList: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 14,
    marginBottom: 20,
    ...SHADOWS.soft,
  },
  scanLogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  scanDotBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLogDetails: {
    flex: 1,
  },
  scanBrandName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 2,
  },
  scanLocationText: {
    fontSize: 11,
    color: COLORS.slate,
    marginBottom: 2,
  },
  scanTimeText: {
    fontSize: 9.5,
    color: COLORS.textMuted,
  },
  scanPayoutCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  scanPayoutVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  scanVerifiedBadge: {
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scanVerifiedText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.teal,
    letterSpacing: 0.5,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: RADIUS.md,
    padding: 16,
    gap: 6,
  },
  tipsTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 2,
  },
  tipsText: {
    fontSize: 11.5,
    color: COLORS.slate,
    lineHeight: 17,
  },
});
