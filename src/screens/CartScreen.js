import React from 'react';
import { ScrollView, View, Text, Image, Pressable } from 'react-native';
import { C } from '../theme/colors';
import { Heading, Empty, Button, rowCard, counter } from '../components/Ui';
export default function CartScreen({ cart, onChange, onCheckout }) {
    return <ScrollView contentContainerStyle={{ padding: 18 }}>
        <Heading title="Tu carrito" text="Revisa los productos que quieres cotizar." />
        {!cart.length ? <Empty text="Tu carrito está vacío." /> : cart.map(p => <View key={p.cartKey} style={rowCard}>
            <Image source={p.imagen ? { uri: p.imagen } : require('../../assets/logo-fruty-express.png')} style={{ width: 72, height: 72, borderRadius: 12 }} />
            <View style={{ flex: 1 }}><Text style={{ fontWeight: '900', color: C.ink }}>{p.nombre}</Text><Text style={{ color: C.muted, fontSize: 12 }}>{p.modalidad} · Calidad {p.calidad || '—'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8 }}>
                    <Pressable onPress={() => onChange(p.cartKey, p.cantidad - 1)}><Text style={counter}>−</Text></Pressable><Text style={{ fontWeight: '900' }}>{p.cantidad}</Text><Pressable onPress={() => onChange(p.cartKey, p.cantidad + 1)}><Text style={counter}>+</Text></Pressable>
                </View>
            </View>
            <Pressable onPress={() => onChange(p.cartKey, 0)}><Text style={{ color: C.red, fontWeight: '900' }}>Quitar</Text></Pressable>
        </View>)}
        {!!cart.length && <><Text style={{ color: C.muted, marginVertical: 12 }}>Los precios finales se confirman por WhatsApp.</Text><Button title="Continuar con la solicitud" onPress={onCheckout} /></>}
    </ScrollView>;
}
