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

interface PassengerRegisterScreenProps {
  onBack?: () => void;
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: (userData: { fullName: string; phone: string; email: string }) => void;
}

export const PassengerRegisterScreen: React.FC<PassengerRegisterScreenProps> = ({
  onBack,
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = () => {
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Please fill in all personal details');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setErrorMsg(null);
    if (onRegisterSuccess) {
      onRegisterSuccess({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
    }
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
          {/* Top Nav */}
          <View style={styles.topNav}>
            <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path d="M15 19l-7-7 7-7" stroke={COLORS.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>

            <View style={styles.portalPill}>
              <Text style={styles.topNavTag}>PASSENGER ONBOARDING</Text>
            </View>

            <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToLogin}>
              <Text style={styles.signInQuickLink}>Login →</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.stampBadge}>
              <Text style={styles.badgeTag}>ACCOUNT ENROLLMENT</Text>
            </View>
            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.heroSubtitle}>
              Earn 250 bonus reward points upon registration to spend on verified partner discounts.
            </Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={[styles.inputBox, activeInput === 'name' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Elena Rostova"
                  placeholderTextColor={COLORS.slateLight}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setActiveInput('name')}
                  onBlur={() => setActiveInput(null)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MOBILE PHONE</Text>
              <View style={[styles.inputBox, activeInput === 'phone' && styles.inputBoxActive]}>
                <View style={styles.countryCodeBadge}>
                  <Text style={styles.countryCodeText}>+44</Text>
                </View>
                <TextInput
                  style={[styles.textInput, { marginLeft: 8 }]}
                  placeholder="7911 123456"
                  placeholderTextColor={COLORS.slateLight}
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setActiveInput('phone')}
                  onBlur={() => setActiveInput(null)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View style={[styles.inputBox, activeInput === 'email' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="elena@example.com"
                  placeholderTextColor={COLORS.slateLight}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setActiveInput('email')}
                  onBlur={() => setActiveInput(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CREATE PASSWORD (MIN 6 CHARACTERS)</Text>
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

            {/* Bonus Banner with Clear Boundaries */}
            <View style={styles.bonusBanner}>
              <View style={styles.bonusIcon}>
                <Text style={{ fontSize: 16 }}>🎁</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bonusTitle}>Welcome Bonus: +250 Points (£2.50)</Text>
                <Text style={styles.bonusSub}>Credited immediately upon account registration</Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleRegister}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>Create Passenger Account</Text>
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path d="M5 12h14M12 5l7 7-7 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Footer Sign In Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToLogin}>
              <Text style={styles.signInBottomLink}> Login</Text>
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
    paddingBottom: 40,
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
  signInQuickLink: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  headerSection: {
    marginBottom: 20,
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
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 18,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '700',
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    fontSize: 11,
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
  countryCodeBadge: {
    backgroundColor: COLORS.backgroundMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.navy,
    fontWeight: '600',
  },
  eyeBtn: {
    paddingHorizontal: 6,
  },
  eyeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 1,
  },
  bonusBanner: {
    backgroundColor: COLORS.goldLight,
    borderWidth: 1.5,
    borderColor: COLORS.goldWarm,
    borderRadius: RADIUS.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    ...SHADOWS.soft,
  },
  bonusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.goldWarm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bonusTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.goldDark,
  },
  bonusSub: {
    fontSize: 12,
    color: COLORS.slate,
  },
  submitBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.navyDeep,
    ...SHADOWS.soft,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
  signInBottomLink: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
});
