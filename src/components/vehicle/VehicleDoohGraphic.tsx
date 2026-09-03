import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { APP_IMAGES, DoohAdCampaign } from '../../constants/assets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VehicleDoohGraphicProps {
  activeCampaign?: DoohAdCampaign;
  viewMode?: 'exterior' | 'inCabin';
  scale?: number;
}

export const VehicleDoohGraphic: React.FC<VehicleDoohGraphicProps> = ({
  activeCampaign,
  viewMode = 'exterior',
  scale = 1,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.9)).current;
  const adFadeAnim = useRef(new Animated.Value(1)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle in-vehicle screen luminance pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle scanline cycle
    Animated.loop(
      Animated.timing(scanlineAnim, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, scanlineAnim]);

  useEffect(() => {
    adFadeAnim.setValue(0.2);
    Animated.timing(adFadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [activeCampaign, adFadeAnim]);

  const campaign = activeCampaign || {
    id: 'default',
    brand: 'NEXUS DRIVE',
    tagline: 'NEXT-GEN MOBILITY',
    headline: 'Zero Emissions. Pure Performance.',
    themeColor: COLORS.teal,
    secondaryColor: COLORS.navy,
    accentColor: COLORS.tealDark,
    category: 'In-Cabin DOOH',
    pointsReward: 150,
    discount: '£15 OFF',
  };

  const scanlineTranslateY = scanlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 50],
  });

  return (
    <View style={[styles.editorialFrame, { transform: [{ scale }] }]}>
      {/* 1. EDITORIAL CORNER METADATA */}
      <View style={styles.topMetaRow}>
        <Text style={styles.topMetaLabel}>
          [ FIGURE 01.A // IN-VEHICLE DOOH DISPLAY ]
        </Text>
        <Text style={styles.topMetaCoord}>
          SYS.V3 // 2026
        </Text>
      </View>

      {/* 2. HERO IMAGE CANVAS WITH ASYMMETRICAL CROPPING */}
      <View style={styles.imageCanvas}>
        <Image
          source={
            viewMode === 'exterior'
              ? APP_IMAGES.vehicleDoohExterior
              : APP_IMAGES.inCabinPassengerDooh
          }
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Subtle Minimalist Contrast Tint */}
        <View style={styles.imageOverlay} />

        {/* 3. DYNAMIC IN-VEHICLE DOOH SCREEN OVERLAY */}
        {viewMode === 'exterior' ? (
          <View style={styles.windowScreenTarget}>
            {/* Minimalist Framing Reticles */}
            <View style={styles.reticleTL} />
            <View style={styles.reticleTR} />
            <View style={styles.reticleBL} />
            <View style={styles.reticleBR} />

            {/* Glowing In-Cabin Screen */}
            <Animated.View
              style={[
                styles.screenDisplayBox,
                {
                  opacity: pulseAnim,
                  borderColor: campaign.themeColor || COLORS.teal,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.screenContentInner,
                  {
                    backgroundColor: COLORS.navy,
                    opacity: adFadeAnim,
                  },
                ]}
              >
                {/* Active Ad Content in the Window */}
                <View style={styles.adMiniHeader}>
                  <Text style={[styles.adMiniBrand, { color: campaign.themeColor || COLORS.teal }]}>
                    {campaign.brand}
                  </Text>
                  <View style={styles.adMiniLiveDot} />
                </View>

                <Text style={styles.adMiniTagline} numberOfLines={1}>
                  {campaign.tagline}
                </Text>

                {/* Animated Light Scanline */}
                <Animated.View
                  style={[
                    styles.scanlineBeam,
                    { transform: [{ translateY: scanlineTranslateY }] },
                  ]}
                />
              </Animated.View>
            </Animated.View>

            {/* Pointer Callout */}
            <View style={styles.calloutPill}>
              <View style={styles.calloutDot} />
              <Text style={styles.calloutText}>LIVE REAR-SEAT TOUCHSCREEN</Text>
            </View>
          </View>
        ) : (
          <View style={styles.inCabinCloseUpOverlay}>
            <Animated.View
              style={[
                styles.inCabinScreenFrame,
                { opacity: adFadeAnim },
              ]}
            >
              <View style={styles.inCabinTopBar}>
                <Text style={styles.inCabinBrand}>{campaign.brand}</Text>
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsBadgeText}>+{campaign.pointsReward} PTS</Text>
                </View>
              </View>
              <Text style={styles.inCabinHeadline}>{campaign.headline}</Text>
              <View style={styles.inCabinQrMock}>
                <View style={styles.qrGrid} />
                <Text style={styles.qrPrompt}>SCAN WITH DOOH APP</Text>
              </View>
            </Animated.View>
          </View>
        )}
      </View>

      {/* 4. BOTTOM METADATA HAIRLINE */}
      <View style={styles.bottomMetaRow}>
        <Text style={styles.bottomMetaLeft}>
          RESOLUTION: 1080P UHD • LATENCY: &lt;50MS
        </Text>
        <Text style={styles.bottomMetaRight}>
          STATUS: VERIFIED BROADCAST
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editorialFrame: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 12,
    ...SHADOWS.soft,
  },
  topMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  topMetaLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  topMetaCoord: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slateLight,
    fontSize: 8.5,
    letterSpacing: 1.2,
  },
  imageCanvas: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.navy,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 19, 43, 0.1)',
  },

  // Exterior Mode: Window Target
  windowScreenTarget: {
    position: 'absolute',
    top: '38%',
    left: '32%',
    width: 140,
    height: 75,
  },
  reticleTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 8,
    height: 8,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: COLORS.teal,
  },
  reticleTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: COLORS.teal,
  },
  reticleBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 8,
    height: 8,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: COLORS.teal,
  },
  reticleBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 8,
    height: 8,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: COLORS.teal,
  },
  screenDisplayBox: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: COLORS.navy,
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  screenContentInner: {
    flex: 1,
    padding: 6,
    justifyContent: 'space-between',
  },
  adMiniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adMiniBrand: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  adMiniLiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.teal,
  },
  adMiniTagline: {
    fontSize: 7.5,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  scanlineBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  calloutPill: {
    position: 'absolute',
    bottom: -18,
    alignSelf: 'center',
    backgroundColor: 'rgba(11, 19, 43, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  calloutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.teal,
  },
  calloutText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  // In-Cabin Mode Close-Up
  inCabinCloseUpOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inCabinScreenFrame: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    padding: 16,
    width: '90%',
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  inCabinTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inCabinBrand: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.teal,
    letterSpacing: 1,
  },
  pointsBadge: {
    backgroundColor: COLORS.magenta,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  pointsBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  inCabinHeadline: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 10,
  },
  inCabinQrMock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 8,
  },
  qrGrid: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  qrPrompt: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.slateLight,
    letterSpacing: 1,
  },

  // Bottom Meta
  bottomMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  bottomMetaLeft: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.slate,
    letterSpacing: 0.8,
  },
  bottomMetaRight: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.teal,
    letterSpacing: 0.8,
  },
});
