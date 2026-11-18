import React from 'react';
import { View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { C } from '../theme/colors';

export default function AnimatedProductImage({ uri }) {
  const x = useSharedValue(0), y = useSharedValue(0), scale = useSharedValue(1), rotation = useSharedValue(0);
  const pan = Gesture.Pan().onChange(e => { x.value += e.changeX; y.value += e.changeY; });
  const pinch = Gesture.Pinch().onUpdate(e => { scale.value = Math.max(.8, Math.min(2.5, e.scale)); });
  const rotate = Gesture.Rotation().onUpdate(e => { rotation.value = e.rotation; });
  const gesture = Gesture.Simultaneous(pan, pinch, rotate);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }, { rotate: `${rotation.value}rad` }] }));
  return <View style={{ height: 270, borderRadius: 20, backgroundColor: C.bg, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }, style]}>
        <Image source={uri ? { uri } : require('../../assets/logo-fruty-express.png')} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
      </Animated.View>
    </GestureDetector>
  </View>;
}
