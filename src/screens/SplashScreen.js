import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

export default function SplashScreen({ onFinish }) {
  // Shared progress value for animation. Starts at 0 (invisible and tiny).
  const progress = useSharedValue(0);

  // Define the animated styles based on progress. Opacity and scale both
  // interpolate from 0 to 1 as progress goes from 0 to 1.
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }],
    };
  });

  useEffect(() => {
    const handleFinish = () => {
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
    };
    progress.value = withTiming(1, { duration: 1000 }, finished => {
      if (finished) {
        runOnJS(handleFinish)();
      }
    });
  }, [progress, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyles]}>
        <Text style={styles.title}>Historical Places</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
});
