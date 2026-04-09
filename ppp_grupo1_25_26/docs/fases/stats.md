# Pantalla `stats`

Este documento describe cómo construir la pantalla de estadísticas desde cero en 4 fases hasta llegar al estado actual de la app.

## Objetivo final

La pantalla debe resumir el estado de la colección con métricas, gráficos y un texto de interpretación que se actualice al volver a la vista.

## Fases

### Fase 1. Estructura del panel

Objetivo: levantar la maqueta visual.

Incluye:

- Cabecera con identidad de la pantalla.
- Tarjetas KPI para totales básicos.
- Contenedores reservados para gráficos y resumen.

Salida esperada:

- La pantalla ya parece un dashboard.
- Se ve dónde vivirán los datos, aunque todavía no los consuma.

### Fase 2. Datos reales y métricas base

Objetivo: conectar las consultas principales a SQLite.

Incluye:

- Total de piezas.
- Total con foto.
- Países distintos.
- Colecciones totales.
- Agrupaciones simples por tipo y por colección o continente.

Salida esperada:

- La pantalla muestra datos reales sin depender todavía de gráficos complejos.

### Fase 3. Visualización de datos

Objetivo: representar los agregados con gráficos.

Incluye:

- Gráfico de barras para la distribución principal.
- Gráfico circular para la distribución por tipo.
- Helpers de cálculo y leyendas.

Salida esperada:

- El resumen deja de ser solo numérico y pasa a ser visual.

### Fase 4. Estado final

Objetivo: cerrar el comportamiento completo que existe hoy.

Incluye:

- Recarga al ganar foco.
- Texto resumen generado a partir de los datos.
- Estados vacíos claros cuando no hay piezas.
- Pulido visual final de tarjetas, colores y composición.

Salida esperada:

- Se reproduce el comportamiento actual de [src/app/(tabs)/stats.tsx](../../src/app/(tabs)/stats.tsx).

## Archivos de versión

- [stats-fase-1.tsx](versiones/stats-fase-1.tsx)
- [stats-fase-2.tsx](versiones/stats-fase-2.tsx)
- [stats-fase-3.tsx](versiones/stats-fase-3.tsx)
- [stats-fase-4.tsx](versiones/stats-fase-4.tsx)

## Criterio de sustitución

Cada fase debe poder sustituir al archivo original sin cambiar la ruta de entrada de Expo Router. La versión final de esta secuencia debe coincidir funcionalmente con la pantalla real.