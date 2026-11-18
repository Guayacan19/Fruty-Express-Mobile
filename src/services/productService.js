import { supabase } from '../lib/supabase';
import catalogoDemo from '../lib/catalogo-demo.json';

const normalizeProduct = (p) => ({
  ...p,
  modalidades_venta: p.modalidades_venta || p.modalidadesVenta || ['Unidad'],
  imagen: p.imagen || null,
});
export async function getProducts() {
  if (!supabase) return catalogoDemo.map(normalizeProduct);
  const { data, error } = await supabase.from('productos').select('*').order('nombre');
  if (error) {
    console.warn('No fue posible cargar productos desde Supabase:', error.message);
    return catalogoDemo.map(normalizeProduct);
  }
  return (data || []).map(normalizeProduct);
}
