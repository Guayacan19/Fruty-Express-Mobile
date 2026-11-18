import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { C } from '../theme/colors';
import { Heading, Empty, rowCard } from '../components/Ui';
export default function NotificationsScreen() {
  const [items, setItems] = useState([]), [loading, setLoading] = useState(true);
  const { session } = useApp();
  useEffect(() => {
    let channel, active = true;
    if (!session || !supabase) { setLoading(false); return; }
    const load = async () => {
      const { data, error } = await supabase.from('notificaciones').select('*').eq('usuario_id', session.user.id).order('created_at', { ascending: false });
      if (active && !error) setItems(data || []);
      if (active) setLoading(false);
    };
    load();
    channel = supabase.channel('mobile-notifs-' + session.user.id).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notificaciones', filter: `usuario_id=eq.${session.user.id}` }, payload => setItems(old => [payload.new, ...old])).subscribe();
    return () => { active = false; if (channel) supabase.removeChannel(channel); };
  }, [session?.user?.id]);
  const mark = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
    if (!error) setItems(old => old.map(n => n.id === id ? { ...n, leida: true } : n));
  };
  return <ScrollView contentContainerStyle={{ padding: 18 }}>
    <Heading title="Notificaciones" text="Actualizaciones sobre el estado de tus pedidos." />
    {loading ? <Text style={{ color: C.muted }}>Cargando notificaciones...</Text> : !items.length ? <Empty text="No tienes notificaciones por ahora." /> :
      items.map(item => <Pressable key={item.id} onPress={() => mark(item.id)} style={[rowCard, { alignItems: 'flex-start' }]}>
        <View style={{ flex: 1 }}><Text style={{ fontWeight: item.leida ? '600' : '900', color: C.ink }}>{item.mensaje || 'Actualización de tu pedido'}</Text>
          <Text style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{new Date(item.created_at).toLocaleString('es-CO')}</Text>
        </View>{!item.leida && <Text style={{ color: C.green, fontWeight: '900' }}>Nueva</Text>}
      </Pressable>)}
  </ScrollView>;
}
