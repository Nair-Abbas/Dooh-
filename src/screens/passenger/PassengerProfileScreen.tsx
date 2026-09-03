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
import { usePassenger } from '../../context/PassengerContext';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';

interface PassengerProfileScreenProps {
  onNavigateToEditProfile?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToHelp?: () => void;
}

export const PassengerProfileScreen: React.FC<PassengerProfileScreenProps> = ({
  onNavigateToSettings,
  onNavigateToHelp,
}) => {
  const { profile, totalPoints, totalGbpValue, updateProfile, signOut } = usePassenger();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit profile state
  const [editName, setEditName] = useState(profile.fullName);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editEmail, setEditEmail] = useState(profile.email);

  const handleOpenEdit = () => {
    setEditName(profile.fullName);
    setEditPhone(profile.phone);
    setEditEmail(profile.email);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (editName.trim()) {
      updateProfile({
        fullName: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
      });
    }
    setShowEditModal(false);
  };

  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
    signOut();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════ TOP HEADER (NO AWKWARD TOP VOID) ═══════ */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTag}>PASSENGER ACCOUNT</Text>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* ═══════ USER IDENTITY CARD ═══════ */}
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

          {/* Membership Tag */}
          <View style={styles.tierBanner}>
            <Text style={styles.tierText}>{profile.membershipTier.toUpperCase()} MEMBER</Text>
            <Text style={styles.memberSince}>Since {profile.memberSince}</Text>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenEdit}
            style={styles.editProfileBtn}
          >
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            <Svg width={16} height={16} viewBox="0 0 24 24">
              <Path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke={COLORS.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* ═══════ REWARD WALLET MINI OVERVIEW ═══════ */}
        <View style={styles.walletMiniRow}>
          <View style={styles.walletMiniCol}>
            <Text style={styles.walletMiniLabel}>TOTAL POINTS</Text>
            <Text style={styles.walletMiniVal}>{totalPoints.toLocaleString()} PTS</Text>
          </View>
          <View style={styles.walletMiniDivider} />
          <View style={styles.walletMiniCol}>
            <Text style={styles.walletMiniLabel}>EST. CASH EQUIVALENT</Text>
            <Text style={styles.walletMiniVal}>£{totalGbpValue.toFixed(2)} GBP</Text>
          </View>
        </View>

        {/* ═══════ ACCOUNT OPTIONS MENU ═══════ */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>PREFERENCES & SUPPORT</Text>

          {/* Settings */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNavigateToSettings}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Circle cx="12" cy="12" r="3" stroke={COLORS.navy} strokeWidth="2" />
                  <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={COLORS.navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Settings & Preferences</Text>
                <Text style={styles.menuItemSubtitle}>Notifications, theme & privacy</Text>
              </View>
            </View>
            <Svg width={16} height={16} viewBox="0 0 24 24">
              <Path d="M9 18l6-6-6-6" stroke={COLORS.slate} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Help & Support */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNavigateToHelp}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Circle cx="12" cy="12" r="10" stroke={COLORS.navy} strokeWidth="1.8" />
                  <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke={COLORS.navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Help & Support FAQ</Text>
                <Text style={styles.menuItemSubtitle}>Voucher redemption & rewards guide</Text>
              </View>
            </View>
            <Svg width={16} height={16} viewBox="0 0 24 24">
              <Path d="M9 18l6-6-6-6" stroke={COLORS.slate} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <AnimatedPressable
          onPress={() => setShowSignOutModal(true)}
          activeScale={0.97}
          style={styles.signOutBtn}
        >
          <Text style={styles.signOutBtnText}>Sign Out of Passenger Account</Text>
        </AnimatedPressable>

        {/* ═══════ EDIT PROFILE MODAL (CRUD UPDATE) ═══════ */}
        <Modal
          visible={showEditModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Personal Details</Text>
              <Text style={styles.modalSub}>
                Update your contact details for voucher deliveries and account security.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Full Name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="+44 7700 900123"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowEditModal(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSaveProfile}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>Save Changes</Text>
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
                Are you sure you want to sign out of your DOOH Passenger Account?
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
  tierBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    marginBottom: 14,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.tealDark,
  },
  memberSince: {
    fontSize: 12,
    color: COLORS.slate,
  },
  editProfileBtn: {
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
  editProfileBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.navy,
  },
  walletMiniRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundOff,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 16,
    marginBottom: 20,
  },
  walletMiniCol: {
    flex: 1,
  },
  walletMiniLabel: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 3,
  },
  walletMiniVal: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.navy,
  },
  walletMiniDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.borderHairline,
    marginHorizontal: 12,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.soft,
  },
  menuSectionTitle: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.slate,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.backgroundOff,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  menuItemSubtitle: {
    fontSize: 12.5,
    color: COLORS.slate,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.borderHairline,
    marginVertical: 4,
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
