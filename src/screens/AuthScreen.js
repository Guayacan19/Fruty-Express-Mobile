import React from 'react';
import { ScrollView, Text, View, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { C } from '../theme/colors';
import { Field, Button } from '../components/Ui';
export default function AuthScreen({ page, name, setName, phone, setPhone, email, setEmail, password, setPassword, busy, onSubmit, onGoogle, onRecover, onSwitch }) {
    const login = page === 'Iniciar sesión';
    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 22, justifyContent: 'center', flexGrow: 1 }}>
            <Text style={{ fontSize: 27, fontWeight: '900', color: C.ink, marginBottom: 6 }}>{login ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</Text>
            <Text style={{ color: C.muted, marginBottom: 22 }}>Accede a tus compras de Fruty Express.</Text>
            {!login && <><Field label="Nombre completo" value={name} onChangeText={setName} /><Field label="Teléfono (10 dígitos)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} /></>}
            <Field label="Correo electrónico" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <Field label="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title={busy ? 'Procesando…' : login ? 'Iniciar sesión' : 'Crear cuenta'} disabled={busy} onPress={onSubmit} />
            {login && <><View style={{ marginTop: 10 }}><Button title="Continuar con Google" light onPress={onGoogle} /></View>
                <Pressable onPress={onRecover} style={{ padding: 12, alignItems: 'center' }}><Text style={{ color: C.greenDark, fontWeight: '800' }}>¿Olvidaste tu contraseña?</Text></Pressable></>}
            <Pressable onPress={onSwitch} style={{ padding: 18, alignItems: 'center' }}><Text style={{ color: C.greenDark, fontWeight: '800' }}>{login ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta. Iniciar sesión'}</Text></Pressable>
        </ScrollView>
    </KeyboardAvoidingView>;
}
