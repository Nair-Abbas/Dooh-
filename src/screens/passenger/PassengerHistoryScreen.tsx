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
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { usePassenger, CouponItem, AdCategory } from '../../context/PassengerContext';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const { width: SW } = Dimensions.get('window');

interface PassengerHistoryScreenProps {
  onNavigateToCouponDetail: (coupon: CouponItem) => void;
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
  'Clean Energy': { bg: COLORS.tealLight, text: COLORS.tealDark, border: COLORS.teal },
  'Travel & Tourism': { bg: COLORS.goldLight, text: COLORS.goldWarm, border: COLORS.goldWarm },
};

export const PassengerHistoryScreen: React.FC<PassengerHistoryScreenProps> = ({
  onNavigateToCouponDetail,
}) => {
  const { coupons } = usePassenger();
  const [activeTab, setActiveTab] = useState<'claimed' | 'expired'>('claimed');
  const [selectedCategory, setSelectedCategory] = useState<'All' | AdCategory>('All');

  const filteredCoupons = coupons
    .filter((c) => c.status === activeTab)
    .filter((c) => (selectedCategory === 'All' ? true : c.category === selectedCategory));

  const claimedCount = coupons.filter((c) => c.status === 'claimed').length;
  const expiredCount = coupons.filter((c) => c.status === 'expired').length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══════ TOP HEADER (SAFE SYSTEM BAR CLEARANCE) ═══════ */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTag}>OFFER ARCHIVE & ACTIVITY</Text>
          <Text style={styles.headerTitle}>Offers & History</Text>
          <Text style={styles.headerSubtitle}>
            Review your past in-cabin advertising claims, active discounts, and expired vouchers.
          </Text>
        </View>

        {/* ═══════ SEGMENTED TABS ═══════ */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('claimed')}
            style={[
              styles.segmentBtn,
              activeTab === 'claimed' && styles.segmentBtnActive,
            ]}
          >
            <Text
              style={[
                styles.segmentBtnText,
                activeTab === 'claimed' && styles.segmentBtnTextActive,
              ]}
            >
              ACTIVE PASSES ({claimedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('expired')}
            style={[
              styles.segmentBtn,
              activeTab === 'expired' && styles.segmentBtnActive,
            ]}
          >
            <Text
              style={[
                styles.segmentBtnText,
                activeTab === 'expired' && styles.segmentBtnTextActive,
              ]}
            >
              EXPIRED ({expiredCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ═══════ CATEGORY FILTER CHIPS ═══════ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.filterBtn, isSelected && styles.filterBtnActive]}
              >
                <Text style={[styles.filterBtnText, isSelected && styles.filterBtnTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ═══════ COUPONS ARCHIVE LIST ═══════ */}
        <View style={styles.listContainer}>
          {filteredCoupons.map((coupon) => (
            <AnimatedPressable
              key={coupon.id}
              onPress={() => onNavigateToCouponDetail(coupon)}
              activeScale={0.97}
              style={styles.archiveCard}
            >
              <View style={styles.archiveCardTop}>
                <View style={styles.brandRow}>
                  <Text style={styles.brandText}>{coupon.brand}</Text>
                  <View style={styles.pointsTag}>
                    <Text style={styles.pointsTagText}>+{coupon.pointsEarned} PTS</Text>
                  </View>
                </View>
                <Text style={styles.headlineText} numberOfLines={1}>
                  {coupon.headline}
                </Text>
              </View>

              <View style={styles.archiveDivider} />

              <View style={styles.archiveCardBottom}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.discountText}>{coupon.discount}</Text>
                  <Text style={styles.locationText} numberOfLines={1}>
                    {coupon.adLocation} • {coupon.dateEarned}
                  </Text>
                </View>

                <View style={styles.viewBtn}>
                  <Text style={styles.viewBtnText}>View Pass →</Text>
                </View>
              </View>
            </AnimatedPressable>
          ))}
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.sm,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.xs,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.soft,
  },
  segmentBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.slate,
    letterSpacing: 0.8,
  },
  segmentBtnTextActive: {
    color: COLORS.navy,
    fontWeight: '900',
  },
  filterRow: {
    gap: 8,
    paddingBottom: 12,
    marginBottom: 6,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundOff,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  filterBtnActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate,
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    gap: 12,
  },
  archiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 16,
    ...SHADOWS.soft,
  },
  archiveCardTop: {
    gap: 4,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.navy,
  },
  pointsTag: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  pointsTagText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: COLORS.tealDark,
  },
  headlineText: {
    fontSize: 13.5,
    color: COLORS.slate,
  },
  archiveDivider: {
    height: 1,
    backgroundColor: COLORS.borderHairline,
    marginVertical: 12,
  },
  archiveCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: COLORS.magenta,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.slateLight,
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: COLORS.backgroundOff,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  viewBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.navy,
  },
});
