import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

const sqlite = SQLite.openDatabaseSync("numispocket.db");

sqlite.execSync(`
  CREATE TABLE IF NOT EXISTS colecciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha_creacion INTEGER,
    activa INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS piezas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coleccion_id INTEGER,
    tipo TEXT,
    titulo TEXT NOT NULL,
    pais TEXT,
    anio INTEGER,
    valor_facial TEXT,
    material TEXT,
    estado_conservacion TEXT,
    rareza TEXT,
    cantidad INTEGER DEFAULT 1,
    tiene_error INTEGER DEFAULT 0,
    observaciones TEXT,
    fecha_alta INTEGER,
    fecha_actualizacion INTEGER
  );

  CREATE TABLE IF NOT EXISTS fotos_pieza (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pieza_id INTEGER,
    uri_local TEXT,
    origen TEXT,
    descripcion TEXT,
    es_principal INTEGER DEFAULT 0,
    fecha_captura INTEGER
  );
`);

export const db = drizzle(sqlite);