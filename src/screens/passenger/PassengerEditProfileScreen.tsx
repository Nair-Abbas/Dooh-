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
import { usePassenger } from '../../context/PassengerContext';

interface PassengerEditProfileScreenProps {
  onBack: () => void;
}

export const PassengerEditProfileScreen: React.FC<PassengerEditProfileScreenProps> = ({
  onBack,
}) => {
  const { profile, updateProfile } = usePassenger();
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (!fullName.trim() || !phone.trim() || !email.trim()) return;

    updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onBack();
    }, 1200);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ═══════ TOP BAR ═══════ */}
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M15 19l-7-7 7-7" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>EDIT PERSONAL DETAILS</Text>

        <TouchableOpacity activeOpacity={0.7} onPress={handleSave} style={styles.saveHeaderBtn}>
          <Text style={styles.saveHeaderBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {saveSuccess && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>✓ Profile Changes Saved</Text>
            </View>
          )}

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={[styles.inputBox, activeInput === 'name' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setActiveInput('name')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MOBILE PHONE</Text>
              <View style={[styles.inputBox, activeInput === 'phone' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
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

          <TouchableOpacity activeOpacity={0.85} onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Profile Updates</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEE',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#ECECEE',
    ...SHADOWS.soft,
  },
  topBarTitle: {
    ...TYPOGRAPHY.microTag,
    color: '#111111',
    letterSpacing: 2,
    fontSize: 10.5,
  },
  saveHeaderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveHeaderBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  successBanner: {
    backgroundColor: '#F4F4F6',
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  successBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
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
    color: '#111111',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#ECECEE',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: 'center',
  },
  inputBoxActive: {
    borderColor: '#111111',
  },
  textInput: {
    fontSize: 14.5,
    color: '#111111',
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  saveBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
