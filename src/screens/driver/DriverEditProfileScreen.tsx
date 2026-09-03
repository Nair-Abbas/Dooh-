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
  Modal,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';
import { useDriver } from '../../context/DriverContext';

interface DriverEditProfileScreenProps {
  onBack: () => void;
}

export const DriverEditProfileScreen: React.FC<DriverEditProfileScreenProps> = ({
  onBack,
}) => {
  const {
    profile,
    vehicle,
    vehicleChangeRequest,
    updateDriverProfile,
    updatePaymentDetails,
    submitVehicleChangeRequest,
    cancelVehicleChangeRequest,
  } = useDriver();

  // Personal Info
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);

  // Fleet Affiliation
  const [fleetType, setFleetType] = useState<'individual' | 'fleet'>(profile.fleetType || 'individual');
  const [fleetName, setFleetName] = useState(profile.fleetName || '');
  const [fleetId, setFleetId] = useState(profile.fleetId || '');

  // Bank Info
  const [bankName, setBankName] = useState(profile.paymentDetails.bankName);
  const [accountHolderName, setAccountHolderName] = useState(profile.paymentDetails.accountHolderName);
  const [iban, setIban] = useState(profile.paymentDetails.iban);
  const [accountNumber, setAccountNumber] = useState(profile.paymentDetails.accountNumber);

  // Vehicle Change Request
  const [newMake, setNewMake] = useState(vehicle.make);
  const [newModel, setNewModel] = useState(vehicle.model);
  const [newYear, setNewYear] = useState(vehicle.year);
  const [newPlate, setNewPlate] = useState(vehicle.plate);
  const [newColor, setNewColor] = useState(vehicle.color);
  const [reason, setReason] = useState('Upgraded to a newer private hire vehicle');

  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSavePersonalInfo = () => {
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all personal contact fields');
      return;
    }

    if (fleetType === 'fleet' && (!fleetName.trim() || !fleetId.trim())) {
      Alert.alert('Error', 'Please enter your Fleet Operator Name and Fleet ID');
      return;
    }

    updateDriverProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      fleetType,
      fleetName: fleetType === 'fleet' ? fleetName.trim() : undefined,
      fleetId: fleetType === 'fleet' ? fleetId.trim().toUpperCase() : undefined,
    });

    updatePaymentDetails({
      bankName: bankName.trim(),
      accountHolderName: accountHolderName.trim(),
      iban: iban.trim(),
      accountNumber: accountNumber.trim(),
    });

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSubmitVehicleRequest = () => {
    if (!newMake.trim() || !newModel.trim() || !newPlate.trim()) {
      Alert.alert('Error', 'Please fill in vehicle make, model and number plate');
      return;
    }

    submitVehicleChangeRequest({
      make: newMake.trim(),
      model: newModel.trim(),
      year: newYear.trim() || '2025',
      plate: newPlate.trim().toUpperCase(),
      color: newColor.trim() || 'Black',
      reason: reason.trim(),
    });

    setShowConfirmModal(true);
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

        <Text style={styles.topBarTitle}>PROFILE & VEHICLE REQUEST</Text>

        <View style={{ width: 38 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {profileSaved && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>✓ Contact & Payment Info Updated</Text>
            </View>
          )}

          {/* ═══════ ACTIVE PENDING REQUEST NOTIFICATION ═══════ */}
          {vehicleChangeRequest?.status === 'pending' && (
            <View style={styles.pendingRequestCard}>
              <Text style={styles.pendingBadgeText}>ADMIN REVIEW IN PROGRESS</Text>
              <Text style={styles.pendingCardTitle}>
                Vehicle Change Request Submitted
              </Text>
              <Text style={styles.pendingCardDesc}>
                Requested: {vehicleChangeRequest.make} {vehicleChangeRequest.model} ({vehicleChangeRequest.plate})
              </Text>
              <Text style={styles.pendingReviewTime}>
                Estimated Review Time: 12-24 Hours • Fleet Safety Desk
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  cancelVehicleChangeRequest();
                  Alert.alert('Request Cancelled', 'Your pending vehicle change request was withdrawn.');
                }}
                style={styles.cancelRequestBtn}
              >
                <Text style={styles.cancelRequestBtnText}>Withdraw Request</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ═══════ 1. PERSONAL INFORMATION ═══════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>PERSONAL CONTACT DETAILS</Text>

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

          {/* ═══════ 2. FLEET OPERATOR AFFILIATION ═══════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>FLEET OPERATOR AFFILIATION</Text>

            <View style={styles.fleetToggleRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setFleetType('individual')}
                style={[
                  styles.fleetTypeBtn,
                  fleetType === 'individual' && styles.fleetTypeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.fleetTypeBtnText,
                    fleetType === 'individual' && styles.fleetTypeBtnTextActive,
                  ]}
                >
                  Individual Driver
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setFleetType('fleet')}
                style={[
                  styles.fleetTypeBtn,
                  fleetType === 'fleet' && styles.fleetTypeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.fleetTypeBtnText,
                    fleetType === 'fleet' && styles.fleetTypeBtnTextActive,
                  ]}
                >
                  Fleet Operator Partner
                </Text>
              </TouchableOpacity>
            </View>

            {fleetType === 'fleet' && (
              <View style={{ gap: 12, marginTop: 4 }}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FLEET OPERATOR NAME</Text>
                  <View style={[styles.inputBox, activeInput === 'fleetName' && styles.inputBoxActive]}>
                    <TextInput
                      style={styles.textInput}
                      value={fleetName}
                      onChangeText={setFleetName}
                      placeholder="e.g. Addison Lee Commercial Fleet"
                      onFocus={() => setActiveInput('fleetName')}
                      onBlur={() => setActiveInput(null)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FLEET OPERATOR ID</Text>
                  <View style={[styles.inputBox, activeInput === 'fleetId' && styles.inputBoxActive]}>
                    <TextInput
                      style={[styles.textInput, { letterSpacing: 1.5, fontWeight: '700' }]}
                      value={fleetId}
                      onChangeText={setFleetId}
                      placeholder="e.g. FLT-LON-88902"
                      onFocus={() => setActiveInput('fleetId')}
                      onBlur={() => setActiveInput(null)}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* ═══════ 3. PAYMENT & BANK DETAILS ═══════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>PAYMENT & BANK DETAILS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>BANK NAME</Text>
              <View style={[styles.inputBox, activeInput === 'bank' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  value={bankName}
                  onChangeText={setBankName}
                  onFocus={() => setActiveInput('bank')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ACCOUNT HOLDER NAME</Text>
              <View style={[styles.inputBox, activeInput === 'accHolder' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  value={accountHolderName}
                  onChangeText={setAccountHolderName}
                  onFocus={() => setActiveInput('accHolder')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>IBAN</Text>
              <View style={[styles.inputBox, activeInput === 'iban' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
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
                  style={styles.textInput}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  onFocus={() => setActiveInput('accNo')}
                  onBlur={() => setActiveInput(null)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleSavePersonalInfo} style={styles.savePersonalBtn}>
              <Text style={styles.savePersonalBtnText}>Save Contact & Bank Details</Text>
            </TouchableOpacity>
          </View>

          {/* ═══════ 3. FORMAL VEHICLE CHANGE REQUEST ═══════ */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>REQUEST VEHICLE CHANGE</Text>
            <Text style={styles.sectionExplainer}>
              Submitting new vehicle information sends a formal review request to DOOH Admin. Your screen hardware allocation will be updated upon admin approval.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NEW VEHICLE MAKE</Text>
              <View style={[styles.inputBox, activeInput === 'make' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Audi / BMW / Mercedes"
                  placeholderTextColor="#A1A1AA"
                  value={newMake}
                  onChangeText={setNewMake}
                  onFocus={() => setActiveInput('make')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NEW VEHICLE MODEL & YEAR</Text>
              <View style={[styles.inputBox, activeInput === 'model' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. e-Tron 55 Quattro (2025)"
                  placeholderTextColor="#A1A1AA"
                  value={newModel}
                  onChangeText={setNewModel}
                  onFocus={() => setActiveInput('model')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NEW REGISTRATION NUMBER (UK PLATE)</Text>
              <View style={[styles.inputBox, activeInput === 'plate' && styles.inputBoxActive]}>
                <TextInput
                  style={[styles.textInput, { letterSpacing: 2, fontWeight: '700' }]}
                  placeholder="e.g. EA74 DOO"
                  placeholderTextColor="#A1A1AA"
                  value={newPlate}
                  onChangeText={setNewPlate}
                  onFocus={() => setActiveInput('plate')}
                  onBlur={() => setActiveInput(null)}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>REASON FOR VEHICLE CHANGE</Text>
              <View style={[styles.inputBox, activeInput === 'reason' && styles.inputBoxActive]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Upgraded to newer EV"
                  placeholderTextColor="#A1A1AA"
                  value={reason}
                  onChangeText={setReason}
                  onFocus={() => setActiveInput('reason')}
                  onBlur={() => setActiveInput(null)}
                />
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleSubmitVehicleRequest} style={styles.submitRequestBtn}>
              <Text style={styles.submitRequestBtnText}>Submit to Admin for Review</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Request Submitted</Text>
            <Text style={styles.modalDesc}>
              Your vehicle change request has been transmitted to DOOH Fleet Operations. Verification typically takes 12-24 hours.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowConfirmModal(false);
                onBack();
              }}
              style={styles.modalDoneBtn}
            >
              <Text style={styles.modalDoneBtnText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  successBanner: {
    backgroundColor: '#F4F4F6',
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  successBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  pendingRequestCard: {
    backgroundColor: '#F4F4F6',
    borderWidth: 1.5,
    borderColor: '#111111',
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 20,
  },
  pendingBadgeText: {
    ...TYPOGRAPHY.microTag,
    color: '#111111',
    fontSize: 8.5,
    marginBottom: 4,
  },
  pendingCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 2,
  },
  pendingCardDesc: {
    fontSize: 12,
    color: '#71717A',
    marginBottom: 4,
  },
  pendingReviewTime: {
    fontSize: 11,
    color: '#A1A1AA',
    marginBottom: 12,
  },
  cancelRequestBtn: {
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelRequestBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#111111',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#ECECEE',
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.soft,
  },
  sectionHeading: {
    ...TYPOGRAPHY.microTag,
    color: '#71717A',
    fontSize: 9.5,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  fleetToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  fleetTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    backgroundColor: '#F4F4F6',
    borderWidth: 1,
    borderColor: '#ECECEE',
    alignItems: 'center',
  },
  fleetTypeBtnActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  fleetTypeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717A',
  },
  fleetTypeBtnTextActive: {
    color: '#FFFFFF',
  },
  sectionExplainer: {
    fontSize: 11.5,
    color: '#71717A',
    lineHeight: 16,
    marginBottom: 14,
  },
  inputGroup: {
    gap: 6,
    marginBottom: 14,
  },
  inputLabel: {
    ...TYPOGRAPHY.microTag,
    color: '#111111',
    fontSize: 9.5,
    letterSpacing: 1.2,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#ECECEE',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  inputBoxActive: {
    borderColor: '#111111',
  },
  textInput: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '500',
  },
  savePersonalBtn: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  savePersonalBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitRequestBtn: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  submitRequestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 24,
    width: '100%',
    ...SHADOWS.medium,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 22,
    color: '#111111',
    marginBottom: 8,
  },
  modalDesc: {
    ...TYPOGRAPHY.bodySmall,
    color: '#71717A',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalDoneBtn: {
    backgroundColor: '#111111',
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalDoneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
