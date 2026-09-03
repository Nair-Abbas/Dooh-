import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { CouponItem, usePassenger } from '../../context/PassengerContext';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

interface PassengerCouponDetailScreenProps {
  coupon: CouponItem;
  onBack: () => void;
}

export const PassengerCouponDetailScreen: React.FC<PassengerCouponDetailScreenProps> = ({
  coupon,
  onBack,
}) => {
  const { redeemCoupon, deleteCoupon } = usePassenger();
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const copyScale = useRef(new Animated.Value(1)).current;

  const isRedeemed = coupon.status === 'redeemed';
  const isExpired = coupon.status === 'expired';

  const handleCopyCode = () => {
    setCopied(true);

    // Spring pop animation
    Animated.sequence([
      Animated.spring(copyScale, { toValue: 1.08, friction: 4, useNativeDriver: true }),
      Animated.spring(copyScale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmRedeem = () => {
    redeemCoupon(coupon.id);
    setShowRedeemModal(false);
  };

  const handleConfirmDelete = () => {
    deleteCoupon(coupon.id);
    setShowDeleteModal(false);
    onBack();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use my DOOH voucher code: ${coupon.code} for ${coupon.discount}!`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ═══════ TOP NAV (CLEAN TOP SPACING) ═══════ */}
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M15 19l-7-7 7-7" stroke={COLORS.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>VOUCHER PASS</Text>

        <TouchableOpacity activeOpacity={0.7} onPress={handleShare} style={styles.backBtn}>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke={COLORS.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══════ VOUCHER PASS TICKET ═══════ */}
        <View style={styles.ticketCard}>
          {/* Top Brand Banner */}
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.ticketBrandTag}>{coupon.category.toUpperCase()}</Text>
              <Text style={styles.ticketBrandTitle}>{coupon.brand}</Text>
            </View>
            <View style={styles.ticketPointsBubble}>
              <Text style={styles.ticketPointsVal}>+{coupon.pointsEarned}</Text>
              <Text style={styles.ticketPointsSub}>PTS</Text>
            </View>
          </View>

          {/* Ticket Body */}
          <View style={styles.ticketBody}>
            <Text style={styles.ticketDiscountText}>{coupon.discount}</Text>
            <Text style={styles.ticketHeadlineText}>{coupon.headline}</Text>

            {/* Value & Status row */}
            <View style={styles.valueRow}>
              <View style={styles.valueCol}>
                <Text style={styles.valueColLabel}>DISCOUNT VALUE</Text>
                <Text style={styles.valueColNumber}>£{coupon.gbpValue.toFixed(2)} GBP</Text>
              </View>
              <View style={styles.valueCol}>
                <Text style={styles.valueColLabel}>STATUS</Text>
                <Text style={[styles.statusText, isRedeemed && { color: COLORS.slate }]}>
                  {coupon.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Perforated divider */}
            <View style={styles.perforatedLine} />

            {/* Code Box with Spring Animation */}
            <Animated.View style={[styles.codeContainer, { transform: [{ scale: copyScale }] }]}>
              <Text style={styles.codeBoxLabel}>PROMO CODE</Text>
              <Text style={styles.codeBoxValue}>{coupon.code}</Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCopyCode}
                style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
              >
                <Text style={[styles.copyBtnText, copied && styles.copyBtnTextSuccess]}>
                  {copied ? 'COPIED TO CLIPBOARD ✓' : 'TAP TO COPY CODE'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* ═══════ CRUD ACTION CONTROLS ═══════ */}
        <View style={styles.crudActionRow}>
          {!isRedeemed && !isExpired && (
            <AnimatedPressable
              onPress={() => setShowRedeemModal(true)}
              activeScale={0.96}
              style={styles.redeemBtn}
            >
              <Text style={styles.redeemBtnText}>✓ Mark as Redeemed</Text>
            </AnimatedPressable>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowDeleteModal(true)}
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteBtnText}>🗑 Delete Voucher</Text>
          </TouchableOpacity>
        </View>

        {/* ═══════ REDEMPTION INSTRUCTIONS ═══════ */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionHeading}>HOW TO REDEEM</Text>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>01</Text>
            <Text style={styles.stepText}>
              Copy your unique promo code from the voucher card above.
            </Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>02</Text>
            <Text style={styles.stepText}>
              Visit <Text style={{ fontWeight: '800' }}>{coupon.brand}</Text> website or show this digital pass in-store at checkout.
            </Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>03</Text>
            <Text style={styles.stepText}>
              Discount is applied instantly to your booking or order.
            </Text>
          </View>
        </View>

        {/* ═══════ METADATA AUDIT ═══════ */}
        <View style={styles.auditCard}>
          <View style={styles.auditRow}>
            <Text style={styles.auditKey}>Scan Location:</Text>
            <Text style={styles.auditVal}>{coupon.adLocation}</Text>
          </View>
          <View style={styles.auditRow}>
            <Text style={styles.auditKey}>Date Earned:</Text>
            <Text style={styles.auditVal}>{coupon.dateEarned}</Text>
          </View>
          <View style={[styles.auditRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.auditKey}>Valid Until:</Text>
            <Text style={styles.auditVal}>{coupon.expiryDate}</Text>
          </View>
        </View>

        {/* Return Button */}
        <AnimatedPressable
          onPress={onBack}
          activeScale={0.97}
          style={styles.doneBtn}
        >
          <Text style={styles.doneBtnText}>Return to Rewards Wallet</Text>
        </AnimatedPressable>
      </ScrollView>

      {/* ═══════ REDEEM CONFIRMATION MODAL ═══════ */}
      <Modal
        visible={showRedeemModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRedeemModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mark Voucher as Used?</Text>
            <Text style={styles.modalSub}>
              This will update your voucher pass status to 'REDEEMED' in your wallet.
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowRedeemModal(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmRedeem}
                style={styles.modalRedeemConfirmBtn}
              >
                <Text style={styles.modalRedeemConfirmText}>Yes, Mark Redeemed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ═══════ DELETE CONFIRMATION MODAL ═══════ */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Voucher?</Text>
            <Text style={styles.modalSub}>
              Are you sure you want to permanently remove {coupon.brand} ({coupon.code}) from your wallet?
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDeleteModal(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmDelete}
                style={styles.modalDeleteConfirmBtn}
              >
                <Text style={styles.modalDeleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: SAFE_TOP_PADDING,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    ...SHADOWS.soft,
  },
  topBarTitle: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    letterSpacing: 1.5,
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  ticketHeader: {
    backgroundColor: COLORS.navy,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketBrandTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.teal,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  ticketBrandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ticketPointsBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  ticketPointsVal: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.teal,
  },
  ticketPointsSub: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slateLight,
    letterSpacing: 0.8,
  },
  ticketBody: {
    padding: 20,
  },
  ticketDiscountText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.magenta,
    marginBottom: 4,
  },
  ticketHeadlineText: {
    fontSize: 14.5,
    color: COLORS.slate,
    lineHeight: 20,
    marginBottom: 16,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundOff,
    padding: 14,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  valueCol: {
    gap: 2,
  },
  valueColLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 1,
  },
  valueColNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.navy,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.tealDark,
  },
  perforatedLine: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    marginVertical: 18,
  },
  codeContainer: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    padding: 18,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  codeBoxLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slateLight,
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  codeBoxValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 14,
  },
  copyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    width: '100%',
    alignItems: 'center',
  },
  copyBtnSuccess: {
    backgroundColor: COLORS.teal,
  },
  copyBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  copyBtnTextSuccess: {
    color: COLORS.navy,
  },
  crudActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  redeemBtn: {
    flex: 1.5,
    backgroundColor: COLORS.teal,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  redeemBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.navy,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.error,
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    marginBottom: 16,
    gap: 12,
    ...SHADOWS.soft,
  },
  instructionHeading: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11.5,
    letterSpacing: 1.5,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.tealDark,
    width: 22,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.slate,
    lineHeight: 20,
  },
  auditCard: {
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    marginBottom: 20,
  },
  auditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderHairline,
  },
  auditKey: {
    fontSize: 13,
    color: COLORS.slate,
  },
  auditVal: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.navy,
  },
  doneBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 11, 24, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 24,
    width: '100%',
    ...SHADOWS.elevated,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    color: COLORS.slate,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate,
  },
  modalRedeemConfirmBtn: {
    flex: 1.5,
    backgroundColor: COLORS.teal,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalRedeemConfirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  modalDeleteConfirmBtn: {
    flex: 1,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalDeleteConfirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
