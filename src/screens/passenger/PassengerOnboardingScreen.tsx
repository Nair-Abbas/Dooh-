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

interface PassengerOnboardingScreenProps {
  onComplete: () => void;
}

export const PassengerOnboardingScreen: React.FC<PassengerOnboardingScreenProps> = ({
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Interactive Simulation States
  const [activeChannel, setActiveChannel] = useState(1);
  const [hasScanned, setHasScanned] = useState(false);
  const [demoPoints, setDemoPoints] = useState(250);

  // Animations (Alive & Cinematic)
  const laserSweep = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const imageZoom = useRef(new Animated.Value(1.0)).current;
  const badgePop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Laser scan sweep
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserSweep, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserSweep, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

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
  }, [laserSweep, pulseAnim, floatAnim, imageZoom]);

  const handleToggleChannel = () => {
    setActiveChannel((prev) => (prev % 3) + 1);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleTestScan = () => {
    setHasScanned(true);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleAddPoints = () => {
    setDemoPoints((prev) => prev + 50);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const slides = [
    {
      id: '1',
      step: '01 / 03',
      tag: 'IN-CABIN EXPERIENCE',
      tagColor: '#00E5FF',
      title: 'Spot the Screen',
      desc: 'Look for the interactive DOOH digital tablet mounted in your taxi streaming curated brand deals.',
      image: APP_IMAGES.inCabinPassengerDooh,
      floatingBadge: `📺 Channel 0${activeChannel} • Tap to Switch`,
      floatingColor: '#00E5FF',
      interactiveAction: handleToggleChannel,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={styles.hudLiveBadge}>
              <View style={styles.hudLiveDot} />
              <Text style={styles.hudLiveText}>4K LIVE AD STREAM</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>CH 0{activeChannel}/03</Text>
            </View>
          </View>

          {/* Center Screen Highlight */}
          <View style={styles.centerTabletFrame}>
            <View style={[styles.cornerBracket, styles.cornerTL]} />
            <View style={[styles.cornerBracket, styles.cornerTR]} />
            <View style={[styles.cornerBracket, styles.cornerBL]} />
            <View style={[styles.cornerBracket, styles.cornerBR]} />
            
            <View style={styles.channelBannerPill}>
              <Text style={styles.channelBannerText}>
                {activeChannel === 1 ? '⚡ Nexus EV • Luxury Ride Pass' : activeChannel === 2 ? '🎧 Lumen Sound • 20% OFF' : '☕ Solaris Roast • Free Coffee'}
              </Text>
            </View>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>👆 Tap image to preview next ad channel</Text>
          </View>
        </View>
      ),
      bullet1: { icon: '🚕', title: 'Rideshare Ads', text: 'Curated premium guides & local promotions' },
      bullet2: { icon: '✨', title: 'Always Dynamic', text: 'Campaigns refresh at every traffic stop' },
    },
    {
      id: '2',
      step: '02 / 03',
      tag: 'INSTANT SCANNER',
      tagColor: '#FF2D78',
      title: 'Scan for Deals',
      desc: 'Point your camera at the on-screen QR code during any ad to instantly claim discount passes.',
      image: APP_IMAGES.safariInCabin,
      floatingBadge: hasScanned ? '✓ 20% Pass Unlocked!' : '📸 Tap to Simulate Scan',
      floatingColor: '#FF2D78',
      interactiveAction: handleTestScan,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={[styles.hudLiveBadge, { backgroundColor: 'rgba(255, 45, 120, 0.25)', borderColor: '#FF2D78' }]}>
              <View style={[styles.hudLiveDot, { backgroundColor: '#FF2D78' }]} />
              <Text style={[styles.hudLiveText, { color: '#FFB2D2' }]}>ACTIVE QR TARGET</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>1-SEC SYNC</Text>
            </View>
          </View>

          {/* Viewfinder Target */}
          <View style={styles.qrViewfinderBox}>
            <View style={[styles.qrCorner, styles.cornerTL, { borderColor: '#FF2D78' }]} />
            <View style={[styles.qrCorner, styles.cornerTR, { borderColor: '#FF2D78' }]} />
            <View style={[styles.qrCorner, styles.cornerBL, { borderColor: '#FF2D78' }]} />
            <View style={[styles.qrCorner, styles.cornerBR, { borderColor: '#FF2D78' }]} />

            {/* Scanning Laser Line */}
            <Animated.View
              style={[
                styles.neonLaserLine,
                {
                  transform: [
                    {
                      translateY: laserSweep.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-30, 80],
                      }),
                    },
                  ],
                },
              ]}
            />

            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
              <Path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {hasScanned ? '🎉 Voucher Pass Saved to Wallet!' : '👆 Tap image to simulate fast scan'}
            </Text>
          </View>
        </View>
      ),
      bullet1: { icon: '⚡', title: '1-Second Capture', text: 'Saves vouchers directly before ad rotates' },
      bullet2: { icon: '🎟️', title: 'VIP Savings', text: 'Discounts on dining, rides & entertainment' },
    },
    {
      id: '3',
      step: '03 / 03',
      tag: 'POINTS & REWARDS',
      tagColor: '#FFB800',
      title: 'Earn & Save Cash',
      desc: 'Collect reward points on every scanned deal and redeem them instantly for cash savings.',
      image: APP_IMAGES.vehicleDoohExterior,
      floatingBadge: `${demoPoints} PTS (£${(demoPoints * 0.01).toFixed(2)})`,
      floatingColor: '#FFB800',
      interactiveAction: handleAddPoints,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={[styles.hudLiveBadge, { backgroundColor: 'rgba(255, 184, 0, 0.25)', borderColor: '#FFB800' }]}>
              <View style={[styles.hudLiveDot, { backgroundColor: '#FFB800' }]} />
              <Text style={[styles.hudLiveText, { color: '#FFE494' }]}>WALLET REWARDS</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>£0.01 / PT</Text>
            </View>
          </View>

          {/* Glowing Points Card */}
          <View style={styles.rewardsGoldCard}>
            <View style={styles.coinCircle}>
              <Text style={{ fontSize: 20 }}>🪙</Text>
            </View>
            <View>
              <Text style={styles.rewardsBalanceLabel}>CURRENT REWARD VALUE</Text>
              <Text style={styles.rewardsBalanceValue}>
                {demoPoints} PTS <Text style={styles.rewardsGbpVal}>(£{(demoPoints * 0.01).toFixed(2)})</Text>
              </Text>
            </View>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>👆 Tap image to claim +50 demo points</Text>
          </View>
        </View>
      ),
      bullet1: { icon: '🎁', title: 'Auto-Earn', text: 'Points add automatically after every scan' },
      bullet2: { icon: '💳', title: 'Direct Checkout', text: '100 points = £1.00 off partner purchases' },
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

        {/* Dark Cinematic Gradient & Vignette Overlay */}
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
          <Text style={styles.brandBadgeText}>PASSENGER GUIDE</Text>
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
            {currentIndex === slides.length - 1 ? 'Start Exploring' : 'Continue'}
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
    backgroundColor: '#070D1E', // Deep obsidian background matching splash
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
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  brandBadgeText: {
    ...TYPOGRAPHY.labelSmall,
    color: '#00E5FF',
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
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 0.8,
    borderColor: '#00E5FF',
    gap: 5,
  },
  hudLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E5FF',
  },
  hudLiveText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#00E5FF',
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
    width: '78%',
    height: 65,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
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
    borderColor: '#00E5FF',
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 2, borderRightWidth: 2 },
  channelBannerPill: {
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
  },
  channelBannerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  qrViewfinderBox: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 120, 0.4)',
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
    overflow: 'hidden',
  },
  qrCorner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: '#FF2D78',
  },
  neonLaserLine: {
    position: 'absolute',
    width: '100%',
    height: 2.5,
    backgroundColor: '#FF2D78',
    shadowColor: '#FF2D78',
    shadowOpacity: 1,
    shadowRadius: 6,
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
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
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
    fontSize: 13,
    color: '#FFD54F',
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
    backgroundColor: '#00E5FF',
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
    backgroundColor: '#00E5FF',
    ...SHADOWS.md,
  },
  ctaText: {
    ...TYPOGRAPHY.labelLarge,
    color: '#070D1E',
    fontWeight: '900',
    fontSize: 14,
  },
});
