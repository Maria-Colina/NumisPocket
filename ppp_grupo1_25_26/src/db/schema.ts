import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Tabla: colecciones
export const colecciones = sqliteTable("colecciones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  fecha_creacion: integer("fecha_creacion"),
  activa: integer("activa").default(1),
});

// Tabla: piezas
export const piezas = sqliteTable("piezas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coleccion_id: integer("coleccion_id"),
  tipo: text("tipo"),
  titulo: text("titulo").notNull(),
  pais: text("pais"),
  anio: integer("anio"),
  valor_facial: text("valor_facial"),
  material: text("material"),
  estado_conservacion: text("estado_conservacion"),
  rareza: text("rareza"),
  cantidad: integer("cantidad").default(1),
  tiene_error: integer("tiene_error").default(0),
  observaciones: text("observaciones"),
  fecha_alta: integer("fecha_alta"),
  fecha_actualizacion: integer("fecha_actualizacion"),
});

// Tabla: fotos_pieza
export const fotos_pieza = sqliteTable("fotos_pieza", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pieza_id: integer("pieza_id"),
  uri_local: text("uri_local"),
  origen: text("origen"),
  descripcion: text("descripcion"),
  es_principal: integer("es_principal").default(0),
  fecha_captura: integer("fecha_captura"),
});