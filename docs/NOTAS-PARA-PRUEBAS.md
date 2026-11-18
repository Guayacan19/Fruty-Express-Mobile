# Lista de pruebas antes de entregar

## Configuración
- [ ] Completar `.env` con la URL y la clave pública de Supabase.
- [ ] Ejecutar `npm install` y `npx expo start -c`.
- [ ] Confirmar RLS en las tablas de clientes y pedidos.
- [ ] Verificar las políticas y columnas reales de `favoritos` y `notificaciones`.

## Tienda
- [ ] El catálogo muestra los productos publicados en la web.
- [ ] Los cambios de precio, imagen y disponibilidad se reflejan en la app.
- [ ] Búsqueda, filtros y detalle funcionan.
- [ ] La imagen del detalle permite arrastrar, ampliar y rotar con gestos.
- [ ] El carrito conserva los productos al cerrar y abrir la app.
- [ ] Registro, inicio de sesión, Google y recuperación funcionan con la configuración de Supabase.
- [ ] Favoritos se guardan por usuario.
- [ ] La dirección del perfil se guarda.
- [ ] El comprador crea una solicitud y esta aparece en el panel web.
- [ ] WhatsApp abre con el resumen correcto.
- [ ] Los cambios de estado aparecen en el historial y notificaciones.

## Reanimated integrado
- [ ] Loader animado durante la carga del catálogo.
- [ ] Botón de agregar al carrito hace el rebote.
- [ ] Carrusel de Inicio se desplaza con escala y rotación.
- [ ] Agitar el teléfono abre un producto aleatorio.
- [ ] El menú lateral entra con animación.

## Antes de publicar
- [ ] Probar en Android físico.
- [ ] Probar en una cuenta cliente real con RLS activado.
- [ ] Generar y probar un APK/AAB de distribución.
