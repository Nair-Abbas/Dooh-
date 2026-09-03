import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';

interface PassengerSettingsScreenProps {
  onBack: () => void;
}

export const PassengerSettingsScreen: React.FC<PassengerSettingsScreenProps> = ({
  onBack,
}) => {
  const [notifications, setNotifications] = useState(true);
  const [locationRewards, setLocationRewards] = useState(true);
  const [highValueAlerts, setHighValueAlerts] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

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

        <Text style={styles.topBarTitle}>SETTINGS & PREFERENCES</Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTag}>SYSTEM PREFERENCES</Text>
          <Text style={styles.headerTitle}>Account Settings.</Text>
        </View>

        {/* 1. NOTIFICATIONS */}
        <View style={styles.settingGroup}>
          <Text style={styles.groupHeading}>Reward Alerts & Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>In-Cabin QR Scan Notifications</Text>
              <Text style={styles.settingSub}>Instant confirmation when scanning headrest screen</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E4E4E7', true: '#111111' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>High-Value Discount Bounties</Text>
              <Text style={styles.settingSub}>Alerts for 500+ PTS partner promotional campaigns</Text>
            </View>
            <Switch
              value={highValueAlerts}
              onValueChange={setHighValueAlerts}
              trackColor={{ false: '#E4E4E7', true: '#111111' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 2. LOCATION */}
        <View style={styles.settingGroup}>
          <Text style={styles.groupHeading}>Ride & Location Context</Text>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Nearby Partner Offers</Text>
              <Text style={styles.settingSub}>Show discounts matching your current vehicle destination</Text>
            </View>
            <Switch
              value={locationRewards}
              onValueChange={setLocationRewards}
              trackColor={{ false: '#E4E4E7', true: '#111111' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 3. SECURITY */}
        <View style={styles.settingGroup}>
          <Text style={styles.groupHeading}>Security & Privacy</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Biometric Unlock</Text>
              <Text style={styles.settingSub}>Require Face ID / Fingerprint to open voucher wallet</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: '#E4E4E7', true: '#111111' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Privacy Policy', 'DOOH Platform encrypts all ride telemetry and interaction data.')}
            style={[styles.linkRow, { borderBottomWidth: 0 }]}
          >
            <Text style={styles.linkLabel}>Privacy Policy & Data Rights</Text>
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path d="M9 18l6-6-6-6" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 20,
  },
  headerTag: {
    ...TYPOGRAPHY.microTag,
    color: '#71717A',
    letterSpacing: 2,
    marginBottom: 6,
  },
  headerTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 32,
    lineHeight: 38,
    color: '#111111',
  },
  settingGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#ECECEE',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 20,
    ...SHADOWS.soft,
  },
  groupHeading: {
    ...TYPOGRAPHY.microTag,
    color: '#71717A',
    fontSize: 9.5,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEE',
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 14,
  },
  settingLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  settingSub: {
    fontSize: 11,
    color: '#71717A',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  linkLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#111111',
  },
});
