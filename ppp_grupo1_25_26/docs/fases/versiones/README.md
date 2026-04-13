# Índice de versiones

Este directorio contiene las versiones por fases de las pantallas `index`, `new` y `stats`.

Los archivos están ordenados para representar una evolución progresiva desde un primer esqueleto hasta el diseño visual unificado actual.

## Fases

### Fases 1-4: Desarrollo Funcional
Estructuras iniciales, interacción, persistencia y refinamiento funcional sin unificación visual.

### Fase 5: Unificación Visual Centralizada (NUEVA)
**Objetivo**: Eliminar diferencias visuales entre las tres pantallas mediante un sistema centralizado de tokens de diseño.

**Tokens implementados**:
- **Colors**: backgrounds, surfaces, text levels, borders, accents, error states
- **Typography**: escala completa (xs → 2xl) con weights y line-heights
- **Spacing**: escala unitaria basada en 4px
- **Borders**: radius (0-999) y widths (1-2) estandarizados
- **Shadows**: elevation levels (sm, md, lg)

**Cambios visuales clave**:
- Todos los colores hardcodeados → `Colors.light.*` tokens
- Headers unificados: `#2563EB` (accent) en todas las pantallas
- Paletas aisladas eliminadas:
  - `colorPorIndice()` → `Colors.light.cardPalette` (index)
  - Yellow header `#F59E0B` → `Colors.light.accent` (stats)
  - Green header `#2FC28B` → `Colors.light.accent` (new)
- Typography normalizada con escala unificada
- Espaciado y borders consistentes usando tokens

**Resultado**: UI coherente, mantenible, escalable sin rediseño de marca

## Pantalla `index`

- [index-fase-1.tsx](index-fase-1.tsx) - estructura visual inicial.
- [index-fase-2.tsx](index-fase-2.tsx) - búsqueda y filtros locales.
- [index-fase-3.tsx](index-fase-3.tsx) - carga real y navegación.
- [index-fase-4.tsx](index-fase-4.tsx) - estados finales y FAB.
- [index-fase-5.tsx](index-fase-5.tsx) - **unificación visual mediante tokens centralizados**.

## Pantalla `new`

- [new-fase-1.tsx](new-fase-1.tsx) - estructura visual inicial.
- [new-fase-2.tsx](new-fase-2.tsx) - estado local, imagen y selección de colección.
- [new-fase-3.tsx](new-fase-3.tsx) - persistencia, lectura y edición.
- [new-fase-4.tsx](new-fase-4.tsx) - validaciones, borrado y cierre funcional.
- [new-fase-5.tsx](new-fase-5.tsx) - **unificación visual mediante tokens centralizados**.

## Pantalla `stats`

- [stats-fase-1.tsx](stats-fase-1.tsx) - maqueta del dashboard.
- [stats-fase-2.tsx](stats-fase-2.tsx) - consultas y métricas base.
- [stats-fase-3.tsx](stats-fase-3.tsx) - visualización con gráficos.
- [stats-fase-4.tsx](stats-fase-4.tsx) - recarga, resumen y pulido final.
- [stats-fase-5.tsx](stats-fase-5.tsx) - **unificación visual mediante tokens centralizados**.

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