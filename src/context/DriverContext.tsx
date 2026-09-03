import React, { createContext, useContext, useState, useEffect } from 'react';
import { DOOH_INTRO_CAMPAIGNS, DoohAdCampaign } from '../constants/assets';

export interface DriverVehicle {
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  hardwareSerial: string;
  firmwareVersion: string;
  screenType: string;
  resolution: string;
  screenStatus: 'online' | 'offline' | 'standby';
}

export interface DriverPaymentDetails {
  bankName: string;
  accountHolderName: string;
  iban: string;
  accountNumber: string;
}

export interface DriverProfile {
  fullName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  driverId: string;
  rating: number;
  memberSince: string;
  avatarInitials: string;
  verificationStatus: 'verified' | 'pending';
  fleetType: 'individual' | 'fleet';
  fleetName?: string;
  fleetId?: string;
  paymentDetails: DriverPaymentDetails;
}

export interface DriverEarningRecord {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
  paymentReference?: string;
}

export interface PayoutTransaction {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'processing';
  method: string;
}

export interface VehicleChangeRequest {
  id: string;
  status: 'none' | 'pending' | 'approved' | 'rejected';
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  reason: string;
  submittedAt: string;
  reviewNotes?: string;
}

interface DriverContextType {
  profile: DriverProfile;
  vehicle: DriverVehicle;
  vehicleChangeRequest: VehicleChangeRequest | null;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  totalEarnings: number;
  todayEarnings: number;
  totalBalance: number;
  earningHistory: DriverEarningRecord[];
  currentCampaignIndex: number;
  currentCampaign: DoohAdCampaign;
  recentPayouts: PayoutTransaction[];
  hardwareHealth: {
    fps: number;
    brightness: number;
    temperatureC: number;
    signalStrength: string;
  };
  toggleScreenOnline: () => void;
  requestPayout: (amount: number) => boolean;
  updateDriverProfile: (updated: Partial<DriverProfile>) => void;
  updatePaymentDetails: (updated: Partial<DriverPaymentDetails>) => void;
  updateVehicle: (updated: Partial<DriverVehicle>) => void;
  submitVehicleChangeRequest: (req: Omit<VehicleChangeRequest, 'id' | 'status' | 'submittedAt'>) => void;
  cancelVehicleChangeRequest: () => void;
  deletePayoutRecord: (id: string) => void;
  signOut: () => void;
}

const INITIAL_PAYMENT_DETAILS: DriverPaymentDetails = {
  bankName: 'Barclays Bank UK',
  accountHolderName: 'Marcus Sterling',
  iban: 'GB29 BARC 2004 1538 4920 11',
  accountNumber: '38492011',
};

const INITIAL_DRIVER_PROFILE: DriverProfile = {
  fullName: 'Marcus Sterling',
  phone: '+44 7911 123456',
  email: 'marcus.sterling@mobility.co.uk',
  licenseNumber: 'STERL805214MS99',
  licenseExpiry: '14 Oct 2028',
  driverId: 'DOOH-DRV-4091',
  rating: 4.96,
  memberSince: 'January 2026',
  avatarInitials: 'MS',
  verificationStatus: 'verified',
  fleetType: 'fleet',
  fleetName: 'Addison Lee Commercial Fleet',
  fleetId: 'FLT-LON-88902',
  paymentDetails: INITIAL_PAYMENT_DETAILS,
};

const INITIAL_VEHICLE: DriverVehicle = {
  make: 'Audi',
  model: 'e-Tron Sportback 55',
  year: '2024',
  plate: 'LN74 DOO',
  color: 'Mythos Black',
  hardwareSerial: 'DOOH-HD-8891-UK',
  firmwareVersion: 'v3.8.2-PRO',
  screenType: 'Dual Ultra-HD In-Cabin Headrest Displays (Left & Right)',
  resolution: '3840 × 1080 @ 60FPS',
  screenStatus: 'online',
};

const INITIAL_EARNING_HISTORY: DriverEarningRecord[] = [
  {
    id: 'earn-01',
    date: '26 Aug 2026',
    amount: 48.50,
    status: 'paid',
    paymentReference: 'DOOH-EP-88219',
  },
  {
    id: 'earn-02',
    date: '25 Aug 2026',
    amount: 62.00,
    status: 'paid',
    paymentReference: 'DOOH-EP-88104',
  },
  {
    id: 'earn-03',
    date: '24 Aug 2026',
    amount: 55.75,
    status: 'paid',
    paymentReference: 'DOOH-EP-87982',
  },
  {
    id: 'earn-04',
    date: '23 Aug 2026',
    amount: 70.20,
    status: 'paid',
    paymentReference: 'DOOH-EP-87840',
  },
  {
    id: 'earn-05',
    date: '22 Aug 2026',
    amount: 42.00,
    status: 'paid',
    paymentReference: 'DOOH-EP-87711',
  },
];

const INITIAL_PAYOUTS: PayoutTransaction[] = [
  {
    id: 'pay-01',
    amount: 150.00,
    date: '24 Aug 2026',
    status: 'completed',
    method: 'Faster Payments (Direct to Barclays)',
  },
  {
    id: 'pay-02',
    amount: 200.00,
    date: '17 Aug 2026',
    status: 'completed',
    method: 'Faster Payments (Direct to Barclays)',
  },
  {
    id: 'pay-03',
    amount: 185.50,
    date: '10 Aug 2026',
    status: 'completed',
    method: 'Faster Payments (Direct to Barclays)',
  },
];

const DriverContext = createContext<DriverContextType | null>(null);

export const DriverProvider: React.FC<{
  children: React.ReactNode;
  initialData?: any;
  onSignOut?: () => void;
}> = ({ children, initialData, onSignOut }) => {
  const [profile, setProfile] = useState<DriverProfile>(() => {
    if (initialData?.fullName) {
      return {
        ...INITIAL_DRIVER_PROFILE,
        fullName: initialData.fullName,
        email: initialData.email || INITIAL_DRIVER_PROFILE.email,
        phone: initialData.phone || INITIAL_DRIVER_PROFILE.phone,
        licenseNumber: initialData.licenseNumber || INITIAL_DRIVER_PROFILE.licenseNumber,
        fleetType: initialData.fleetType || 'individual',
        fleetName: initialData.fleetName || (initialData.fleetType === 'fleet' ? 'Affiliated Fleet Operator' : undefined),
        fleetId: initialData.fleetId || (initialData.fleetType === 'fleet' ? 'FLT-PENDING' : undefined),
        paymentDetails: {
          ...INITIAL_PAYMENT_DETAILS,
          ...(initialData.bankName && {
            bankName: initialData.bankName,
            accountHolderName: initialData.accountHolderName || initialData.fullName,
            iban: initialData.iban || INITIAL_PAYMENT_DETAILS.iban,
            accountNumber: initialData.accountNumber || INITIAL_PAYMENT_DETAILS.accountNumber,
          }),
        },
      };
    }
    return INITIAL_DRIVER_PROFILE;
  });
  const [vehicle, setVehicle] = useState<DriverVehicle>(INITIAL_VEHICLE);
  const [vehicleChangeRequest, setVehicleChangeRequest] = useState<VehicleChangeRequest | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [earningHistory, setEarningHistory] = useState<DriverEarningRecord[]>(INITIAL_EARNING_HISTORY);
  const [recentPayouts, setRecentPayouts] = useState<PayoutTransaction[]>(INITIAL_PAYOUTS);
  const [totalBalance, setTotalBalance] = useState<number>(78.45);
  const [currentCampaignIndex, setCurrentCampaignIndex] = useState<number>(0);

  const totalEarnings = earningHistory.reduce((sum, r) => sum + r.amount, 0) + totalBalance;
  const todayEarnings = earningHistory[0]?.amount || 48.50;

  const currentCampaign = DOOH_INTRO_CAMPAIGNS[currentCampaignIndex] || DOOH_INTRO_CAMPAIGNS[0];

  // Rotate simulated broadcast campaigns every 8 seconds if online
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      setCurrentCampaignIndex((prev) => (prev + 1) % DOOH_INTRO_CAMPAIGNS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const toggleScreenOnline = () => {
    setIsOnline((prev) => !prev);
    setVehicle((prev) => ({
      ...prev,
      screenStatus: !isOnline ? 'online' : 'standby',
    }));
  };

  // [CREATE] Payout Transaction CRUD
  const requestPayout = (amount: number): boolean => {
    if (amount <= 0 || amount > totalBalance) return false;

    setTotalBalance((prev) => prev - amount);

    const newPayout: PayoutTransaction = {
      id: `pay-${Date.now()}`,
      amount,
      date: 'Today (Instant)',
      status: 'completed',
      method: `Faster Payments (Direct to ${profile.paymentDetails.bankName || 'Verified Bank'})`,
    };

    setRecentPayouts((prev) => [newPayout, ...prev]);
    return true;
  };

  // [UPDATE] Driver Profile CRUD
  const updateDriverProfile = (updated: Partial<DriverProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (updated.fullName) {
        const parts = updated.fullName.trim().split(' ');
        const first = parts[0]?.[0] || 'M';
        const last = parts[1]?.[0] || parts[0]?.[1] || 'S';
        next.avatarInitials = (first + last).toUpperCase();
      }
      return next;
    });
  };

  // [UPDATE] Bank / Payment Details CRUD
  const updatePaymentDetails = (updated: Partial<DriverPaymentDetails>) => {
    setProfile((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        ...updated,
      },
    }));
  };

  // [UPDATE] Vehicle Specifications CRUD
  const updateVehicle = (updated: Partial<DriverVehicle>) => {
    setVehicle((prev) => ({ ...prev, ...updated }));
  };

  // [CREATE / SUBMIT] Vehicle Change Request CRUD
  const submitVehicleChangeRequest = (req: Omit<VehicleChangeRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: VehicleChangeRequest = {
      id: `vcr-${Date.now()}`,
      status: 'pending',
      make: req.make,
      model: req.model,
      year: req.year,
      plate: req.plate,
      color: req.color,
      reason: req.reason,
      submittedAt: 'Just Now',
      reviewNotes: 'Admin review queue: Priority 1 fleet verification',
    };
    setVehicleChangeRequest(newReq);
  };

  // [DELETE / CANCEL] Cancel Vehicle Change Request CRUD
  const cancelVehicleChangeRequest = () => {
    setVehicleChangeRequest(null);
  };

  // [DELETE] Delete Payout Record CRUD
  const deletePayoutRecord = (id: string) => {
    setRecentPayouts((prev) => prev.filter((p) => p.id !== id));
  };

  const signOut = () => {
    if (onSignOut) onSignOut();
  };

  return (
    <DriverContext.Provider
      value={{
        profile,
        vehicle,
        vehicleChangeRequest,
        isOnline,
        setIsOnline,
        totalEarnings,
        todayEarnings,
        totalBalance,
        earningHistory,
        currentCampaignIndex,
        currentCampaign,
        recentPayouts,
        hardwareHealth: {
          fps: 60,
          brightness: 85,
          temperatureC: 38,
          signalStrength: '5G Full (1.2 Gbps)',
        },
        toggleScreenOnline,
        requestPayout,
        updateDriverProfile,
        updatePaymentDetails,
        updateVehicle,
        submitVehicleChangeRequest,
        cancelVehicleChangeRequest,
        deletePayoutRecord,
        signOut,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = (): DriverContextType => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
};
