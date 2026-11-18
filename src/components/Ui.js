import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { C } from '../theme/colors';

export function Button({ title, onPress, light = false, disabled = false }) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={animated}>
    <Pressable disabled={disabled} onPress={onPress}
      onPressIn={() => { scale.value = withSpring(.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={{ backgroundColor: light ? C.greenSoft : C.green, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 13, alignItems: 'center', opacity: disabled ? 0.55 : 1 }}>
      <Text style={{ color: light ? C.greenDark : '#fff', fontWeight: '900' }}>{title}</Text>
    </Pressable>
  </Animated.View>;
}
export function Field({ label, ...props }) {
  return <View style={{ marginBottom: 13 }}>
    <Text style={{ fontWeight: '800', color: C.ink, marginBottom: 6 }}>{label}</Text>
    <TextInput placeholderTextColor="#98a49a"
      style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, color: C.ink }}
      {...props} />
  </View>;
}
export function Heading({ title, text }) {
  return <View style={{ marginBottom: 14 }}>
    <Text style={{ fontSize: 23, fontWeight: '900', color: C.ink }}>{title}</Text>
    {!!text && <Text style={{ color: C.muted, marginTop: 5, lineHeight: 20 }}>{text}</Text>}
  </View>;
}
export function Empty({ text }) {
  return <View style={{ padding: 24, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' }}>
    <Text style={{ fontSize: 32 }}>🍃</Text>
    <Text style={{ color: C.muted, textAlign: 'center', marginTop: 8 }}>{text}</Text>
  </View>;
}
export const rowCard = { backgroundColor: '#fff', padding: 13, borderRadius: 15, marginBottom: 11, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.line };
export const inputStyle = { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 13, padding: 13, color: C.ink };
export const optionLabel = { fontWeight: '900', color: C.ink, marginTop: 18 };
export const choice = { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 18, backgroundColor: C.greenSoft };
export const choiceActive = { backgroundColor: C.green };
export const counter = { fontSize: 22, color: C.green, fontWeight: '900', paddingHorizontal: 5 };
export const bodyText = { fontSize: 16, color: C.muted, lineHeight: 25, marginTop: 14 };
