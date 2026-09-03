import React, { createContext, useContext, useState } from 'react';

export type AdCategory = 'Mobility & EV' | 'Audio & Tech' | 'Clean Energy' | 'Travel & Tourism';

export interface CouponItem {
  id: string;
  code: string;
  brand: string;
  category: AdCategory;
  headline: string;
  discount: string;
  pointsEarned: number;
  gbpValue: number; // e.g. £15.00
  dateEarned: string;
  expiryDate: string;
  status: 'claimed' | 'expired' | 'redeemed';
  adLocation: string; // e.g. "Audi e-Tron In-Cabin #LN-402"
  themeColor: string;
}

export interface CategorySummary {
  category: AdCategory;
  icon: string;
  color: string;
  totalPoints: number;
  totalGbp: number;
  couponCount: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  category: AdCategory;
  timeAgo: string;
  type: 'scan' | 'welcome' | 'reward';
}

export interface PassengerProfile {
  fullName: string;
  phone: string;
  email: string;
  membershipTier: string;
  memberSince: string;
  avatarInitials: string;
}

interface PassengerContextType {
  profile: PassengerProfile;
  totalPoints: number;
  totalGbpValue: number;
  coupons: CouponItem[];
  recentActivity: ActivityItem[];
  selectedCoupon: CouponItem | null;
  categorySummaries: CategorySummary[];
  setSelectedCoupon: (coupon: CouponItem | null) => void;
  updateProfile: (updated: Partial<PassengerProfile>) => void;
  claimScanReward: (campaign: {
    brand: string;
    headline: string;
    category: AdCategory;
    discount: string;
    points: number;
    themeColor: string;
  }) => CouponItem;
  addCustomVoucher: (voucher: {
    brand: string;
    headline: string;
    category: AdCategory;
    discount: string;
    code: string;
    points: number;
  }) => CouponItem;
  redeemCoupon: (couponId: string) => void;
  deleteCoupon: (couponId: string) => void;
  clearActivityHistory: () => void;
  signOut: () => void;
}

export const CATEGORY_CONFIG: Record<AdCategory, { icon: string; color: string }> = {
  'Mobility & EV': { icon: '⚡', color: '#00B4A6' },
  'Audio & Tech': { icon: '🎧', color: '#D4145A' },
  'Clean Energy': { icon: '🌱', color: '#D4A843' },
  'Travel & Tourism': { icon: '✈️', color: '#1B2A4A' },
};

const INITIAL_PROFILE: PassengerProfile = {
  fullName: 'Eleanor Vance',
  phone: '+44 7700 900123',
  email: 'eleanor.vance@mobility.co.uk',
  membershipTier: 'VIP Gold',
  memberSince: 'March 2026',
  avatarInitials: 'EV',
};

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'c-01',
    code: 'DOOH-NEXUS-15',
    brand: 'NEXUS DRIVE',
    category: 'Mobility & EV',
    headline: 'Zero Emissions. Pure Performance.',
    discount: '£15 OFF Next Rental',
    pointsEarned: 150,
    gbpValue: 15.00,
    dateEarned: '26 Aug 2026, 18:42',
    expiryDate: '30 Sep 2026',
    status: 'claimed',
    adLocation: 'Audi e-Tron In-Cabin #LN-402',
    themeColor: '#00B4A6',
  },
  {
    id: 'c-02',
    code: 'LUMEN-AUDIO-20',
    brand: 'LUMEN SOUND',
    category: 'Audio & Tech',
    headline: 'Hear Every Nuance in 360°',
    discount: '20% OFF Spatial Audio',
    pointsEarned: 200,
    gbpValue: 20.00,
    dateEarned: '24 Aug 2026, 21:15',
    expiryDate: '15 Oct 2026',
    status: 'claimed',
    adLocation: 'BMW i7 In-Cabin #LN-119',
    themeColor: '#D4145A',
  },
  {
    id: 'c-03',
    code: 'SOLARIS-FREE',
    brand: 'SOLARIS ENERGY',
    category: 'Clean Energy',
    headline: "Powering Tomorrow's Transit",
    discount: 'FREE 1-Month Clean Power',
    pointsEarned: 120,
    gbpValue: 12.00,
    dateEarned: '18 Aug 2026, 09:30',
    expiryDate: '25 Aug 2026',
    status: 'expired',
    adLocation: 'Tesla Model S In-Cabin #UK-773',
    themeColor: '#D4A843',
  },
  {
    id: 'c-04',
    code: 'KYOTO-EXP-25',
    brand: 'AURORA TRAVEL',
    category: 'Travel & Tourism',
    headline: 'Experience Kyoto Tradition & Art',
    discount: '£25 Travel Voucher',
    pointsEarned: 250,
    gbpValue: 25.00,
    dateEarned: '10 Aug 2026, 14:10',
    expiryDate: '01 Sep 2026',
    status: 'claimed',
    adLocation: 'Mercedes S-Class In-Cabin #UK-882',
    themeColor: '#1B2A4A',
  },
];

const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: 'a-01',
    title: 'Ad Scanned • Nexus Drive',
    subtitle: 'Mercedes S-Class In-Cabin Screen #UK-882',
    points: 150,
    category: 'Mobility & EV',
    timeAgo: '2 hours ago',
    type: 'scan',
  },
  {
    id: 'a-02',
    title: 'Welcome Verification Bonus',
    subtitle: 'DOOH Mobility Onboarding',
    points: 250,
    category: 'Mobility & EV',
    timeAgo: 'Yesterday',
    type: 'welcome',
  },
  {
    id: 'a-03',
    title: 'Ad Scanned • Lumen Sound',
    subtitle: 'Audi A8 Rear Display #LN-552',
    points: 200,
    category: 'Audio & Tech',
    timeAgo: '3 days ago',
    type: 'scan',
  },
];

const PassengerContext = createContext<PassengerContextType | null>(null);

export const PassengerProvider: React.FC<{ children: React.ReactNode; onSignOut?: () => void }> = ({
  children,
  onSignOut,
}) => {
  const [profile, setProfile] = useState<PassengerProfile>(INITIAL_PROFILE);
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);

  // Total points dynamically aggregated from all active/claimed coupons + welcome bonus
  const totalPoints = coupons.reduce((acc, c) => acc + c.pointsEarned, 250);
  const totalGbpValue = totalPoints * 0.01; // £0.01 per point rate

  // Compute points and totals broken down per Category
  const categoriesList: AdCategory[] = ['Mobility & EV', 'Audio & Tech', 'Clean Energy', 'Travel & Tourism'];
  const categorySummaries: CategorySummary[] = categoriesList.map((cat) => {
    const catCoupons = coupons.filter((c) => c.category === cat);
    const catPoints = catCoupons.reduce((sum, c) => sum + c.pointsEarned, 0) + (cat === 'Mobility & EV' ? 250 : 0);
    return {
      category: cat,
      icon: CATEGORY_CONFIG[cat].icon,
      color: CATEGORY_CONFIG[cat].color,
      totalPoints: catPoints,
      totalGbp: catPoints * 0.01,
      couponCount: catCoupons.length,
    };
  });

  // [UPDATE] Profile CRUD
  const updateProfile = (updated: Partial<PassengerProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (updated.fullName) {
        const parts = updated.fullName.trim().split(' ');
        const first = parts[0]?.[0] || 'D';
        const last = parts[1]?.[0] || parts[0]?.[1] || 'O';
        next.avatarInitials = (first + last).toUpperCase();
      }
      return next;
    });
  };

  // [CREATE] Scan Reward CRUD
  const claimScanReward = (campaign: {
    brand: string;
    headline: string;
    category: AdCategory;
    discount: string;
    points: number;
    themeColor: string;
  }): CouponItem => {
    const newCoupon: CouponItem = {
      id: `c-${Date.now()}`,
      code: `DOOH-${campaign.brand.replace(/\s+/g, '').toUpperCase().slice(0, 5)}-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: campaign.brand,
      category: campaign.category,
      headline: campaign.headline,
      discount: campaign.discount,
      pointsEarned: campaign.points,
      gbpValue: campaign.points * 0.1,
      dateEarned: 'Just Now',
      expiryDate: '30 Oct 2026',
      status: 'claimed',
      adLocation: 'Active Vehicle In-Cabin Screen #LN-LIVE',
      themeColor: campaign.themeColor,
    };

    setCoupons((prev) => [newCoupon, ...prev]);

    const newActivity: ActivityItem = {
      id: `a-${Date.now()}`,
      title: `Ad Scanned • ${campaign.brand}`,
      subtitle: `In-Cabin Screen (#LN-LIVE) • ${campaign.category}`,
      points: campaign.points,
      category: campaign.category,
      timeAgo: 'Just now',
      type: 'scan',
    };
    setRecentActivity((prev) => [newActivity, ...prev]);

    return newCoupon;
  };

  // [CREATE] Custom Voucher Code Entry CRUD
  const addCustomVoucher = (voucher: {
    brand: string;
    headline: string;
    category: AdCategory;
    discount: string;
    code: string;
    points: number;
  }): CouponItem => {
    const newCoupon: CouponItem = {
      id: `c-${Date.now()}`,
      code: voucher.code.toUpperCase().trim(),
      brand: voucher.brand,
      category: voucher.category,
      headline: voucher.headline,
      discount: voucher.discount,
      pointsEarned: voucher.points,
      gbpValue: voucher.points * 0.1,
      dateEarned: 'Just Now',
      expiryDate: '15 Dec 2026',
      status: 'claimed',
      adLocation: 'Partner Promotion Direct Entry',
      themeColor: CATEGORY_CONFIG[voucher.category].color,
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    return newCoupon;
  };

  // [UPDATE] Redeem Coupon CRUD
  const redeemCoupon = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, status: 'redeemed' } : c))
    );
    if (selectedCoupon && selectedCoupon.id === couponId) {
      setSelectedCoupon((prev) => (prev ? { ...prev, status: 'redeemed' } : null));
    }
  };

  // [DELETE] Delete Coupon CRUD
  const deleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    if (selectedCoupon && selectedCoupon.id === couponId) {
      setSelectedCoupon(null);
    }
  };

  // [DELETE] Clear Activity History CRUD
  const clearActivityHistory = () => {
    setRecentActivity([]);
  };

  const signOut = () => {
    if (onSignOut) onSignOut();
  };

  return (
    <PassengerContext.Provider
      value={{
        profile,
        totalPoints,
        totalGbpValue,
        coupons,
        recentActivity,
        selectedCoupon,
        categorySummaries,
        setSelectedCoupon,
        updateProfile,
        claimScanReward,
        addCustomVoucher,
        redeemCoupon,
        deleteCoupon,
        clearActivityHistory,
        signOut,
      }}
    >
      {children}
    </PassengerContext.Provider>
  );
};

export const usePassenger = (): PassengerContextType => {
  const context = useContext(PassengerContext);
  if (!context) {
    throw new Error('usePassenger must be used within a PassengerProvider');
  }
  return context;
};
