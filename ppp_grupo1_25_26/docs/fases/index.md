# Pantalla `index`

Este documento describe cómo construir la pantalla principal de listado desde cero en 4 fases hasta llegar al estado actual de la app.

## Objetivo final

La pantalla debe mostrar el listado general de piezas, permitir búsqueda y filtros visuales, indicar si cada pieza tiene foto y ofrecer navegación a alta y edición desde cada tarjeta o desde el botón flotante.

## Fases

### Fase 1. Estructura del listado

Objetivo: levantar la composición base de la pantalla principal.

Incluye:

- Cabecera con identidad de la colección.
- Campo de búsqueda visual.
- Chips de filtro estáticos.
- Lista de tarjetas con contenido de prueba.
- Botón flotante de alta.

Salida esperada:

- La pantalla ya se percibe como un listado principal.
- Se reconoce dónde irá cada zona funcional.

### Fase 2. Interacción local

Objetivo: hacer que la vista responda a cambios sin usar aún la base de datos.

Incluye:

- Estado local para la búsqueda.
- Filtros por tipo y por presencia de foto.
- Lista generada a partir de datos en memoria.
- Selección visual de chip activo.

Salida esperada:

- El usuario puede explorar el comportamiento de búsqueda y filtros antes de conectar SQLite.

### Fase 3. Datos reales y navegación

Objetivo: conectar el listado con la base de datos y con las rutas de alta y edición.

Incluye:

- Carga de piezas desde `piezas`.
- Consulta de fotos en `fotos_pieza` para marcar la existencia de imagen.
- Construcción del detalle resumido de cada tarjeta.
- Navegación a `new` para editar una pieza existente.
- Navegación a `new` para crear una nueva pieza.

Salida esperada:

- La pantalla ya funciona como un listado real y enlaza con el formulario.

### Fase 4. Estado final

Objetivo: cerrar el comportamiento completo que existe hoy.

Incluye:

- Recarga automática al recuperar el foco.
- Estados de carga y vacío.
- Tarjetas con color alternado y botón `Ver`.
- FAB fijo para crear una nueva pieza.

Salida esperada:

- Se reproduce el comportamiento actual de [src/app/(tabs)/index.tsx](../../src/app/(tabs)/index.tsx).

## Archivos de versión

- [index-fase-1.tsx](versiones/index-fase-1.tsx)
- [index-fase-2.tsx](versiones/index-fase-2.tsx)
- [index-fase-3.tsx](versiones/index-fase-3.tsx)
- [index-fase-4.tsx](versiones/index-fase-4.tsx)

## Criterio de sustitución

Cada fase debe poder sustituir al archivo original sin cambiar la ruta de entrada de Expo Router. La versión final de esta secuencia debe coincidir funcionalmente con la pantalla real.