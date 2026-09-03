import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { useDriver } from '../../context/DriverContext';
import { DOOH_INTRO_CAMPAIGNS } from '../../constants/assets';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const { width: SW } = Dimensions.get('window');

interface DriverScreenMonitorScreenProps {
  onBack: () => void;
}

export const DriverScreenMonitorScreen: React.FC<DriverScreenMonitorScreenProps> = ({
  onBack,
}) => {
  const {
    vehicle,
    isOnline,
    currentCampaign,
    currentCampaignIndex,
  } = useDriver();

  const scanSweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Laser scan sweep on headrests
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanSweep, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scanSweep, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanSweep]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ═══════ TOP BAR (CLEAN TOP SPACING) ═══════ */}
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M15 19l-7-7 7-7" stroke={COLORS.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>IN-CABIN SCREEN MONITOR</Text>

        <View style={styles.liveIndicatorPill}>
          <Text style={styles.liveIndicatorText}>
            {isOnline ? '5G LIVE' : 'OFFLINE'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTag}>DUAL HEADREST DISPLAY</Text>
          <Text style={styles.headerTitle}>Live In-Cabin Displays</Text>
          <Text style={styles.headerSubtitle}>
            Live mirror of the touchscreens playing inside your {vehicle.make} {vehicle.model}.
          </Text>
        </View>

        {/* ═══════ DUAL SCREEN BEZEL SIMULATOR ═══════ */}
        <View style={styles.bezelContainer}>
          <View style={styles.bezelHeader}>
            <View style={styles.bezelHeaderLeft}>
              <Text style={styles.bezelHeaderText}>
                DUAL HEADREST SCREENS (LEFT & RIGHT)
              </Text>
            </View>
            <Text style={styles.bezelHeaderSync}>
              {isOnline ? '✓ 5G SYNCED' : 'DISCONNECTED'}
            </Text>
          </View>

          {/* DUAL HEADREST DISPLAY MOCKUPS (LEFT & RIGHT) */}
          <View style={styles.dualHeadrestWrapper}>
            {/* Screen 1: Rear Left Display */}
            <View style={styles.headrestUnit}>
              <View style={styles.headrestMount}>
                <Text style={styles.headrestMountText}>REAR LEFT HEADREST</Text>
              </View>
              <View style={styles.screenFrame}>
                {isOnline ? (
                  <>
                    <Image
                      source={currentCampaign.image}
                      style={styles.screenImage}
                      resizeMode="cover"
                    />
                    <Animated.View
                      style={[
                        styles.screenLaserScan,
                        {
                          transform: [
                            {
                              translateY: scanSweep.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 95],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <View style={styles.screenOverlay}>
                      <View style={styles.overlayTop}>
                        <Text style={styles.overlayBrand}>{currentCampaign.brand}</Text>
                        <View style={styles.interactiveQrBadge}>
                          <Text style={styles.qrBadgeText}>QR READY</Text>
                        </View>
                      </View>
                      <Text style={styles.overlayHeadline} numberOfLines={1}>
                        {currentCampaign.headline}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.screenOffState}>
                    <Text style={styles.screenOffText}>DISPLAY STANDBY</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Screen 2: Rear Right Display */}
            <View style={styles.headrestUnit}>
              <View style={styles.headrestMount}>
                <Text style={styles.headrestMountText}>REAR RIGHT HEADREST</Text>
              </View>
              <View style={styles.screenFrame}>
                {isOnline ? (
                  <>
                    <Image
                      source={currentCampaign.image}
                      style={styles.screenImage}
                      resizeMode="cover"
                    />
                    <Animated.View
                      style={[
                        styles.screenLaserScan,
                        {
                          transform: [
                            {
                              translateY: scanSweep.interpolate({
                                inputRange: [0, 1],
                                outputRange: [95, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <View style={styles.screenOverlay}>
                      <View style={styles.overlayTop}>
                        <Text style={styles.overlayBrand}>{currentCampaign.brand}</Text>
                        <View style={styles.interactiveQrBadge}>
                          <Text style={styles.qrBadgeText}>QR READY</Text>
                        </View>
                      </View>
                      <Text style={styles.overlayHeadline} numberOfLines={1}>
                        {currentCampaign.headline}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.screenOffState}>
                    <Text style={styles.screenOffText}>DISPLAY STANDBY</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* ═══════ CAMPAIGN QUEUE ═══════ */}
        <View style={styles.campaignsQueueSection}>
          <Text style={styles.queueTitle}>CAMPAIGN BROADCAST ROTATION</Text>
          <View style={styles.queueList}>
            {DOOH_INTRO_CAMPAIGNS.map((camp, idx) => {
              const isActive = idx === currentCampaignIndex;
              return (
                <View
                  key={idx}
                  style={[
                    styles.queueCard,
                    isActive && styles.queueCardActive,
                  ]}
                >
                  <View style={styles.queueCardLeft}>
                    <View style={[styles.queueIndexBox, isActive && styles.queueIndexBoxActive]}>
                      <Text style={[styles.queueIndexText, isActive && styles.queueIndexTextActive]}>
                        #{idx + 1}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.queueBrandText}>{camp.brand}</Text>
                      <Text style={styles.queueHeadlineText}>{camp.headline}</Text>
                    </View>
                  </View>

                  <View style={styles.queueRight}>
                    {isActive ? (
                      <View style={styles.playingBadge}>
                        <Text style={styles.playingBadgeText}>ON AIR</Text>
                      </View>
                    ) : (
                      <Text style={styles.queuedText}>Queued</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Return CTA */}
        <AnimatedPressable
          onPress={onBack}
          activeScale={0.96}
          style={styles.doneBtn}
        >
          <Text style={styles.doneBtnText}>Return to Driver Dashboard</Text>
        </AnimatedPressable>
      </ScrollView>
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
    letterSpacing: 1.4,
    fontSize: 12,
  },
  liveIndicatorPill: {
    backgroundColor: COLORS.backgroundOff,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  liveIndicatorText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.tealDark,
    letterSpacing: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  headerSection: {
    marginBottom: 18,
  },
  headerTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11.5,
    letterSpacing: 1.5,
    marginBottom: 4,
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
    fontSize: 14.5,
    color: COLORS.slate,
    lineHeight: 21,
  },
  bezelContainer: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  bezelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  bezelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bezelHeaderText: {
    ...TYPOGRAPHY.microTag,
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 1.2,
  },
  bezelHeaderSync: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.teal,
    letterSpacing: 0.8,
  },
  dualHeadrestWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  headrestUnit: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headrestMount: {
    alignItems: 'center',
    marginBottom: 6,
  },
  headrestMountText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slateLight,
    letterSpacing: 0.8,
  },
  screenFrame: {
    height: 110,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  screenImage: {
    width: '100%',
    height: '100%',
  },
  screenLaserScan: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.teal,
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  screenOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 19, 43, 0.85)',
    padding: 6,
  },
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  overlayBrand: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  interactiveQrBadge: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
  },
  qrBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: COLORS.navy,
  },
  overlayHeadline: {
    fontSize: 10,
    color: COLORS.slateLight,
  },
  screenOffState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenOffText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 1,
  },
  campaignsQueueSection: {
    marginBottom: 22,
  },
  queueTitle: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  queueList: {
    gap: 8,
  },
  queueCard: {
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
  queueCardActive: {
    borderColor: COLORS.teal,
    borderWidth: 1.5,
  },
  queueCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  queueIndexBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: COLORS.backgroundOff,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queueIndexBoxActive: {
    backgroundColor: COLORS.navy,
  },
  queueIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.slate,
  },
  queueIndexTextActive: {
    color: '#FFFFFF',
  },
  queueBrandText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  queueHeadlineText: {
    fontSize: 12.5,
    color: COLORS.slate,
  },
  queueRight: {
    marginLeft: 8,
  },
  playingBadge: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  playingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  queuedText: {
    fontSize: 12,
    color: COLORS.slateLight,
    fontWeight: '600',
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
  },
});
