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
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
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
  // Slide 1 (Dashboard)
  const [isDemoOnline, setIsDemoOnline] = useState(true);
  // Slide 2 (Monitor)
  const [activeScreenIndex, setActiveScreenIndex] = useState<1 | 2>(1); // 1 = Rear Left, 2 = Rear Right
  // Slide 3 (Earnings)
  const [hasTriggeredPayout, setHasTriggeredPayout] = useState(false);
  // Slide 4 (Profile)
  const [activeProfileTab, setActiveProfileTab] = useState<'vehicle' | 'bank'>('vehicle');

  // ── Persistent Ambient Animations ──
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const imageZoom = useRef(new Animated.Value(1.0)).current;
  const badgePop = useRef(new Animated.Value(1)).current;
  const orbGlow = useRef(new Animated.Value(0.4)).current;
  const radarWave1 = useRef(new Animated.Value(0)).current;
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
          toValue: -6,
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
          toValue: 1.06,
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

    // Sonar radar wave
    Animated.loop(
      Animated.sequence([
        Animated.timing(radarWave1, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(radarWave1, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim, imageZoom, orbGlow, pulseAnim, radarWave1]);

  // Interactive Action Handlers
  const handleToggleOnline = () => {
    setIsDemoOnline((prev) => !prev);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 100, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 3.5, tension: 70, useNativeDriver: true }),
    ]).start();
  };

  const handleToggleMonitorScreen = () => {
    setActiveScreenIndex((prev) => (prev === 1 ? 2 : 1));
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 100, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 3.5, tension: 70, useNativeDriver: true }),
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

  const handleToggleProfileTab = () => {
    setActiveProfileTab((prev) => (prev === 'vehicle' ? 'bank' : 'vehicle'));
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 100, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 3.5, tension: 70, useNativeDriver: true }),
    ]).start();
  };

  // ── 4 COMPREHENSIVE SCREEN WALKTHROUGH SLIDES (STRICTLY THEMED) ──
  const slides = [
    {
      id: 'screen_driver_home',
      step: '01 / 04',
      screenCode: 'SCREEN 1: DASHBOARD',
      tag: 'SHIFT TELEMETRY',
      tagColor: COLORS.success,
      title: 'Driver Dashboard',
      desc: 'Your shift command center. Informs you about today’s verified ad earnings, passenger impression count, hours online, and lets you toggle your in-cabin DOOH screens on/off with 1 tap.',
      image: APP_IMAGES.roleDriver,
      floatingBadge: isDemoOnline ? '🟢 Online • Tap to Toggle' : '⚪ Standby Mode',
      floatingColor: isDemoOnline ? COLORS.success : COLORS.slateLight,
      interactiveAction: handleToggleOnline,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View
              style={[
                styles.hudLiveBadge,
                { borderColor: isDemoOnline ? COLORS.success : COLORS.slateMuted },
              ]}
            >
              <Animated.View
                style={[
                  styles.hudLiveDot,
                  {
                    backgroundColor: isDemoOnline ? COLORS.success : COLORS.slateLight,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <Text
                style={[styles.hudLiveText, { color: isDemoOnline ? COLORS.success : COLORS.slateLight }]}
              >
                {isDemoOnline ? 'LIVE SHIFT ACTIVE' : 'SCREENS ASLEEP'}
              </Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>DRIVER SUITE</Text>
            </View>
          </View>

          {/* Center Screen Mirror Frame */}
          <View
            style={[
              styles.centerTabletFrame,
              {
                borderColor: isDemoOnline
                  ? 'rgba(16, 185, 129, 0.55)'
                  : 'rgba(255, 255, 255, 0.2)',
                backgroundColor: isDemoOnline
                  ? 'rgba(6, 40, 28, 0.65)'
                  : 'rgba(0, 0, 0, 0.55)',
              },
            ]}
          >
            <View
              style={[
                styles.cornerBracket,
                styles.cornerTL,
                { borderColor: isDemoOnline ? COLORS.success : COLORS.slateLight },
              ]}
            />
            <View
              style={[
                styles.cornerBracket,
                styles.cornerTR,
                { borderColor: isDemoOnline ? COLORS.success : COLORS.slateLight },
              ]}
            />
            <View
              style={[
                styles.cornerBracket,
                styles.cornerBL,
                { borderColor: isDemoOnline ? COLORS.success : COLORS.slateLight },
              ]}
            />
            <View
              style={[
                styles.cornerBracket,
                styles.cornerBR,
                { borderColor: isDemoOnline ? COLORS.success : COLORS.slateLight },
              ]}
            />

            <View
              style={[
                styles.channelBannerPill,
                {
                  backgroundColor: isDemoOnline
                    ? 'rgba(16, 185, 129, 0.25)'
                    : 'rgba(0, 0, 0, 0.6)',
                },
              ]}
            >
              <Text style={styles.channelBannerText}>
                {isDemoOnline
                  ? '£18.50 Earned Today • 142 Impressions'
                  : '💤 Tap image to power on display screens'}
              </Text>
            </View>

            <Text style={styles.signalMetaText}>
              {isDemoOnline
                ? '🟢 Active Loop: Nexus EV & Solaris Coffee'
                : '12V vehicle port ready for auto-ignition'}
            </Text>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {isDemoOnline
                ? '🟢 Online • Tap image to toggle standby mode'
                : '⚪ Standby • Tap image to power on'}
            </Text>
          </View>
        </View>
      ),
      bullet1: {
        icon: '⚡',
        title: 'One-Tap Online',
        text: 'Instantly start ad broadcasts when you start your shift',
      },
      bullet2: {
        icon: '📊',
        title: 'Shift Statistics',
        text: 'Live ticker of today’s earnings, trips & passenger eyes',
      },
    },
    {
      id: 'screen_screen_monitor',
      step: '02 / 04',
      screenCode: 'SCREEN 2: SCREEN MONITOR',
      tag: 'CABIN MONITOR',
      tagColor: COLORS.teal,
      title: 'Screen Monitor Hub',
      desc: 'Real-time in-cabin hardware mirror. View what passengers see on headrest displays, verify 5G connection signal, monitor 14ms latency ping, and adjust display brightness.',
      image: APP_IMAGES.inCabinPassengerDooh,
      floatingBadge:
        activeScreenIndex === 1 ? '🖥️ Rear Left Mirror' : '🖥️ Rear Right Mirror',
      floatingColor: COLORS.teal,
      interactiveAction: handleToggleMonitorScreen,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View
              style={[
                styles.hudLiveBadge,
                { backgroundColor: 'rgba(0, 168, 150, 0.2)', borderColor: COLORS.teal },
              ]}
            >
              <Animated.View
                style={[
                  styles.hudLiveDot,
                  { backgroundColor: COLORS.teal, transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={[styles.hudLiveText, { color: COLORS.teal }]}>SCREEN MONITOR</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>DISPLAY 0{activeScreenIndex} / 02</Text>
            </View>
          </View>

          {/* Live Screen Preview Mirror */}
          <View style={[styles.centerTabletFrame, { borderColor: 'rgba(0, 168, 150, 0.45)' }]}>
            <View
              style={[
                styles.channelBannerPill,
                { backgroundColor: 'rgba(0, 168, 150, 0.25)' },
              ]}
            >
              <Text style={styles.channelBannerText}>
                {activeScreenIndex === 1
                  ? '🖥️ Display Left: 1080P 60FPS • 100% Brightness'
                  : '🖥️ Display Right: 1080P 60FPS • 100% Brightness'}
              </Text>
            </View>

            <Text style={styles.signalMetaText}>
              📶 5G Connected • Latency: 14ms • Battery: 12.8V Normal
            </Text>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              👆 Tap image to switch between Left and Right screen mirrors
            </Text>
          </View>
        </View>
      ),
      bullet1: {
        icon: '🖥️',
        title: 'Dual Screen Mirror',
        text: 'Verify exact ads and promo loops streaming in cabin',
      },
      bullet2: {
        icon: '📡',
        title: '5G Health Check',
        text: 'Real-time telemetry diagnostics and heartbeat ping',
      },
    },
    {
      id: 'screen_driver_earnings',
      step: '03 / 04',
      screenCode: 'SCREEN 3: EARNINGS',
      tag: 'EARNINGS & PAYOUTS',
      tagColor: COLORS.goldWarm,
      title: 'Earnings & Payouts Screen',
      desc: 'Financial command hub. Informs you about detailed revenue breakdown per passenger ride, weekly earnings charts, impression RPM, and instant 1-click cashout to your linked UK bank account.',
      image: APP_IMAGES.safariInCabin,
      floatingBadge: hasTriggeredPayout ? '✓ £18.50 Transferred!' : 'Available: £18.50',
      floatingColor: COLORS.goldWarm,
      interactiveAction: handleTriggerPayout,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View
              style={[
                styles.hudLiveBadge,
                { backgroundColor: 'rgba(233, 196, 106, 0.25)', borderColor: COLORS.goldWarm },
              ]}
            >
              <Animated.View
                style={[
                  styles.hudLiveDot,
                  { backgroundColor: COLORS.goldWarm, transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={[styles.hudLiveText, { color: COLORS.goldLight }]}>BANK WALLET</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>0% PLATFORM FEE</Text>
            </View>
          </View>

          {/* Earnings Card */}
          <View style={[styles.rewardsGoldCard, { borderColor: COLORS.goldWarm }]}>
            <Animated.View
              style={[
                styles.coinCircle,
                {
                  backgroundColor: hasTriggeredPayout
                    ? 'rgba(16, 185, 129, 0.25)'
                    : 'rgba(233, 196, 106, 0.22)',
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{hasTriggeredPayout ? '✓' : '💷'}</Text>
            </Animated.View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rewardsBalanceLabel, { color: COLORS.goldWarm }]}>PAYOUT BALANCE</Text>
              <Text style={styles.rewardsBalanceValue}>
                £18.50{' '}
                <Text
                  style={[
                    styles.rewardsGbpVal,
                    { color: hasTriggeredPayout ? COLORS.success : COLORS.goldWarm },
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
                        backgroundColor: COLORS.success,
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
                : '👆 Tap image to simulate 1-click instant cashout'}
            </Text>
          </View>
        </View>
      ),
      bullet1: {
        icon: '🏦',
        title: '0% Platform Fee',
        text: 'Keep 100% of your generated passenger ad earnings',
      },
      bullet2: {
        icon: '⚡',
        title: 'Instant Cashout',
        text: 'Funds deposit directly into your bank within 60s',
      },
    },
    {
      id: 'screen_driver_profile',
      step: '04 / 04',
      screenCode: 'SCREEN 4: PROFILE & SETTINGS',
      tag: 'HARDWARE & PROFILE',
      tagColor: COLORS.magenta,
      title: 'Vehicle Profile & Settings',
      desc: 'Manage your registered vehicle specs, linked payout bank accounts, 12V OBD-II telemetry diagnostics, notification preferences, and 24/7 driver partner support.',
      image: APP_IMAGES.vehicleDoohExterior,
      floatingBadge:
        activeProfileTab === 'vehicle' ? '🚕 Vehicle Specs' : '🏦 Bank Accounts',
      floatingColor: COLORS.magenta,
      interactiveAction: handleToggleProfileTab,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View
              style={[
                styles.hudLiveBadge,
                { backgroundColor: 'rgba(212, 20, 90, 0.25)', borderColor: COLORS.magenta },
              ]}
            >
              <Animated.View
                style={[
                  styles.hudLiveDot,
                  { backgroundColor: COLORS.magenta, transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={[styles.hudLiveText, { color: COLORS.magentaLight }]}>PROFILE & SETTINGS</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>REGISTERED</Text>
            </View>
          </View>

          {/* Profile Card Mock */}
          <View
            style={[styles.centerTabletFrame, { borderColor: 'rgba(212, 20, 90, 0.45)' }]}
          >
            {activeProfileTab === 'vehicle' ? (
              <View style={styles.dashMockContent}>
                <Text style={[styles.dashDealTitle, { color: '#FFFFFF' }]}>
                  🚕 London Taxi TX4 • Reg: LK21 DOOH
                </Text>
                <Text style={styles.dashDealSub}>
                  OBD-II Telemetry: Verified • Hardware Serial: #DH-9941
                </Text>
              </View>
            ) : (
              <View style={styles.dashMockContent}>
                <Text style={[styles.dashDealTitle, { color: COLORS.magentaLight }]}>
                  🏦 Barclays Direct Deposit Linked
                </Text>
                <Text style={styles.dashDealSub}>
                  Account: *******492 • Sort Code: 20-45-72
                </Text>
              </View>
            )}
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {activeProfileTab === 'vehicle'
                ? '👆 Tap image to preview Linked Bank Account'
                : '👆 Tap image to return to Vehicle Specs'}
            </Text>
          </View>
        </View>
      ),
      bullet1: {
        icon: '🛡️',
        title: 'Certified Hardware',
        text: 'Registered DOOH tablet mounting & serial tracking',
      },
      bullet2: {
        icon: '📞',
        title: '24/7 Driver Support',
        text: 'Immediate roadside & ad technical assistance',
      },
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

        {/* Floating Screen Tag */}
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
          <Text style={[styles.stepTagLabel, { color: item.tagColor }]}>{item.screenCode}</Text>
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDeep} />

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
                  stroke={COLORS.slateLight}
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
              DRIVER APP TOUR
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={onComplete} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip Tour</Text>
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
            {currentIndex === slides.length - 1 ? 'Start Driving' : 'Next Screen'}
          </Text>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke={COLORS.navyDeep}
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
    backgroundColor: COLORS.navyDeep, // #060B18
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
    color: COLORS.slateLight,
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
    backgroundColor: COLORS.navyLight,
    ...SHADOWS.medium,
  },
  heroPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 11, 24, 0.62)',
  },
  floatingTagPill: {
    position: 'absolute',
    top: 12,
    left: 14,
    backgroundColor: 'rgba(6, 11, 24, 0.88)',
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
    backgroundColor: 'rgba(6, 11, 24, 0.88)',
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
    gap: 5,
  },
  hudLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hudLiveText: {
    fontSize: 9.5,
    fontWeight: '900',
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
    paddingHorizontal: 10,
  },
  dashMockContent: {
    width: '100%',
    alignItems: 'center',
  },
  dashDealTitle: {
    fontSize: 11.5,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  dashDealSub: {
    fontSize: 9.5,
    color: COLORS.slateLight,
    textAlign: 'center',
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
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    marginBottom: 3,
  },
  channelBannerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11.5,
  },
  signalMetaText: {
    fontSize: 9.5,
    color: COLORS.slateLight,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  rewardsGoldCard: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 11, 24, 0.88)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
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
    color: COLORS.slateUltraLight,
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
    width: 20,
    height: 2,
    borderRadius: 1,
    marginRight: 8,
  },
  stepTagLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  mainTitle: {
    ...TYPOGRAPHY.headlineLarge,
    fontSize: 23,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 5,
    letterSpacing: -0.3,
  },
  mainDesc: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.slateLight,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 11,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureEmoji: {
    fontSize: 15,
  },
  featureTitle: {
    ...TYPOGRAPHY.labelMedium,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 2,
    fontSize: 12,
  },
  featureDesc: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 10.5,
    color: COLORS.slateLight,
    lineHeight: 14,
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
    backgroundColor: COLORS.navyDeep,
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
    width: 24,
  },
  dotInactive: {
    width: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  ctaText: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.navyDeep,
    fontWeight: '900',
    fontSize: 13.5,
  },
});
