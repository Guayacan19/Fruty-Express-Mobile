import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { C } from '../theme/colors';
export default function AppHeader({ cartCount, onHome, onCart, onMenu }) {
    return <View style={{ paddingHorizontal: 18, paddingTop: 9, paddingBottom: 13, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={onHome} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image source={require('../../assets/logo-fruty-express.png')} style={{ width: 48, height: 42 }} resizeMode="contain" />
            <View><Text style={{ fontSize: 18, fontWeight: '900', color: C.greenDark }}>Fruty Express</Text><Text style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>FRESCURA PARA TU HOGAR</Text></View>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable onPress={onCart} style={{ backgroundColor: C.greenSoft, padding: 10, borderRadius: 12, position: 'relative' }}>
                <Text style={{ fontSize: 21 }}>🛒</Text>{cartCount > 0 && <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: C.orange, minWidth: 19, height: 19, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>{cartCount}</Text></View>}
            </Pressable>
            <Pressable onPress={onMenu} style={{ backgroundColor: C.greenSoft, padding: 10, borderRadius: 12 }}><Text style={{ fontSize: 20, color: C.greenDark }}>☰</Text></Pressable>
        </View>
    </View>;
}
