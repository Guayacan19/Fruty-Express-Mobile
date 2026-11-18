import { supabase } from '../lib/supabase';

export async function getCustomerProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from('perfiles').select('*').eq('id', userId).maybeSingle();
  if (error) { console.warn('Perfil:', error.message); return null; }
  return data;
}
export async function getCustomerOrders(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('pedidos').select('*').eq('usuario_id', userId).order('created_at', { ascending:false });
  if (error) { console.warn('Pedidos:', error.message); return []; }
  return data || [];
}
export async function getCustomerFavorites(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('favoritos').select('producto_id').eq('usuario_id', userId);
  if (error) { console.warn('Favoritos:', error.message); return []; }
  return (data || []).map(row => String(row.producto_id));
}
export async function toggleCustomerFavorite(userId, productId, isFavorite) {
  if (!supabase || !userId) throw new Error('Inicia sesión para guardar favoritos.');
  if (isFavorite) {
    const { error } = await supabase.from('favoritos').delete().eq('usuario_id', userId).eq('producto_id', String(productId));
    if (error) throw error;
    return false;
  }
  const { error } = await supabase.from('favoritos').upsert(
    { usuario_id:userId, producto_id:String(productId) },
    { onConflict:'usuario_id,producto_id', ignoreDuplicates:true }
  );
  if (error) throw error;
  return true;
}
