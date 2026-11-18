import React from 'react';
import { ScrollView, Text, Linking } from 'react-native';
import { C } from '../theme/colors';
import { Heading, Button, bodyText } from '../components/Ui';
export function AboutScreen() {
    return <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 27, fontWeight: '900', color: C.greenDark }}>Del campo a tu mesa</Text>
        <Text style={bodyText}>Somos Fruty Express, una marca que reúne tres establecimientos dedicados a la comercialización de frutas, verduras y productos para el hogar.</Text>
        <Text style={bodyText}>Durante cerca de dos años hemos trabajado para ofrecer variedad, calidad y una atención cercana a nuestros clientes. Queremos facilitar tus compras y acompañarte en cada mercado.</Text>
        <Text style={bodyText}>Estamos presentes en Kennedy y Soacha, con una misma identidad y compromiso de servicio.</Text>
    </ScrollView>;
}
export function ContactScreen() {
    return <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Heading title="¡Hablemos!" text="En Fruty Express queremos estar cerca de ti." />
        <Text style={bodyText}>Atención directa por WhatsApp: +57 320 916 3503</Text>
        <Text style={bodyText}>Nuestros establecimientos: Kennedy y Soacha.</Text>
        <Button title="Escribir por WhatsApp" onPress={() => Linking.openURL('https://wa.me/573209163503')} />
    </ScrollView>;
}
