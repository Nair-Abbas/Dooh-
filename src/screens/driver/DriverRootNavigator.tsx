import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DriverProvider } from '../../context/DriverContext';
import { DriverTabBar, DriverTab } from '../../components/navigation/DriverTabBar';
import { DriverHomeScreen } from './DriverHomeScreen';
import { DriverScreenMonitorScreen } from './DriverScreenMonitorScreen';
import { DriverEarningsScreen } from './DriverEarningsScreen';
import { DriverProfileScreen } from './DriverProfileScreen';
import { DriverEditProfileScreen } from './DriverEditProfileScreen';
import { DriverSettingsScreen } from './DriverSettingsScreen';
import { DriverHelpScreen } from './DriverHelpScreen';

interface DriverRootNavigatorProps {
  initialUserData?: any;
  onSignOut: () => void;
}

const DriverAppInner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DriverTab>('home');
  const [activeSubScreen, setActiveSubScreen] = useState<
    'edit_profile' | 'settings' | 'help' | null
  >(null);

  return (
    <View style={styles.root}>
      {/* ═══════ SUB-SCREENS (FULL OVERLAYS) ═══════ */}
      {activeSubScreen === 'edit_profile' && (
        <DriverEditProfileScreen onBack={() => setActiveSubScreen(null)} />
      )}

      {activeSubScreen === 'settings' && (
        <DriverSettingsScreen onBack={() => setActiveSubScreen(null)} />
      )}

      {activeSubScreen === 'help' && (
        <DriverHelpScreen onBack={() => setActiveSubScreen(null)} />
      )}

      {/* ═══════ 4 MAIN DRIVER TABS ═══════ */}
      {!activeSubScreen && (
        <>
          <View style={styles.tabContent}>
            {/* 1. Dashboard / Home */}
            {activeTab === 'home' && (
              <DriverHomeScreen
                onNavigateToMonitor={() => setActiveTab('monitor')}
                onNavigateToEarnings={() => setActiveTab('earnings')}
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            )}

            {/* 2. Live Screen Monitor */}
            {activeTab === 'monitor' && (
              <DriverScreenMonitorScreen onBack={() => setActiveTab('home')} />
            )}

            {/* 3. Earnings & Bank Payouts */}
            {activeTab === 'earnings' && <DriverEarningsScreen />}

            {/* 4. Vehicle Profile & Settings */}
            {activeTab === 'profile' && (
              <DriverProfileScreen
                onNavigateToEditProfile={() => setActiveSubScreen('edit_profile')}
                onNavigateToSettings={() => setActiveSubScreen('settings')}
                onNavigateToHelp={() => setActiveSubScreen('help')}
              />
            )}
          </View>

          {/* Bottom Tab Bar */}
          <DriverTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </View>
  );
};

export const DriverRootNavigator: React.FC<DriverRootNavigatorProps> = ({
  initialUserData,
  onSignOut,
}) => {
  return (
    <DriverProvider initialData={initialUserData} onSignOut={onSignOut}>
      <DriverAppInner />
    </DriverProvider>
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
