import React, { useRef } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface AnimatedPressableProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  activeScale?: number;
  disabled?: boolean;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  onPress,
  style,
  children,
  activeScale = 0.94,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: activeScale,
        useNativeDriver: true,
        friction: 4,
        tension: 140,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.88,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
