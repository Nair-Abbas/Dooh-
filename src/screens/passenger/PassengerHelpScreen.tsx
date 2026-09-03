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
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';

interface PassengerHelpScreenProps {
  onBack: () => void;
}

const PASSENGER_FAQS = [
  {
    q: 'How do in-cabin DOOH screen rewards work?',
    a: 'When you take a ride in a vehicle equipped with smart headrest displays, simply tap or scan any active brand advertisement with your mobile camera. Points and promo vouchers are instantly credited to your wallet.',
  },
  {
    q: 'How do I redeem my collected points for discounts?',
    a: 'Each point has a monetary conversion rate of £0.01 (100 points = £1.00). In the Offers tab, copy any claimed promo code and apply it during checkout on our partner apps and websites.',
  },
  {
    q: 'Do points or claimed vouchers ever expire?',
    a: 'Points in your account never expire. Voucher codes have individual expiration dates displayed on the voucher pass ticket (typically 30–60 days).',
  },
  {
    q: 'What if a QR code fails to scan on the screen?',
    a: 'Ensure adequate screen brightness and hold your phone camera 15-20cm away from the headrest display. You can also tap the on-screen brand name on your app simulator to manually claim.',
  },
];

export const PassengerHelpScreen: React.FC<PassengerHelpScreenProps> = ({
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

        <Text style={styles.topBarTitle}>HELP & SUPPORT DESK</Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTag}>CUSTOMER CARE</Text>
          <Text style={styles.headerTitle}>Support Desk.</Text>
          <Text style={styles.headerSubtitle}>
            Frequently asked questions, scanning guides, and passenger assistance.
          </Text>
        </View>

        {/* Support Channels Card */}
        <View style={styles.channelsCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Customer Support', 'Connecting to DOOH Passenger Care: support@dooh.mobility')}
            style={styles.channelItem}
          >
            <View style={styles.channelIconCircle}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#111111" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M22 6l-10 7L2 6" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={styles.channelTextCol}>
              <Text style={styles.channelTitle}>Email Passenger Support</Text>
              <Text style={styles.channelSubtitle}>24/7 ticket response for reward queries</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.faqSectionHeading}>FREQUENTLY ASKED QUESTIONS</Text>

        <View style={styles.faqContainer}>
          {PASSENGER_FAQS.map((faq, index) => {
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
