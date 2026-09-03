import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';
import { APP_IMAGES } from '../../constants/assets';

const { width: SW, height: SH } = Dimensions.get('window');

interface IntroSplashScreenProps {
  onComplete?: () => void;
}

export const IntroSplashScreen: React.FC<IntroSplashScreenProps> = ({
  onComplete,
}) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // ── Cinematic Camera & Scene Animation values ──
  // Scene 1: Desert Safari Car Drive-By
  const safariCarX = useRef(new Animated.Value(SW * 0.25)).current;
  const safariCarScale = useRef(new Animated.Value(1.0)).current;
  const safariExteriorOpacity = useRef(new Animated.Value(1)).current;

  // Scene 2: Camera Zooming into the in-vehicle screen
  const interiorOpacity = useRef(new Animated.Value(0)).current;
  const interiorScale = useRef(new Animated.Value(1.25)).current;
  const inVehicleScreenGlow = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const messageScale = useRef(new Animated.Value(0.92)).current;

  // Progress Bar
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 5.5-second total cinematic progress
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // ── STEP 1: Desert Safari car speeds across and passes by you ──
    Animated.parallel([
      Animated.timing(safariCarX, {
        toValue: -SW * 0.18,
        duration: 2600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(safariCarScale, {
        toValue: 1.18,
        duration: 2600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // ── STEP 2: Camera angle smoothly zooms in towards the in-vehicle display ──
    const t1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(safariExteriorOpacity, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(interiorOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(interiorScale, {
          toValue: 1.0,
          duration: 3000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    // ── STEP 3: In-Vehicle screen lights up with "Welcome to Jetted in-vehicle ads experience" ──
    const t2 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(inVehicleScreenGlow, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(messageScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2700);

    // ── STEP 4: Auto complete transition ──
    const t3 = setTimeout(() => {
      onCompleteRef.current?.();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [inVehicleScreenGlow, interiorOpacity, interiorScale, messageOpacity, messageScale, progressAnim, safariCarScale, safariCarX, safariExteriorOpacity]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* ═══════ 1. SCENE 1: DESERT SAFARI CAR PASSING BY ═══════ */}
      <Animated.View
        style={[
          styles.sceneLayer,
          {
            opacity: safariExteriorOpacity,
          },
        ]}
      >
        <Animated.Image
          source={APP_IMAGES.safariExterior}
          style={[
            styles.fullImage,
            {
              transform: [
                { translateX: safariCarX },
                { scale: safariCarScale },
              ],
            },
          ]}
          resizeMode="cover"
        />

        {/* Warm Golden Hour Vignette */}
        <View style={styles.desertVignette} />
      </Animated.View>

      {/* ═══════ 2. SCENE 2: CAMERA MOVES TOWARDS IN-VEHICLE DISPLAY ═══════ */}
      <Animated.View
        style={[
          styles.sceneLayer,
          {
            opacity: interiorOpacity,
          },
        ]}
      >
        <Animated.Image
          source={APP_IMAGES.safariInCabin}
          style={[
            styles.fullImage,
            {
              transform: [{ scale: interiorScale }],
            },
          ]}
          resizeMode="cover"
        />

        {/* In-Vehicle Display Highlight Overlay */}
        <Animated.View
          style={[
            styles.inVehicleScreenOverlay,
            {
              opacity: inVehicleScreenGlow,
            },
          ]}
        />
      </Animated.View>

      {/* ═══════ 3. IN-VEHICLE DISPLAY MESSAGE ═══════ */}
      <Animated.View
        style={[
          styles.displayMessageContainer,
          {
            opacity: messageOpacity,
            transform: [{ scale: messageScale }],
          },
        ]}
      >
        <View style={styles.displayCard}>
          <View style={styles.screenHeaderRow}>
            <View style={styles.activeDot} />
            <Text style={styles.screenLiveTag}>JETTED IN-VEHICLE DISPLAY</Text>
          </View>

          <Text style={styles.screenMainHeadline}>
            Welcome to Jetted In-Vehicle Ads Experience
          </Text>

          <Text style={styles.screenSubtext}>
            Interactive headrest & in-cabin smart screen network
          </Text>
        </View>
      </Animated.View>

      {/* ═══════ 4. TOP SKIP BUTTON ═══════ */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onCompleteRef.current?.()}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* ═══════ 5. BOTTOM MINIMAL PROGRESS BAR ═══════ */}
      <View style={styles.bottomProgressWrapper}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  sceneLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  fullImage: {
    width: SW * 1.3,
    height: SH * 1.08,
    position: 'absolute',
    left: -SW * 0.15,
    top: 0,
  },
  desertVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  inVehicleScreenOverlay: {
    position: 'absolute',
    bottom: SH * 0.22,
    left: SW * 0.08,
    width: SW * 0.6,
    height: 180,
    backgroundColor: 'rgba(212, 163, 115, 0.18)',
    borderRadius: 20,
  },
  displayMessageContainer: {
    position: 'absolute',
    bottom: SH * 0.12,
    left: 20,
    right: 20,
    zIndex: 20,
  },
  displayCard: {
    backgroundColor: 'rgba(11, 19, 43, 0.95)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderWidth: 1.8,
    borderColor: '#D4AF37', // Luxury Champagne Gold / Amber
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
  },
  screenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  screenLiveTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D4AF37',
    letterSpacing: 1.5,
  },
  screenMainHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  screenSubtext: {
    fontSize: 13,
    color: '#E2E8F0',
    marginTop: 6,
    lineHeight: 18,
    fontWeight: '500',
  },
  topRow: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 26 : 48,
    right: 20,
    zIndex: 30,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bottomProgressWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 30,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#D4AF37',
  },
});
