import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { C } from '../theme/colors';
const money = v => v == null ? 'Por cotizar' : `$${Number(v).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
export default function ProductCard({ item, onOpen, onAdd, onFavorite }) {
    const cartBounce = useSharedValue(1);
    const cartStyle = useAnimatedStyle(() => ({ transform: [{ scale: cartBounce.value }] }));
    return <View style={{ width: '48%', backgroundColor: '#fff', borderRadius: 17, borderWidth: 1, borderColor: C.line, marginBottom: 12, overflow: 'hidden' }}>
        <Pressable onPress={onOpen}>
            <Image source={item.imagen ? { uri: item.imagen } : require('../../assets/logo-fruty-express.png')} style={{ width: '100%', height: 125, backgroundColor: C.bg }} resizeMode="cover" />
            <View style={{ padding: 11 }}>
                <Text numberOfLines={2} style={{ fontWeight: '900', color: C.ink, minHeight: 40 }}>{item.nombre}</Text>
                <Text style={{ color: C.green, fontWeight: '900', marginTop: 5 }}>{money(item.precio)}</Text>
                <Text style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{item.categoria}</Text>
            </View>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 11, paddingBottom: 11 }}>
            <Animated.View style={[{ flex: 1 }, cartStyle]}>
                <Pressable onPress={() => { cartBounce.value = withSequence(withSpring(.82), withSpring(1.12), withSpring(1)); onAdd?.(); }} style={{ backgroundColor: C.green, padding: 8, borderRadius: 9, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '900' }}>+ Carrito</Text>
                </Pressable>
            </Animated.View>
            <Pressable onPress={onFavorite} style={{ backgroundColor: C.greenSoft, padding: 8, borderRadius: 9 }}><Text style={{ color: C.greenDark }}>♥</Text></Pressable>
        </View>
    </View>;
}
