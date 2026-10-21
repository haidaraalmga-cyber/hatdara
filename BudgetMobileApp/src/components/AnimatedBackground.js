import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const AnimatedBackground = () => {
  // Orb 1 - Green/Emerald
  const orb1TranslateX = useSharedValue(0);
  const orb1TranslateY = useSharedValue(0);
  const orb1Scale = useSharedValue(1);

  // Orb 2 - Purple
  const orb2TranslateX = useSharedValue(0);
  const orb2TranslateY = useSharedValue(0);
  const orb2Scale = useSharedValue(1);

  // Orb 3 - Blue
  const orb3TranslateX = useSharedValue(0);
  const orb3TranslateY = useSharedValue(0);
  const orb3Scale = useSharedValue(1);

  useEffect(() => {
    // Orb 1 animations
    orb1TranslateX.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb1TranslateY.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(40, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb1Scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Orb 2 animations
    orb2TranslateX.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(40, { duration: 5500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb2TranslateY.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb2Scale.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.3, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Orb 3 animations
    orb3TranslateX.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-25, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb3TranslateY.value = withRepeat(
      withSequence(
        withTiming(-35, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(35, { duration: 5500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb3Scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const orb1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb1TranslateX.value },
      { translateY: orb1TranslateY.value },
      { scale: orb1Scale.value },
    ],
  }));

  const orb2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb2TranslateX.value },
      { translateY: orb2TranslateY.value },
      { scale: orb2Scale.value },
    ],
  }));

  const orb3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb3TranslateX.value },
      { translateY: orb3TranslateY.value },
      { scale: orb3Scale.value },
    ],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.orb, styles.orb1, orb1AnimatedStyle]} />
      <Animated.View style={[styles.orb, styles.orb2, orb2AnimatedStyle]} />
      <Animated.View style={[styles.orb, styles.orb3, orb3AnimatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: '#10b981', // emerald
    top: '10%',
    left: '20%',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
  },
  orb2: {
    width: 250,
    height: 250,
    backgroundColor: '#a855f7', // purple
    top: '50%',
    right: '15%',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  orb3: {
    width: 200,
    height: 200,
    backgroundColor: '#3b82f6', // blue
    bottom: '15%',
    left: '10%',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
});

export default AnimatedBackground;
