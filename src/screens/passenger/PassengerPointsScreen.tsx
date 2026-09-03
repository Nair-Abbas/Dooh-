import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { usePassenger, CouponItem, AdCategory } from '../../context/PassengerContext';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const { width: SW } = Dimensions.get('window');

interface PassengerPointsScreenProps {
  onNavigateToCouponDetail: (coupon: CouponItem) => void;
  onNavigateToScan: () => void;
}

const CATEGORIES: ('All' | AdCategory)[] = [
  'All',
  'Mobility & EV',
  'Audio & Tech',
  'Clean Energy',
  'Travel & Tourism',
];

const CATEGORY_COLORS: Record<AdCategory, { bg: string; text: string; border: string }> = {
  'Mobility & EV': { bg: COLORS.tealLight, text: COLORS.tealDark, border: COLORS.teal },
  'Audio & Tech': { bg: COLORS.magentaLight, text: COLORS.magentaMuted, border: COLORS.magenta },
  'Clean Energy': { bg: COLORS.goldLight, text: COLORS.goldMuted, border: COLORS.gold },
  'Travel & Tourism': { bg: '#EDE9FE', text: '#6D28D9', border: '#8B5CF6' },
};

export const PassengerPointsScreen: React.FC<PassengerPointsScreenProps> = ({
  onNavigateToCouponDetail,
  onNavigateToScan,
}) => {
  const { totalPoints, totalGbpValue, coupons, categorySummaries } = usePassenger();
  const [selectedCategory, setSelectedCategory] = useState<'All' | AdCategory>('All');

  const filteredCoupons =
    selectedCategory === 'All'
      ? coupons
      : coupons.filter((c) => c.category === selectedCategory);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════ TOP HEADER (NO AWKWARD TOP VOID) ═══════ */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTag}>REWARD WALLET</Text>
          <Text style={styles.headerTitle}>Points & Value</Text>
          <Text style={styles.headerSubtitle}>
            100 points = £1.00 in instant partner discounts.
          </Text>
        </View>

        {/* ═══════ TOTAL POINTS SUMMARY CARD ═══════ */}
        <View style={styles.pointsSummaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>ACCUMULATED REWARD POINTS</Text>
              <View style={styles.pointsBigRow}>
                <Text style={styles.pointsBigNumber}>{totalPoints.toLocaleString()}</Text>
                <Text style={styles.pointsBigUnit}>PTS</Text>
              </View>
            </View>

            <View style={styles.currencyPill}>
              <Text style={styles.currencyPillLabel}>TOTAL CASH VALUE</Text>
              <Text style={styles.currencyPillValue}>£{totalGbpValue.toFixed(2)} GBP</Text>
            </View>
          </View>

          {/* Conversion Formula Explainer */}
          <View style={styles.formulaBox}>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaItem}>{totalPoints} PTS</Text>
              <Text style={styles.formulaEq}>×</Text>
              <Text style={styles.formulaItem}>£0.01 Rate</Text>
              <Text style={styles.formulaEq}>=</Text>
              <Text style={styles.formulaResult}>£{totalGbpValue.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* ═══════ POINTS BY CATEGORY BREAKDOWN ═══════ */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionHeading}>CATEGORY DISTRIBUTION</Text>

          <View style={styles.categoryGrid}>
            {categorySummaries.map((cat) => {
              const sharePercent = totalPoints > 0 ? ((cat.totalPoints / totalPoints) * 100).toFixed(0) : 0;
              const isSelected = selectedCategory === cat.category;
              const catColor = CATEGORY_COLORS[cat.category] || { bg: COLORS.tealLight, text: COLORS.tealDark, border: COLORS.teal };
              return (
                <TouchableOpacity
                  key={cat.category}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(isSelected ? 'All' : cat.category)}
                  style={[
                    styles.categoryCard,
                    isSelected && { borderColor: COLORS.navy, borderWidth: 2 },
                  ]}
                >
                  <View style={styles.categoryCardHeader}>
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <View style={[styles.shareBadge, { backgroundColor: catColor.bg }]}>
                      <Text style={[styles.shareBadgeText, { color: catColor.text }]}>{sharePercent}%</Text>
                    </View>
                  </View>
                  <Text numberOfLines={1} style={styles.categoryTitle}>{cat.category}</Text>
                  <Text style={styles.categoryPointsText}>{cat.totalPoints.toLocaleString()} PTS</Text>
                  <Text style={styles.categoryGbpText}>≈ £{cat.totalGbp.toFixed(2)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ═══════ VOUCHERS LISTING ═══════ */}
        <View style={styles.vouchersSection}>
          <View style={styles.vouchersHeaderRow}>
            <Text style={styles.vouchersSectionTitle}>
              {selectedCategory === 'All' ? 'All Unlocked Passes' : `${selectedCategory} Passes`}
            </Text>
            <Text style={styles.vouchersCount}>{filteredCoupons.length} ITEMS</Text>
          </View>

          <View style={styles.vouchersList}>
            {filteredCoupons.map((coupon) => (
              <AnimatedPressable
                key={coupon.id}
                onPress={() => onNavigateToCouponDetail(coupon)}
                activeScale={0.97}
                style={styles.voucherRowCard}
              >
                <View style={styles.voucherLeft}>
                  <Text style={styles.voucherBrand}>{coupon.brand}</Text>
                  <Text style={styles.voucherHeadline} numberOfLines={1}>
                    {coupon.headline}
                  </Text>
                  <Text style={styles.voucherCodeText}>Code: {coupon.code}</Text>
                </View>

                <View style={styles.voucherRight}>
                  <Text style={styles.voucherDiscount}>{coupon.discount}</Text>
                  <Text style={styles.voucherGbp}>£{coupon.gbpValue.toFixed(2)} Value</Text>
                  <View style={styles.passLink}>
                    <Text style={styles.passLinkText}>View Pass →</Text>
                  </View>
                </View>
              </AnimatedPressable>
            ))}
          </View>
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
    paddingTop: SAFE_TOP_PADDING,
    paddingBottom: 32,
  },
  topHeader: {
    marginBottom: 18,
  },
  headerTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.navy,
    marginBottom: 6,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 14.5,
    color: COLORS.slate,
    lineHeight: 21,
  },
  pointsSummaryCard: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  summaryLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slateLight,
    fontSize: 11.5,
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  pointsBigRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  pointsBigNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  pointsBigUnit: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.teal,
    letterSpacing: 1,
  },
  currencyPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  currencyPillLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slateLight,
    letterSpacing: 1,
    marginBottom: 2,
  },
  currencyPillValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  formulaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.sm,
    padding: 12,
  },
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formulaItem: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formulaEq: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.teal,
  },
  formulaResult: {
    fontSize: 14.5,
    fontWeight: '900',
    color: COLORS.teal,
  },
  categorySection: {
    marginBottom: 22,
  },
  sectionHeading: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: (SW - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 14,
    ...SHADOWS.soft,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 20,
  },
  shareBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
  },
  shareBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  categoryTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 4,
  },
  categoryPointsText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
  },
  categoryGbpText: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  vouchersSection: {
    marginBottom: 20,
  },
  vouchersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  vouchersSectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.navy,
  },
  vouchersCount: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1,
  },
  vouchersList: {
    gap: 10,
  },
  voucherRowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  voucherLeft: {
    flex: 1,
    marginRight: 10,
  },
  voucherBrand: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 2,
  },
  voucherHeadline: {
    fontSize: 13,
    color: COLORS.slate,
    marginBottom: 4,
  },
  voucherCodeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.tealDark,
  },
  voucherRight: {
    alignItems: 'flex-end',
  },
  voucherDiscount: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.magenta,
  },
  voucherGbp: {
    fontSize: 11.5,
    color: COLORS.slate,
    marginTop: 1,
  },
  passLink: {
    marginTop: 4,
  },
  passLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
  },
});
