import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Image,
  Easing,
  StatusBar,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { APP_IMAGES } from '../../constants/assets';

const { width: SW, height: SH } = Dimensions.get('window');

interface DriverOnboardingScreenProps {
  onComplete: () => void;
}

export const DriverOnboardingScreen: React.FC<DriverOnboardingScreenProps> = ({
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Interactive Simulation States
  const [isDemoOnline, setIsDemoOnline] = useState(true);
  const [isSurgeMode, setIsSurgeMode] = useState(false);
  const [hasTriggeredPayout, setHasTriggeredPayout] = useState(false);

  // Animations (Alive & Cinematic)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const imageZoom = useRef(new Animated.Value(1.0)).current;
  const badgePop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ambient radar pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.14,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle continuous camera zoom
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageZoom, {
          toValue: 1.06,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(imageZoom, {
          toValue: 1.0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, floatAnim, imageZoom]);

  const handleToggleOnline = () => {
    setIsDemoOnline(!isDemoOnline);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleToggleSurge = () => {
    setIsSurgeMode(!isSurgeMode);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleTriggerPayout = () => {
    setHasTriggeredPayout(true);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const slides = [
    {
      id: '1',
      step: '01 / 03',
      tag: 'IN-CABIN TELEMETRY',
      tagColor: '#10B981',
      title: 'Keep Screen Active',
      desc: 'Keep your in-vehicle DOOH screen powered on to automatically stream brand ad loops.',
      image: APP_IMAGES.roleDriver,
      floatingBadge: isDemoOnline ? '🟢 5G Connected' : '⚪ Standby Mode',
      floatingColor: isDemoOnline ? '#10B981' : '#94A3B8',
      interactiveAction: handleToggleOnline,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={[styles.hudLiveBadge, { borderColor: isDemoOnline ? '#10B981' : '#64748B' }]}>
              <View style={[styles.hudLiveDot, { backgroundColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />
              <Text style={[styles.hudLiveText, { color: isDemoOnline ? '#10B981' : '#94A3B8' }]}>
                {isDemoOnline ? 'DUAL DISPLAYS ONLINE' : 'SCREENS ASLEEP'}
              </Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>1080P • 60 FPS</Text>
            </View>
          </View>

          {/* Center Screen Mirror Frame */}
          <View style={[styles.centerTabletFrame, { borderColor: isDemoOnline ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.2)' }]}>
            <View style={[styles.cornerBracket, styles.cornerTL, { borderColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />
            <View style={[styles.cornerBracket, styles.cornerTR, { borderColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />
            <View style={[styles.cornerBracket, styles.cornerBL, { borderColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />
            <View style={[styles.cornerBracket, styles.cornerBR, { borderColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />
            
            <View style={[styles.channelBannerPill, { backgroundColor: isDemoOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 0, 0, 0.6)' }]}>
              <Text style={styles.channelBannerText}>
                {isDemoOnline ? '⚡ Broadcast Loop Active • Verified Impressions' : '💤 Tap image to wake screens & start earning'}
              </Text>
            </View>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {isDemoOnline ? '🟢 Connected • Tap image to toggle standby' : '⚪ Standby • Tap image to activate'}
            </Text>
          </View>
        </View>
      ),
      bullet1: { icon: '⚡', title: 'Auto Power-On', text: 'Connects to your 12V vehicle port automatically' },
      bullet2: { icon: '📡', title: 'Live Telemetry', text: 'Real-time heartbeat verifies passenger impressions' },
    },
    {
      id: '2',
      step: '02 / 03',
      tag: 'GEO AD ENGINE',
      tagColor: '#00E5FF',
      title: 'Drive & Stream Ads',
      desc: 'Location-targeted brand campaigns play automatically with zero driver effort required.',
      image: APP_IMAGES.vehicleDoohExterior,
      floatingBadge: isSurgeMode ? '🔥 1.4x Surge Zone' : '📍 Standard Route',
      floatingColor: isSurgeMode ? '#FF2D78' : '#00E5FF',
      interactiveAction: handleToggleSurge,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={[styles.hudLiveBadge, { backgroundColor: 'rgba(0, 229, 255, 0.2)', borderColor: '#00E5FF' }]}>
              <View style={styles.hudLiveDot} />
              <Text style={styles.hudLiveText}>GPS GEO-TARGETING</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>{isSurgeMode ? 'SURGE 1.4X' : 'STANDARD'}</Text>
            </View>
          </View>

          {/* Geo Radar Frame */}
          <View style={[styles.centerTabletFrame, { borderColor: isSurgeMode ? 'rgba(255, 45, 120, 0.6)' : 'rgba(0, 229, 255, 0.4)' }]}>
            <View style={[styles.channelBannerPill, { backgroundColor: isSurgeMode ? 'rgba(255, 45, 120, 0.3)' : 'rgba(0, 229, 255, 0.2)' }]}>
              <Text style={styles.channelBannerText}>
                {isSurgeMode ? '🔥 Commercial Hotspot Active (+40% Boost)' : '🗺️ Central City Transit Route (Auto-Streaming)'}
              </Text>
            </View>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>👆 Tap image to simulate entering a Surge Zone</Text>
          </View>
        </View>
      ),
      bullet1: { icon: '🗺️', title: 'Smart Targeting', text: 'Campaigns match high-traffic commercial zones' },
      bullet2: { icon: '🚀', title: 'Zero Distraction', text: 'Runs in full background while you focus on driving' },
    },
    {
      id: '3',
      step: '03 / 03',
      tag: 'DIRECT PAYOUTS',
      tagColor: '#FFB800',
      title: 'Track Daily Earnings',
      desc: 'Earn verified cash per passenger trip and withdraw straight to your bank account.',
      image: APP_IMAGES.safariInCabin,
      floatingBadge: hasTriggeredPayout ? '✓ £18.50 Paid Out!' : 'Available: £18.50',
      floatingColor: '#FFB800',
      interactiveAction: handleTriggerPayout,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={[styles.hudLiveBadge, { backgroundColor: 'rgba(255, 184, 0, 0.25)', borderColor: '#FFB800' }]}>
              <View style={[styles.hudLiveDot, { backgroundColor: '#FFB800' }]} />
              <Text style={[styles.hudLiveText, { color: '#FFE494' }]}>DIRECT REVENUE</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>WEEKLY 0% FEE</Text>
            </View>
          </View>

          {/* Earnings Card */}
          <View style={styles.rewardsGoldCard}>
            <View style={[styles.coinCircle, { backgroundColor: 'rgba(16, 185, 129, 0.25)' }]}>
              <Text style={{ fontSize: 18 }}>💷</Text>
            </View>
            <View>
              <Text style={styles.rewardsBalanceLabel}>PAYOUT BALANCE</Text>
              <Text style={styles.rewardsBalanceValue}>
                £18.50 <Text style={[styles.rewardsGbpVal, { color: '#10B981' }]}>{hasTriggeredPayout ? '• Transferred ✓' : '• Ready to withdraw'}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {hasTriggeredPayout ? '✓ Transferred £18.50 to Bank Account' : '👆 Tap image to simulate 1-click payout'}
            </Text>
          </View>
        </View>
      ),
      bullet1: { icon: '📊', title: 'Live Tracking', text: 'Hourly impression count and trip revenue' },
      bullet2: { icon: '🏦', title: '0% Fees', text: 'Automatic weekly direct bank deposit' },
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SW);
    if (index >= 0 && index < slides.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onComplete();
    }
  };

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={styles.slideContainer}>
      {/* ── CINEMATIC PHOTO HERO BOX ── */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={item.interactiveAction}
        style={styles.heroBox}
      >
        {/* Animated Background Photo with Zoom */}
        <Animated.Image
          source={item.image}
          style={[
            styles.heroPhoto,
            {
              transform: [{ scale: imageZoom }],
            },
          ]}
          resizeMode="cover"
        />

        {/* Dark Vignette Overlay */}
        <View style={styles.vignetteOverlay} />

        {/* Floating Tag */}
        <View style={[styles.floatingTagPill, { borderColor: item.tagColor }]}>
          <Text style={[styles.floatingTagText, { color: item.tagColor }]}>{item.tag}</Text>
        </View>

        {/* Floating Animated Interactive Pill */}
        <Animated.View
          style={[
            styles.floatingActionBadge,
            {
              transform: [{ translateY: floatAnim }, { scale: badgePop }],
              borderColor: item.floatingColor,
            },
          ]}
        >
          <Text style={[styles.floatingActionText, { color: item.floatingColor }]}>
            {item.floatingBadge}
          </Text>
        </Animated.View>

        {/* Interactive HUD Layer */}
        {item.overlayHUD}
      </TouchableOpacity>

      {/* ── CLEAN PUNCHY 1-SENTENCE HEADINGS ── */}
      <View style={styles.infoBox}>
        <View style={styles.stepBadgeRow}>
          <Text style={[styles.stepNumberText, { color: item.tagColor }]}>{item.step}</Text>
          <View style={[styles.stepLine, { backgroundColor: item.tagColor }]} />
        </View>

        <Text style={styles.mainTitle}>{item.title}</Text>
        <Text style={styles.mainDesc}>{item.desc}</Text>

        {/* ── 2 COMPACT SCANNABLE FEATURE TILES ── */}
        <View style={styles.featuresRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>{item.bullet1.icon}</Text>
            <Text style={styles.featureTitle}>{item.bullet1.title}</Text>
            <Text style={styles.featureDesc}>{item.bullet1.text}</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>{item.bullet2.icon}</Text>
            <Text style={styles.featureTitle}>{item.bullet2.title}</Text>
            <Text style={styles.featureDesc}>{item.bullet2.text}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070D1E" />

      {/* ── TOP HEADER (CINEMATIC DARK) ── */}
      <View style={styles.header}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>DRIVER PARTNER</Text>
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={onComplete} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* ── SLIDES ── */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* ── FOOTER CONTROLS ── */}
      <View style={styles.footer}>
        {/* Step Progress Indicators */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Finish CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>
            {currentIndex === slides.length - 1 ? 'Go to Dashboard' : 'Continue'}
          </Text>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="#070D1E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070D1E',
    paddingTop: SAFE_TOP_PADDING,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brandBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  brandBadgeText: {
    ...TYPOGRAPHY.labelSmall,
    color: '#10B981',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  skipText: {
    ...TYPOGRAPHY.labelSmall,
    color: '#94A3B8',
    fontWeight: '700',
  },
  flatList: {
    flex: 1,
  },
  slideContainer: {
    width: SW,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBox: {
    width: SW - 40,
    height: 200,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 18,
    position: 'relative',
    backgroundColor: '#0E172F',
    ...SHADOWS.medium,
  },
  heroPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 13, 30, 0.55)',
  },
  floatingTagPill: {
    position: 'absolute',
    top: 12,
    left: 14,
    backgroundColor: 'rgba(7, 13, 30, 0.8)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    zIndex: 10,
  },
  floatingTagText: {
    ...TYPOGRAPHY.labelSmall,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  floatingActionBadge: {
    position: 'absolute',
    top: 12,
    right: 14,
    backgroundColor: 'rgba(7, 13, 30, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    zIndex: 10,
  },
  floatingActionText: {
    ...TYPOGRAPHY.labelSmall,
    fontSize: 11,
    fontWeight: '800',
  },
  hudOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: 'space-between',
    zIndex: 5,
  },
  hudTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
  },
  hudLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 0.8,
    borderColor: '#10B981',
    gap: 5,
  },
  hudLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  hudLiveText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.8,
  },
  hudResPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  hudResText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  centerTabletFrame: {
    alignSelf: 'center',
    width: '80%',
    height: 65,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    position: 'relative',
  },
  cornerBracket: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: '#10B981',
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 2, borderRightWidth: 2 },
  channelBannerPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
  },
  channelBannerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  rewardsGoldCard: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 13, 30, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FFB800',
    gap: 10,
  },
  coinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardsBalanceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 0.6,
  },
  rewardsBalanceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  rewardsGbpVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  hudBottomPrompt: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  hudBottomPromptText: {
    fontSize: 10.5,
    color: '#CBD5E1',
    fontWeight: '700',
  },
  infoBox: {
    width: '100%',
    alignItems: 'flex-start',
  },
  stepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepNumberText: {
    ...TYPOGRAPHY.labelSmall,
    fontWeight: '800',
    letterSpacing: 1,
    marginRight: 8,
  },
  stepLine: {
    width: 28,
    height: 2,
    borderRadius: 1,
  },
  mainTitle: {
    ...TYPOGRAPHY.headlineLarge,
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  mainDesc: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  featureTitle: {
    ...TYPOGRAPHY.labelMedium,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 2,
  },
  featureDesc: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#070D1E',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#10B981',
  },
  dotInactive: {
    width: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: RADIUS.lg,
    backgroundColor: '#10B981',
    ...SHADOWS.md,
  },
  ctaText: {
    ...TYPOGRAPHY.labelLarge,
    color: '#070D1E',
    fontWeight: '900',
    fontSize: 14,
  },
});
