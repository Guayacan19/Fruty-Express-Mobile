import React from 'react';
import { ScrollView, View } from 'react-native';
import { Heading, Field, Button } from '../components/Ui';
export default function AccountScreen({ session, zona, setZona, barrio, setBarrio, direccion, setDireccion, onSave, onSignIn, onSignOut }) {
    return <ScrollView contentContainerStyle={{ padding: 18 }}>
        <Heading title="Mi cuenta" text={session?.user?.email || 'Administra tus datos de comprador.'} />
        {!session ? <Button title="Iniciar sesión" onPress={onSignIn} /> : <>
            <Field label="Zona" value={zona} onChangeText={setZona} />
            <Field label="Barrio" value={barrio} onChangeText={setBarrio} />
            <Field label="Dirección" value={direccion} onChangeText={setDireccion} />
            <Button title="Guardar dirección" onPress={onSave} />
            <View style={{ marginTop: 12 }}><Button title="Cerrar sesión" light onPress={onSignOut} /></View>
        </>}
    </ScrollView>;
}
