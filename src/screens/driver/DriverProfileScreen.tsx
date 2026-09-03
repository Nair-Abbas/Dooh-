import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SAFE_TOP_PADDING } from '../../constants/theme';
import { useDriver } from '../../context/DriverContext';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

interface DriverProfileScreenProps {
  onNavigateToEditProfile?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToHelp?: () => void;
}

export const DriverProfileScreen: React.FC<DriverProfileScreenProps> = ({
  onNavigateToSettings,
  onNavigateToHelp,
}) => {
  const {
    profile,
    vehicle,
    vehicleChangeRequest,
    updateDriverProfile,
    updatePaymentDetails,
    submitVehicleChangeRequest,
    cancelVehicleChangeRequest,
    signOut,
  } = useDriver();

  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [showVehicleRequestModal, setShowVehicleRequestModal] = useState(false);

  // Edit contact states
  const [name, setName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);

  // Edit bank states
  const [bankName, setBankName] = useState(profile.paymentDetails.bankName);
  const [accountHolder, setAccountHolder] = useState(profile.paymentDetails.accountHolderName);
  const [iban, setIban] = useState(profile.paymentDetails.iban);
  const [accountNumber, setAccountNumber] = useState(profile.paymentDetails.accountNumber);

  // Vehicle change request states
  const [reqMake, setReqMake] = useState('Mercedes-Benz');
  const [reqModel, setReqModel] = useState('EQE 350+');
  const [reqYear, setReqYear] = useState('2025');
  const [reqPlate, setReqPlate] = useState('LD75 MER');
  const [reqColor, setReqColor] = useState('Obsidian Black');
  const [reqReason, setReqReason] = useState('Fleet upgrade to newer executive EV model');

  const handleOpenContactEdit = () => {
    setName(profile.fullName);
    setPhone(profile.phone);
    setEmail(profile.email);
    setShowEditContactModal(true);
  };

  const handleSaveContact = () => {
    if (name.trim()) {
      updateDriverProfile({
        fullName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
    }
    setShowEditContactModal(false);
  };

  const handleOpenBankEdit = () => {
    setBankName(profile.paymentDetails.bankName);
    setAccountHolder(profile.paymentDetails.accountHolderName);
    setIban(profile.paymentDetails.iban);
    setAccountNumber(profile.paymentDetails.accountNumber);
    setShowEditBankModal(true);
  };

  const handleSaveBank = () => {
    updatePaymentDetails({
      bankName: bankName.trim() || 'Barclays Bank UK',
      accountHolderName: accountHolder.trim() || profile.fullName,
      iban: iban.trim() || 'GB29 BARC 2004 1538 4920 11',
      accountNumber: accountNumber.trim() || '38492011',
    });
    setShowEditBankModal(false);
  };

  const handleSubmitVehicleChange = () => {
    submitVehicleChangeRequest({
      make: reqMake.trim(),
      model: reqModel.trim(),
      year: reqYear.trim(),
      plate: reqPlate.trim(),
      color: reqColor.trim(),
      reason: reqReason.trim(),
    });
    setShowVehicleRequestModal(false);
  };

  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
    signOut();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══════ TOP HEADER (NO AWKWARD TOP VOID) ═══════ */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTag}>VEHICLE & PARTNER ACCOUNT</Text>
          <Text style={styles.headerTitle}>Driver Profile</Text>
        </View>

        {/* ═══════ PENDING VEHICLE REVIEW BANNER ═══════ */}
        {vehicleChangeRequest?.status === 'pending' && (
          <View style={styles.pendingReviewBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingReviewTag}>VEHICLE CHANGE UNDER ADMIN REVIEW</Text>
              <Text style={styles.pendingReviewTitle}>
                {vehicleChangeRequest.make} {vehicleChangeRequest.model} ({vehicleChangeRequest.plate})
              </Text>
              <Text style={styles.pendingReviewSub}>
                Admin verification in progress (12-24 hrs) • Hardware transfer pending
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={cancelVehicleChangeRequest}
              style={styles.cancelReqBtn}
            >
              <Text style={styles.cancelReqBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ═══════ 1. PERSONAL DETAILS CARD (CRUD UPDATE) ═══════ */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarBubble}>
              <Text style={styles.avatarInitialsText}>{profile.avatarInitials}</Text>
            </View>

            <View style={styles.profileInfoCol}>
              <Text style={styles.profileName}>{profile.fullName}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
              <Text style={styles.profilePhone}>{profile.phone}</Text>
            </View>
          </View>

          {/* Verification Banner */}
          <View style={styles.ratingBanner}>
            <View style={styles.ratingCol}>
              <Text style={styles.ratingNumber}>{profile.rating} ★</Text>
              <Text style={styles.ratingSub}>Partner Rating</Text>
            </View>
            <View style={styles.bannerDivider} />
            <View style={styles.partnerTierCol}>
              <Text style={styles.verifiedText}>✓ VERIFIED PARTNER</Text>
              <Text style={styles.memberSince}>Since {profile.memberSince}</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenContactEdit}
            style={styles.editBtn}
          >
            <Text style={styles.editBtnText}>Edit Contact Details</Text>
            <Svg width={16} height={16} viewBox="0 0 24 24">
              <Path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke={COLORS.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* ═══════ 2. LICENSE DETAILS CARD ═══════ */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeaderTag}>DRIVER LICENSE DETAILS</Text>
          <View style={styles.docRow}>
            <Text style={styles.docKey}>License / Badge Number:</Text>
            <Text style={styles.docVal}>{profile.licenseNumber}</Text>
          </View>
          <View style={styles.docRow}>
            <Text style={styles.docKey}>Expiry Date:</Text>
            <Text style={styles.docVal}>{profile.licenseExpiry}</Text>
          </View>
        </View>

        {/* ═══════ 2.5 FLEET OPERATOR & AFFILIATION CARD ═══════ */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderWithAction}>
            <Text style={styles.cardHeaderTag}>FLEET OPERATOR & AFFILIATION</Text>
            <View
              style={[
                styles.fleetBadgePill,
                {
                  backgroundColor: profile.fleetType === 'fleet' ? COLORS.tealLight : COLORS.backgroundOff,
                  borderColor: profile.fleetType === 'fleet' ? COLORS.teal : COLORS.borderHairline,
                },
              ]}
            >
              <Text
                style={[
                  styles.fleetBadgePillText,
                  { color: profile.fleetType === 'fleet' ? COLORS.tealDark : COLORS.slate },
                ]}
              >
                {profile.fleetType === 'fleet' ? 'COMMERCIAL FLEET' : 'INDIVIDUAL DRIVER'}
              </Text>
            </View>
          </View>

          <View style={styles.docRow}>
            <Text style={styles.docKey}>Partner Type:</Text>
            <Text style={styles.docVal}>
              {profile.fleetType === 'fleet' ? 'Part of Fleet Operator' : 'Independent Owner-Driver'}
            </Text>
          </View>
          {profile.fleetType === 'fleet' && (
            <>
              <View style={styles.docRow}>
                <Text style={styles.docKey}>Fleet Operator Name:</Text>
                <Text style={styles.docVal}>{profile.fleetName || 'Addison Lee Commercial Fleet'}</Text>
              </View>
              <View style={styles.docRow}>
                <Text style={styles.docKey}>Fleet Operator ID:</Text>
                <Text style={[styles.docVal, { fontWeight: '800', letterSpacing: 0.5 }]}>
                  {profile.fleetId || 'FLT-LON-88902'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* ═══════ 3. VEHICLE SPECIFICATIONS CARD (CRUD CREATE REQUEST) ═══════ */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderWithAction}>
            <Text style={styles.cardHeaderTag}>REGISTERED VEHICLE DETAILS</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowVehicleRequestModal(true)}
            >
              <Text style={styles.actionLinkText}>Request Change →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docRow}>
            <Text style={styles.docKey}>Vehicle Model:</Text>
            <Text style={styles.docVal}>{vehicle.make} {vehicle.model} ({vehicle.year})</Text>
          </View>
          <View style={styles.docRow}>
            <Text style={styles.docKey}>Number Plate:</Text>
            <Text style={styles.docVal}>{vehicle.plate}</Text>
          </View>
          <View style={styles.docRow}>
            <Text style={styles.docKey}>Hardware Kit Serial:</Text>
            <Text style={styles.docVal}>{vehicle.hardwareSerial}</Text>
          </View>
        </View>

        {/* ═══════ 4. PAYMENT & BANK DETAILS (CRUD UPDATE) ═══════ */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderWithAction}>
            <Text style={styles.cardHeaderTag}>VERIFIED BANK & PAYOUT DETAILS</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleOpenBankEdit}
            >
              <Text style={styles.actionLinkText}>Edit Bank →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docRow}>
            <Text style={styles.docKey}>Bank Name:</Text>
            <Text style={styles.docVal}>{profile.paymentDetails.bankName || 'Barclays UK'}</Text>
          </View>
          <View style={styles.docRow}>
            <Text style={styles.docKey}>Account Holder:</Text>
            <Text style={styles.docVal}>{profile.paymentDetails.accountHolderName || profile.fullName}</Text>
          </View>
          <View style={styles.docRow}>
            <Text style={styles.docKey}>IBAN:</Text>
            <Text style={styles.docVal}>{profile.paymentDetails.iban || 'GB29 NWBK 6016 •••• ••'}</Text>
          </View>
          <View style={styles.docRow}>
            <Text style={styles.docKey}>Account Number:</Text>
            <Text style={styles.docVal}>•••• {profile.paymentDetails.accountNumber.slice(-4) || '2011'}</Text>
          </View>
        </View>

        {/* ═══════ 5. ACTIONS & LOGOUT ═══════ */}
        <View style={styles.menuCard}>
          <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToSettings} style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuLabel}>Display Settings & Network</Text>
              <Text style={styles.menuSub}>Screen brightness, 5G sync telemetry</Text>
            </View>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M9 18l6-6-6-6" stroke={COLORS.slate} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToHelp} style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuLabel}>Support & Hardware Guide</Text>
              <Text style={styles.menuSub}>Touchscreen diagnostics & portal FAQ</Text>
            </View>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M9 18l6-6-6-6" stroke={COLORS.slate} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <AnimatedPressable
          onPress={() => setShowSignOutModal(true)}
          activeScale={0.97}
          style={styles.signOutBtn}
        >
          <Text style={styles.signOutBtnText}>Sign Out of Driver Portal</Text>
        </AnimatedPressable>

        {/* ═══════ EDIT CONTACT MODAL (CRUD UPDATE) ═══════ */}
        <Modal
          visible={showEditContactModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditContactModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Contact Details</Text>
              <Text style={styles.modalSub}>
                Update your driver partner contact information.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.modalInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <TextInput
                  style={styles.modalInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+44 7911 123456"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.modalInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="driver@mobility.co.uk"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowEditContactModal(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSaveContact}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ═══════ EDIT BANK MODAL (CRUD UPDATE) ═══════ */}
        <Modal
          visible={showEditBankModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditBankModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Update Bank / Payout Details</Text>
              <Text style={styles.modalSub}>
                Earnings disbursements are routed to this account.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>BANK NAME</Text>
                <TextInput
                  style={styles.modalInput}
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="e.g. Barclays Bank UK"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ACCOUNT HOLDER NAME</Text>
                <TextInput
                  style={styles.modalInput}
                  value={accountHolder}
                  onChangeText={setAccountHolder}
                  placeholder="Full Legal Name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>IBAN</Text>
                <TextInput
                  style={styles.modalInput}
                  value={iban}
                  onChangeText={setIban}
                  placeholder="GB29 BARC 2004 1538 4920 11"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ACCOUNT NUMBER</Text>
                <TextInput
                  style={styles.modalInput}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="8-digit account number"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowEditBankModal(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSaveBank}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>Update Bank</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ═══════ VEHICLE CHANGE REQUEST MODAL (CRUD CREATE) ═══════ */}
        <Modal
          visible={showVehicleRequestModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowVehicleRequestModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Request Vehicle Change</Text>
              <Text style={styles.modalSub}>
                Submit new vehicle specs for DOOH hardware transfer & admin verification.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>MAKE & MODEL</Text>
                <TextInput
                  style={styles.modalInput}
                  value={`${reqMake} ${reqModel}`}
                  onChangeText={(v) => {
                    const parts = v.split(' ');
                    setReqMake(parts[0] || 'Mercedes-Benz');
                    setReqModel(parts.slice(1).join(' ') || 'EQE');
                  }}
                  placeholder="e.g. Mercedes-Benz EQE 350"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NUMBER PLATE</Text>
                <TextInput
                  style={styles.modalInput}
                  value={reqPlate}
                  onChangeText={setReqPlate}
                  placeholder="e.g. LD75 MER"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>REASON FOR CHANGE</Text>
                <TextInput
                  style={styles.modalInput}
                  value={reqReason}
                  onChangeText={setReqReason}
                  placeholder="Reason for change"
                />
              </View>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowVehicleRequestModal(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSubmitVehicleChange}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ═══════ SIGN OUT MODAL ═══════ */}
        <Modal
          visible={showSignOutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSignOutModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Sign Out?</Text>
              <Text style={styles.modalSub}>
                Are you sure you want to sign out of the DOOH Driver Partner Portal?
              </Text>
              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowSignOutModal(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleConfirmSignOut}
                  style={styles.modalConfirmBtn}
                >
                  <Text style={styles.modalConfirmText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
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
    paddingTop: SAFE_TOP_PADDING,
    paddingBottom: 36,
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
  pendingReviewBanner: {
    backgroundColor: COLORS.goldLight,
    borderWidth: 1.5,
    borderColor: COLORS.goldWarm,
    borderRadius: RADIUS.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.soft,
  },
  pendingReviewTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.goldDark,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 3,
  },
  pendingReviewTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 2,
  },
  pendingReviewSub: {
    fontSize: 12.5,
    color: COLORS.slate,
    lineHeight: 17,
  },
  cancelReqBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.goldWarm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
  },
  cancelReqBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.goldDark,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 18,
    marginBottom: 16,
    ...SHADOWS.soft,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileInfoCol: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.navy,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.slate,
  },
  profilePhone: {
    fontSize: 13.5,
    color: COLORS.slateLight,
  },
  ratingBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    marginBottom: 14,
  },
  ratingCol: {
    flex: 1,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.navy,
  },
  ratingSub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  bannerDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.borderHairline,
    marginHorizontal: 12,
  },
  partnerTierCol: {
    flex: 1.5,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  memberSince: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  editBtn: {
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.xs,
    paddingVertical: 11,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  editBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.navy,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 16,
    marginBottom: 14,
    gap: 8,
    ...SHADOWS.soft,
  },
  cardHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fleetBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
  },
  fleetBadgePillText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  cardHeaderTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  actionLinkText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderHairline,
  },
  docKey: {
    fontSize: 13.5,
    color: COLORS.slate,
  },
  docVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 6,
    marginBottom: 20,
    ...SHADOWS.soft,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  menuLeft: {
    flex: 1,
    gap: 2,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  menuSub: {
    fontSize: 12.5,
    color: COLORS.slate,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.borderHairline,
  },
  signOutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  signOutBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.error,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 13.5,
    color: COLORS.slate,
    lineHeight: 19,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 4,
    marginBottom: 12,
  },
  inputLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.navy,
    fontSize: 11,
    letterSpacing: 1,
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: COLORS.slateBorder,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.navy,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate,
  },
  modalSaveBtn: {
    flex: 1.5,
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
