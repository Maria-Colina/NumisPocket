# Guía breve de versiones

Esta guía explica cómo leer y usar las versiones por fases de las pantallas `index`, `new` y `stats`.

## Qué contiene cada fase

- Fase 1: estructura visual y composición básica.
- Fase 2: interacción local y estado de la pantalla.
- Fase 3: conexión con la base de datos y flujo funcional intermedio.
- Fase 4: comportamiento final equivalente al archivo original.

## Cómo navegar

1. Abre primero el índice de [versiones/README.md](versiones/README.md).
2. Consulta [index.md](index.md), [new.md](new.md) o [stats.md](stats.md) para ver la explicación fase a fase.
3. Abre el archivo TSX de la fase que quieras revisar dentro de [versiones](versiones).

## Qué comparar

- La fase 1 sirve para revisar la base visual.
- La fase 2 muestra cuándo aparecen el estado y las primeras acciones.
- La fase 3 marca el punto en el que la pantalla empieza a depender de SQLite.
- La fase 4 debe comportarse como el archivo de producción.

## Regla práctica

Si vas a sustituir el archivo original por una versión intermedia, hazlo siempre en orden de fase y vuelve al original solo cuando quieras comprobar el estado final.