import React, { useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { C } from '../theme/colors';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const nav = [['Inicio', '⌂'], ['Productos', '▦'], ['Nosotros', '♡'], ['Contacto', '✉'], ['Carrito', '🛒'], ['Favoritos', '♥'], ['Mis pedidos', '▤'], ['Notificaciones', '♢'], ['Mi cuenta', '☺']];
export default function DrawerMenu({ visible, page, session, onNavigate, onClose }) {
  const x = useSharedValue(-360), opacity = useSharedValue(0);
  useEffect(() => { x.value = withSpring(visible ? 0 : -360, { damping: 22, stiffness: 180 }); opacity.value = withTiming(visible ? 1 : 0, { duration: 180 }); }, [visible]);
  const panel = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const backdrop = useAnimatedStyle(() => ({ opacity: opacity.value }));
  if (!visible) return null;
  return <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000, elevation: 25, flexDirection: 'row' }}>
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(14,32,19,0.48)' }, backdrop]} />
    <Animated.View style={[{ width: '82%', maxWidth: 340, backgroundColor: '#fff', paddingTop: 25, paddingHorizontal: 18, elevation: 20 }, panel]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Image source={require('../../assets/logo-fruty-express.png')} style={{ width: 58, height: 54 }} resizeMode="contain" />
        <View><Text style={{ fontSize: 20, fontWeight: '900', color: C.greenDark }}>Fruty Express</Text><Text style={{ color: C.muted, fontSize: 11 }}>MENÚ PRINCIPAL</Text></View>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 25 }}>
        {nav.map(([p, icon]) => <Pressable key={p} onPress={() => onNavigate(p)} style={{ minHeight: 58, paddingVertical: 16, borderBottomWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 13 }}>
          <Text style={{ width: 22, color: C.green, fontWeight: '900' }}>{icon}</Text><Text style={{ color: C.ink, fontWeight: page === p ? '900' : '700' }}>{p}</Text>
        </Pressable>)}
        {!session ? <><Pressable onPress={() => onNavigate('Iniciar sesión')} style={{ padding: 14, marginTop: 15, backgroundColor: C.green, borderRadius: 12 }}><Text style={{ color: '#fff', fontWeight: '900', textAlign: 'center' }}>Iniciar sesión</Text></Pressable>
          <Pressable onPress={() => onNavigate('Registro')} style={{ padding: 13 }}><Text style={{ color: C.greenDark, fontWeight: '900', textAlign: 'center' }}>Crear cuenta</Text></Pressable></> : <Text style={{ color: C.muted, marginTop: 16 }}>Sesión: {session.user.email}</Text>}
      </ScrollView>
    </Animated.View>
    <Pressable onPress={onClose} style={{ flex: 1 }} />
  </View>;
}
