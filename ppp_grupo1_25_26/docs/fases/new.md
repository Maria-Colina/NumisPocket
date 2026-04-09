# Pantalla `new`

Este documento describe cómo construir la pantalla de alta y edición desde cero en 4 fases hasta llegar al estado actual de la app.

## Objetivo final

La pantalla debe permitir crear y editar una pieza numismática, asociarle una foto, relacionarla con una colección, validar los campos críticos y persistir todo en SQLite.

## Fases

### Fase 1. Estructura visual

Objetivo: levantar la composición base sin lógica de datos.

Incluye:

- Cabecera con título y subtítulo.
- Bloque de imagen con placeholder de moneda.
- Campos principales representados como formulario visual.
- Botones de acción preparados, aunque todavía sin guardar real.

Salida esperada:

- La pantalla ya transmite el flujo de alta de una pieza.
- Se reconoce la jerarquía visual del formulario.

### Fase 2. Estado local e interacción básica

Objetivo: convertir el formulario en una pantalla interactiva.

Incluye:

- Estados locales para los campos del formulario.
- Selección de imagen desde galería.
- Modal de colecciones con alta local de una nueva colección.
- Previsualización de la imagen seleccionada.

Salida esperada:

- El usuario puede rellenar campos, elegir imagen y simular selección de colección.
- La pantalla ya responde a entradas reales.

### Fase 3. Persistencia y edición

Objetivo: conectar el formulario con SQLite.

Incluye:

- Lectura de una pieza existente cuando llega `id` por ruta.
- Inserción de una pieza nueva.
- Actualización de una pieza existente.
- Guardado de la foto principal en `fotos_pieza`.
- Carga de colecciones desde la base de datos.

Salida esperada:

- La pantalla deja de ser solo visual y se convierte en CRUD real.
- Ya puede reutilizarse como pantalla de alta y de edición.

### Fase 4. Estado final

Objetivo: cerrar el comportamiento completo que existe hoy.

Incluye:

- Validación de título, año y cantidad.
- Opción de eliminar pieza.
- Modal de colecciones funcional con creación real.
- Ajustes de UX para crear, editar y volver atrás tras guardar.

Salida esperada:

- Se reproduce el comportamiento actual de [src/app/(tabs)/new.tsx](../../src/app/(tabs)/new.tsx).

## Archivos de versión

- [new-fase-1.tsx](versiones/new-fase-1.tsx)
- [new-fase-2.tsx](versiones/new-fase-2.tsx)
- [new-fase-3.tsx](versiones/new-fase-3.tsx)
- [new-fase-4.tsx](versiones/new-fase-4.tsx)

## Criterio de sustitución

Cada fase debe poder sustituir al archivo original sin cambiar la ruta de entrada de Expo Router. La versión final de esta secuencia debe coincidir funcionalmente con la pantalla real.