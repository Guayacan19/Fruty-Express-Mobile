
import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';

import { C } from '../theme/colors';
import { inputStyle, Empty } from '../components/Ui';
import ProductCard from '../components/ProductCard';
import AnimatedLoader from '../components/AnimatedLoader';

export default function ProductsScreen({
  products,
  loading,
  search,
  setSearch,
  category,
  setCategory,
  onOpen,
  onAdd,
  onFavorite,
}) {
  const categories = [
    'Todos',
    'fruta',
    'verdura',
    'hortaliza',
    'importado',
  ];

  const filtered = products.filter(
    p =>
      (category === 'Todos' || p.categoria === category) &&
      p.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: '900',
          color: C.ink,
          marginBottom: 12,
        }}
      >
        Nuestros productos
      </Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar frutas, verduras..."
        placeholderTextColor={C.muted}
        style={inputStyle}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          height: 76,
          flexGrow: 0,
          marginTop: 10,
          marginBottom: 14,
        }}
        contentContainerStyle={{
          alignItems: 'center',
          gap: 10,
          paddingVertical: 12,
          paddingHorizontal: 2,
        }}
      >
        {categories.map(c => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={{
              minHeight: 46,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 24,
              backgroundColor:
                category === c ? C.green : C.greenSoft,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                includeFontPadding: true,
                textAlignVertical: 'center',
                color: category === c ? '#FFFFFF' : C.greenDark,
                fontWeight: '800',
                textTransform: 'capitalize',
              }}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <AnimatedLoader label="Actualizando catálogo..." />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {filtered.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onOpen={() => onOpen(item)}
                onAdd={() => onAdd(item)}
                onFavorite={() => onFavorite(item.id)}
              />
            ))}
          </View>

          {!filtered.length && (
            <Empty text="No encontramos productos con esa búsqueda." />
          )}
        </ScrollView>
      )}
    </View>
  );
}
