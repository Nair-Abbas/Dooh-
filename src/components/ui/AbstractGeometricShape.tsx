import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Polygon, Line } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface AbstractGeometricShapeProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  variant?: 'corner' | 'inline' | 'subtle';
}

/**
 * Abstract Faceted Geometric Graphic
 * Derived from the editorial reference artwork:
 * Sophisticated polygon shards in deep navy, slate, teal, magenta, and warm gold.
 */
export const AbstractGeometricShape: React.FC<AbstractGeometricShapeProps> = ({
  size = 120,
  style,
  variant = 'corner',
}) => {
  const vbWidth = 160;
  const vbHeight = 160;

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Svg width={size} height={size} viewBox={`0 0 ${vbWidth} ${vbHeight}`}>
        {/* Facet 1: Deep Navy Base */}
        <Polygon
          points="0,0 90,0 60,60 0,40"
          fill={COLORS.shardNavy}
          opacity={0.95}
        />

        {/* Facet 2: Medium Navy Shard */}
        <Polygon
          points="90,0 150,20 110,75 60,60"
          fill={COLORS.shardNavyMedium}
          opacity={0.9}
        />

        {/* Facet 3: Teal Accent Shard */}
        <Polygon
          points="60,60 110,75 75,125 30,90"
          fill={COLORS.shardTeal}
          opacity={0.88}
        />

        {/* Facet 4: Magenta Accent Shard */}
        <Polygon
          points="110,75 160,85 130,135 75,125"
          fill={COLORS.shardMagenta}
          opacity={0.82}
        />

        {/* Facet 5: Warm Gold Apex */}
        <Polygon
          points="0,40 60,60 30,90 0,105"
          fill={COLORS.shardGold}
          opacity={0.85}
        />

        {/* Facet 6: Muted Slate Base */}
        <Polygon
          points="30,90 75,125 45,160 0,140 0,105"
          fill={COLORS.shardSlate}
          opacity={0.7}
        />

        {/* Delicate structural architectural hairline */}
        <Line
          x1="0"
          y1="0"
          x2="160"
          y2="160"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          opacity={0.3}
        />
        <Line
          x1="60"
          y1="60"
          x2="130"
          y2="135"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          opacity={0.3}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
