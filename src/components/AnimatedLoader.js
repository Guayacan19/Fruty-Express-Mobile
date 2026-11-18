import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { C } from '../theme/colors';
export default function AnimatedLoader({ label = 'Cargando...' }) {
  const rotation = useSharedValue(0);
  useEffect(() => { rotation.value = withRepeat(withTiming(360, { duration: 850 }), -1, false); return () => { rotation.value = 0; }; }, []);
  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  return <View style={{ alignItems: 'center', justifyContent: 'center', padding: 28 }}>
    <Animated.View style={[{ width: 34, height: 34, borderWidth: 4, borderColor: C.line, borderTopColor: C.green, borderRadius: 20 }, spin]} />
    <Animated.Text style={{ color: C.muted, marginTop: 12, fontWeight: '700' }}>{label}</Animated.Text>
  </View>;
}
