import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, Extrapolation } from 'react-native-reanimated';
import { Accelerometer } from 'expo-sensors';
import { C } from '../theme/colors';
import { Heading, Empty } from '../components/Ui';
import ProductCard from '../components/ProductCard';
import AnimatedLoader from '../components/AnimatedLoader';
const { width } = Dimensions.get('window');
const featured = ['🍓', '🥑', '🍇', '🥭', '🍉'];
const names = ['Fresa', 'Aguacate', 'Uva', 'Mango', 'Sandía'];
function Carousel({ products, onOpen }) {
  const offset = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({ onScroll: e => { offset.value = e.contentOffset.x; } });
  const data = products.slice(0, 8);
  if (!data.length) return <Text style={{ color: C.muted, paddingVertical: 16 }}>El carrusel aparecerá cuando cargue el catálogo.</Text>;
  return <Animated.ScrollView horizontal onScroll={onScroll} scrollEventThrottle={16} showsHorizontalScrollIndicator={false} snapToInterval={width * .72} decelerationRate="fast" contentContainerStyle={{ paddingVertical: 10, paddingRight: 12 }}>
    {data.map((item, index) => <CarouselItem key={item.id} item={item} index={index} offset={offset} onPress={() => onOpen(item)} />)}
  </Animated.ScrollView>;
}
function CarouselItem({ item, index, offset, onPress }) {
  const style = useAnimatedStyle(() => {
    const center = index * (width * .72);
    const distance = Math.abs(offset.value - center);
    const scale = interpolate(distance, [0, width * .72], [1, .86], Extrapolation.CLAMP);
    const rotate = interpolate(offset.value, [center - width * .72, center, center + width * .72], [6, 0, -6], Extrapolation.CLAMP);
    return { transform: [{ scale }, { rotate: `${rotate}deg` }] };
  });
  return <Animated.View style={[{ width: width * .66, marginRight: 12, borderRadius: 20, backgroundColor: '#fff', padding: 18, borderWidth: 1, borderColor: C.line, justifyContent: 'center', minHeight: 142 }, style]}>
    <Pressable onPress={onPress}>
      <Text style={{ fontSize: 34 }}>{item.emoji || '🍏'}</Text>
      <Text style={{ fontWeight: '900', fontSize: 17, color: C.ink, marginTop: 8 }}>{item.nombre}</Text>
      <Text style={{ color: C.muted, marginTop: 3 }}>Descubre productos frescos</Text>
    </Pressable>
  </Animated.View>;
}
export default function HomeScreen({ products, productsLoading, onOpen, onBrowse, onShakeProduct, onFavorite }) {
  const [shakeReady, setShakeReady] = useState(false);
  useEffect(() => {
    let subscription, last = 0;
    let active = true;
    (async () => {
      const available = await Accelerometer.isAvailableAsync();
      if (!active || !available) return;
      Accelerometer.setUpdateInterval(150);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        if (magnitude > 1.85 && now - last > 1800) { last = now; setShakeReady(true); onShakeProduct?.(); }
        else if (magnitude < 1.2) setShakeReady(false);
      });
    })();
    return () => { active = false; subscription?.remove(); };
  }, [onShakeProduct]);
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 36 }}>
    <View style={{ backgroundColor: C.greenDark, borderRadius: 22, padding: 22, marginBottom: 20 }}>
      <Text style={{ color: '#d8f0b9', fontWeight: '900', letterSpacing: 1 }}>BIENVENIDO A FRUTY EXPRESS</Text>
      <Text style={{ fontSize: 29, fontWeight: '900', color: '#fff', marginTop: 10, lineHeight: 34 }}>Del campo a tu mesa 🍃</Text>
      <Text style={{ color: '#e2f2e2', lineHeight: 21, marginTop: 9 }}>Frutas, verduras y productos frescos para acompañar tu hogar.</Text>
      <Pressable onPress={onBrowse} style={{ backgroundColor: '#fff', padding: 13, borderRadius: 12, alignSelf: 'flex-start', marginTop: 18 }}>
        <Text style={{ color: C.greenDark, fontWeight: '900' }}>Explorar productos →</Text>
      </Pressable>
    </View>
    <Heading title="Compra fácil desde tu celular" text="Consulta el catálogo y envía tu solicitud de cotización." />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12, marginBottom: 22 }}>
      {['🥬 Variedad', '🚚 Atención cercana', '🍎 Productos frescos'].map(t => <View key={t} style={{ backgroundColor: '#fff', padding: 14, borderRadius: 14, flexGrow: 1, minWidth: '30%', alignItems: 'center' }}><Text style={{ fontWeight: '800', color: C.ink }}>{t}</Text></View>)}
    </View>
    <Heading title="Productos para descubrir" text="Desliza para explorar el carrusel." />
    <Carousel products={products} onOpen={onOpen} />
    <Pressable onPress={onShakeProduct} style={{ padding: 12, backgroundColor: C.greenSoft, borderRadius: 13, marginTop: 10, marginBottom: 20 }}>
      <Text style={{ color: C.greenDark, fontWeight: '800', textAlign: 'center' }}>{shakeReady ? '¡Sacudida detectada!' : '🎲 Agita tu celular para descubrir un producto'}</Text>
    </Pressable>
    <Heading title="Productos destacados" />
    {productsLoading ? <AnimatedLoader label="Cargando productos..." /> : products.filter(p => p.destacado === true || p.destacado === 'true').length === 0 ? <Empty text="Pronto encontrarás aquí nuestros productos destacados." /> :
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {products.filter(p => p.destacado === true || p.destacado === 'true').slice(0, 4).map(item => <ProductCard key={item.id} item={item} onOpen={() => onOpen(item)} onAdd={() => onOpen(item, true)} onFavorite={() => onFavorite?.(item.id)} />)}
      </View>}
    <Pressable onPress={onBrowse} style={{ backgroundColor: C.green, padding: 14, borderRadius: 13, alignItems: 'center', marginTop: 8 }}><Text style={{ color: '#fff', fontWeight: '900' }}>Ver todo el catálogo</Text></Pressable>
  </ScrollView>;
}
