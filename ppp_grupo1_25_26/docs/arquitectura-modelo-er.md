--- 
titlepage: true 
titlepage-logo: "images/cesar-Manrique.png" 
logo-width: 10cm 

title: "Módulo de Proyecto (PPP)"
subtitle: "Gestor de colecciones numismáticas " 
subsubtitle: "C.F.G.S. Desarrollo de Aplicaciones Multiplataforma (DAM)" 
author: [José Daniel Artiles González, Santiago Atienza Ferro, María Colina Lorda] 
keywords: [React, Expo, Drizzle, PPP, DAM ] 
date: '\today' 

lang: es 
toc: true 
toc-depth: 2

numbersections: true 

fontsize: 11pt
geometry: margin=2.5cm
highlight-style: tango
header-includes:
    - \usepackage{calc}
    - \newcounter{none}
    - \usepackage{lscape}
---
\newpage

# Modelo Entidad-Relacion (ER)

## Objetivo
Documentar el modelo de datos actual de la aplicacion con Mermaid, alineado con el esquema definido en Drizzle.

## Leyenda
- `PK`: clave primaria.
- `FK`: clave foranea.
- `UK`: restriccion unique.
- `REL IMPLICITA`: relacion usada por dominio pero sin `references()` explicita en el esquema.

## Diagrama ER (Mermaid)

```mermaid
erDiagram
  AJUSTES {
    int id PK
    text nombre_ajuste UK
    text valor
  }

  COLECCIONES {
    int id PK
    text nombre
    text descripcion
    int fecha_creacion
    int activa
  }

  ESTADOS_CONSERVACION {
    int id PK
    text codigo UK
    text nombre
    text descripcion
    int orden
    int activo
  }

  TIPOS_ITEMS {
    int id PK
    text codigo UK
    text nombre
    text descripcion
    int orden
    int activo
  }

  PIEZAS {
    int id PK
    int coleccion_id
    text tipo
    int tipo_item_id FK
    text titulo
    text pais
    int anio
    text catalogo_ref
    text valor_facial
    text material
    int estado_conservacion_id FK
    text rareza
    int cantidad
    int tiene_error
    text observaciones
    int fecha_alta
    int fecha_actualizacion
  }

  FOTOS_PIEZA {
    int id PK
    int pieza_id
    text uri_local
    text origen
    text descripcion
    int es_principal
    int fecha_captura
  }

  COLECCIONES ||--o{ PIEZAS : "coleccion_id (REL IMPLICITA)"
  TIPOS_ITEMS ||--o{ PIEZAS : "tipo_item_id"
  ESTADOS_CONSERVACION ||--o{ PIEZAS : "estado_conservacion_id"
  PIEZAS ||--o{ FOTOS_PIEZA : "pieza_id (REL IMPLICITA)"
```

## Notas de modelado
1. Las relaciones `PIEZAS.tipo_item_id -> TIPOS_ITEMS.id` y `PIEZAS.estado_conservacion_id -> ESTADOS_CONSERVACION.id` si estan declaradas con `references()` en el esquema Drizzle.
2. Las relaciones `PIEZAS.coleccion_id -> COLECCIONES.id` y `FOTOS_PIEZA.pieza_id -> PIEZAS.id` se modelan como relaciones implicitas de dominio, porque actualmente no tienen `references()` explicita en `schema.ts`.
3. `AJUSTES` no participa en relaciones directas con otras entidades del dominio de catalogacion.
