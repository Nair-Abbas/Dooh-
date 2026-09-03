import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';

interface DriverHelpScreenProps {
  onBack: () => void;
}

const DRIVER_FAQS = [
  {
    q: 'How do in-cabin screens broadcast during shifts?',
    a: 'Simply ensure the master toggle on your Driver Dashboard is switched to "Online". Both headrest touchscreens will automatically sync over 5G and cycle the verified partner brand campaigns.',
  },
  {
    q: 'When and how are driver payouts disbursed?',
    a: 'You can tap "Request Instant Bank Payout" anytime on the Earnings tab to transfer your balance directly into your verified bank account with zero fees. Automatic batch payouts occur every Monday morning.',
  },
  {
    q: 'How does driver earnings and revenue allocation work?',
    a: 'Platform earnings are calculated and credited directly to your driver wallet by the DOOH fleet network. You can review your complete earning history with dates, amounts, and payment references on the Earnings tab.',
  },
  {
    q: 'What if a headrest screen loses power or disconnects?',
    a: 'Check that the screen power harness under the passenger seat is firmly seated. If the display fails to reconnect after restarting your vehicle, tap "Request Screen Kit Service" below for a free technician visit.',
  },
];

export const DriverHelpScreen: React.FC<DriverHelpScreenProps> = ({
  onBack,
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
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

        <Text style={styles.topBarTitle}>DRIVER & HARDWARE DESK</Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTag}>PARTNER ASSISTANCE</Text>
          <Text style={styles.headerTitle}>Driver Support.</Text>
          <Text style={styles.headerSubtitle}>
            24/7 assistance for vehicle hardware maintenance, revenue questions, and technical support.
          </Text>
        </View>

        {/* Support Channels Card */}
        <View style={styles.channelsCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Priority Driver Line', 'Connecting to 24/7 Priority Partner Dispatch: 0800 900 DOOH')}
            style={styles.channelItem}
          >
            <View style={styles.channelIconCircle}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={styles.channelTextCol}>
              <Text style={styles.channelTitle}>24/7 Driver Partner Hotline</Text>
              <Text style={styles.channelSubtitle}>Instant phone support for active drivers</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.channelDivider} />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Hardware Service', 'Technician dispatch scheduled for vehicle LN74 DOO.')}
            style={styles.channelItem}
          >
            <View style={styles.channelIconCircle}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={styles.channelTextCol}>
              <Text style={styles.channelTitle}>Request Screen Kit Service</Text>
              <Text style={styles.channelSubtitle}>Free hardware replacement & maintenance</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.faqSectionHeading}>FREQUENTLY ASKED QUESTIONS</Text>

        <View style={styles.faqContainer}>
          {DRIVER_FAQS.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleFaq(index)}
                  style={styles.faqHeader}
                >
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                  >
                    <Path d="M6 9l6 6 6-6" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.faqBody}>
                    <Text style={styles.faqAnswer}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
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
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: '#71717A',
    lineHeight: 18,
    marginTop: 4,
  },
  channelsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#ECECEE',
    padding: 16,
    marginBottom: 24,
    ...SHADOWS.soft,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 6,
  },
  channelIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelTextCol: {
    flex: 1,
  },
  channelTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  channelSubtitle: {
    fontSize: 11,
    color: '#71717A',
  },
  channelDivider: {
    height: 1,
    backgroundColor: '#ECECEE',
    marginVertical: 12,
  },
  faqSectionHeading: {
    ...TYPOGRAPHY.microTag,
    color: '#71717A',
    fontSize: 9.5,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#ECECEE',
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEE',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111111',
    flex: 1,
    paddingRight: 12,
  },
  faqBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  faqAnswer: {
    fontSize: 12.5,
    color: '#71717A',
    lineHeight: 19,
  },
});
