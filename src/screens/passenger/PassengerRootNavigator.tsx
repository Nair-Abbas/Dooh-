import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PassengerProvider, usePassenger, CouponItem } from '../../context/PassengerContext';
import { PassengerTabBar, PassengerTab } from '../../components/navigation/PassengerTabBar';
import { PassengerHomeScreen } from './PassengerHomeScreen';
import { PassengerScanScreen } from './PassengerScanScreen';
import { PassengerPointsScreen } from './PassengerPointsScreen';
import { PassengerCouponDetailScreen } from './PassengerCouponDetailScreen';
import { PassengerOffersScreen } from './PassengerOffersScreen';
import { PassengerProfileScreen } from './PassengerProfileScreen';
import { PassengerEditProfileScreen } from './PassengerEditProfileScreen';
import { PassengerSettingsScreen } from './PassengerSettingsScreen';
import { PassengerHelpScreen } from './PassengerHelpScreen';

interface PassengerRootNavigatorProps {
  onSignOut: () => void;
}

const PassengerAppInner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PassengerTab>('home');
  const [activeSubScreen, setActiveSubScreen] = useState<
    'coupon_detail' | 'edit_profile' | 'settings' | 'help' | null
  >(null);
  const { selectedCoupon, setSelectedCoupon } = usePassenger();

  const handleOpenCouponDetail = (coupon: CouponItem) => {
    setSelectedCoupon(coupon);
    setActiveSubScreen('coupon_detail');
  };

  return (
    <View style={styles.root}>
      {/* ═══════ SUB-SCREENS (FULL OVERLAY MODALS) ═══════ */}
      {activeSubScreen === 'coupon_detail' && selectedCoupon && (
        <PassengerCouponDetailScreen
          coupon={selectedCoupon}
          onBack={() => setActiveSubScreen(null)}
        />
      )}

      {activeSubScreen === 'edit_profile' && (
        <PassengerEditProfileScreen onBack={() => setActiveSubScreen(null)} />
      )}

      {activeSubScreen === 'settings' && (
        <PassengerSettingsScreen onBack={() => setActiveSubScreen(null)} />
      )}

      {activeSubScreen === 'help' && (
        <PassengerHelpScreen onBack={() => setActiveSubScreen(null)} />
      )}

      {/* ═══════ MAIN TAB SCREENS ═══════ */}
      {!activeSubScreen && (
        <>
          <View style={styles.tabContent}>
            {/* Screen 5: Home */}
            {activeTab === 'home' && (
              <PassengerHomeScreen
                onNavigateToScan={() => setActiveTab('scan')}
                onNavigateToPoints={() => setActiveTab('points')}
                onNavigateToOffers={() => setActiveTab('offers')}
                onNavigateToCouponDetail={handleOpenCouponDetail}
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            )}

            {/* Screen 6: Scan */}
            {activeTab === 'scan' && (
              <PassengerScanScreen
                onBack={() => setActiveTab('home')}
                onNavigateToCouponDetail={handleOpenCouponDetail}
              />
            )}

            {/* Screen 7: Points */}
            {activeTab === 'points' && (
              <PassengerPointsScreen
                onNavigateToCouponDetail={handleOpenCouponDetail}
                onNavigateToScan={() => setActiveTab('scan')}
              />
            )}

            {/* Screen 8: Offers & Perks */}
            {(activeTab === 'offers' || activeTab === 'history') && (
              <PassengerOffersScreen
                onNavigateToCouponDetail={handleOpenCouponDetail}
                onNavigateToScan={() => setActiveTab('scan')}
              />
            )}

            {/* Screen 10: Profile */}
            {activeTab === 'profile' && (
              <PassengerProfileScreen
                onNavigateToEditProfile={() => setActiveSubScreen('edit_profile')}
                onNavigateToSettings={() => setActiveSubScreen('settings')}
                onNavigateToHelp={() => setActiveSubScreen('help')}
              />
            )}
          </View>

          {/* Bottom Tab Bar */}
          <PassengerTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </View>
  );
};

export const PassengerRootNavigator: React.FC<PassengerRootNavigatorProps> = ({
  onSignOut,
}) => {
  return (
    <PassengerProvider onSignOut={onSignOut}>
      <PassengerAppInner />
    </PassengerProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
  },
});
