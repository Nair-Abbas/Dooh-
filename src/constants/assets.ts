import { AdCategory } from '../context/PassengerContext';

export const APP_IMAGES = {
  hero: require('../../assets/images/dooh_hero.jpg'),
  passbyHero: require('../../assets/images/dooh_passby_hero.jpg'),
  safariExterior: require('../../assets/images/dooh_safari_exterior.jpg'),
  safariInCabin: require('../../assets/images/dooh_safari_incabin.jpg'),
  vehicleDoohExterior: require('../../assets/images/dooh_vehicle_exterior.jpg'),
  inCabinPassengerDooh: require('../../assets/images/dooh_vehicle_incabin.jpg'),
  roleDriver: require('../../assets/images/role_driver.jpg'),
  rolePassenger: require('../../assets/images/role_passenger.jpg'),
};

export interface DoohAdCampaign {
  id: string;
  brand: string;
  tagline: string;
  headline: string;
  category: AdCategory;
  themeColor: string;
  accentColor: string;
  pointsReward: number;
  image?: any;
}

export const DOOH_INTRO_CAMPAIGNS: DoohAdCampaign[] = [
  {
    id: 'ad-01',
    brand: 'NEXUS DRIVE',
    tagline: 'NEXT-GEN MOBILITY',
    headline: 'Zero Emissions. Pure Performance.',
    category: 'Mobility & EV',
    themeColor: '#00A896',
    accentColor: '#33C4B8',
    pointsReward: 150,
    image: APP_IMAGES.vehicleDoohExterior,
  },
  {
    id: 'ad-02',
    brand: 'LUMEN SOUND',
    tagline: 'SPATIAL ACOUSTICS',
    headline: 'Hear Every Nuance in 360°',
    category: 'Audio & Tech',
    themeColor: '#D4145A',
    accentColor: '#E84580',
    pointsReward: 200,
    image: APP_IMAGES.inCabinPassengerDooh,
  },
  {
    id: 'ad-03',
    brand: 'SOLARIS ENERGY',
    tagline: 'CLEAN CITY POWER',
    headline: "Powering Tomorrow's Transit",
    category: 'Clean Energy',
    themeColor: '#D4A373',
    accentColor: '#E8C96B',
    pointsReward: 120,
    image: APP_IMAGES.hero,
  },
  {
    id: 'ad-04',
    brand: 'AURORA TRAVEL',
    tagline: 'LUXURY EXPERIENCES',
    headline: 'Experience Kyoto Tradition & Art',
    category: 'Travel & Tourism',
    themeColor: '#0B132B',
    accentColor: '#6B7B95',
    pointsReward: 250,
    image: APP_IMAGES.rolePassenger,
  },
];
