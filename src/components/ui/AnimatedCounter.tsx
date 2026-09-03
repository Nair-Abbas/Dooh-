import React, { useEffect, useState, useRef } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: StyleProp<TextStyle>;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 800,
  prefix = '',
  suffix = '',
  decimals = 0,
  style,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);

  useEffect(() => {
    const startValue = startValueRef.current;
    const endValue = value;
    const startTime = Date.now();

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        startValueRef.current = endValue;
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString();

  return (
    <Text style={style}>
      {prefix}
      {formatted}
      {suffix}
    </Text>
  );
};
