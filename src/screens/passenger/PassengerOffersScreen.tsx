import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { usePassenger, CouponItem, AdCategory } from '../../context/PassengerContext';
import { APP_IMAGES } from '../../constants/assets';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const { width: SW } = Dimensions.get('window');

interface PassengerOffersScreenProps {
  onNavigateToCouponDetail: (coupon: CouponItem) => void;
  onNavigateToScan?: () => void;
}

interface VideoAdCampaign {
  id: string;
  brand: string;
  tagline: string;
  category: AdCategory;
  headline: string;
  discount: string;
  pointsReward: number;
  promoCode: string;
  durationSeconds: number;
  themeColor: string;
  accentColor: string;
  image: any;
  videoTitle: string;
  sponsorInfo: string;
  description: string;
  perks: string[];
}

const VIDEO_AD_CAMPAIGNS: VideoAdCampaign[] = [
  {
    id: 'vad-01',
    brand: 'NEXUS DRIVE',
    tagline: 'NEXT-GEN MOBILITY',
    category: 'Mobility & EV',
    headline: 'Zero Emissions. Pure Performance.',
    discount: '£15 OFF Next Luxury Ride',
    pointsReward: 150,
    promoCode: 'NEXUS-DOOH-15',
    durationSeconds: 15,
    themeColor: '#00B4A6',
    accentColor: '#33C4B8',
    image: APP_IMAGES.vehicleDoohExterior,
    videoTitle: 'The All-Electric Executive Chauffeur Film (4K)',
    sponsorInfo: 'Exclusive In-Cabin Mobility Broadcast Sponsor',
    description: 'Experience ultra-quiet electric luxury across London. High-torque acceleration meets sustainable private hire travel.',
    perks: ['Zero congestion charges', 'Free in-cabin WiFi', 'Priority pickup guarantee'],
  },
  {
    id: 'vad-02',
    brand: 'LUMEN SOUND',
    tagline: 'SPATIAL ACOUSTICS',
    category: 'Audio & Tech',
    headline: 'Hear Every Nuance in 360° Surround',
    discount: '20% OFF Spatial Audio Gear',
    pointsReward: 200,
    promoCode: 'LUMEN-ACOUSTIC-20',
    durationSeconds: 12,
    themeColor: '#D4145A',
    accentColor: '#E84580',
    image: APP_IMAGES.inCabinPassengerDooh,
    videoTitle: 'Immersive Headphone Architecture Showcase',
    sponsorInfo: 'Official Premium Audio Partner',
    description: 'Studio-grade planar magnetic acoustics with intelligent active noise cancelling tuned for frequent commuters.',
    perks: ['Binaural room calibration', '40hr battery life', 'Aerospace aluminum build'],
  },
  {
    id: 'vad-03',
    brand: 'SOLARIS ENERGY',
    tagline: 'CLEAN CITY POWER',
    category: 'Clean Energy',
    headline: "Powering Tomorrow's Electric Transit",
    discount: 'FREE 30 Min Ultra-Fast EV Charge',
    pointsReward: 180,
    promoCode: 'SOLARIS-CHARGE-FREE',
    durationSeconds: 14,
    themeColor: '#D4A843',
    accentColor: '#E8C96B',
    image: APP_IMAGES.hero,
    videoTitle: 'Next-Generation Renewable Megawatt Hubs',
    sponsorInfo: 'Green Transit & EV Network Partner',
    description: '100% certified solar and wind electricity fueling electric fleets with 350kW liquid-cooled charging points.',
    perks: ['100% wind & solar power', 'Zero waiting times', '24/7 highway charging hubs'],
  },
  {
    id: 'vad-04',
    brand: 'AURORA TRAVEL',
    tagline: 'LUXURY RETREATS',
    category: 'Travel & Tourism',
    headline: 'Experience Kyoto Tradition & Zen Art',
    discount: '£50 Hotel Credit & VIP Lounge',
    pointsReward: 250,
    promoCode: 'AURORA-KYOTO-50',
    durationSeconds: 16,
    themeColor: '#1B2A4A',
    accentColor: '#6B7B95',
    image: APP_IMAGES.rolePassenger,
    videoTitle: 'Curated Heritage & Ryokan Journeys',
    sponsorInfo: 'Global Luxury Concierge Partner',
    description: 'Bespoke bespoke Japanese itineraries with private tea ceremonies, ryokan onsen suites, and Michelin culinary tours.',
    perks: ['Free room upgrades', 'VIP terminal lounge access', 'Personal concierge 24/7'],
  },
];

export const PassengerOffersScreen: React.FC<PassengerOffersScreenProps> = ({
  onNavigateToCouponDetail,
  onNavigateToScan,
}) => {
  const { coupons, addCustomVoucher } = usePassenger();

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [adCompleted, setAdCompleted] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState<string | null>(null);

  const currentCampaign = VIDEO_AD_CAMPAIGNS[currentAdIndex] || VIDEO_AD_CAMPAIGNS[0];
  const isCurrentClaimed = coupons.some(
    (c) => c.brand.toLowerCase() === currentCampaign.brand.toLowerCase() && c.status === 'claimed'
  );

  // Scanline & Pulse animations for the video player
  const scanSweep = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Video progress timer loop
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgressSeconds((prev) => {
          if (prev >= currentCampaign.durationSeconds) {
            setAdCompleted(true);
            return currentCampaign.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentCampaign]);

  // Handle switching ad campaign
  const handleSelectCampaign = (index: number) => {
    setCurrentAdIndex(index);
    setProgressSeconds(0);
    setAdCompleted(false);
    setIsPlaying(true);
  };

  // Video scanner sweep
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanSweep, { toValue: 1, duration: 2500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(scanSweep, { toValue: 0, duration: 2500, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [scanSweep, pulseAnim]);

  // Claim offer action
  const handleClaimOffer = (campaign: VideoAdCampaign) => {
    if (isCurrentClaimed) {
      const existing = coupons.find((c) => c.brand.toLowerCase() === campaign.brand.toLowerCase());
      if (existing) {
        onNavigateToCouponDetail(existing);
        return;
      }
    }

    const newCoupon = addCustomVoucher({
      brand: campaign.brand,
      headline: campaign.headline,
      category: campaign.category,
      discount: campaign.discount,
      code: campaign.promoCode,
      points: campaign.pointsReward,
    });

    setShowClaimSuccess(`🎉 Offer Claimed! You earned +${campaign.pointsReward} PTS and saved ${campaign.discount}!`);
    setTimeout(() => {
      setShowClaimSuccess(null);
      onNavigateToCouponDetail(newCoupon);
    }, 1800);
  };

  const progressPercentage = Math.min(100, (progressSeconds / currentCampaign.durationSeconds) * 100);
  const claimedCoupons = coupons.filter((c) => c.status === 'claimed');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════ 1. SCREEN TITLE HEADER ═══════ */}
        <View style={styles.topHeader}>
          <View style={styles.headerTagRow}>
            <View style={styles.liveBroadcastPill}>
              <Animated.View style={[styles.redLiveDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.liveBroadcastTag}>IN-CABIN AD STREAM • 4K DOOH</Text>
            </View>
            <View style={styles.activePassesBadge}>
              <Text style={styles.activePassesBadgeText}>{claimedCoupons.length} SAVED PASSES</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>Watch Ads & Unlock Offers</Text>
          <Text style={styles.headerSubtitle}>
            Watch active video broadcasts from our mobility advertising sponsors to unlock high-value vouchers & earn platform bonus points.
          </Text>
        </View>

        {/* ═══════ 2. CLAIM SUCCESS POPUP BANNER ═══════ */}
        {showClaimSuccess ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{showClaimSuccess}</Text>
          </View>
        ) : null}

        {/* ═══════ 3. CINEMATIC VIDEO AD PLAYER ═══════ */}
        <View style={styles.playerContainer}>
          {/* Top Video Bezel Bar */}
          <View style={styles.playerHeaderBar}>
            <View style={styles.channelCol}>
              <Text style={styles.channelTag}>CHANNEL {currentAdIndex + 1} / {VIDEO_AD_CAMPAIGNS.length}</Text>
              <Text style={styles.channelTitle} numberOfLines={1}>{currentCampaign.videoTitle}</Text>
            </View>
            <View style={styles.resolutionBadge}>
              <Text style={styles.resolutionText}>4K HDR 60FPS</Text>
            </View>
          </View>

          {/* Video Viewport */}
          <View style={styles.videoScreen}>
            <Image
              source={currentCampaign.image}
              style={styles.videoImage}
              resizeMode="cover"
            />

            {/* Subtle scanline animation */}
            <Animated.View
              style={[
                styles.videoScanline,
                {
                  transform: [
                    {
                      translateY: scanSweep.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 200],
                      }),
                    },
                  ],
                },
              ]}
            />

            {/* Video Top Overlay */}
            <View style={styles.videoTopOverlay}>
              <View style={[styles.brandWatermark, { backgroundColor: currentCampaign.themeColor }]}>
                <Text style={styles.brandWatermarkText}>{currentCampaign.brand}</Text>
              </View>
              <View style={styles.sponsorPill}>
                <Text style={styles.sponsorPillText}>SPONSORED</Text>
              </View>
            </View>

            {/* Video Center Play/Pause Indicator (Tap to Toggle) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsPlaying(!isPlaying)}
              style={styles.centerPlayBtnOverlay}
            >
              <View style={styles.centerPlayCircle}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  {isPlaying ? (
                    <Path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="#FFFFFF" />
                  ) : (
                    <Polygon points="5 3 19 12 5 21 5 3" fill="#FFFFFF" />
                  )}
                </Svg>
              </View>
            </TouchableOpacity>

            {/* Video Bottom HUD Overlay */}
            <View style={styles.videoBottomHUD}>
              <View style={styles.hudMetaRow}>
                <Text style={styles.hudHeadline} numberOfLines={1}>
                  {currentCampaign.headline}
                </Text>
                <Text style={styles.hudTimer}>
                  00:{progressSeconds < 10 ? `0${progressSeconds}` : progressSeconds} / 00:{currentCampaign.durationSeconds}
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: currentCampaign.themeColor,
                    },
                  ]}
                />
              </View>

              {/* Player Controls Row */}
              <View style={styles.controlsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsPlaying(!isPlaying)}
                  style={styles.controlIconBtn}
                >
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    {isPlaying ? (
                      <Path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="#FFFFFF" />
                    ) : (
                      <Polygon points="5 3 19 12 5 21 5 3" fill="#FFFFFF" />
                    )}
                  </Svg>
                  <Text style={styles.controlBtnText}>{isPlaying ? 'Pause' : 'Play'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsMuted(!isMuted)}
                  style={styles.controlIconBtn}
                >
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path
                      d={isMuted ? "M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" : "M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </Svg>
                  <Text style={styles.controlBtnText}>{isMuted ? 'Muted' : 'Sound On'}</Text>
                </TouchableOpacity>

                <View style={styles.rewardTagSmall}>
                  <Text style={styles.rewardTagSmallText}>+{currentCampaign.pointsReward} PTS</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ═══════ 4. UNLOCKED OFFER CTA CARD ═══════ */}
        <View style={styles.activeOfferCard}>
          <View style={styles.offerCardTop}>
            <View style={styles.badgeCategoryRow}>
              <View style={[styles.categoryTag, { backgroundColor: currentCampaign.themeColor + '18' }]}>
                <Text style={[styles.categoryTagText, { color: currentCampaign.themeColor }]}>
                  {currentCampaign.category.toUpperCase()}
                </Text>
              </View>
              <View style={styles.sponsoredTag}>
                <Text style={styles.sponsoredTagText}>{currentCampaign.tagline}</Text>
              </View>
            </View>

            <Text style={styles.brandTitleBig}>{currentCampaign.brand}</Text>
            <Text style={styles.discountBig}>{currentCampaign.discount}</Text>
            <Text style={styles.offerDesc}>{currentCampaign.description}</Text>
          </View>

          {/* Perks Bullet Points */}
          <View style={styles.perksContainer}>
            {currentCampaign.perks.map((perk, i) => (
              <View key={i} style={styles.perkRow}>
                <Text style={[styles.perkDot, { color: currentCampaign.themeColor }]}>✓</Text>
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>

          {/* Promo Code & Action Box */}
          <View style={styles.promoActionContainer}>
            <View style={styles.promoCodeSnippet}>
              <Text style={styles.promoCodeKey}>PROMO CODE</Text>
              <Text style={styles.promoCodeVal}>{currentCampaign.promoCode}</Text>
            </View>

            {isCurrentClaimed ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  const existing = coupons.find((c) => c.brand.toLowerCase() === currentCampaign.brand.toLowerCase());
                  if (existing) onNavigateToCouponDetail(existing);
                }}
                style={styles.viewExistingPassBtn}
              >
                <Text style={styles.viewExistingPassBtnText}>✓ Pass Claimed • View Voucher →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => handleClaimOffer(currentCampaign)}
                style={[styles.claimAdOfferBtn, { backgroundColor: COLORS.navy }]}
              >
                <View style={styles.claimBtnInner}>
                  <Text style={styles.claimAdOfferBtnText}>
                    {adCompleted ? '🎉 Claim Exclusive Offer' : 'Watch Ad & Avail Offer'}
                  </Text>
                  <Text style={styles.claimPtsBonus}>+{currentCampaign.pointsReward} PTS</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ═══════ 5. UP NEXT AD CHANNELS PLAYLIST ═══════ */}
        <View style={styles.playlistSection}>
          <View style={styles.playlistHeaderRow}>
            <Text style={styles.playlistSectionTitle}>Up Next In-Cabin Ads</Text>
            <Text style={styles.playlistCountTag}>{VIDEO_AD_CAMPAIGNS.length} AD CHANNELS</Text>
          </View>

          <View style={styles.playlistCardsList}>
            {VIDEO_AD_CAMPAIGNS.map((campaign, idx) => {
              const isSelected = idx === currentAdIndex;
              const isClaimed = coupons.some(
                (c) => c.brand.toLowerCase() === campaign.brand.toLowerCase() && c.status === 'claimed'
              );

              return (
                <AnimatedPressable
                  key={campaign.id}
                  onPress={() => handleSelectCampaign(idx)}
                  activeScale={0.97}
                  style={[
                    styles.playlistCard,
                    isSelected && styles.playlistCardActive,
                  ]}
                >
                  <View style={styles.playlistThumbWrapper}>
                    <Image source={campaign.image} style={styles.playlistThumb} />
                    <View style={styles.playlistPlayOverlay}>
                      <Svg width={14} height={14} viewBox="0 0 24 24">
                        <Polygon points="5 3 19 12 5 21 5 3" fill="#FFFFFF" />
                      </Svg>
                    </View>
                  </View>

                  <View style={styles.playlistMetaCol}>
                    <View style={styles.playlistBrandRow}>
                      <Text style={[styles.playlistBrandText, isSelected && { color: COLORS.navy }]}>
                        {campaign.brand}
                      </Text>
                      {isSelected ? (
                        <View style={styles.nowPlayingTag}>
                          <Text style={styles.nowPlayingTagText}>NOW PLAYING</Text>
                        </View>
                      ) : isClaimed ? (
                        <View style={styles.claimedTagSmall}>
                          <Text style={styles.claimedTagSmallText}>CLAIMED</Text>
                        </View>
                      ) : (
                        <View style={styles.pointsTagSmall}>
                          <Text style={styles.pointsTagSmallText}>+{campaign.pointsReward} PTS</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.playlistHeadline} numberOfLines={1}>
                      {campaign.headline}
                    </Text>

                    <Text style={styles.playlistDiscount} numberOfLines={1}>
                      {campaign.discount}
                    </Text>
                  </View>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        {/* ═══════ 6. SAVED VOUCHERS QUICK ACCESS ═══════ */}
        {claimedCoupons.length > 0 && (
          <View style={styles.savedVouchersSection}>
            <View style={styles.playlistHeaderRow}>
              <Text style={styles.playlistSectionTitle}>My Saved Voucher Passes</Text>
              <Text style={styles.playlistCountTag}>{claimedCoupons.length} ACTIVE</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedCouponsScroll}>
              {claimedCoupons.map((coupon) => (
                <TouchableOpacity
                  key={coupon.id}
                  activeOpacity={0.8}
                  onPress={() => onNavigateToCouponDetail(coupon)}
                  style={styles.savedCouponPillCard}
                >
                  <View style={styles.savedCouponTop}>
                    <Text style={styles.savedCouponBrand}>{coupon.brand}</Text>
                    <Text style={styles.savedCouponCode}>{coupon.code}</Text>
                  </View>
                  <Text style={styles.savedCouponDiscount}>{coupon.discount}</Text>
                  <Text style={styles.savedCouponView}>Open Voucher →</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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
    paddingBottom: 36,
  },
  topHeader: {
    marginBottom: 16,
  },
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  liveBroadcastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundOff,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  redLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  liveBroadcastTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 9.5,
    letterSpacing: 1.2,
  },
  activePassesBadge: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  activePassesBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: COLORS.tealDark,
    letterSpacing: 0.8,
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
    fontSize: 13.5,
    color: COLORS.slate,
    lineHeight: 19,
  },
  successBanner: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 14,
    ...SHADOWS.medium,
  },
  successBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  playerContainer: {
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#334155',
    ...SHADOWS.medium,
  },
  playerHeaderBar: {
    backgroundColor: '#020617',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  channelCol: {
    flex: 1,
  },
  channelTag: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  channelTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 1,
  },
  resolutionBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resolutionText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.goldWarm,
    letterSpacing: 0.8,
  },
  videoScreen: {
    height: 220,
    position: 'relative',
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  videoImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.88,
  },
  videoScanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  videoTopOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    zIndex: 10,
  },
  brandWatermark: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  brandWatermarkText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  sponsorPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sponsorPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  centerPlayBtnOverlay: {
    alignSelf: 'center',
    zIndex: 20,
  },
  centerPlayCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBottomHUD: {
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    zIndex: 10,
  },
  hudMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hudHeadline: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    flex: 1,
    marginRight: 8,
  },
  hudTimer: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  controlIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  controlBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  rewardTagSmall: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  rewardTagSmallText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  activeOfferCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 18,
    marginBottom: 22,
    gap: 12,
    ...SHADOWS.soft,
  },
  offerCardTop: {
    gap: 4,
  },
  badgeCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  categoryTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  sponsoredTag: {
    backgroundColor: COLORS.backgroundOff,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  sponsoredTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
  },
  brandTitleBig: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.navy,
  },
  discountBig: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.magenta,
    marginVertical: 2,
  },
  offerDesc: {
    fontSize: 13,
    color: COLORS.slate,
    lineHeight: 18,
  },
  perksContainer: {
    gap: 6,
    backgroundColor: COLORS.backgroundOff,
    padding: 12,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkDot: {
    fontSize: 13,
    fontWeight: '900',
  },
  perkText: {
    fontSize: 12.5,
    color: COLORS.navy,
    fontWeight: '600',
  },
  promoActionContainer: {
    gap: 10,
    marginTop: 4,
  },
  promoCodeSnippet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
  },
  promoCodeKey: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slateLight,
    letterSpacing: 1,
  },
  promoCodeVal: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 1,
  },
  claimAdOfferBtn: {
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  claimBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  claimAdOfferBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  claimPtsBonus: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  viewExistingPassBtn: {
    backgroundColor: COLORS.tealLight,
    borderWidth: 1,
    borderColor: COLORS.teal,
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewExistingPassBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  playlistSection: {
    marginBottom: 24,
    gap: 12,
  },
  playlistHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playlistSectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.navy,
  },
  playlistCountTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11,
    letterSpacing: 1,
  },
  playlistCardsList: {
    gap: 10,
  },
  playlistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.soft,
  },
  playlistCardActive: {
    borderColor: COLORS.navy,
    borderWidth: 1.5,
    backgroundColor: '#F8FAFC',
  },
  playlistThumbWrapper: {
    width: 72,
    height: 54,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    position: 'relative',
  },
  playlistThumb: {
    width: '100%',
    height: '100%',
  },
  playlistPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistMetaCol: {
    flex: 1,
    gap: 2,
  },
  playlistBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playlistBrandText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.slate,
  },
  nowPlayingTag: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  nowPlayingTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  claimedTagSmall: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  claimedTagSmallText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: COLORS.tealDark,
  },
  pointsTagSmall: {
    backgroundColor: COLORS.backgroundOff,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  pointsTagSmallText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: COLORS.slate,
  },
  playlistHeadline: {
    fontSize: 12,
    color: COLORS.slateLight,
  },
  playlistDiscount: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.magenta,
  },
  savedVouchersSection: {
    gap: 12,
  },
  savedCouponsScroll: {
    gap: 10,
    paddingBottom: 6,
  },
  savedCouponPillCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 14,
    width: SW * 0.65,
    gap: 4,
    ...SHADOWS.soft,
  },
  savedCouponTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedCouponBrand: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.navy,
  },
  savedCouponCode: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.tealDark,
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  savedCouponDiscount: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.magenta,
  },
  savedCouponView: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 4,
  },
});
