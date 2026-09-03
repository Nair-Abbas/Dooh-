import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { usePassenger, CouponItem, AdCategory } from '../../context/PassengerContext';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';

const { width: SW } = Dimensions.get('window');

interface PassengerHomeScreenProps {
  onNavigateToScan: () => void;
  onNavigateToPoints: () => void;
  onNavigateToOffers?: () => void;
  onNavigateToCouponDetail: (coupon: CouponItem) => void;
  onNavigateToProfile: () => void;
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

export const PassengerHomeScreen: React.FC<PassengerHomeScreenProps> = ({
  onNavigateToScan,
  onNavigateToPoints,
  onNavigateToOffers,
  onNavigateToCouponDetail,
  onNavigateToProfile,
}) => {
  const { profile, totalPoints, totalGbpValue, coupons, recentActivity, categorySummaries } =
    usePassenger();
  const [selectedCategory, setSelectedCategory] = useState<'All' | AdCategory>('All');

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(15)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered Cascade
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

  const activeCoupons = coupons
    .filter((c) => c.status === 'claimed')
    .filter((c) => (selectedCategory === 'All' ? true : c.category === selectedCategory));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════ 1. TOP HEADER (NO AWKWARD TOP VOID) ═══════ */}
        <Animated.View style={[styles.topHeader, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
          <View>
            <View style={styles.liveTagRow}>
              <Text style={styles.liveTagText}>[ IN-CABIN DISPLAY CONNECTED ]</Text>
            </View>
            <Text style={styles.greetingTitle}>Hello, {profile.fullName.split(' ')[0]}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToProfile}
            style={styles.avatarCircle}
          >
            <Text style={styles.avatarText}>{profile.avatarInitials}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ═══════ 2. HERO POINTS & BALANCE CARD ═══════ */}
        <Animated.View style={[styles.walletCard, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
          <View style={styles.walletTopRow}>
            <View>
              <Text style={styles.walletMicroLabel}>TOTAL REWARD BALANCE</Text>
              <View style={styles.pointsNumberRow}>
                <AnimatedCounter
                  value={totalPoints}
                  duration={900}
                  style={styles.pointsNumber}
                />
                <Text style={styles.pointsUnit}>PTS</Text>
              </View>
            </View>

            <View style={styles.gbpBadge}>
              <Text style={styles.gbpBadgeLabel}>ESTIMATED VALUE</Text>
              <AnimatedCounter
                value={totalGbpValue}
                prefix="£"
                decimals={2}
                duration={900}
                style={styles.gbpBadgeValue}
              />
            </View>
          </View>

          <View style={styles.walletDivider} />

          <View style={styles.walletBottomRow}>
            <Text style={styles.walletTierText}>Tier: {profile.membershipTier}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onNavigateToPoints}
              style={styles.viewPointsLink}
            >
              <Text style={styles.viewPointsLinkText}>Breakdown</Text>
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke={COLORS.teal}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ═══════ 3. SCAN HERO BANNER (PREMIUM OBSIDIAN & SAPPHIRE THEME) ═══════ */}
        <Animated.View style={{ opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }}>
          <AnimatedPressable
            onPress={onNavigateToScan}
            activeScale={0.96}
            style={styles.scanBanner}
          >
            <View style={styles.scanBannerContent}>
              <View style={styles.scanBadge}>
                <Text style={styles.scanBadgeText}>IN-CABIN SCANNER</Text>
              </View>
              <Text style={styles.scanBannerTitle}>Scan Screen Ad</Text>
              <Text style={styles.scanBannerSub}>
                Scan the in-car screen to collect points and claim voucher deals.
              </Text>
            </View>

            <View style={styles.scanIconBubble}>
              <Svg width={24} height={24} viewBox="0 0 24 24">
                <Path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
              </Svg>
            </View>
          </AnimatedPressable>
        </Animated.View>

        {/* ═══════ 4. CATEGORY HORIZONTAL FILTER ═══════ */}
        <Animated.View style={[styles.categorySection, { opacity: fadeAnim2 }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Vouchers</Text>
            <View style={styles.headerRightActions}>
              <Text style={styles.sectionCountTag}>{activeCoupons.length} ACTIVE</Text>
              {onNavigateToOffers && (
                <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToOffers} style={styles.allOffersBtn}>
                  <Text style={styles.allOffersBtnText}>Explore All Offers →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected && styles.categoryPillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* ═══════ 5. ACTIVE VOUCHER CARDS ═══════ */}
        <Animated.View style={[styles.couponsList, { opacity: fadeAnim2 }]}>
          {activeCoupons.map((coupon) => {
            const badgeStyle = CATEGORY_COLORS[coupon.category] || {
              bg: COLORS.backgroundMuted,
              text: COLORS.slate,
              border: COLORS.borderHairline,
            };

            return (
              <AnimatedPressable
                key={coupon.id}
                onPress={() => onNavigateToCouponDetail(coupon)}
                activeScale={0.97}
                style={styles.couponCard}
              >
                {/* Top Card Header */}
                <View style={styles.couponCardHeader}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border },
                    ]}
                  >
                    <Text style={[styles.categoryBadgeText, { color: badgeStyle.text }]}>
                      {coupon.category.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.pointsEarnedTag}>
                    <Text style={styles.pointsEarnedTagText}>+{coupon.pointsEarned} PTS</Text>
                  </View>
                </View>

                {/* Brand & Headline */}
                <Text style={styles.couponBrand}>{coupon.brand}</Text>
                <Text style={styles.couponHeadline} numberOfLines={2}>
                  {coupon.headline}
                </Text>

                {/* Discount & Code Bar */}
                <View style={styles.couponDiscountBar}>
                  <View style={styles.discountCol}>
                    <Text style={styles.discountAmountText}>{coupon.discount}</Text>
                    <Text style={styles.discountGbpVal}>Worth £{coupon.gbpValue.toFixed(2)} GBP</Text>
                  </View>

                  <View style={styles.codePill}>
                    <Text style={styles.codePillLabel}>CODE</Text>
                    <Text style={styles.codePillText}>{coupon.code}</Text>
                  </View>
                </View>

                {/* Footer Metadata */}
                <View style={styles.couponFooter}>
                  <Text style={styles.couponExpiry}>Expires: {coupon.expiryDate}</Text>
                  <View style={styles.viewPassLink}>
                    <Text style={styles.viewPassLinkText}>View Voucher Pass</Text>
                    <Svg width={14} height={14} viewBox="0 0 24 24">
                      <Path d="M9 18l6-6-6-6" stroke={COLORS.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                </View>
              </AnimatedPressable>
            );
          })}
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
  liveTagRow: {
    marginBottom: 4,
  },
  liveTagText: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11.5,
    letterSpacing: 1.2,
  },
  greetingTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.navy,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  walletCard: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  walletTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  walletMicroLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slateLight,
    fontSize: 11.5,
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  pointsNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  pointsNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  pointsUnit: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.teal,
    letterSpacing: 1,
  },
  gbpBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  gbpBadgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slateLight,
    letterSpacing: 1,
    marginBottom: 2,
  },
  gbpBadgeValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  walletDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 14,
  },
  walletBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletTierText: {
    fontSize: 13.5,
    color: COLORS.slateLight,
    fontWeight: '600',
  },
  viewPointsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewPointsLinkText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.teal,
  },
  scanBanner: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#3B82F6', // Electric Sapphire Accent
    ...SHADOWS.soft,
  },
  scanBannerContent: {
    flex: 1,
    marginRight: 14,
  },
  scanBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#60A5FA',
    marginBottom: 6,
  },
  scanBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#93C5FD',
    letterSpacing: 1.2,
  },
  scanBannerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  scanBannerSub: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  scanIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB', // Sapphire Blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  categorySection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  allOffersBtn: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  allOffersBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.navy,
  },
  sectionCountTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11,
    letterSpacing: 1,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundOff,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  categoryPillText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.slate,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  couponsList: {
    gap: 14,
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 18,
    ...SHADOWS.soft,
  },
  couponCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1.2,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pointsEarnedTag: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.teal,
  },
  pointsEarnedTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  couponBrand: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 4,
  },
  couponHeadline: {
    fontSize: 14.5,
    color: COLORS.slate,
    lineHeight: 20,
    marginBottom: 14,
  },
  couponDiscountBar: {
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.sm,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  discountCol: {
    flex: 1,
  },
  discountAmountText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.magenta,
  },
  discountGbpVal: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  codePill: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
  },
  codePillLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slateLight,
    letterSpacing: 0.8,
    marginBottom: 1,
  },
  codePillText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  couponExpiry: {
    fontSize: 12.5,
    color: COLORS.slateLight,
  },
  viewPassLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewPassLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
});
