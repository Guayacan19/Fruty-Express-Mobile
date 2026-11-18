import React from 'react';
import { ScrollView, Text, View, TextInput, Pressable } from 'react-native';
import { C } from '../theme/colors';
import { Heading, Button, optionLabel, choice, choiceActive, counter, inputStyle } from '../components/Ui';
import AnimatedProductImage from '../components/AnimatedProductImage';
export default function ProductDetailScreen({ product, mode, setMode, quality, setQuality, quantity, setQuantity, onBack, onAdd, onFavorite }) {
    if (!product) return null;
    return <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 35 }}>
        <Pressable onPress={onBack}><Text style={{ color: C.green, fontWeight: '900', marginBottom: 14 }}>‹ Volver al catálogo</Text></Pressable>
        <AnimatedProductImage uri={product.imagen} />
        <Text style={{ fontSize: 25, fontWeight: '900', color: C.ink, marginTop: 18 }}>{product.nombre}</Text>
        <Text style={{ fontSize: 20, color: C.green, fontWeight: '900', marginVertical: 8 }}>{product.precio == null ? 'Por cotizar' : `$${Number(product.precio).toLocaleString('es-CO')}`}</Text>
        <Text style={{ color: C.muted, lineHeight: 22 }}>{product.descripcion || 'Producto disponible en nuestro catálogo.'}</Text>
        <Text style={optionLabel}>Modalidad de venta</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {(product.modalidades_venta || ['Unidad']).map(m => <Pressable key={m} onPress={() => setMode(m)} style={[choice, mode === m && choiceActive]}><Text style={{ color: mode === m ? '#fff' : C.greenDark, fontWeight: '800' }}>{m}</Text></Pressable>)}
        </View>
        {!!product.calidades?.length && <><Text style={optionLabel}>Calidad</Text><View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>{product.calidades.map(q => <Pressable key={q} onPress={() => setQuality(q)} style={[choice, quality === q && choiceActive]}><Text style={{ color: quality === q ? '#fff' : C.greenDark, fontWeight: '800' }}>{q}</Text></Pressable>)}</View></>}
        <Text style={optionLabel}>Cantidad</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginVertical: 10 }}>
            <Pressable onPress={() => setQuantity(String(Math.max(1, Number(quantity || 1) - 1)))}><Text style={counter}>−</Text></Pressable>
            <TextInput value={quantity} onChangeText={v => setQuantity(v.replace(/[^0-9]/g, ''))} keyboardType="number-pad" style={[inputStyle, { width: 75, textAlign: 'center' }]} />
            <Pressable onPress={() => setQuantity(String(Number(quantity || 1) + 1))}><Text style={counter}>+</Text></Pressable>
        </View>
        <Button title="Agregar al carrito" onPress={onAdd} />
        <Pressable onPress={onFavorite} style={{ padding: 15, alignItems: 'center' }}><Text style={{ color: C.greenDark, fontWeight: '800' }}>♥ Guardar en favoritos</Text></Pressable>
    </ScrollView>;
}
