import React from 'react';
import { ScrollView, View } from 'react-native';
import { Empty } from '../components/Ui';
import ProductCard from '../components/ProductCard';
export default function FavoritesScreen({ session, favorites, products, onOpen, onAdd, onFavorite }) {
  const items = products.filter(p => favorites.includes(String(p.id)));
  return <ScrollView contentContainerStyle={{ padding: 18 }}>
    {!session ? <Empty text="Inicia sesión para consultar tus favoritos." /> : !items.length ? <Empty text="Todavía no guardas productos." /> :
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>{items.map(item => <ProductCard key={item.id} item={item} onOpen={() => onOpen(item)} onAdd={() => onAdd(item)} onFavorite={() => onFavorite(item.id)} />)}</View>}
  </ScrollView>;
}
