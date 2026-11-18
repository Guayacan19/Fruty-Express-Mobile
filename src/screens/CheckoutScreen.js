import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Heading, Field, Button } from '../components/Ui';
export default function CheckoutScreen({ zona, setZona, barrio, setBarrio, direccion, setDireccion, observaciones, setObservaciones, busy, onSubmit }) {
    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 18 }}>
            <Heading title="Datos de entrega" text="Completa los datos para enviar tu solicitud." />
            <Field label="Zona" value={zona} onChangeText={setZona} placeholder="Ej. Kennedy" />
            <Field label="Barrio" value={barrio} onChangeText={setBarrio} placeholder="Tu barrio" />
            <Field label="Dirección" value={direccion} onChangeText={setDireccion} placeholder="Dirección de entrega" />
            <Field label="Observaciones" value={observaciones} onChangeText={setObservaciones} multiline />
            <Button title={busy ? 'Enviando…' : 'Guardar pedido y abrir WhatsApp'} disabled={busy} onPress={onSubmit} />
        </ScrollView>
    </KeyboardAvoidingView>;
}
