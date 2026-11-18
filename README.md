# Fruty Express Mobile

Aplicación para compradores desarrollada con React Native y Expo. La administración de productos y pedidos permanece en la versión web. La app móvil consulta el mismo proyecto Supabase.

## Funcionalidades

- Inicio y carrusel de productos.
- Catálogo, búsqueda, categorías y detalle de producto.
- Carrito persistente con AsyncStorage.
- Registro e inicio de sesión por correo y contraseña.
- Acceso con Google y recuperación de contraseña (requiere configurar los Redirect URLs de Supabase).
- Favoritos vinculados a la cuenta.
- Perfil y dirección de entrega.
- Solicitudes guardadas en `public.pedidos` y envío del resumen a WhatsApp.
- Historial de pedidos y notificaciones.
- Secciones Nosotros y Contacto.

## Reanimated integrado en la tienda

Los conceptos de la actividad se aplican a pantallas reales, no a un laboratorio separado:

1. **Drag & Drop with Rotation:** el usuario puede arrastrar y rotar la imagen de un producto en su detalle.
2. **Loading Animation:** indicador circular animado durante la carga del catálogo.
3. **Multitouch Gestures:** pellizcar para ampliar y usar dos dedos para desplazar y rotar la imagen de producto.
4. **Bounce Animation:** rebote al pulsar el botón para agregar un producto al carrito.
5. **Animated Carousel:** carrusel de productos en Inicio con escala y rotación según el desplazamiento.
6. **Accelerometer Shake:** agitar el celular en Inicio para abrir un producto aleatorio.
7. **Drawer Navigation:** menú lateral de navegación con entrada animada.

## Estructura del proyecto

```text
fruty-express-mobile/
├── App.js
├── app.json
├── babel.config.js
├── assets/
├── docs/
├── src/
│   ├── components/
│   │   ├── AnimatedLoader.js
│   │   ├── AnimatedProductImage.js
│   │   ├── AppHeader.js
│   │   ├── DrawerMenu.js
│   │   ├── ProductCard.js
│   │   └── Ui.js
│   ├── context/
│   │   └── AppContext.js
│   ├── lib/
│   │   ├── catalogo-demo.json
│   │   └── supabase.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── AccountScreen.js
│   │   ├── AuthScreen.js
│   │   ├── CartScreen.js
│   │   ├── CheckoutScreen.js
│   │   ├── FavoritesScreen.js
│   │   ├── HomeScreen.js
│   │   ├── InfoScreen.js
│   │   ├── NotificationsScreen.js
│   │   ├── OrdersScreen.js
│   │   ├── ProductDetailScreen.js
│   │   └── ProductsScreen.js
│   ├── services/
│   │   ├── customerService.js
│   │   └── productService.js
│   └── theme/
│       └── colors.js
├── package.json
└── supabase-mobile-migration.sql
```

## Configuración

1. Abre la carpeta `fruty-express-mobile` en Visual Studio Code.
2. Copia `.env.example` y renombra la copia como `.env`.
3. Completa las variables con la URL y la clave pública de Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA_ANON_O_PUBLISHABLE
```

4. En la terminal de VS Code ejecuta:

```bash
npm install
npx expo start -c
```

5. Escanea el QR desde Expo Go compatible con SDK 54. Para publicar la app a clientes se debe generar posteriormente un APK/AAB con EAS Build.

## Supabase y seguridad

La aplicación usa las tablas compartidas `perfiles`, `productos` y `pedidos`, además de `favoritos` y `notificaciones` si están configuradas en el proyecto. Los pedidos conservan el flujo de solicitud/cotización: no se procesa un pago en línea.

El ZIP no contiene claves privadas. Configura únicamente la clave pública anon/publishable en `.env`; nunca incluyas `service_role` en una app móvil.

El archivo `supabase-mobile-migration.sql` es opcional. Antes de ejecutarlo, comprueba en Supabase si `favoritos` y `notificaciones` ya existen y revisa sus columnas y políticas. No ejecutes una migración a ciegas sobre la base de datos real.

Si Supabase no está configurado o la consulta del catálogo falla, la app usa `src/lib/catalogo-demo.json` para mostrar datos de demostración. La autenticación, favoritos, notificaciones y pedidos necesitan conexión real.

## Notas

- El panel administrativo no está incluido en la app móvil.
- El carrito se guarda localmente en el dispositivo.
- Los pedidos se guardan en Supabase y luego se abre WhatsApp al número de atención usado por el sitio: +57 320 916 3503.
- Google OAuth necesita que el proveedor esté habilitado y que `frutyexpress://auth/callback` esté permitido en Supabase.
- El acelerómetro debe probarse en un teléfono físico; algunos emuladores no tienen sensor.
- Se debe probar la app con las políticas RLS reales antes de usarla con clientes.
