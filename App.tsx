import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IntroSplashScreen } from './src/screens/intro/IntroSplashScreen';
import { RoleSelectionScreen } from './src/screens/auth/RoleSelectionScreen';

// Passenger Screens
import { PassengerLoginScreen } from './src/screens/passenger/PassengerLoginScreen';
import { PassengerRegisterScreen } from './src/screens/passenger/PassengerRegisterScreen';
import { PassengerRootNavigator } from './src/screens/passenger/PassengerRootNavigator';

// Driver Screens
import { DriverLoginScreen } from './src/screens/driver/DriverLoginScreen';
import { DriverRegisterScreen } from './src/screens/driver/DriverRegisterScreen';
import { DriverRootNavigator } from './src/screens/driver/DriverRootNavigator';

type AppScreen =
  | 'splash'
  | 'role_selection'
  | 'passenger_login'
  | 'passenger_register'
  | 'passenger_app'
  | 'driver_login'
  | 'driver_register'
  | 'driver_app';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [currentUser, setCurrentUser] = useState<any>(null);

  return (
    <View style={styles.root}>
      {/* SCREEN 1: DOOH Animated Intro / Splash */}
      {screen === 'splash' && (
        <IntroSplashScreen onComplete={() => setScreen('role_selection')} />
      )}

      {/* SCREEN 2: Role Selection */}
      {screen === 'role_selection' && (
        <RoleSelectionScreen
          onSelectRole={(role) => {
            if (role === 'passenger') {
              setScreen('passenger_login');
            } else if (role === 'driver') {
              setScreen('driver_login');
            }
          }}
        />
      )}

      {/* ══════════════ PASSENGER FLOW ══════════════ */}
      {/* SCREEN 4: Passenger Login */}
      {screen === 'passenger_login' && (
        <PassengerLoginScreen
          onBack={() => setScreen('role_selection')}
          onNavigateToRegister={() => setScreen('passenger_register')}
          onLoginSuccess={(credentials) => {
            setCurrentUser(credentials);
            setScreen('passenger_app');
          }}
        />
      )}

      {/* SCREEN 3: Passenger Registration */}
      {screen === 'passenger_register' && (
        <PassengerRegisterScreen
          onBack={() => setScreen('passenger_login')}
          onNavigateToLogin={() => setScreen('passenger_login')}
          onRegisterSuccess={(data) => {
            setCurrentUser(data);
            setScreen('passenger_app');
          }}
        />
      )}

      {/* PASSENGER SUITE (SCREENS 5 TO 13 + BOTTOM TAB BAR) */}
      {screen === 'passenger_app' && (
        <PassengerRootNavigator
          onSignOut={() => {
            setCurrentUser(null);
            setScreen('role_selection');
          }}
        />
      )}

      {/* ══════════════ DRIVER FLOW ══════════════ */}
      {/* SCREEN 15: Driver Login */}
      {screen === 'driver_login' && (
        <DriverLoginScreen
          onBack={() => setScreen('role_selection')}
          onNavigateToRegister={() => setScreen('driver_register')}
          onLoginSuccess={(credentials) => {
            setCurrentUser(credentials);
            setScreen('driver_app');
          }}
        />
      )}

      {/* SCREEN 14: Driver Registration */}
      {screen === 'driver_register' && (
        <DriverRegisterScreen
          onBack={() => setScreen('driver_login')}
          onNavigateToLogin={() => setScreen('driver_login')}
          onRegisterSuccess={(data) => {
            setCurrentUser(data);
            setScreen('driver_app');
          }}
        />
      )}

      {/* DRIVER SUITE (SCREENS 16 TO 23 + BOTTOM TAB BAR) */}
      {screen === 'driver_app' && (
        <DriverRootNavigator
          initialUserData={currentUser}
          onSignOut={() => {
            setCurrentUser(null);
            setScreen('role_selection');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
