import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function Shimmer({ style, borderRadius = 12 }) {
  const [width, setWidth] = useState(0);
  const anim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const gradientWidth = Math.max(80, width * 0.6);
  const translateX = anim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-gradientWidth, width],
  });

  return (
    <View
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      style={[styles.base, { borderRadius }, style]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { width: gradientWidth, transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.0)',
            'rgba(255,255,255,0.45)',
            'rgba(255,255,255,0.0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
});
