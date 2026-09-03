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
  Easing,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { APP_IMAGES } from '../../constants/assets';

const { width: SW } = Dimensions.get('window');

interface DriverOnboardingScreenProps {
  onComplete: () => void;
}

export const DriverOnboardingScreen: React.FC<DriverOnboardingScreenProps> = ({
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // ── Interactive Simulation States ──
  const [isDemoOnline, setIsDemoOnline] = useState(true);
  const [surgeTier, setSurgeTier] = useState<1 | 2 | 3>(2); // 1 = 1.0x, 2 = 1.4x, 3 = 2.0x
  const [hasTriggeredPayout, setHasTriggeredPayout] = useState(false);
  const [payoutProgress, setPayoutProgress] = useState(0);

  // ── Persistent Ambient Animations ──
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const imageZoom = useRef(new Animated.Value(1.0)).current;
  const badgePop = useRef(new Animated.Value(1)).current;
  const orbGlow = useRef(new Animated.Value(0.4)).current;
  const radarWave1 = useRef(new Animated.Value(0)).current;
  const radarWave2 = useRef(new Animated.Value(0)).current;
  const payoutBarAnim = useRef(new Animated.Value(0)).current;

  // ── Staggered Entrance Animations for Active Slide ──
  const slideContentAnim = useRef(new Animated.Value(0)).current;

  const runSlideEntrance = () => {
    slideContentAnim.setValue(0);
    Animated.spring(slideContentAnim, {
      toValue: 1,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    runSlideEntrance();
  }, [currentIndex]);

  useEffect(() => {
    // Ambient radar pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -7,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle continuous camera zoom
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageZoom, {
          toValue: 1.07,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(imageZoom, {
          toValue: 1.0,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Background orb glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbGlow, {
          toValue: 0.85,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orbGlow, {
          toValue: 0.4,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sonar radar ripple rings
    Animated.loop(
      Animated.sequence([
        Animated.timing(radarWave1, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(radarWave1, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(radarWave2, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(radarWave2, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    }, 900);
  }, [floatAnim, imageZoom, orbGlow, pulseAnim, radarWave1, radarWave2]);

  const handleToggleOnline = () => {
    setIsDemoOnline((prev) => !prev);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 100, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 3.5, tension: 70, useNativeDriver: true }),
    ]).start();
  };

  const handleCycleSurge = () => {
    setSurgeTier((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 4, tension: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleTriggerPayout = () => {
    setHasTriggeredPayout(true);
    payoutBarAnim.setValue(0);

    Animated.parallel([
      Animated.timing(payoutBarAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(badgePop, { toValue: 1.3, duration: 100, useNativeDriver: true }),
        Animated.spring(badgePop, { toValue: 1.0, friction: 4, tension: 80, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const slides = [
    {
      id: '1',
      step: '01 / 03',
      tag: 'IN-CABIN TELEMETRY',
      tagColor: '#10B981',
      title: 'Keep Screen Active',
      desc: 'Keep your in-vehicle DOOH screen powered on during rides to automatically stream brand ad loops and earn passive revenue.',
      image: APP_IMAGES.roleDriver,
      floatingBadge: isDemoOnline ? '🟢 5G Connected' : '⚪ Standby Mode',
      floatingColor: isDemoOnline ? '#10B981' : '#94A3B8',
      interactiveAction: handleToggleOnline,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={[styles.hudLiveBadge, { borderColor: isDemoOnline ? '#10B981' : '#64748B' }]}>
              <Animated.View
                style={[
                  styles.hudLiveDot,
                  {
                    backgroundColor: isDemoOnline ? '#10B981' : '#94A3B8',
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <Text style={[styles.hudLiveText, { color: isDemoOnline ? '#10B981' : '#94A3B8' }]}>
                {isDemoOnline ? 'DUAL DISPLAYS ONLINE' : 'SCREENS ASLEEP'}
              </Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>1080P • 60 FPS</Text>
            </View>
          </View>

          {/* Center Screen Mirror Frame */}
          <View
            style={[
              styles.centerTabletFrame,
              {
                borderColor: isDemoOnline ? 'rgba(16, 185, 129, 0.55)' : 'rgba(255, 255, 255, 0.2)',
                backgroundColor: isDemoOnline ? 'rgba(6, 40, 28, 0.65)' : 'rgba(0, 0, 0, 0.55)',
              },
            ]}
          >
            <View style={[styles.cornerBracket, styles.cornerTL, { borderColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />
            <View style={[styles.cornerBracket, styles.cornerTR, { borderColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />
            <View style={[styles.cornerBracket, styles.cornerBL, { borderColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />
            <View style={[styles.cornerBracket, styles.cornerBR, { borderColor: isDemoOnline ? '#10B981' : '#94A3B8' }]} />

            <View
              style={[
                styles.channelBannerPill,
                { backgroundColor: isDemoOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 0, 0, 0.6)' },
              ]}
            >
              <Text style={styles.channelBannerText}>
                {isDemoOnline
                  ? '⚡ 4K Broadcast Active • Verified Impressions'
                  : '💤 Tap image to power on display'}
              </Text>
            </View>

            <Text style={styles.signalMetaText}>
              {isDemoOnline ? '📶 5G Ultra Wideband • Latency 14ms' : 'Offline • Ready for 12V ignition'}
            </Text>
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
      desc: 'GPS-targeted brand campaigns play automatically with zero driver effort required as you navigate city commercial hubs.',
      image: APP_IMAGES.vehicleDoohExterior,
      floatingBadge:
        surgeTier === 3
          ? '⚡ 2.0x Prime Surge'
          : surgeTier === 2
          ? '🔥 1.4x Commercial Zone'
          : '📍 Standard Route',
      floatingColor: surgeTier === 3 ? '#FFB800' : surgeTier === 2 ? '#FF2D78' : '#00E5FF',
      interactiveAction: handleCycleSurge,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={[styles.hudLiveBadge, { backgroundColor: 'rgba(0, 229, 255, 0.2)', borderColor: '#00E5FF' }]}>
              <Animated.View
                style={[
                  styles.hudLiveDot,
                  { backgroundColor: '#00E5FF', transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={styles.hudLiveText}>GPS GEO-TARGETING</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>
                {surgeTier === 3 ? 'BOOST 2.0X' : surgeTier === 2 ? 'SURGE 1.4X' : 'STANDARD 1.0X'}
              </Text>
            </View>
          </View>

          {/* Geo Radar Frame with Ripple Animations */}
          <View
            style={[
              styles.centerTabletFrame,
              {
                borderColor:
                  surgeTier === 3
                    ? 'rgba(255, 184, 0, 0.65)'
                    : surgeTier === 2
                    ? 'rgba(255, 45, 120, 0.65)'
                    : 'rgba(0, 229, 255, 0.45)',
              },
            ]}
          >
            {/* Animated Radar Pulse Rings */}
            <Animated.View
              style={[
                styles.radarRing,
                {
                  transform: [
                    {
                      scale: radarWave1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 2.2],
                      }),
                    },
                  ],
                  opacity: radarWave1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 0],
                  }),
                  borderColor: surgeTier === 3 ? '#FFB800' : surgeTier === 2 ? '#FF2D78' : '#00E5FF',
                },
              ]}
            />
            <Animated.View
              style={[
                styles.radarRing,
                {
                  transform: [
                    {
                      scale: radarWave2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 2.2],
                      }),
                    },
                  ],
                  opacity: radarWave2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 0],
                  }),
                  borderColor: surgeTier === 3 ? '#FFB800' : surgeTier === 2 ? '#FF2D78' : '#00E5FF',
                },
              ]}
            />

            <View
              style={[
                styles.channelBannerPill,
                {
                  backgroundColor:
                    surgeTier === 3
                      ? 'rgba(255, 184, 0, 0.3)'
                      : surgeTier === 2
                      ? 'rgba(255, 45, 120, 0.3)'
                      : 'rgba(0, 229, 255, 0.25)',
                },
              ]}
            >
              <Text style={styles.channelBannerText}>
                {surgeTier === 3
                  ? '⚡ Prime Downtown Corridor (+100% Rate)'
                  : surgeTier === 2
                  ? '🔥 Commercial Hotspot (+40% Boost)'
                  : '🗺️ Central City Transit Route (1.0x Rate)'}
              </Text>
            </View>

            <Text style={styles.signalMetaText}>
              {surgeTier === 3 ? 'Estimated: £4.20 / hr bonus' : surgeTier === 2 ? 'Estimated: £2.80 / hr bonus' : 'Streaming base payout rates'}
            </Text>
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
      desc: 'Earn guaranteed cash per passenger impression and withdraw straight to your linked bank account with 0% fees.',
      image: APP_IMAGES.safariInCabin,
      floatingBadge: hasTriggeredPayout ? '✓ £18.50 Paid Out!' : 'Available: £18.50',
      floatingColor: '#FFB800',
      interactiveAction: handleTriggerPayout,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View
              style={[
                styles.hudLiveBadge,
                { backgroundColor: 'rgba(255, 184, 0, 0.25)', borderColor: '#FFB800' },
              ]}
            >
              <Animated.View
                style={[
                  styles.hudLiveDot,
                  { backgroundColor: '#FFB800', transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={[styles.hudLiveText, { color: '#FFE494' }]}>DIRECT REVENUE</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>WEEKLY 0% FEE</Text>
            </View>
          </View>

          {/* Earnings Card */}
          <View style={styles.rewardsGoldCard}>
            <Animated.View
              style={[
                styles.coinCircle,
                {
                  backgroundColor: hasTriggeredPayout ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 184, 0, 0.22)',
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{hasTriggeredPayout ? '✓' : '💷'}</Text>
            </Animated.View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rewardsBalanceLabel}>PAYOUT BALANCE</Text>
              <Text style={styles.rewardsBalanceValue}>
                £18.50{' '}
                <Text
                  style={[
                    styles.rewardsGbpVal,
                    { color: hasTriggeredPayout ? '#10B981' : '#FFD54F' },
                  ]}
                >
                  {hasTriggeredPayout ? '• Transferred to Bank ✓' : '• Ready to Cash Out'}
                </Text>
              </Text>

              {hasTriggeredPayout && (
                <View style={styles.payoutTrack}>
                  <Animated.View
                    style={[
                      styles.payoutFill,
                      {
                        width: payoutBarAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {hasTriggeredPayout
                ? '✓ Transferred £18.50 to Bank (Sort Code **-**-72)'
                : '👆 Tap image to simulate 1-click payout'}
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

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
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

  const currentSlide = slides[currentIndex] || slides[0];

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

      {/* ── ANIMATED STAGGERED INFO BOX ── */}
      <Animated.View
        style={[
          styles.infoBox,
          {
            opacity: slideContentAnim,
            transform: [
              {
                translateY: slideContentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.stepBadgeRow}>
          <Text style={[styles.stepNumberText, { color: item.tagColor }]}>{item.step}</Text>
          <View style={[styles.stepLine, { backgroundColor: item.tagColor }]} />
          <Text style={styles.stepTagLabel}>DRIVER PARTNER NETWORK</Text>
        </View>

        <Text style={styles.mainTitle}>{item.title}</Text>
        <Text style={styles.mainDesc}>{item.desc}</Text>

        {/* ── 2 COMPACT SCANNABLE FEATURE TILES ── */}
        <View style={styles.featuresRow}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrap}>
              <Text style={styles.featureEmoji}>{item.bullet1.icon}</Text>
            </View>
            <Text style={styles.featureTitle}>{item.bullet1.title}</Text>
            <Text style={styles.featureDesc}>{item.bullet1.text}</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconWrap}>
              <Text style={styles.featureEmoji}>{item.bullet2.icon}</Text>
            </View>
            <Text style={styles.featureTitle}>{item.bullet2.title}</Text>
            <Text style={styles.featureDesc}>{item.bullet2.text}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070D1E" />

      {/* ── AMBIENT BACKGROUND GLOW ORBS ── */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ambientOrbTop,
          {
            backgroundColor: currentSlide.tagColor,
            opacity: orbGlow.interpolate({
              inputRange: [0.4, 0.85],
              outputRange: [0.12, 0.24],
            }),
          },
        ]}
      />

      {/* ── TOP HEADER (CINEMATIC DARK) ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handlePrev} activeOpacity={0.7}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="#CBD5E1"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          )}
          <View style={[styles.brandBadge, { borderColor: currentSlide.tagColor }]}>
            <View style={[styles.brandDot, { backgroundColor: currentSlide.tagColor }]} />
            <Text style={[styles.brandBadgeText, { color: currentSlide.tagColor }]}>
              DRIVER ONBOARDING
            </Text>
          </View>
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
        {/* Step Progress Expanding Pill Indicators */}
        <View style={styles.dotsRow}>
          {slides.map((slide, i) => {
            const isActive = i === currentIndex;
            return (
              <TouchableOpacity
                key={slide.id}
                activeOpacity={0.8}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({ index: i, animated: true });
                  setCurrentIndex(i);
                }}
                style={[
                  styles.dot,
                  isActive
                    ? [styles.dotActive, { backgroundColor: slide.tagColor }]
                    : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Next / Finish CTA with Spring Animation */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: currentSlide.tagColor }]}
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
    position: 'relative',
  },
  ambientOrbTop: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  brandBadgeText: {
    ...TYPOGRAPHY.labelSmall,
    fontSize: 10.5,
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
    zIndex: 5,
  },
  slideContainer: {
    width: SW,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBox: {
    width: SW - 40,
    height: 205,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 16,
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
    backgroundColor: 'rgba(7, 13, 30, 0.58)',
  },
  floatingTagPill: {
    position: 'absolute',
    top: 12,
    left: 14,
    backgroundColor: 'rgba(7, 13, 30, 0.85)',
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
    backgroundColor: 'rgba(7, 13, 30, 0.88)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
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
    width: '82%',
    height: 70,
    borderWidth: 1.2,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  radarRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  cornerBracket: {
    position: 'absolute',
    width: 10,
    height: 10,
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 2, borderRightWidth: 2 },
  channelBannerPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    marginBottom: 4,
  },
  channelBannerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11.5,
  },
  signalMetaText: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  rewardsGoldCard: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 13, 30, 0.88)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FFB800',
    gap: 10,
    width: '88%',
  },
  coinCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardsBalanceLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 0.6,
  },
  rewardsBalanceValue: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  rewardsGbpVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  payoutTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 1.5,
    marginTop: 4,
    overflow: 'hidden',
  },
  payoutFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  hudBottomPrompt: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    width: 24,
    height: 2,
    borderRadius: 1,
    marginRight: 8,
  },
  stepTagLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
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
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 14,
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
  featureIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureEmoji: {
    fontSize: 16,
  },
  featureTitle: {
    ...TYPOGRAPHY.labelMedium,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 2,
    fontSize: 12.5,
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
    zIndex: 10,
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
    width: 26,
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
    ...SHADOWS.md,
  },
  ctaText: {
    ...TYPOGRAPHY.labelLarge,
    color: '#070D1E',
    fontWeight: '900',
    fontSize: 14,
  },
});
