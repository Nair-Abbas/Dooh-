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

interface PassengerOnboardingScreenProps {
  onComplete: () => void;
}

export const PassengerOnboardingScreen: React.FC<PassengerOnboardingScreenProps> = ({
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // ── Interactive Simulation States ──
  // Slide 1 (Dashboard)
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'deals'>('overview');
  // Slide 2 (Scanner)
  const [hasScanned, setHasScanned] = useState(false);
  // Slide 3 (Points)
  const [demoPoints, setDemoPoints] = useState(350);
  const [floatingPoints, setFloatingPoints] = useState<Array<{ id: number; text: string }>>([]);
  // Slide 4 (Offers / Wallet)
  const [isVoucherRedeemed, setIsVoucherRedeemed] = useState(false);

  // ── Persistent Ambient Animations ──
  const laserSweep = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const imageZoom = useRef(new Animated.Value(1.0)).current;
  const badgePop = useRef(new Animated.Value(1)).current;
  const orbGlow = useRef(new Animated.Value(0.4)).current;
  const scanSuccessScale = useRef(new Animated.Value(0)).current;
  const scanSuccessOpacity = useRef(new Animated.Value(0)).current;
  const barcodeScanAnim = useRef(new Animated.Value(0)).current;

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
    // Laser scan sweep for Scanner Screen
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserSweep, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserSweep, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

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

    // Floating badges & icons
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

    // Ambient background orb glow
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

    // Barcode sweep animation for Offers screen
    Animated.loop(
      Animated.sequence([
        Animated.timing(barcodeScanAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(barcodeScanAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [barcodeScanAnim, floatAnim, imageZoom, laserSweep, orbGlow, pulseAnim]);

  // Interactive Action Handlers
  const handleToggleDashboardView = () => {
    setDashboardTab((prev) => (prev === 'overview' ? 'deals' : 'overview'));
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 100, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 3.5, tension: 70, useNativeDriver: true }),
    ]).start();
  };

  const handleTestScan = () => {
    setHasScanned(true);
    scanSuccessScale.setValue(0.7);
    scanSuccessOpacity.setValue(1);

    Animated.parallel([
      Animated.spring(scanSuccessScale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(badgePop, { toValue: 1.3, duration: 100, useNativeDriver: true }),
        Animated.spring(badgePop, { toValue: 1.0, friction: 4, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const handleAddPoints = () => {
    const newPtId = Date.now();
    setDemoPoints((prev) => prev + 50);
    setFloatingPoints((prev) => [...prev, { id: newPtId, text: '+50 PTS' }]);

    setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((p) => p.id !== newPtId));
    }, 1200);

    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 4, tension: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleToggleVoucher = () => {
    setIsVoucherRedeemed((prev) => !prev);
    Animated.sequence([
      Animated.timing(badgePop, { toValue: 1.25, duration: 100, useNativeDriver: true }),
      Animated.spring(badgePop, { toValue: 1.0, friction: 3.5, tension: 70, useNativeDriver: true }),
    ]).start();
  };

  // ── 4 COMPREHENSIVE SCREEN WALKTHROUGH SLIDES (STRICTLY THEMED) ──
  const slides = [
    {
      id: 'screen_home',
      step: '01 / 04',
      screenCode: 'SCREEN 5: DASHBOARD',
      tag: 'HOME & DISCOVERY',
      tagColor: COLORS.teal,
      title: 'Home Dashboard',
      desc: 'Your mobility command center. Informs you about your accumulated reward points balance, total scanned deals, live in-cabin vehicle screen status, and featured brand promotions.',
      image: APP_IMAGES.inCabinPassengerDooh,
      floatingBadge:
        dashboardTab === 'overview' ? '📊 Live Status • Tap to Toggle' : '🔥 8 Active Deals Today',
      floatingColor: COLORS.teal,
      interactiveAction: handleToggleDashboardView,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View style={[styles.hudLiveBadge, { borderColor: COLORS.teal }]}>
              <Animated.View style={[styles.hudLiveDot, { backgroundColor: COLORS.teal, transform: [{ scale: pulseAnim }] }]} />
              <Text style={[styles.hudLiveText, { color: COLORS.teal }]}>HOME HUB LIVE</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>PASSENGER SUITE</Text>
            </View>
          </View>

          {/* Mini Dashboard Interactive Simulation Frame */}
          <View style={[styles.centerTabletFrame, { borderColor: 'rgba(0, 168, 150, 0.45)' }]}>
            <View style={[styles.cornerBracket, styles.cornerTL, { borderColor: COLORS.teal }]} />
            <View style={[styles.cornerBracket, styles.cornerTR, { borderColor: COLORS.teal }]} />
            <View style={[styles.cornerBracket, styles.cornerBL, { borderColor: COLORS.teal }]} />
            <View style={[styles.cornerBracket, styles.cornerBR, { borderColor: COLORS.teal }]} />

            {dashboardTab === 'overview' ? (
              <View style={styles.dashMockContent}>
                <View style={styles.dashMockHeader}>
                  <Text style={styles.dashGreetingText}>Welcome back, Passenger</Text>
                  <View style={[styles.dashPill, { backgroundColor: 'rgba(0, 168, 150, 0.2)' }]}>
                    <Text style={[styles.dashPillText, { color: COLORS.teal }]}>350 PTS (£3.50)</Text>
                  </View>
                </View>
                <View style={styles.dashStatusRow}>
                  <View style={[styles.dashDotGreen, { backgroundColor: COLORS.success }]} />
                  <Text style={styles.dashStatusText}>Connected to Taxi Screen #402</Text>
                </View>
              </View>
            ) : (
              <View style={styles.dashMockContent}>
                <Text style={styles.dashDealTitle}>⚡ Featured Today: 20% Off EV Rides</Text>
                <Text style={styles.dashDealSub}>Plus 15+ local dining & cafe perks near your route</Text>
              </View>
            )}
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {dashboardTab === 'overview'
                ? '👆 Tap image to preview Daily Deals feed'
                : '👆 Tap image to return to Live Overview'}
            </Text>
          </View>
        </View>
      ),
      bullet1: {
        icon: '📊',
        title: 'Instant Overview',
        text: 'Quick stats on your points, wallet value & past scans',
      },
      bullet2: {
        icon: '✨',
        title: 'Live Discovery',
        text: 'Curated brand deals refresh during your taxi ride',
      },
    },
    {
      id: 'screen_scan',
      step: '02 / 04',
      screenCode: 'SCREEN 6: SCANNER',
      tag: 'IN-CABIN SCANNER',
      tagColor: COLORS.magenta,
      title: 'Scan Screen',
      desc: 'Dedicated high-speed camera scanner. Point your phone camera directly at the in-vehicle tablet during any brand ad to lock in discount codes and save vouchers instantly.',
      image: APP_IMAGES.safariInCabin,
      floatingBadge: hasScanned ? '✓ 20% Pass Unlocked!' : '📸 Tap to Simulate Scan',
      floatingColor: COLORS.magenta,
      interactiveAction: handleTestScan,
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
              <Text style={[styles.hudLiveText, { color: COLORS.magentaLight }]}>CAMERA VIEWFINDER</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>1-SEC SYNC</Text>
            </View>
          </View>

          {/* Viewfinder Target */}
          <View style={styles.qrViewfinderBox}>
            <View style={[styles.qrCorner, styles.cornerTL, { borderColor: COLORS.magenta }]} />
            <View style={[styles.qrCorner, styles.cornerTR, { borderColor: COLORS.magenta }]} />
            <View style={[styles.qrCorner, styles.cornerBL, { borderColor: COLORS.magenta }]} />
            <View style={[styles.qrCorner, styles.cornerBR, { borderColor: COLORS.magenta }]} />

            {/* Scanning Laser Line */}
            <Animated.View
              style={[
                styles.neonLaserLine,
                {
                  backgroundColor: COLORS.magenta,
                  shadowColor: COLORS.magenta,
                  transform: [
                    {
                      translateY: laserSweep.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-32, 78],
                      }),
                    },
                  ],
                },
              ]}
            />

            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>

            {hasScanned && (
              <Animated.View
                style={[
                  styles.unlockedVoucherBadge,
                  {
                    backgroundColor: COLORS.magenta,
                    transform: [{ scale: scanSuccessScale }],
                    opacity: scanSuccessOpacity,
                  },
                ]}
              >
                <Text style={styles.unlockedVoucherText}>🎟️ SAVED TO WALLET</Text>
              </Animated.View>
            )}
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {hasScanned
                ? '🎉 Voucher Pass Saved to Offers Wallet!'
                : '👆 Tap image to simulate fast scan action'}
            </Text>
          </View>
        </View>
      ),
      bullet1: {
        icon: '⚡',
        title: 'Auto-Capture',
        text: 'Instant QR lock-in before screen ad rotates',
      },
      bullet2: {
        icon: '🎟️',
        title: 'Direct Pass Claim',
        text: 'Stores coupons straight into your digital wallet',
      },
    },
    {
      id: 'screen_points',
      step: '03 / 04',
      screenCode: 'SCREEN 7: POINTS',
      tag: 'POINTS & WALLET',
      tagColor: COLORS.goldWarm,
      title: 'Points & Rewards Screen',
      desc: 'Informs you about your accumulated reward points balance, points conversion rate (100 PTS = £1.00), tier progression (Silver -> VIP), and lets you redeem for direct cash savings.',
      image: APP_IMAGES.vehicleDoohExterior,
      floatingBadge: `${demoPoints} PTS (£${(demoPoints * 0.01).toFixed(2)})`,
      floatingColor: COLORS.goldWarm,
      interactiveAction: handleAddPoints,
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
              <Text style={[styles.hudLiveText, { color: COLORS.goldLight }]}>WALLET BALANCE</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>100 PTS = £1.00</Text>
            </View>
          </View>

          {/* Floating Point Toasts */}
          {floatingPoints.map((item) => (
            <Animated.View key={item.id} style={[styles.floatingPtToast, { backgroundColor: COLORS.goldWarm }]}>
              <Text style={styles.floatingPtToastText}>{item.text}</Text>
            </Animated.View>
          ))}

          {/* Glowing Points Card */}
          <View style={[styles.rewardsGoldCard, { borderColor: COLORS.goldWarm }]}>
            <Animated.View
              style={[
                styles.coinCircle,
                {
                  backgroundColor: 'rgba(233, 196, 106, 0.22)',
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Text style={{ fontSize: 20 }}>🪙</Text>
            </Animated.View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rewardsBalanceLabel, { color: COLORS.goldWarm }]}>TOTAL REWARD VALUE</Text>
              <Text style={styles.rewardsBalanceValue}>
                {demoPoints} PTS{' '}
                <Text style={[styles.rewardsGbpVal, { color: COLORS.goldWarm }]}>
                  (£{(demoPoints * 0.01).toFixed(2)})
                </Text>
              </Text>
              <View style={styles.tierProgressBar}>
                <View
                  style={[
                    styles.tierProgressFill,
                    { backgroundColor: COLORS.goldWarm, width: `${Math.min((demoPoints / 600) * 100, 100)}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>👆 Tap image to simulate earning +50 points</Text>
          </View>
        </View>
      ),
      bullet1: {
        icon: '🎁',
        title: 'Points per Scan',
        text: 'Earn guaranteed reward points on every scanned ad',
      },
      bullet2: {
        icon: '💳',
        title: 'Cash Conversion',
        text: 'Redeem points for direct discounts on purchases',
      },
    },
    {
      id: 'screen_offers',
      step: '04 / 04',
      screenCode: 'SCREEN 8: OFFERS & PASSES',
      tag: 'OFFERS & VOUCHERS',
      tagColor: COLORS.success,
      title: 'Offers & Coupons Screen',
      desc: 'Your digital voucher wallet. Displays all claimed discount passes, categorized by dining, retail and travel, with countdown expiry timers and instant barcode checkout.',
      image: APP_IMAGES.rolePassenger,
      floatingBadge: isVoucherRedeemed ? '✓ Code Ready at Checkout' : '🎟️ Tap to Preview Barcode',
      floatingColor: COLORS.success,
      interactiveAction: handleToggleVoucher,
      overlayHUD: (
        <View style={styles.hudOverlayContainer}>
          <View style={styles.hudTopRow}>
            <View
              style={[
                styles.hudLiveBadge,
                { backgroundColor: 'rgba(16, 185, 129, 0.25)', borderColor: COLORS.success },
              ]}
            >
              <Animated.View
                style={[
                  styles.hudLiveDot,
                  { backgroundColor: COLORS.success, transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={[styles.hudLiveText, { color: '#6EE7B7' }]}>DIGITAL WALLET</Text>
            </View>
            <View style={styles.hudResPill}>
              <Text style={styles.hudResText}>ACTIVE PASSES</Text>
            </View>
          </View>

          {/* Coupon Ticket Preview Frame */}
          <View style={[styles.centerTabletFrame, { borderColor: 'rgba(16, 185, 129, 0.45)' }]}>
            <View style={[styles.cornerBracket, styles.cornerTL, { borderColor: COLORS.success }]} />
            <View style={[styles.cornerBracket, styles.cornerTR, { borderColor: COLORS.success }]} />
            <View style={[styles.cornerBracket, styles.cornerBL, { borderColor: COLORS.success }]} />
            <View style={[styles.cornerBracket, styles.cornerBR, { borderColor: COLORS.success }]} />

            {isVoucherRedeemed ? (
              <View style={styles.barcodeBox}>
                <Text style={[styles.barcodeNumber, { color: COLORS.success }]}>DOOH-PASS-98214</Text>
                <View style={styles.simulatedBarcode}>
                  <View style={[styles.bLine, { width: 3 }]} />
                  <View style={[styles.bLine, { width: 1 }]} />
                  <View style={[styles.bLine, { width: 4 }]} />
                  <View style={[styles.bLine, { width: 2 }]} />
                  <View style={[styles.bLine, { width: 5 }]} />
                  <View style={[styles.bLine, { width: 2 }]} />
                  <View style={[styles.bLine, { width: 3 }]} />
                  <View style={[styles.bLine, { width: 1 }]} />
                  <View style={[styles.bLine, { width: 4 }]} />
                  <View style={[styles.bLine, { width: 2 }]} />
                </View>
                <Text style={styles.barcodeScanSub}>Scan barcode at store cashier</Text>
              </View>
            ) : (
              <View style={styles.dashMockContent}>
                <Text style={[styles.dashDealTitle, { color: '#6EE7B7' }]}>
                  ☕ Solaris Coffee: £2.00 Off Any Brew
                </Text>
                <Text style={styles.dashDealSub}>Valid for 3 days • Tap to reveal cashier barcode</Text>
              </View>
            )}
          </View>

          <View style={styles.hudBottomPrompt}>
            <Text style={styles.hudBottomPromptText}>
              {isVoucherRedeemed
                ? '✓ Barcode Active • Tap to return to ticket'
                : '👆 Tap image to simulate Cashier Barcode view'}
            </Text>
          </View>
        </View>
      ),
      bullet1: {
        icon: '🎟️',
        title: '1-Tap Cashier Scan',
        text: 'Present in-app barcode at partner checkout counters',
      },
      bullet2: {
        icon: '⏳',
        title: 'Expiry Alerts',
        text: 'Smart countdown reminders before saved deals expire',
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

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => {
    return (
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
  };

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
              APP WALKTHROUGH GUIDE
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
            {currentIndex === slides.length - 1 ? 'Start Using App' : 'Next Screen'}
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
    backgroundColor: 'rgba(0, 168, 150, 0.2)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    position: 'relative',
    paddingHorizontal: 10,
  },
  dashMockContent: {
    width: '100%',
    alignItems: 'center',
  },
  dashMockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  dashGreetingText: {
    fontSize: 10,
    color: COLORS.slateLight,
    fontWeight: '700',
  },
  dashPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  dashPillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  dashStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dashDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dashStatusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
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
  barcodeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  barcodeNumber: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 3,
  },
  simulatedBarcode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 2,
  },
  bLine: {
    height: '100%',
    backgroundColor: COLORS.navyDeep,
  },
  barcodeScanSub: {
    fontSize: 8.5,
    color: COLORS.slateUltraLight,
    fontWeight: '700',
    marginTop: 2,
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
  qrViewfinderBox: {
    alignSelf: 'center',
    width: 82,
    height: 82,
    borderWidth: 1,
    borderColor: 'rgba(212, 20, 90, 0.4)',
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    position: 'relative',
    overflow: 'hidden',
  },
  qrCorner: {
    position: 'absolute',
    width: 12,
    height: 12,
  },
  neonLaserLine: {
    position: 'absolute',
    width: '100%',
    height: 2.5,
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  unlockedVoucherBadge: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  unlockedVoucherText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  floatingPtToast: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    zIndex: 20,
    elevation: 6,
  },
  floatingPtToastText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.navyDeep,
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
  tierProgressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 1.5,
    marginTop: 4,
    overflow: 'hidden',
  },
  tierProgressFill: {
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
