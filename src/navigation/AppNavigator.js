
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';

import {
  View,
  Text,
  Pressable,
  Linking,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ExpoLinking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { C } from '../theme/colors';

import AppHeader from '../components/AppHeader';
import DrawerMenu from '../components/DrawerMenu';

import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AuthScreen from '../screens/AuthScreen';
import OrdersScreen from '../screens/OrdersScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AccountScreen from '../screens/AccountScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import {
  AboutScreen,
  ContactScreen,
} from '../screens/InfoScreen';

export default function AppNavigator() {
  const {
    session,
    profile,
    setProfile,
    products,
    productsLoading,
    refreshProducts,
    cart,
    addToCart,
    changeCart,
    setCart,
    favorites,
    toggleFavorite,
    orders,
    loadCustomerData,
    signOut,
    notice,
    setNotice,
  } = useApp();

  const [page, setPage] = useState('Inicio');
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [zona, setZona] = useState('');
  const [barrio, setBarrio] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [detailMode, setDetailMode] = useState('Unidad');
  const [detailQuality, setDetailQuality] = useState('');
  const [detailQty, setDetailQty] = useState('1');

  const [busy, setBusy] = useState(false);

  // Evita procesar dos veces el mismo código OAuth.
  const handledAuthCode = useRef(null);

  useEffect(() => {
    setZona(profile?.zona || '');
    setBarrio(profile?.barrio || '');
    setDireccion(profile?.direccion || '');
  }, [profile]);

  const go = useCallback((destination) => {
    setPage(destination);
    setDrawer(false);

    if (destination !== 'Detalle') {
      setSelected(null);
    }
  }, []);

  const openProduct = useCallback((product, quickAdd = false) => {
    if (quickAdd) {
      addToCart(product);
      return;
    }

    setSelected(product);
    setDetailMode(product.modalidades_venta?.[0] || 'Unidad');
    setDetailQuality(product.calidades?.[0] || '');
    setDetailQty('1');
    setPage('Detalle');
    setDrawer(false);
  }, [addToCart]);

  const discoverRandom = useCallback(() => {
    if (!products.length) {
      refreshProducts();
      return;
    }

    const product = products[
      Math.floor(Math.random() * products.length)
    ];

    openProduct(product);
  }, [products, refreshProducts, openProduct]);

  // Procesar el enlace de regreso de Google.
  const processAuthUrl = useCallback(async (url) => {
    if (!url || !supabase) return;

    try {
      const parsed = ExpoLinking.parse(url);
      const params = parsed.queryParams || {};

      const code = params.code;

      if (params.error_description) {
        Alert.alert(
          'Google',
          String(params.error_description)
        );
        return;
      }

      if (code && handledAuthCode.current !== code) {
        handledAuthCode.current = code;

        const { error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          handledAuthCode.current = null;
          Alert.alert('Autenticación', error.message);
          return;
        }

        go('Inicio');
      }
    } catch (error) {
      Alert.alert(
        'Error de autenticación',
        error.message || 'No se pudo procesar el inicio de sesión.'
      );
    }
  }, [go]);

  // Escuchar enlaces cuando la aplicación está abierta
  // o cuando se abre desde un enlace externo.
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        processAuthUrl(url);
      }
    }).catch((error) => {
      console.log('Error leyendo enlace inicial:', error);
    });

    const subscription = Linking.addEventListener(
      'url',
      ({ url }) => {
        processAuthUrl(url);
      }
    );

    return () => subscription.remove();
  }, [processAuthUrl]);

  // Inicio de sesión con Google.
  const googleLogin = async () => {
    if (!supabase) {
      Alert.alert(
        'Configura Supabase',
        'Revisa las credenciales del archivo .env.'
      );
      return;
    }

    if (busy) return;

    try {
      setBusy(true);

      // En Expo Go genera el enlace de retorno del entorno
      // de desarrollo. En una aplicación instalada utiliza
      // el esquema definido en app.json.
      const redirectTo = ExpoLinking.createURL(
        'auth/callback'
      );

      console.log('REDIRECT GOOGLE:', redirectTo);

      const { data, error } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            skipBrowserRedirect: true,
          },
        });

      if (error) {
        Alert.alert('Google', error.message);
        return;
      }

      if (!data?.url) {
        Alert.alert(
          'Google',
          'No se recibió la dirección de autenticación.'
        );
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type === 'success' && result.url) {
        await processAuthUrl(result.url);
      } else if (result.type === 'cancel') {
        console.log('Inicio de sesión cancelado.');
      } else if (result.type === 'dismiss') {
        console.log('Ventana de autenticación cerrada.');
      }
    } catch (error) {
      Alert.alert(
        'Error con Google',
        error.message || 'No se pudo iniciar la autenticación.'
      );
    } finally {
      setBusy(false);
    }
  };

  // Recuperar contraseña.
  const recoverPassword = async () => {
    if (!supabase || !email.trim()) {
      Alert.alert(
        'Correo requerido',
        'Escribe primero tu correo electrónico.'
      );
      return;
    }

    try {
      const redirectTo = ExpoLinking.createURL(
        'auth/callback'
      );

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo }
        );

      Alert.alert(
        error ? 'No se pudo enviar' : 'Revisa tu correo',
        error?.message ||
          'Te enviamos el enlace para restablecer tu contraseña.'
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Iniciar sesión con correo y contraseña.
  const doLogin = async () => {
    if (!supabase) {
      Alert.alert(
        'Falta configurar Supabase',
        'Completa el archivo .env con la URL y la clave pública.'
      );
      return;
    }

    if (busy) return;

    setBusy(true);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        Alert.alert(
          'No se pudo iniciar sesión',
          error.message
        );
      } else {
        go('Inicio');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setBusy(false);
    }
  };

  // Registrar usuario.
  const doRegister = async () => {
    if (!supabase) {
      Alert.alert(
        'Configura Supabase',
        'Completa el archivo .env antes de registrar usuarios.'
      );
      return;
    }

    if (
      !name.trim() ||
      !/^\d{10}$/.test(phone) ||
      !email.trim() ||
      password.length < 6
    ) {
      Alert.alert(
        'Revisa los datos',
        'Completa nombre, teléfono de 10 dígitos, correo y contraseña de al menos 6 caracteres.'
      );
      return;
    }

    if (busy) return;

    setBusy(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nombre: name.trim(),
            telefono: phone,
          },
        },
      });

      if (error) {
        Alert.alert('No se pudo registrar', error.message);
      } else {
        Alert.alert(
          'Registro enviado',
          'Si tu proyecto exige confirmar el correo, revisa tu bandeja de entrada.'
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setBusy(false);
    }
  };

  // Guardar datos del perfil.
  const saveProfile = async () => {
    if (!session) {
      go('Iniciar sesión');
      return;
    }

    if (!supabase || busy) return;

    setBusy(true);

    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ zona, barrio, direccion })
        .eq('id', session.user.id);

      if (error) {
        Alert.alert('No se pudo guardar', error.message);
      } else {
        setProfile({
          ...profile,
          zona,
          barrio,
          direccion,
        });

        Alert.alert(
          'Datos actualizados',
          'Tu dirección quedó guardada.'
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setBusy(false);
    }
  };

  // Guardar pedido y abrir WhatsApp.
  const sendOrder = async () => {
    if (!session) {
      Alert.alert(
        'Inicia sesión',
        'Debes ingresar a tu cuenta para enviar una solicitud.'
      );
      go('Iniciar sesión');
      return;
    }

    if (!supabase) {
      Alert.alert(
        'Sin conexión',
        'Configura Supabase para guardar tu solicitud.'
      );
      return;
    }

    if (busy) return;

    if (
      !cart.length ||
      !zona ||
      !barrio.trim() ||
      !direccion.trim()
    ) {
      Alert.alert(
        'Faltan datos',
        'Completa zona, barrio, dirección y agrega productos al carrito.'
      );
      return;
    }

    setBusy(true);

    try {
      const productsOrder = cart.map((p) => ({
        producto_id: p.id,
        nombre: p.nombre,
        imagen: p.imagen || '',
        calidad: p.calidad || null,
        modalidad: p.modalidad,
        cantidad: p.cantidad,
        cantidad_formateada: `${p.cantidad} ${p.modalidad}`,
      }));

      const { error: profileError } = await supabase
        .from('perfiles')
        .update({
          nombre:
            profile?.nombre ||
            session.user.user_metadata?.nombre ||
            '',
          telefono: profile?.telefono || '',
          zona,
          barrio,
          direccion,
        })
        .eq('id', session.user.id);

      if (profileError) {
        Alert.alert(
          'Error al actualizar perfil',
          profileError.message
        );
        return;
      }

      const { error: orderError } = await supabase
        .from('pedidos')
        .insert({
          usuario_id: session.user.id,
          nombre_cliente:
            profile?.nombre ||
            session.user.user_metadata?.nombre ||
            session.user.email,
          telefono: profile?.telefono || '',
          zona,
          barrio,
          direccion,
          observaciones,
          productos: productsOrder,
          estado: 'recibido',
        });

      if (orderError) {
        Alert.alert(
          'No se guardó el pedido',
          orderError.message
        );
        return;
      }

      const lines = cart
        .map(
          (p, i) =>
            `${i + 1}. ${p.nombre}\nCalidad: ${
              p.calidad || 'No aplica'
            }\nCantidad: ${p.cantidad} ${p.modalidad}`
        )
        .join('\n\n');

      const message =
        `¡Hola! Quiero solicitar una cotización en Fruty Kennedy.\n\n` +
        `Nombre: ${profile?.nombre || session.user.email}\n` +
        `Teléfono: ${profile?.telefono || ''}\n` +
        `Zona: ${zona}\n` +
        `Barrio: ${barrio}\n` +
        `Dirección: ${direccion}\n\n` +
        `PRODUCTOS\n${lines}\n\n` +
        `Precios: pendientes de cotización.\n` +
        `Observaciones: ${observaciones || 'Sin observaciones'}`;

      setCart([]);
      await loadCustomerData(session.user.id);
      go('Mis pedidos');

      Linking.openURL(
        `https://wa.me/573209163503?text=${encodeURIComponent(message)}`
      ).catch(() => {
        Alert.alert(
          'Pedido guardado',
          'No se pudo abrir WhatsApp, pero tu solicitud quedó registrada.'
        );
      });
    } catch (error) {
      Alert.alert('Error al enviar el pedido', error.message);
    } finally {
      setBusy(false);
    }
  };

  // Seleccionar pantalla.
  const screen = () => {
    if (page === 'Inicio') {
      return (
        <HomeScreen
          products={products}
          productsLoading={productsLoading}
          onOpen={(p) => openProduct(p)}
          onBrowse={() => go('Productos')}
          onShakeProduct={discoverRandom}
          onFavorite={toggleFavorite}
        />
      );
    }

    if (page === 'Productos') {
      return (
        <ProductsScreen
          products={products}
          loading={productsLoading}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          onOpen={(p) => openProduct(p)}
          onAdd={(p) => addToCart(p)}
          onFavorite={toggleFavorite}
        />
      );
    }

    if (page === 'Detalle' && selected) {
      return (
        <ProductDetailScreen
          product={selected}
          mode={detailMode}
          setMode={setDetailMode}
          quality={detailQuality}
          setQuality={setDetailQuality}
          quantity={detailQty}
          setQuantity={setDetailQty}
          onBack={() => go('Productos')}
          onAdd={() => {
            addToCart(selected, {
              modalidad: detailMode,
              calidad: detailQuality,
              cantidad: Math.max(1, Number(detailQty) || 1),
            });
            go('Carrito');
          }}
          onFavorite={() => toggleFavorite(selected.id)}
        />
      );
    }

    if (page === 'Carrito') {
      return (
        <CartScreen
          cart={cart}
          onChange={changeCart}
          onCheckout={() =>
            go(session ? 'Finalizar pedido' : 'Iniciar sesión')
          }
        />
      );
    }

    if (page === 'Finalizar pedido') {
      return (
        <CheckoutScreen
          zona={zona}
          setZona={setZona}
          barrio={barrio}
          setBarrio={setBarrio}
          direccion={direccion}
          setDireccion={setDireccion}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          busy={busy}
          onSubmit={sendOrder}
        />
      );
    }

    if (page === 'Iniciar sesión' || page === 'Registro') {
      return (
        <AuthScreen
          page={page}
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          busy={busy}
          onSubmit={
            page === 'Iniciar sesión' ? doLogin : doRegister
          }
          onGoogle={googleLogin}
          onRecover={recoverPassword}
          onSwitch={() =>
            go(
              page === 'Iniciar sesión'
                ? 'Registro'
                : 'Iniciar sesión'
            )
          }
        />
      );
    }

    if (page === 'Mis pedidos') {
      return <OrdersScreen orders={orders} />;
    }

    if (page === 'Notificaciones') {
      return <NotificationsScreen />;
    }

    if (page === 'Favoritos') {
      return (
        <FavoritesScreen
          session={session}
          favorites={favorites}
          products={products}
          onOpen={(p) => openProduct(p)}
          onAdd={(p) => addToCart(p)}
          onFavorite={toggleFavorite}
        />
      );
    }

    if (page === 'Mi cuenta') {
      return (
        <AccountScreen
          session={session}
          zona={zona}
          setZona={setZona}
          barrio={barrio}
          setBarrio={setBarrio}
          direccion={direccion}
          setDireccion={setDireccion}
          onSave={saveProfile}
          onSignIn={() => go('Iniciar sesión')}
          onSignOut={signOut}
        />
      );
    }

    if (page === 'Nosotros') {
      return <AboutScreen />;
    }

    if (page === 'Contacto') {
      return <ContactScreen />;
    }

    return (
      <View style={{ padding: 18 }}>
        <Text style={{ color: C.ink, fontWeight: '800' }}>
          Fruty Express
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: C.bg }}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar style="dark" />

      <AppHeader
        cartCount={cart.length}
        onHome={() => go('Inicio')}
        onCart={() => go('Carrito')}
        onMenu={() => setDrawer(true)}
      />

      {!!notice && (
        <Pressable
          onPress={() => setNotice('')}
          style={{ backgroundColor: C.pale, padding: 9 }}
        >
          <Text style={{ color: C.ink, textAlign: 'center' }}>
            {notice} ×
          </Text>
        </Pressable>
      )}

      <View style={{ flex: 1 }}>
        {screen()}
      </View>

      <DrawerMenu
        visible={drawer}
        page={page}
        session={session}
        onNavigate={go}
        onClose={() => setDrawer(false)}
      />
    </SafeAreaView>
  );
}
