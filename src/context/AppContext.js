import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { getProducts } from '../services/productService';
import { getCustomerProfile, getCustomerOrders, getCustomerFavorites, toggleCustomerFavorite } from '../services/customerService';

const AppContext = createContext(null);
const CART_KEY = '@fruty-express/cart-v1';

export function AppProvider({ children }) {
  const [session,setSession] = useState(null);
  const [profile,setProfile] = useState(null);
  const [products,setProducts] = useState([]);
  const [productsLoading,setProductsLoading] = useState(true);
  const [cart,setCartState] = useState([]);
  const [favorites,setFavorites] = useState([]);
  const [orders,setOrders] = useState([]);
  const [notice,setNotice] = useState('');

  const setCart = useCallback((next) => {
    setCartState(current => {
      const value = typeof next === 'function' ? next(current) : next;
      AsyncStorage.setItem(CART_KEY, JSON.stringify(value)).catch(()=>{});
      return value;
    });
  },[]);

  const loadCustomerData = useCallback(async (userId) => {
    const id = userId || session?.user?.id;
    if (!id) { setProfile(null); setOrders([]); setFavorites([]); return; }
    const [nextProfile,nextOrders,nextFavorites] = await Promise.all([
      getCustomerProfile(id), getCustomerOrders(id), getCustomerFavorites(id)
    ]);
    setProfile(nextProfile); setOrders(nextOrders); setFavorites(nextFavorites);
  },[session?.user?.id]);

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    const rows = await getProducts();
    setProducts(rows);
    setProductsLoading(false);
  },[]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then(raw => {
      if (raw) setCartState(JSON.parse(raw));
    }).catch(()=>{});
    refreshProducts();
    if (!supabase) return;
    supabase.auth.getSession().then(({data}) => {
      setSession(data?.session || null);
      if (data?.session?.user?.id) loadCustomerData(data.session.user.id);
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_event,nextSession) => {
      setSession(nextSession);
      if (nextSession?.user?.id) {
        setTimeout(() => loadCustomerData(nextSession.user.id),0);
      } else {
        setProfile(null); setOrders([]); setFavorites([]);
      }
    });
    return () => subscription.unsubscribe();
  },[]);

  const addToCart = useCallback((product, options={}) => {
    const modalidad = options.modalidad || product.modalidades_venta?.[0] || product.modalidadesVenta?.[0] || 'Unidad';
    const calidad = options.calidad || product.calidades?.[0] || '';
    const cantidad = Math.max(1, Number(options.cantidad) || 1);
    const cartKey = `${product.id}-${modalidad}-${calidad}`;
    setCart(current => {
      const found = current.find(row => row.cartKey === cartKey);
      if (found) return current.map(row => row.cartKey === cartKey ? {...row,cantidad:row.cantidad+cantidad} : row);
      return [...current,{...product,cartKey,modalidad,calidad,cantidad}];
    });
    setNotice(`${product.nombre} agregado al carrito`);
  },[setCart]);

  const changeCart = useCallback((cartKey,cantidad) => {
    setCart(current => cantidad <= 0 ? current.filter(row=>row.cartKey!==cartKey) :
      current.map(row=>row.cartKey===cartKey?{...row,cantidad}:row));
  },[setCart]);

  const toggleFavorite = useCallback(async (productId) => {
    if (!session?.user?.id) { setNotice('Inicia sesión para guardar favoritos'); return; }
    const id = String(productId);
    const exists = favorites.includes(id);
    try {
      const next = await toggleCustomerFavorite(session.user.id,id,exists);
      setFavorites(current => next ? [...current,id] : current.filter(item=>item!==id));
    } catch(error) { setNotice(error.message || 'No se pudo actualizar favoritos'); }
  },[session?.user?.id,favorites]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
  },[]);

  const value = useMemo(() => ({
    session,profile,setProfile,products,productsLoading,refreshProducts,
    cart,addToCart,changeCart,setCart,favorites,toggleFavorite,orders,
    loadCustomerData,signOut,notice,setNotice
  }),[session,profile,products,productsLoading,refreshProducts,cart,addToCart,changeCart,setCart,favorites,toggleFavorite,orders,loadCustomerData,signOut,notice]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp debe usarse dentro de AppProvider');
  return value;
}
