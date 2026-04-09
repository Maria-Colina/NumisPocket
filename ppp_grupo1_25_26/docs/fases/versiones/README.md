# Índice de versiones

Este directorio contiene las versiones por fases de las pantallas `index`, `new` y `stats`.

Los archivos están ordenados para representar una evolución progresiva desde un primer esqueleto hasta el comportamiento final actual.

## Pantalla `index`

- [index-fase-1.tsx](index-fase-1.tsx) - estructura visual inicial.
- [index-fase-2.tsx](index-fase-2.tsx) - búsqueda y filtros locales.
- [index-fase-3.tsx](index-fase-3.tsx) - carga real y navegación.
- [index-fase-4.tsx](index-fase-4.tsx) - estados finales y FAB.

## Pantalla `new`

- [new-fase-1.tsx](new-fase-1.tsx) - estructura visual inicial.
- [new-fase-2.tsx](new-fase-2.tsx) - estado local, imagen y selección de colección.
- [new-fase-3.tsx](new-fase-3.tsx) - persistencia, lectura y edición.
- [new-fase-4.tsx](new-fase-4.tsx) - validaciones, borrado y cierre funcional.

## Pantalla `stats`

- [stats-fase-1.tsx](stats-fase-1.tsx) - maqueta del dashboard.
- [stats-fase-2.tsx](stats-fase-2.tsx) - consultas y métricas base.
- [stats-fase-3.tsx](stats-fase-3.tsx) - visualización con gráficos.
- [stats-fase-4.tsx](stats-fase-4.tsx) - recarga, resumen y pulido final.

## Referencia

Los archivos originales de la app siguen siendo:

- [src/app/(tabs)/new.tsx](../../../src/app/(tabs)/new.tsx)
- [src/app/(tabs)/index.tsx](../../../src/app/(tabs)/index.tsx)
- [src/app/(tabs)/stats.tsx](../../../src/app/(tabs)/stats.tsx)

## Uso recomendado

1. Empieza por la fase 1 para entender la estructura mínima.
2. Continúa con la fase 2 para ver cómo entra la interacción.
3. Revisa la fase 3 para el salto a persistencia y consultas reales.
4. Usa la fase 4 como equivalente funcional al archivo original.