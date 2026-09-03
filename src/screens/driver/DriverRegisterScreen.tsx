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
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';

interface DriverRegisterScreenProps {
  onBack: () => void;
  onNavigateToLogin: () => void;
  onRegisterSuccess: (driverData: any) => void;
}

export const DriverRegisterScreen: React.FC<DriverRegisterScreenProps> = ({
  onBack,
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  // Personal Details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // License Details
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');

  // Vehicle Details
  const [vehicleModel, setVehicleModel] = useState('');
  const [plate, setPlate] = useState('');
  const [hardwareId, setHardwareId] = useState('');

  // Fleet Affiliation Details
  const [fleetType, setFleetType] = useState<'individual' | 'fleet'>('individual');
  const [fleetName, setFleetName] = useState('');
  const [fleetId, setFleetId] = useState('');

  // Payment / Bank Details (Required)
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [iban, setIban] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Security
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = () => {
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Please fill in your personal contact details');
      return;
    }
    if (!licenseNumber.trim()) {
      setErrorMsg('Please enter your Driver License / PHV Badge Number');
      return;
    }
    if (!vehicleModel.trim() || !plate.trim()) {
      setErrorMsg('Please enter your vehicle make, model and plate number');
      return;
    }
    if (fleetType === 'fleet') {
      if (!fleetName.trim()) {
        setErrorMsg('Please enter your Fleet Operator or Company Name');
        return;
      }
      if (!fleetId.trim()) {
        setErrorMsg('Please enter your Fleet Operator ID or Partner Code');
        return;
      }
    }
    if (!bankName.trim() || !accountHolderName.trim() || !iban.trim() || !accountNumber.trim()) {
      setErrorMsg('Please complete all required bank & payout details');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setErrorMsg(null);
    onRegisterSuccess({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      licenseNumber: licenseNumber.trim().toUpperCase(),
      licenseExpiry: licenseExpiry.trim() || '14/10/2028',
      vehicleModel: vehicleModel.trim(),
      plate: plate.trim().toUpperCase(),
      hardwareId: hardwareId.trim() || 'DOOH-HD-PENDING-KIT',
      fleetType,
      fleetName: fleetType === 'fleet' ? fleetName.trim() : undefined,
      fleetId: fleetType === 'fleet' ? fleetId.trim().toUpperCase() : undefined,
      bankName: bankName.trim(),
      accountHolderName: accountHolderName.trim(),
      iban: iban.trim().toUpperCase(),
      accountNumber: accountNumber.trim(),
    });
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
          {/* Top Bar */}
          <View style={styles.topNav}>
            <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path d="M15 19l-7-7 7-7" stroke={COLORS.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>

            <View style={styles.portalPill}>
              <Text style={styles.topNavTag}>DRIVER ONBOARDING</Text>
            </View>

            <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToLogin}>
              <Text style={styles.signInQuickLink}>Login →</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.stampBadge}>
              <Text style={styles.badgeTag}>VEHICLE PARTNER ENROLLMENT</Text>
            </View>
            <Text style={styles.heroTitle}>Register Your{'\n'}Vehicle.</Text>
            <Text style={styles.heroSubtitle}>
              Join the DOOH mobility partner fleet. Turn your in-cabin headrest displays into a verified digital broadcast network.
            </Text>
          </View>

          {/* Partner Highlight Banner */}
          <View style={styles.hardwareBanner}>
            <View style={styles.hardwareBadge}>
              <Text style={styles.hardwareBadgeText}>DIRECT DISBURSEMENTS</Text>
            </View>
            <View style={styles.hardwareTextCol}>
              <Text style={styles.hardwareTitle}>Direct Bank Payouts</Text>
              <Text style={styles.hardwareDesc}>
                Set up your vehicle and payout details to begin receiving platform revenue.
              </Text>
            </View>
          </View>

          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠ {errorMsg}</Text>
            </View>
          ) : null}

          {/* ═══════ SECTION 1: PERSONAL CONTACT DETAILS ═══════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>[ 01 ] PERSONAL CONTACT DETAILS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL LEGAL NAME</Text>
              <View style={[styles.inputBox, activeInput === 'name' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Tariq Al-Mansoor"
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
                  placeholder="7700 900123"
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
                  placeholder="tariq@example.com"
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
          </View>

          {/* ═══════ SECTION 2: LICENSE DETAILS ═══════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>[ 02 ] DRIVER LICENSE DETAILS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>LICENSE / PHV BADGE NUMBER</Text>
              <View style={[styles.inputBox, activeInput === 'lic' && styles.inputBoxActive]}>
                <TextInput
                  style={[styles.textInput, { letterSpacing: 1.5, fontWeight: '700' }]}
                  placeholder="e.g. PHV-788920-LON"
                  placeholderTextColor={COLORS.slateLight}
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                  onFocus={() => setActiveInput('lic')}
                  onBlur={() => setActiveInput(null)}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EXPIRY DATE</Text>
              <View style={[styles.inputBox, activeInput === 'exp' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="DD/MM/YYYY (e.g. 14/10/2028)"
                  placeholderTextColor={COLORS.slateLight}
                  value={licenseExpiry}
                  onChangeText={setLicenseExpiry}
                  onFocus={() => setActiveInput('exp')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>
          </View>

          {/* ═══════ SECTION 3: VEHICLE INFORMATION ═══════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>[ 03 ] REGISTERED VEHICLE DETAILS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>VEHICLE MAKE, MODEL & YEAR</Text>
              <View style={[styles.inputBox, activeInput === 'model' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Mercedes-Benz EQE (2024)"
                  placeholderTextColor={COLORS.slateLight}
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                  onFocus={() => setActiveInput('model')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>VEHICLE NUMBER PLATE (UK)</Text>
              <View style={[styles.inputBox, activeInput === 'plate' && styles.inputBoxActive]}>
                <TextInput
                  style={[styles.textInput, { letterSpacing: 2, fontWeight: '700' }]}
                  placeholder="e.g. LD74 DOO"
                  placeholderTextColor={COLORS.slateLight}
                  value={plate}
                  onChangeText={setPlate}
                  onFocus={() => setActiveInput('plate')}
                  onBlur={() => setActiveInput(null)}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>HARDWARE KIT SERIAL (OPTIONAL)</Text>
              <View style={[styles.inputBox, activeInput === 'hw' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="DOOH-HD-8849-DUAL (Or leave blank)"
                  placeholderTextColor={COLORS.slateLight}
                  value={hardwareId}
                  onChangeText={setHardwareId}
                  onFocus={() => setActiveInput('hw')}
                  onBlur={() => setActiveInput(null)}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>

          {/* ═══════ SECTION 4: FLEET OPERATOR AFFILIATION ═══════ */}
          <View style={styles.sectionCard}>
            <View style={styles.payoutHeaderRow}>
              <Text style={styles.sectionHeading}>[ 04 ] FLEET AFFILIATION & OPERATOR</Text>
              <View style={[styles.requiredPill, { backgroundColor: COLORS.tealLight, borderColor: COLORS.teal }]}>
                <Text style={[styles.requiredPillText, { color: COLORS.tealDark }]}>PARTNER TYPE</Text>
              </View>
            </View>
            <Text style={styles.payoutExplainer}>
              Specify whether you are operating independently or as part of a registered commercial fleet operator.
            </Text>

            {/* Selection Cards */}
            <View style={styles.fleetTypeContainer}>
              {/* Option A: Individual */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setFleetType('individual')}
                style={[
                  styles.fleetOptionCard,
                  fleetType === 'individual' && styles.fleetOptionCardActive,
                ]}
              >
                <View style={styles.fleetOptionHeader}>
                  <View
                    style={[
                      styles.radioCircle,
                      fleetType === 'individual' && styles.radioCircleActive,
                    ]}
                  >
                    {fleetType === 'individual' && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.fleetOptionTitle,
                      fleetType === 'individual' && styles.fleetOptionTitleActive,
                    ]}
                  >
                    Individual Operator
                  </Text>
                </View>
                <Text style={styles.fleetOptionDesc}>
                  Independent private hire / owner-driver. Direct personal payouts.
                </Text>
              </TouchableOpacity>

              {/* Option B: Part of Fleet */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setFleetType('fleet')}
                style={[
                  styles.fleetOptionCard,
                  fleetType === 'fleet' && styles.fleetOptionCardActive,
                ]}
              >
                <View style={styles.fleetOptionHeader}>
                  <View
                    style={[
                      styles.radioCircle,
                      fleetType === 'fleet' && styles.radioCircleActive,
                    ]}
                  >
                    {fleetType === 'fleet' && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.fleetOptionTitle,
                      fleetType === 'fleet' && styles.fleetOptionTitleActive,
                    ]}
                  >
                    Part of Fleet Operator
                  </Text>
                </View>
                <Text style={styles.fleetOptionDesc}>
                  Associated with a taxi / PHV fleet management company.
                </Text>
              </TouchableOpacity>
            </View>

            {/* If Fleet Selected -> Show Fleet Name & ID inputs */}
            {fleetType === 'fleet' && (
              <View style={styles.fleetFieldsBox}>
                <View style={styles.fleetGuidanceBanner}>
                  <Text style={styles.fleetGuidanceTag}>FLEET VERIFICATION</Text>
                  <Text style={styles.fleetGuidanceText}>
                    Your registration will be linked to your Fleet Manager’s DOOH console for centralized broadcast hardware monitoring.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FLEET OPERATOR / COMPANY NAME</Text>
                  <View style={[styles.inputBox, activeInput === 'fleetName' && styles.inputBoxActive]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Addison Lee / Green Motion / City Fleet"
                      placeholderTextColor={COLORS.slateLight}
                      value={fleetName}
                      onChangeText={setFleetName}
                      onFocus={() => setActiveInput('fleetName')}
                      onBlur={() => setActiveInput(null)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FLEET OPERATOR ID / PARTNER CODE</Text>
                  <View style={[styles.inputBox, activeInput === 'fleetId' && styles.inputBoxActive]}>
                    <TextInput
                      style={[styles.textInput, { letterSpacing: 1.5, fontWeight: '700' }]}
                      placeholder="e.g. FLT-LON-88902"
                      placeholderTextColor={COLORS.slateLight}
                      value={fleetId}
                      onChangeText={setFleetId}
                      onFocus={() => setActiveInput('fleetId')}
                      onBlur={() => setActiveInput(null)}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* ═══════ SECTION 5: PAYMENT & BANK DETAILS (REQUIRED) ═══════ */}
          <View style={styles.sectionCard}>
            <View style={styles.payoutHeaderRow}>
              <Text style={styles.sectionHeading}>[ 05 ] PAYMENT & BANK DETAILS</Text>
              <View style={styles.requiredPill}>
                <Text style={styles.requiredPillText}>REQUIRED</Text>
              </View>
            </View>
            <Text style={styles.payoutExplainer}>
              Enter your verified bank information to receive direct platform earnings.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>BANK NAME</Text>
              <View style={[styles.inputBox, activeInput === 'bank' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Barclays / NatWest / HSBC"
                  placeholderTextColor={COLORS.slateLight}
                  value={bankName}
                  onChangeText={setBankName}
                  onFocus={() => setActiveInput('bank')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ACCOUNT HOLDER NAME</Text>
              <View style={[styles.inputBox, activeInput === 'holder' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Tariq Al-Mansoor"
                  placeholderTextColor={COLORS.slateLight}
                  value={accountHolderName}
                  onChangeText={setAccountHolderName}
                  onFocus={() => setActiveInput('holder')}
                  onBlur={() => setActiveInput(null)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>IBAN</Text>
              <View style={[styles.inputBox, activeInput === 'iban' && styles.inputBoxActive]}>
                <TextInput
                  style={[styles.textInput, { letterSpacing: 1.5, fontWeight: '700' }]}
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                  placeholderTextColor={COLORS.slateLight}
                  value={iban}
                  onChangeText={setIban}
                  onFocus={() => setActiveInput('iban')}
                  onBlur={() => setActiveInput(null)}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ACCOUNT NUMBER</Text>
              <View style={[styles.inputBox, activeInput === 'accNo' && styles.inputBoxActive]}>
                <TextInput
                  style={[styles.textInput, { letterSpacing: 1.5 }]}
                  placeholder="8 Digit Account Number (e.g. 13319268)"
                  placeholderTextColor={COLORS.slateLight}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  onFocus={() => setActiveInput('accNo')}
                  onBlur={() => setActiveInput(null)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* ═══════ SECTION 6: ACCOUNT SECURITY ═══════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>[ 06 ] PORTAL SECURITY</Text>

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

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleRegister}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>Submit Driver Registration</Text>
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path d="M5 12h14M12 5l7 7-7 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Footer Sign In Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already registered vehicle?</Text>
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
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 40,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderHairline,
    ...SHADOWS.soft,
  },
  topNavTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    letterSpacing: 1.8,
  },
  signInQuickLink: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.teal,
  },
  headerSection: {
    marginBottom: 24,
  },
  stampBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.backgroundMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    marginBottom: 10,
  },
  badgeTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 8.5,
    letterSpacing: 1.5,
  },
  heroTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 38,
    lineHeight: 44,
    color: COLORS.navy,
    marginBottom: 8,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.slate,
    lineHeight: 20,
  },
  hardwareBanner: {
    backgroundColor: COLORS.tealLight,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    borderRadius: RADIUS.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  hardwareBadge: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  hardwareBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  hardwareTextCol: {
    flex: 1,
  },
  hardwareTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.tealDark,
    marginBottom: 2,
  },
  hardwareDesc: {
    fontSize: 11,
    color: COLORS.slate,
    lineHeight: 15,
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
    fontSize: 12.5,
    color: COLORS.error,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderHairline,
    padding: 18,
    marginBottom: 20,
    gap: 14,
    ...SHADOWS.soft,
  },
  sectionHeading: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 9.5,
    letterSpacing: 1.5,
  },
  payoutHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requiredPill: {
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1.5,
    borderColor: COLORS.goldWarm,
  },
  requiredPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.goldDark,
    letterSpacing: 0.8,
  },
  payoutExplainer: {
    fontSize: 11.5,
    color: COLORS.slate,
    lineHeight: 16,
    marginTop: -4,
  },
  fleetTypeContainer: {
    gap: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  fleetOptionCard: {
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.borderHairline,
    padding: 14,
    gap: 6,
  },
  fleetOptionCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.navy,
    ...SHADOWS.soft,
  },
  fleetOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.slateLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: COLORS.navy,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.navy,
  },
  fleetOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate,
  },
  fleetOptionTitleActive: {
    color: COLORS.navy,
    fontWeight: '900',
  },
  fleetOptionDesc: {
    fontSize: 12,
    color: COLORS.slateLight,
    lineHeight: 16,
    paddingLeft: 30,
  },
  fleetFieldsBox: {
    marginTop: 8,
    gap: 14,
    paddingTop: 10,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.borderHairline,
  },
  fleetGuidanceBanner: {
    backgroundColor: COLORS.tealLight,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    borderRadius: RADIUS.xs,
    padding: 10,
    gap: 3,
  },
  fleetGuidanceTag: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.tealDark,
    letterSpacing: 1,
  },
  fleetGuidanceText: {
    fontSize: 11.5,
    color: COLORS.navy,
    lineHeight: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    fontSize: 9,
    letterSpacing: 1.2,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.slateBorder,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBoxActive: {
    borderColor: COLORS.navy,
    backgroundColor: '#FFFFFF',
  },
  countryCodeBadge: {
    backgroundColor: COLORS.backgroundMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  countryCodeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.navy,
    fontWeight: '500',
  },
  eyeBtn: {
    paddingHorizontal: 6,
  },
  eyeBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 1,
  },
  submitBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    ...SHADOWS.soft,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footerRow: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.slate,
  },
  signInBottomLink: {
    color: COLORS.navy,
  },
});
