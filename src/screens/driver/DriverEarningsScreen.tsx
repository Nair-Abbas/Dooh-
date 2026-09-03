import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { useDriver } from '../../context/DriverContext';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';

export const DriverEarningsScreen: React.FC = () => {
  const {
    totalEarnings,
    totalBalance,
    earningHistory,
    profile,
    recentPayouts,
    requestPayout,
    deletePayoutRecord,
  } = useDriver();

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(totalBalance.toFixed(0));
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'payouts'>('history');

  const checkScale = useRef(new Animated.Value(0)).current;

  const handleConfirmPayout = () => {
    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > totalBalance) {
      Alert.alert('Invalid Amount', `Please enter an amount up to £${totalBalance.toFixed(2)}`);
      return;
    }

    const success = requestPayout(amountNum);
    if (success) {
      setPayoutSuccess(true);
      checkScale.setValue(0);
      Animated.spring(checkScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();

      setTimeout(() => {
        setPayoutSuccess(false);
        setShowPayoutModal(false);
      }, 1600);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══════ TOP HEADER (NO AWKWARD TOP VOID) ═══════ */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTag}>DRIVER REVENUE & WALLET</Text>
          <Text style={styles.headerTitle}>Driver Earnings</Text>
        </View>

        {/* ═══════ TOTAL EARNINGS & BALANCE HERO CARD ═══════ */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <View>
              <Text style={styles.balanceLabel}>TOTAL ACCUMULATED EARNINGS</Text>
              <AnimatedCounter
                value={totalEarnings}
                prefix="£"
                decimals={2}
                duration={900}
                style={styles.totalEarningsNumber}
              />
            </View>

            <View style={styles.availableBalancePill}>
              <Text style={styles.availableBalanceLabel}>PAYOUT BALANCE</Text>
              <AnimatedCounter
                value={totalBalance}
                prefix="£"
                decimals={2}
                duration={900}
                style={styles.availableBalanceValue}
              />
            </View>
          </View>

          <Text style={styles.balanceSub}>
            Direct Bank Payouts to {profile.paymentDetails.bankName} (•••• {profile.paymentDetails.accountNumber.slice(-4) || '2011'})
          </Text>

          <AnimatedPressable
            onPress={() => {
              setPayoutAmount(totalBalance.toFixed(0));
              setShowPayoutModal(true);
            }}
            activeScale={0.97}
            style={styles.withdrawBtn}
          >
            <Text style={styles.withdrawBtnText}>Request Bank Payout</Text>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M5 12h14M12 5l7 7-7 7" stroke={COLORS.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </AnimatedPressable>
        </View>

        {/* ═══════ FAST PAYOUT METRIC HIGHLIGHTS ═══════ */}
        <View style={styles.highlightsRow}>
          <View style={styles.highlightCol}>
            <Text style={styles.highlightColLabel}>NEXT CYCLE</Text>
            <Text style={styles.highlightColVal}>Instant (Faster Payments)</Text>
          </View>
          <View style={styles.highlightColDivider} />
          <View style={styles.highlightCol}>
            <Text style={styles.highlightColLabel}>PAYOUT METHOD</Text>
            <Text style={styles.highlightColVal}>UK Direct BACS</Text>
          </View>
        </View>

        {/* ═══════ SEGMENTED TOGGLE (HISTORY VS PAYOUTS) ═══════ */}
        <View style={styles.segmentedToggle}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('history')}
            style={[styles.toggleBtn, activeTab === 'history' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleBtnText, activeTab === 'history' && styles.toggleBtnTextActive]}>
              Earning History ({earningHistory.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('payouts')}
            style={[styles.toggleBtn, activeTab === 'payouts' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleBtnText, activeTab === 'payouts' && styles.toggleBtnTextActive]}>
              Bank Payouts ({recentPayouts.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ═══════ TAB 1: EARNING HISTORY ═══════ */}
        {activeTab === 'history' && (
          <View style={styles.listContainer}>
            {earningHistory.map((record) => (
              <View key={record.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>{record.date}</Text>
                  <Text style={styles.historyRef}>Ref: {record.paymentReference}</Text>
                </View>

                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>+£{record.amount.toFixed(2)}</Text>
                  <View style={[styles.statusPill, record.status === 'paid' ? styles.statusPillPaid : styles.statusPillPending]}>
                    <Text style={[styles.statusPillText, { color: record.status === 'paid' ? COLORS.tealDark : COLORS.goldMuted }]}>
                      {record.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ═══════ TAB 2: BANK PAYOUTS (CRUD DELETE) ═══════ */}
        {activeTab === 'payouts' && (
          <View style={styles.listContainer}>
            {recentPayouts.map((payout) => (
              <View key={payout.id} style={styles.payoutCard}>
                <View style={styles.payoutIconBox}>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" stroke={COLORS.goldMuted} strokeWidth="2" strokeLinecap="round" />
                  </Svg>
                </View>

                <View style={styles.payoutDetails}>
                  <Text style={styles.payoutMethod}>{payout.method}</Text>
                  <Text style={styles.payoutDate}>{payout.date}</Text>
                </View>

                <View style={styles.payoutAmountBox}>
                  <Text style={styles.payoutAmountText}>-£{payout.amount.toFixed(2)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.payoutStatusTag}>
                      {payout.status === 'completed' ? '✓ SENT' : 'PROCESSING'}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => deletePayoutRecord(payout.id)}
                      style={{ padding: 2 }}
                    >
                      <Text style={{ fontSize: 13, color: COLORS.slateLight }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ═══════ PAYOUT REQUEST MODAL ═══════ */}
        <Modal
          visible={showPayoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPayoutModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              {payoutSuccess ? (
                <View style={styles.successStateCol}>
                  <Animated.View style={[styles.successCheckBubble, { transform: [{ scale: checkScale }] }]}>
                    <Svg width={36} height={36} viewBox="0 0 24 24">
                      <Path d="M20 6L9 17l-5-5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </Animated.View>
                  <Text style={styles.successHeading}>Payout Dispatched!</Text>
                  <Text style={styles.successSub}>
                    £{parseFloat(payoutAmount || '0').toFixed(2)} is being processed via UK Faster Payments to your verified account.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Request Instant Payout</Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPayoutModal(false)} style={styles.modalCloseBtn}>
                      <Text style={styles.modalCloseText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalSub}>
                    Funds will be disbursed to your registered UK bank account within 30 minutes.
                  </Text>

                  {/* Bank Destination preview */}
                  <View style={styles.bankTargetCard}>
                    <Text style={styles.bankTargetLabel}>DESTINATION ACCOUNT</Text>
                    <Text style={styles.bankTargetName}>{profile.paymentDetails.bankName}</Text>
                    <Text style={styles.bankTargetHolder}>{profile.paymentDetails.accountHolderName} • Acc: •••• {profile.paymentDetails.accountNumber.slice(-4) || '2011'}</Text>
                  </View>

                  {/* Amount Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ENTER PAYOUT AMOUNT (£ GBP)</Text>
                    <View style={styles.inputBox}>
                      <Text style={styles.poundSymbol}>£</Text>
                      <TextInput
                        style={styles.textInput}
                        value={payoutAmount}
                        onChangeText={setPayoutAmount}
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor={COLORS.slateLight}
                      />
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPayoutAmount(totalBalance.toFixed(0))}
                        style={styles.maxBtn}
                      >
                        <Text style={styles.maxBtnText}>MAX</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.modalBtnRow}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setShowPayoutModal(false)}
                      style={styles.cancelBtn}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>

                    <AnimatedPressable
                      onPress={handleConfirmPayout}
                      activeScale={0.97}
                      style={styles.confirmBtn}
                    >
                      <Text style={styles.confirmBtnText}>Confirm Transfer</Text>
                    </AnimatedPressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
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
    paddingTop: 10 | SAFE_TOP_PADDING,
    paddingBottom: 32,
  },
  topHeader: {
    marginBottom: 18,
  },
  headerTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.navy,
  },
  balanceCard: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slateLight,
    fontSize: 11.5,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  totalEarningsNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  availableBalancePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  availableBalanceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.goldWarm,
    letterSpacing: 1,
    marginBottom: 2,
  },
  availableBalanceValue: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  balanceSub: {
    fontSize: 13.5,
    color: COLORS.slateLight,
    marginTop: 10,
    marginBottom: 16,
  },
  withdrawBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  withdrawBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  highlightsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 16,
    marginBottom: 18,
  },
  highlightCol: {
    flex: 1,
  },
  highlightColLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 3,
  },
  highlightColVal: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.navy,
  },
  highlightColDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.borderHairline,
    marginHorizontal: 12,
  },
  segmentedToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.sm,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.soft,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate,
  },
  toggleBtnTextActive: {
    color: COLORS.navy,
    fontWeight: '800',
  },
  listContainer: {
    gap: 10,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  historyLeft: {
    gap: 2,
  },
  historyDate: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  historyRef: {
    fontSize: 12,
    color: COLORS.slate,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  statusPillPaid: {
    backgroundColor: COLORS.tealLight,
  },
  statusPillPending: {
    backgroundColor: COLORS.goldLight,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  payoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...SHADOWS.soft,
  },
  payoutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutDetails: {
    flex: 1,
  },
  payoutMethod: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 2,
  },
  payoutDate: {
    fontSize: 12,
    color: COLORS.slate,
  },
  payoutAmountBox: {
    alignItems: 'flex-end',
    gap: 2,
  },
  payoutAmountText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.navy,
  },
  payoutStatusTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 11, 24, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 24,
    width: '100%',
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.navy,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 18,
    color: COLORS.slate,
    fontWeight: '700',
  },
  modalSub: {
    fontSize: 13.5,
    color: COLORS.slate,
    lineHeight: 19,
    marginBottom: 16,
  },
  bankTargetCard: {
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 14,
    marginBottom: 16,
  },
  bankTargetLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  bankTargetName: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.navy,
  },
  bankTargetHolder: {
    fontSize: 12.5,
    color: COLORS.slate,
    marginTop: 2,
  },
  inputGroup: {
    gap: 6,
    marginBottom: 20,
  },
  inputLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    fontSize: 11,
    letterSpacing: 1,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: COLORS.slateBorder,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  poundSymbol: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.navy,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
  },
  maxBtn: {
    backgroundColor: COLORS.backgroundMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  maxBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 0.8,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate,
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  successStateCol: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successCheckBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.teal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 6,
  },
  successSub: {
    fontSize: 14,
    color: COLORS.slate,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
});
