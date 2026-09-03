import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { usePassenger, CouponItem } from '../../context/PassengerContext';
import { DOOH_INTRO_CAMPAIGNS, DoohAdCampaign } from '../../constants/assets';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const { width: SW } = Dimensions.get('window');

interface PassengerScanScreenProps {
  onBack?: () => void;
  onNavigateToCouponDetail?: (coupon: CouponItem) => void;
}

export const PassengerScanScreen: React.FC<PassengerScanScreenProps> = ({
  onBack,
  onNavigateToCouponDetail,
}) => {
  const { claimScanReward } = usePassenger();
  const [torchOn, setTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [detectedCampaign, setDetectedCampaign] = useState<DoohAdCampaign>(DOOH_INTRO_CAMPAIGNS[0]);
  const [claimedCoupon, setClaimedCoupon] = useState<CouponItem | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Laser scanner animation
  const laserAnim = useRef(new Animated.Value(0)).current;
  const reticlePulse = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Smooth, prominent laser scan sweep
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Corner reticle breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(reticlePulse, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(reticlePulse, { toValue: 0.95, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [laserAnim, reticlePulse]);

  const handleSimulateScan = (campaign: DoohAdCampaign) => {
    setIsScanning(false);
    setDetectedCampaign(campaign);

    const coupon = claimScanReward({
      brand: campaign.brand,
      headline: campaign.headline,
      category: campaign.category,
      discount: `${campaign.brand.split(' ')[0]} Pass - £${(campaign.pointsReward * 0.01).toFixed(0)} OFF`,
      points: campaign.pointsReward,
      themeColor: COLORS.navy,
    });

    setClaimedCoupon(coupon);
    modalScale.setValue(0.7);
    setShowSuccessModal(true);

    Animated.spring(modalScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const handleScanAnother = () => {
    setShowSuccessModal(false);
    setIsScanning(true);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#060B18" />

      {/* ═══════ 1. TOP VIEWFINDER HEADER (NO AWKWARD TOP VOID) ═══════ */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.headerBtn}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M15 19l-7-7 7-7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>IN-CABIN SCANNER</Text>
          <Text style={styles.headerSubtitle}>Align camera with in-car QR code</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setTorchOn(!torchOn)}
          style={[styles.headerBtn, torchOn && styles.headerBtnActive]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={torchOn ? COLORS.navy : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* ═══════ 2. SCANNER VIEWFINDER ═══════ */}
      <View style={styles.scannerContainer}>
        <Animated.View style={[styles.viewfinderBox, { transform: [{ scale: reticlePulse }] }]}>
          {/* Corner Reticles */}
          <View style={styles.reticleTL} />
          <View style={styles.reticleTR} />
          <View style={styles.reticleBL} />
          <View style={styles.reticleBR} />

          {/* Animated Laser Bar (Teal Glow) */}
          {isScanning && (
            <Animated.View
              style={[
                styles.laserLine,
                {
                  transform: [
                    {
                      translateY: laserAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [15, 225],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.laserCore} />
              <View style={styles.laserGlow} />
            </Animated.View>
          )}

          {/* Center Target Indicator */}
          <View style={styles.centerTarget}>
            <View style={styles.centerCrossH} />
            <View style={styles.centerCrossV} />
          </View>
        </Animated.View>

        <Text style={styles.scannerHint}>
          Point camera at the in-car screen to claim deals
        </Text>
      </View>

      {/* ═══════ 3. IN-CABIN BROADCAST SIMULATOR ═══════ */}
      <View style={styles.broadcastFeedSection}>
        <View style={styles.feedHeaderRow}>
          <Text style={styles.feedTagText}>[ LIVE AD CAMPAIGNS ]</Text>
          <Text style={styles.feedTapText}>Tap to scan ↓</Text>
        </View>

        <View style={styles.campaignsList}>
          {DOOH_INTRO_CAMPAIGNS.map((camp, idx) => (
            <AnimatedPressable
              key={idx}
              onPress={() => handleSimulateScan(camp)}
              activeScale={0.96}
              style={styles.campaignItemCard}
            >
              <View style={styles.campaignLeft}>
                <View style={styles.campaignBadge}>
                  <Text style={styles.campaignBadgeText}>SCREEN #{idx + 1}</Text>
                </View>
                <Text style={styles.campaignBrandText}>{camp.brand}</Text>
                <Text style={styles.campaignHeadlineText} numberOfLines={1}>
                  {camp.headline}
                </Text>
              </View>

              <View style={styles.campaignRight}>
                <View style={styles.pointsPill}>
                  <Text style={styles.pointsPillText}>+{camp.pointsReward} PTS</Text>
                </View>
                <Text style={styles.scanCtaText}>Instant Scan →</Text>
              </View>
            </AnimatedPressable>
          ))}
        </View>
      </View>

      {/* ═══════ 4. REWARD UNLOCKED MODAL ═══════ */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Animated.View style={[styles.successCard, { transform: [{ scale: modalScale }] }]}>
            {/* Top Reward Icon */}
            <View style={styles.rewardIconBubble}>
              <Svg width={34} height={34} viewBox="0 0 24 24">
                <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={COLORS.goldWarm} strokeWidth="2" fill={COLORS.goldLight} />
              </Svg>
            </View>

            <Text style={styles.successTag}>[ REWARD UNLOCKED ]</Text>
            <Text style={styles.successBrandTitle}>{detectedCampaign.brand}</Text>
            <Text style={styles.successHeadline}>{detectedCampaign.headline}</Text>

            {/* Points & Discount Banner */}
            <View style={styles.unlockedBox}>
              <View style={styles.pointsEarnedBig}>
                <Text style={styles.pointsValBig}>+{detectedCampaign.pointsReward}</Text>
                <Text style={styles.pointsSubBig}>POINTS ADDED TO WALLET</Text>
              </View>

              <View style={styles.couponDivider} />

              <View style={styles.unlockedCodeRow}>
                <Text style={styles.unlockedCodeLabel}>VOUCHER CODE</Text>
                <Text style={styles.unlockedCodeVal}>{claimedCoupon?.code || 'DOOH-PASS'}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <AnimatedPressable
                onPress={() => {
                  setShowSuccessModal(false);
                  if (claimedCoupon && onNavigateToCouponDetail) {
                    onNavigateToCouponDetail(claimedCoupon);
                  }
                }}
                activeScale={0.96}
                style={styles.viewPassBtn}
              >
                <Text style={styles.viewPassBtnText}>View Voucher Pass</Text>
              </AnimatedPressable>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleScanAnother}
                style={styles.scanAgainBtn}
              >
                <Text style={styles.scanAgainBtnText}>Scan Another Display</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: SAFE_TOP_PADDING,
    paddingBottom: 14,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnActive: {
    backgroundColor: COLORS.teal,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.slateLight,
    marginTop: 2,
  },
  scannerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewfinderBox: {
    width: SW * 0.72,
    height: SW * 0.72,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reticleTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 24,
    height: 24,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderColor: '#38BDF8', // Cyber Cyan / Electric Sapphire
    borderTopLeftRadius: 6,
  },
  reticleTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderColor: '#38BDF8',
    borderTopRightRadius: 6,
  },
  reticleBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderColor: '#38BDF8',
    borderBottomLeftRadius: 6,
  },
  reticleBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderColor: '#38BDF8',
    borderBottomRightRadius: 6,
  },
  laserLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  laserCore: {
    width: '100%',
    height: 3,
    backgroundColor: '#38BDF8',
    borderRadius: 1.5,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  laserGlow: {
    position: 'absolute',
    width: '100%',
    height: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: 7,
  },
  centerTarget: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCrossH: {
    width: 14,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  centerCrossV: {
    position: 'absolute',
    width: 1.5,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  scannerHint: {
    fontSize: 13,
    color: COLORS.slateLight,
    marginTop: 10,
  },
  broadcastFeedSection: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    ...SHADOWS.elevated,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedTagText: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    fontSize: 11.5,
    letterSpacing: 1.2,
  },
  feedTapText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  campaignsList: {
    gap: 10,
  },
  campaignItemCard: {
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
  campaignLeft: {
    flex: 1,
    marginRight: 10,
  },
  campaignBadge: {
    backgroundColor: COLORS.backgroundOff,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  campaignBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
  },
  campaignBrandText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 2,
  },
  campaignHeadlineText: {
    fontSize: 13,
    color: COLORS.slate,
  },
  campaignRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pointsPill: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  pointsPillText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.tealDark,
  },
  scanCtaText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 11, 24, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.elevated,
  },
  rewardIconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.goldWarm,
  },
  successTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  successBrandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 4,
  },
  successHeadline: {
    fontSize: 14,
    color: COLORS.slate,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  unlockedBox: {
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.md,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    marginBottom: 20,
  },
  pointsEarnedBig: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  pointsValBig: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.tealDark,
    letterSpacing: -0.5,
  },
  pointsSubBig: {
    ...TYPOGRAPHY.microTag,
    fontSize: 10.5,
    color: COLORS.slate,
    letterSpacing: 1,
    marginTop: 3,
  },
  couponDivider: {
    height: 1,
    backgroundColor: COLORS.borderHairline,
    marginVertical: 10,
  },
  unlockedCodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  unlockedCodeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
  },
  unlockedCodeVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 1.5,
  },
  modalActions: {
    width: '100%',
    gap: 10,
  },
  viewPassBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  viewPassBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scanAgainBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  scanAgainBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.slate,
  },
});
