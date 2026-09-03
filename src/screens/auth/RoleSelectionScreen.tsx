import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { APP_IMAGES } from '../../constants/assets';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

const { width: SW } = Dimensions.get('window');

export interface RoleSelectionScreenProps {
  onSelectRole?: (role: 'passenger' | 'driver') => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
}) => {
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(15)).current;
  const card1Opacity = useRef(new Animated.Value(0)).current;
  const card1TranslateY = useRef(new Animated.Value(20)).current;
  const card2Opacity = useRef(new Animated.Value(0)).current;
  const card2TranslateY = useRef(new Animated.Value(20)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(headerTranslateY, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    const t1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(card1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(card1TranslateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }, 120);

    const t2 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(card2Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(card2TranslateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }, 240);

    const t3 = setTimeout(() => {
      Animated.timing(footerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [headerOpacity, headerTranslateY, card1Opacity, card1TranslateY, card2Opacity, card2TranslateY, footerOpacity]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ═══════ HEADER (NO AWKWARD BLANK TOP VOID) ═══════ */}
        <Animated.View
          style={[
            styles.headerSection,
            { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <View style={styles.stampRow}>
            <Text style={styles.stampTag}>[ DOOH PLATFORM ]</Text>
            <Text style={styles.stampEdition}>2026</Text>
          </View>

          <Text style={styles.headerTitle}>Select Your Role</Text>
          <Text style={styles.headerSubtitle}>
            Choose how you want to get started.
          </Text>
        </Animated.View>

        {/* ═══════ 1. PASSENGER CARD ═══════ */}
        <Animated.View
          style={[
            styles.cardWrapper,
            { opacity: card1Opacity, transform: [{ translateY: card1TranslateY }] },
          ]}
        >
          <AnimatedPressable
            onPress={() => onSelectRole?.('passenger')}
            activeScale={0.96}
            style={styles.card}
          >
            <View style={styles.cardImageContainer}>
              <Image
                source={APP_IMAGES.rolePassenger}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardImageBadge}>
                <Text style={styles.badgeText}>PASSENGER</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.cardRole}>Passenger</Text>
                <Text style={styles.roleIndex}>[ 01 ]</Text>
              </View>

              <Text style={styles.cardTagline}>SCAN • EARN • REDEEM</Text>

              <Text style={styles.cardDescription}>
                Scan in-car screen ads to collect reward points and unlock deals.
              </Text>

              <View style={styles.cardCtaBtn}>
                <Text style={styles.cardCtaBtnText}>Continue as Passenger</Text>
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Path d="M5 12h14M12 5l7 7-7 7" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </View>
          </AnimatedPressable>
        </Animated.View>

        {/* ═══════ 2. DRIVER PARTNER CARD ═══════ */}
        <Animated.View
          style={[
            styles.cardWrapper,
            { opacity: card2Opacity, transform: [{ translateY: card2TranslateY }] },
          ]}
        >
          <AnimatedPressable
            onPress={() => onSelectRole?.('driver')}
            activeScale={0.96}
            style={styles.card}
          >
            <View style={styles.cardImageContainer}>
              <Image
                source={APP_IMAGES.roleDriver}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardImageBadgeGold}>
                <Text style={styles.badgeTextGold}>DRIVER</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.cardRole}>Driver Partner</Text>
                <Text style={styles.roleIndex}>[ 02 ]</Text>
              </View>

              <Text style={styles.cardTagline}>DRIVE • STREAM • EARN</Text>

              <Text style={styles.cardDescription}>
                Keep your vehicle screen active during rides to earn daily cash.
              </Text>

              <View style={styles.cardCtaBtn}>
                <Text style={styles.cardCtaBtnText}>Continue as Driver</Text>
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Path d="M5 12h14M12 5l7 7-7 7" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </View>
          </AnimatedPressable>
        </Animated.View>

        {/* ═══════ FOOTER ═══════ */}
        <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
          <Text style={styles.footerBrand}>DOOH NETWORK</Text>
          <Text style={styles.footerSub}>SMART IN-VEHICLE MEDIA</Text>
        </Animated.View>
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
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: 20,
  },
  stampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stampTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  stampEdition: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11,
    letterSpacing: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 34,
    lineHeight: 40,
    color: COLORS.navy,
    marginBottom: 6,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    color: COLORS.slate,
    lineHeight: 22,
  },
  cardWrapper: {
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  cardImageContainer: {
    width: '100%',
    height: 175,
    position: 'relative',
    backgroundColor: COLORS.navy,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  cardImageBadgeGold: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(233, 196, 106, 0.4)',
  },
  badgeTextGold: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.goldWarm,
    letterSpacing: 1.2,
  },
  cardContent: {
    padding: 18,
  },
  roleTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  cardRole: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: -0.5,
  },
  roleIndex: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1,
  },
  cardTagline: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.tealDark,
    fontSize: 11.5,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14.5,
    color: COLORS.slate,
    lineHeight: 21,
    marginBottom: 16,
  },
  cardCtaBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    ...SHADOWS.soft,
  },
  cardCtaBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderHairline,
    marginTop: 8,
  },
  footerBrand: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 2,
  },
  footerSub: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 10.5,
    letterSpacing: 1.2,
    marginTop: 4,
  },
});
