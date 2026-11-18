import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { C } from '../theme/colors';
import { Heading, Empty, rowCard } from '../components/Ui';
export default function OrdersScreen({ orders }) {
    return <ScrollView contentContainerStyle={{ padding: 18 }}>
        <Heading title="Mis pedidos" text="Consulta tus solicitudes y su estado." />
        {!orders.length ? <Empty text="Aún no tienes pedidos registrados." /> : orders.map(o => <View key={o.id} style={rowCard}>
            <View style={{ flex: 1 }}><Text style={{ fontWeight: '900', color: C.ink }}>Pedido {String(o.id).slice(0, 8)}</Text>
                <Text style={{ color: C.muted, marginTop: 4 }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('es-CO') : ''}</Text>
                <Text style={{ color: C.green, fontWeight: '900', marginTop: 6, textTransform: 'capitalize' }}>{o.estado?.replace('_', ' ')}</Text>
                <Text style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>{Array.isArray(o.productos) ? o.productos.map(p => p.nombre).join(', ') : ''}</Text>
            </View>
        </View>)}
    </ScrollView>;
}
