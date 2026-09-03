import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';
import { useDriver } from '../../context/DriverContext';

const { width: SW } = Dimensions.get('window');

export const DriverRoutesScreen: React.FC = () => {
  const { trips } = useDriver();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══════ TOP HEADER ═══════ */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTag}>MOBILITY COVERAGE & ZONES</Text>
          <Text style={styles.headerTitle}>Routes & Trips.</Text>
          <Text style={styles.headerSubtitle}>
            Drive through high-footfall metropolitan zones to maximize impressions and unlock peak multiplier rates.
          </Text>
        </View>

        {/* ═══════ HIGH-VALUE COVERAGE ZONES SIMULATOR MAP ═══════ */}
        <View style={styles.mapCard}>
          {/* Simulated Map Viewport */}
          <View style={styles.mapCanvas}>
            {/* Grid Lines */}
            <View style={styles.mapGridLineH1} />
            <View style={styles.mapGridLineH2} />
            <View style={styles.mapGridLineV1} />
            <View style={styles.mapGridLineV2} />

            {/* Zone 1 Hotspot Bubble */}
            <View style={styles.zone1Bubble}>
              <View style={styles.zone1Pulse} />
              <Text style={styles.zone1Tag}>ZONE 1: 1.5x MULTIPLIER</Text>
              <Text style={styles.zone1Sub}>Westminster • Soho • Covent Garden</Text>
            </View>

            {/* Zone 2 Hotspot Bubble */}
            <View style={styles.zone2Bubble}>
              <Text style={styles.zone2Tag}>ZONE 2: 1.4x HIGH DENSITY</Text>
              <Text style={styles.zone2Sub}>Canary Wharf Financial</Text>
            </View>

            {/* Live Vehicle Location Pin */}
            <View style={styles.vehiclePin}>
              <View style={styles.pinDot} />
              <Text style={styles.pinText}>YOU ARE HERE</Text>
            </View>
          </View>

          {/* Map Footer stats */}
          <View style={styles.mapFooter}>
            <View style={styles.mapStatCol}>
              <Text style={styles.mapStatKey}>CURRENT ZONE</Text>
              <Text style={styles.mapStatVal}>Zone 1 (Central)</Text>
            </View>
            <View style={styles.mapStatCol}>
              <Text style={styles.mapStatKey}>MULTIPLIER</Text>
              <Text style={[styles.mapStatVal, { color: COLORS.teal }]}>1.5× Peak Surge</Text>
            </View>
            <View style={styles.mapStatCol}>
              <Text style={styles.mapStatKey}>ACTIVE CPM</Text>
              <Text style={styles.mapStatVal}>£14.20 / 1k</Text>
            </View>
          </View>
        </View>

        {/* ═══════ TODAY'S TRIP LOG ═══════ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed Route Segments</Text>
          <Text style={styles.sectionCount}>{trips.length} Trips Today</Text>
        </View>

        <View style={styles.tripsList}>
          {trips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripLeftCol}>
                <View style={styles.tripDot} />
                <View style={styles.tripLine} />
              </View>

              <View style={styles.tripContent}>
                <View style={styles.tripHeaderRow}>
                  <Text style={styles.tripZoneTitle}>{trip.routeZone}</Text>
                  <Text style={styles.tripEarnings}>+£{trip.earningsGbp.toFixed(2)}</Text>
                </View>

                <Text style={styles.tripTime}>⏰ {trip.time} • {trip.distanceKm} km driven</Text>

                <View style={styles.tripMetaRow}>
                  <View style={styles.impressionsTag}>
                    <Text style={styles.impressionsTagText}>{trip.impressionsDelivered} Impressions</Text>
                  </View>
                  <View style={styles.multiplierTag}>
                    <Text style={styles.multiplierTagText}>{trip.multiplier}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
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
    paddingTop: 54,
    paddingBottom: 30,
  },
  topHeader: {
    marginBottom: 20,
  },
  headerTag: {
    ...TYPOGRAPHY.microTag,
    color: COLORS.magenta,
    letterSpacing: 2,
    marginBottom: 6,
  },
  headerTitle: {
    ...TYPOGRAPHY.heroDisplay,
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.navy,
    marginBottom: 6,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.slate,
    lineHeight: 18,
  },

  // Map Card
  mapCard: {
    backgroundColor: '#0F1B33',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  mapCanvas: {
    height: 200,
    backgroundColor: '#0A0F1D',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGridLineH1: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  mapGridLineH2: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  mapGridLineV1: {
    position: 'absolute',
    left: SW * 0.35,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  mapGridLineV2: {
    position: 'absolute',
    left: SW * 0.65,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  zone1Bubble: {
    position: 'absolute',
    top: 25,
    left: 20,
    backgroundColor: 'rgba(212, 20, 90, 0.18)',
    borderWidth: 1.5,
    borderColor: COLORS.magenta,
    borderRadius: RADIUS.md,
    padding: 8,
  },
  zone1Pulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.magenta,
    marginBottom: 2,
  },
  zone1Tag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  zone1Sub: {
    fontSize: 8,
    color: COLORS.slateLight,
  },
  zone2Bubble: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: 'rgba(0, 180, 166, 0.18)',
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    borderRadius: RADIUS.md,
    padding: 8,
  },
  zone2Tag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  zone2Sub: {
    fontSize: 8,
    color: COLORS.slateLight,
  },
  vehiclePin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    ...SHADOWS.soft,
  },
  pinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
  },
  pinText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.navy,
  },
  mapFooter: {
    flexDirection: 'row',
    backgroundColor: '#0F1B33',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  mapStatCol: {
    flex: 1,
  },
  mapStatKey: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.slateLight,
    marginBottom: 2,
  },
  mapStatVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Trips list
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
    color: COLORS.navy,
  },
  sectionCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.slate,
    fontWeight: '600',
  },
  tripsList: {
    gap: 12,
  },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 16,
    ...SHADOWS.soft,
  },
  tripLeftCol: {
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 4,
  },
  tripDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.magenta,
  },
  tripLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.borderLight,
    marginTop: 4,
  },
  tripContent: {
    flex: 1,
  },
  tripHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  tripZoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
    flex: 1,
  },
  tripEarnings: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  tripTime: {
    fontSize: 11,
    color: COLORS.slate,
    marginBottom: 10,
  },
  tripMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  impressionsTag: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  impressionsTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.slate,
  },
  multiplierTag: {
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#FFE4EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  multiplierTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.magenta,
  },
});
