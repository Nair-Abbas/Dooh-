import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

interface PassengerLoginScreenProps {
  onBack?: () => void;
  onNavigateToRegister?: () => void;
  onLoginSuccess?: (credentials: { identifier: string }) => void;
}

export const PassengerLoginScreen: React.FC<PassengerLoginScreenProps> = ({
  onBack,
  onNavigateToRegister,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = () => {
    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setErrorMsg(null);
    if (onLoginSuccess) {
      onLoginSuccess({ identifier: identifier.trim() });
    }
  };

  const handleDemoLogin = () => {
    setIdentifier('passenger@dooh.mobility');
    setPassword('dooh2026');
    setErrorMsg(null);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Nav with crisp back button border */}
          <View style={styles.topNav}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              style={styles.backBtn}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path
                  d="M15 19l-7-7 7-7"
                  stroke={COLORS.navy}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            <View style={styles.portalPill}>
              <Text style={styles.topNavTag}>PASSENGER PORTAL</Text>
            </View>

            <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToRegister}>
              <Text style={styles.registerQuickLink}>Register →</Text>
            </TouchableOpacity>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.stampBadge}>
              <Text style={styles.badgeTag}>IN-CABIN PASSENGER</Text>
            </View>
            <Text style={styles.heroTitle}>Login</Text>
          </View>

          {/* Value Highlight with Clear Boundaries */}
          <View style={styles.statsCard}>
            <View style={styles.statsIconCircle}>
              <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={COLORS.tealDark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={styles.statsTextCol}>
              <Text style={styles.statsHeading}>Instant Voucher Unlocks</Text>
              <Text style={styles.statsSub}>
                Over 250+ mobility and retail partner discounts redeemable on your trips.
              </Text>
            </View>
          </View>

          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.formSection}>
            {/* Identifier Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL OR MOBILE NUMBER</Text>
              <View style={[styles.inputBox, activeInput === 'id' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com or +44 7700 900..."
                  placeholderTextColor={COLORS.slateLight}
                  value={identifier}
                  onChangeText={setIdentifier}
                  onFocus={() => setActiveInput('id')}
                  onBlur={() => setActiveInput(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={[styles.inputBox, activeInput === 'pwd' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••••••"
                  placeholderTextColor={COLORS.slateLight}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setActiveInput('pwd')}
                  onBlur={() => setActiveInput(null)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Text style={styles.eyeBtnText}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <AnimatedPressable
              onPress={handleLogin}
              activeScale={0.97}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>Login</Text>
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path d="M5 12h14M12 5l7 7-7 7" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </AnimatedPressable>

            {/* Auto Fill Demo */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDemoLogin}
              style={styles.demoFillBtn}
            >
              <Text style={styles.demoFillBtnText}>⚡ Demo Login (passenger@dooh.mobility)</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Register Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to DOOH Rewards?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToRegister}>
              <Text style={styles.registerBottomLink}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: SAFE_TOP_PADDING,
    paddingBottom: 32,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  portalPill: {
    backgroundColor: COLORS.backgroundMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topNavTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  registerQuickLink: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  headerSection: {
    marginBottom: 18,
  },
  stampBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.teal,
    marginBottom: 8,
  },
  badgeTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.tealDark,
    fontSize: 10.5,
    letterSpacing: 1.2,
  },
  heroTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 34,
    lineHeight: 40,
    color: COLORS.navy,
    marginBottom: 6,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    color: COLORS.slate,
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
    ...SHADOWS.soft,
  },
  statsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.tealLight,
    borderWidth: 1,
    borderColor: COLORS.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsTextCol: {
    flex: 1,
  },
  statsHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 2,
  },
  statsSub: {
    fontSize: 13,
    color: COLORS.slate,
    lineHeight: 18,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 18,
  },
  errorText: {
    fontSize: 13.5,
    color: COLORS.error,
    fontWeight: '700',
  },
  formSection: {
    gap: 18,
    marginBottom: 22,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    fontSize: 11.5,
    letterSpacing: 1,
    fontWeight: '800',
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBoxActive: {
    borderColor: COLORS.navy,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.navy,
    fontWeight: '600',
  },
  eyeBtn: {
    paddingHorizontal: 8,
  },
  eyeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 1,
  },
  submitBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.navyDeep,
    ...SHADOWS.soft,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  demoFillBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundMuted,
  },
  demoFillBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.slate,
  },
  registerBottomLink: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
});
