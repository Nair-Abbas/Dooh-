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

interface DriverSettingsScreenProps {
  onBack: () => void;
}

export const DriverSettingsScreen: React.FC<DriverSettingsScreenProps> = ({
  onBack,
}) => {
  const [autoStart, setAutoStart] = useState(true);
  const [autoDimming, setAutoDimming] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [surgeAlerts, setSurgeAlerts] = useState(true);

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

        <Text style={styles.topBarTitle}>HARDWARE & DISPLAY SETTINGS</Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTag}>SYSTEM PREFERENCES</Text>
          <Text style={styles.headerTitle}>Driver Controls.</Text>
        </View>

        {/* 1. DISPLAY & BROADCAST */}
        <View style={styles.settingGroup}>
          <Text style={styles.groupHeading}>Display & Automation</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Auto-Start Broadcast</Text>
              <Text style={styles.settingSub}>Launch ad loop automatically upon vehicle ignition</Text>
            </View>
            <Switch
              value={autoStart}
              onValueChange={setAutoStart}
              trackColor={{ false: '#E4E4E7', true: '#111111' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Ambient Auto-Dimming</Text>
              <Text style={styles.settingSub}>Adjust screen brightness for night vs sunny conditions</Text>
            </View>
            <Switch
              value={autoDimming}
              onValueChange={setAutoDimming}
              trackColor={{ false: '#E4E4E7', true: '#111111' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 2. NOTIFICATIONS */}
        <View style={styles.settingGroup}>
          <Text style={styles.groupHeading}>Audio & Alerts</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Screen Interaction Chimes</Text>
              <Text style={styles.settingSub}>Play soft subtle tone during interactive playback</Text>
            </View>
            <Switch
              value={soundAlerts}
              onValueChange={setSoundAlerts}
              trackColor={{ false: '#E4E4E7', true: '#111111' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>High-Density Broadcast Notices</Text>
              <Text style={styles.settingSub}>Alert when entering high-visibility advertising zones</Text>
            </View>
            <Switch
              value={surgeAlerts}
              onValueChange={setSurgeAlerts}
              trackColor={{ false: '#E4E4E7', true: '#111111' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 3. DIAGNOSTICS */}
        <View style={styles.settingGroup}>
          <Text style={styles.groupHeading}>Hardware Maintenance</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Diagnostic Test', 'Dual Headrest Smart Screens: OK (60 FPS)\n5G Ultra Wideband Sync: Connected (48ms)\nTouchscreen Digitizer: OK')}
            style={styles.linkRow}
          >
            <Text style={styles.linkLabel}>Run Full Hardware Diagnostics Test</Text>
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path d="M9 18l6-6-6-6" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Cache Cleared', 'Hardware offline buffer refreshed.')}
            style={[styles.linkRow, { borderBottomWidth: 0 }]}
          >
            <Text style={styles.linkLabel}>Clear Media Loop Cache</Text>
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
