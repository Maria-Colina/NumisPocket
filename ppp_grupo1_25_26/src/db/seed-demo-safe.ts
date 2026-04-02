import { db } from "@/db";
import { colecciones, piezas } from "@/db/schema";
import { eq } from "drizzle-orm";

type CountrySeed = {
  continente: string;
  pais: string;
  moneda1: { titulo: string; valor: string; anio: number; material: string };
  moneda2: { titulo: string; valor: string; anio: number; material: string };
  billete: { titulo: string; valor: string; anio: number; material?: string };
};

const countries: CountrySeed[] = [
  {
    continente: "Europa",
    pais: "España",
    moneda1: { titulo: "1 Peseta", valor: "1 Peseta", anio: 1980, material: "Aluminio" },
    moneda2: { titulo: "2 Euros Conmemorativa", valor: "2 Euros", anio: 2015, material: "Bimetálica" },
    billete: { titulo: "1000 Pesetas", valor: "1000 Pesetas", anio: 1992 },
  },
  {
    continente: "Europa",
    pais: "Francia",
    moneda1: { titulo: "1 Franc", valor: "1 Franc", anio: 1988, material: "Níquel" },
    moneda2: { titulo: "2 Euros", valor: "2 Euros", anio: 2002, material: "Bimetálica" },
    billete: { titulo: "20 Francs", valor: "20 Francs", anio: 1997 },
  },
  {
    continente: "Europa",
    pais: "Alemania",
    moneda1: { titulo: "1 Deutsche Mark", valor: "1 Mark", anio: 1990, material: "Cuproníquel" },
    moneda2: { titulo: "1 Euro", valor: "1 Euro", anio: 2004, material: "Bimetálica" },
    billete: { titulo: "10 Deutsche Mark", valor: "10 Mark", anio: 1991 },
  },
  {
    continente: "Europa",
    pais: "Italia",
    moneda1: { titulo: "100 Lire", valor: "100 Lire", anio: 1985, material: "Acero inoxidable" },
    moneda2: { titulo: "2 Euros", valor: "2 Euros", anio: 2007, material: "Bimetálica" },
    billete: { titulo: "1000 Lire", valor: "1000 Lire", anio: 1990 },
  },
  {
    continente: "Europa",
    pais: "Portugal",
    moneda1: { titulo: "50 Escudos", valor: "50 Escudos", anio: 1998, material: "Cuproníquel" },
    moneda2: { titulo: "1 Euro", valor: "1 Euro", anio: 2008, material: "Bimetálica" },
    billete: { titulo: "500 Escudos", valor: "500 Escudos", anio: 1995 },
  },

  {
    continente: "Asia",
    pais: "Japón",
    moneda1: { titulo: "100 Yen", valor: "100 Yen", anio: 2001, material: "Cuproníquel" },
    moneda2: { titulo: "500 Yen", valor: "500 Yen", anio: 2010, material: "Níquel-latón" },
    billete: { titulo: "1000 Yen", valor: "1000 Yen", anio: 2004 },
  },
  {
    continente: "Asia",
    pais: "China",
    moneda1: { titulo: "1 Jiao", valor: "1 Jiao", anio: 2003, material: "Aluminio" },
    moneda2: { titulo: "1 Yuan", valor: "1 Yuan", anio: 2015, material: "Acero niquelado" },
    billete: { titulo: "10 Yuan", valor: "10 Yuan", anio: 2019 },
  },
  {
    continente: "Asia",
    pais: "India",
    moneda1: { titulo: "1 Rupia", valor: "1 Rupia", anio: 1999, material: "Acero inoxidable" },
    moneda2: { titulo: "10 Rupias", valor: "10 Rupias", anio: 2018, material: "Bimetálica" },
    billete: { titulo: "50 Rupias", valor: "50 Rupias", anio: 2017 },
  },
  {
    continente: "Asia",
    pais: "Corea del Sur",
    moneda1: { titulo: "100 Won", valor: "100 Won", anio: 2005, material: "Cuproníquel" },
    moneda2: { titulo: "500 Won", valor: "500 Won", anio: 2016, material: "Cuproníquel" },
    billete: { titulo: "1000 Won", valor: "1000 Won", anio: 2007 },
  },
  {
    continente: "Asia",
    pais: "Tailandia",
    moneda1: { titulo: "5 Baht", valor: "5 Baht", anio: 2000, material: "Cuproníquel" },
    moneda2: { titulo: "10 Baht", valor: "10 Baht", anio: 2014, material: "Bimetálica" },
    billete: { titulo: "20 Baht", valor: "20 Baht", anio: 2013 },
  },

  {
    continente: "África",
    pais: "Marruecos",
    moneda1: { titulo: "1 Dirham", valor: "1 Dirham", anio: 2002, material: "Níquel" },
    moneda2: { titulo: "5 Dirhams", valor: "5 Dirhams", anio: 2011, material: "Bimetálica" },
    billete: { titulo: "20 Dirhams", valor: "20 Dirhams", anio: 2012 },
  },
  {
    continente: "África",
    pais: "Egipto",
    moneda1: { titulo: "50 Piastres", valor: "50 Piastres", anio: 2008, material: "Latón" },
    moneda2: { titulo: "1 Libra Egipcia", valor: "1 Libra", anio: 2019, material: "Bimetálica" },
    billete: { titulo: "10 Libras Egipcias", valor: "10 Libras", anio: 2015 },
  },
  {
    continente: "África",
    pais: "Sudáfrica",
    moneda1: { titulo: "1 Rand", valor: "1 Rand", anio: 1994, material: "Bronce niquelado" },
    moneda2: { titulo: "5 Rand", valor: "5 Rand", anio: 2018, material: "Bimetálica" },
    billete: { titulo: "20 Rand", valor: "20 Rand", anio: 2017 },
  },
  {
    continente: "África",
    pais: "Kenia",
    moneda1: { titulo: "1 Shilling", valor: "1 Shilling", anio: 1998, material: "Níquel-latón" },
    moneda2: { titulo: "20 Shillings", valor: "20 Shillings", anio: 2018, material: "Bimetálica" },
    billete: { titulo: "50 Shillings", valor: "50 Shillings", anio: 2019 },
  },
  {
    continente: "África",
    pais: "Nigeria",
    moneda1: { titulo: "1 Naira", valor: "1 Naira", anio: 2006, material: "Acero niquelado" },
    moneda2: { titulo: "2 Naira", valor: "2 Naira", anio: 2019, material: "Bimetálica" },
    billete: { titulo: "50 Naira", valor: "50 Naira", anio: 2020 },
  },

  {
    continente: "América del Norte",
    pais: "Estados Unidos",
    moneda1: { titulo: "Quarter Dollar", valor: "25 Cents", anio: 2001, material: "Cuproníquel" },
    moneda2: { titulo: "1 Dollar Coin", valor: "1 Dollar", anio: 2007, material: "Latón manganeso" },
    billete: { titulo: "1 Dollar", valor: "1 Dollar", anio: 2017 },
  },
  {
    continente: "América del Norte",
    pais: "Canadá",
    moneda1: { titulo: "1 Dollar Loonie", valor: "1 Dollar", anio: 2000, material: "Níquel" },
    moneda2: { titulo: "2 Dollars Toonie", valor: "2 Dollars", anio: 2016, material: "Bimetálica" },
    billete: { titulo: "5 Dollars", valor: "5 Dollars", anio: 2013 },
  },
  {
    continente: "América del Norte",
    pais: "México",
    moneda1: { titulo: "1 Peso", valor: "1 Peso", anio: 1997, material: "Bronce-aluminio" },
    moneda2: { titulo: "10 Pesos", valor: "10 Pesos", anio: 2012, material: "Bimetálica" },
    billete: { titulo: "50 Pesos", valor: "50 Pesos", anio: 2021 },
  },
  {
    continente: "América del Norte",
    pais: "Cuba",
    moneda1: { titulo: "1 Peso Cubano", valor: "1 Peso", anio: 1996, material: "Latón" },
    moneda2: { titulo: "3 Pesos", valor: "3 Pesos", anio: 2014, material: "Níquel-latón" },
    billete: { titulo: "10 Pesos Cubanos", valor: "10 Pesos", anio: 2015 },
  },
  {
    continente: "América del Norte",
    pais: "República Dominicana",
    moneda1: { titulo: "1 Peso Dominicano", valor: "1 Peso", anio: 2008, material: "Cuproníquel" },
    moneda2: { titulo: "10 Pesos Dominicanos", valor: "10 Pesos", anio: 2016, material: "Bimetálica" },
    billete: { titulo: "20 Pesos Dominicanos", valor: "20 Pesos", anio: 2014 },
  },

  {
    continente: "América del Sur",
    pais: "Argentina",
    moneda1: { titulo: "1 Peso Argentino", valor: "1 Peso", anio: 1995, material: "Cuproníquel" },
    moneda2: { titulo: "2 Pesos Argentinos", valor: "2 Pesos", anio: 2011, material: "Bimetálica" },
    billete: { titulo: "100 Pesos Argentinos", valor: "100 Pesos", anio: 2018 },
  },
  {
    continente: "América del Sur",
    pais: "Brasil",
    moneda1: { titulo: "50 Centavos", valor: "50 Centavos", anio: 2004, material: "Acero inoxidable" },
    moneda2: { titulo: "1 Real", valor: "1 Real", anio: 2019, material: "Bimetálica" },
    billete: { titulo: "20 Reais", valor: "20 Reais", anio: 2012 },
  },
  {
    continente: "América del Sur",
    pais: "Chile",
    moneda1: { titulo: "100 Pesos Chilenos", valor: "100 Pesos", anio: 2009, material: "Níquel-latón" },
    moneda2: { titulo: "500 Pesos Chilenos", valor: "500 Pesos", anio: 2017, material: "Bimetálica" },
    billete: { titulo: "1000 Pesos Chilenos", valor: "1000 Pesos", anio: 2020 },
  },
  {
    continente: "América del Sur",
    pais: "Perú",
    moneda1: { titulo: "1 Sol", valor: "1 Sol", anio: 2006, material: "Latón" },
    moneda2: { titulo: "5 Soles", valor: "5 Soles", anio: 2015, material: "Bimetálica" },
    billete: { titulo: "10 Soles", valor: "10 Soles", anio: 2018 },
  },
  {
    continente: "América del Sur",
    pais: "Colombia",
    moneda1: { titulo: "200 Pesos Colombianos", valor: "200 Pesos", anio: 1994, material: "Bronce" },
    moneda2: { titulo: "1000 Pesos Colombianos", valor: "1000 Pesos", anio: 2016, material: "Bimetálica" },
    billete: { titulo: "2000 Pesos Colombianos", valor: "2000 Pesos", anio: 2017 },
  },

  {
    continente: "Oceanía",
    pais: "Australia",
    moneda1: { titulo: "50 Cents", valor: "50 Cents", anio: 2001, material: "Cuproníquel" },
    moneda2: { titulo: "2 Dollars", valor: "2 Dollars", anio: 2018, material: "Aluminio-bronce" },
    billete: { titulo: "5 Australian Dollars", valor: "5 Dollars", anio: 2016 },
  },
  {
    continente: "Oceanía",
    pais: "Nueva Zelanda",
    moneda1: { titulo: "1 Dollar", valor: "1 Dollar", anio: 2007, material: "Aluminio-bronce" },
    moneda2: { titulo: "2 Dollars", valor: "2 Dollars", anio: 2015, material: "Aluminio-bronce" },
    billete: { titulo: "10 New Zealand Dollars", valor: "10 Dollars", anio: 2015 },
  },
  {
    continente: "Oceanía",
    pais: "Fiyi",
    moneda1: { titulo: "20 Cents", valor: "20 Cents", anio: 2009, material: "Cuproníquel" },
    moneda2: { titulo: "1 Dollar", valor: "1 Dollar", anio: 2013, material: "Níquel-latón" },
    billete: { titulo: "5 Fijian Dollars", valor: "5 Dollars", anio: 2013 },
  },
  {
    continente: "Oceanía",
    pais: "Papúa Nueva Guinea",
    moneda1: { titulo: "1 Toea", valor: "1 Toea", anio: 2000, material: "Bronce" },
    moneda2: { titulo: "1 Kina", valor: "1 Kina", anio: 2010, material: "Bimetálica" },
    billete: { titulo: "10 Kina", valor: "10 Kina", anio: 2018 },
  },
  {
    continente: "Oceanía",
    pais: "Samoa",
    moneda1: { titulo: "50 Sene", valor: "50 Sene", anio: 1996, material: "Cuproníquel" },
    moneda2: { titulo: "1 Tala", valor: "1 Tala", anio: 2011, material: "Níquel-latón" },
    billete: { titulo: "5 Tala", valor: "5 Tala", anio: 2014 },
  },
];

function getEstado(index: number) {
  const estados = ["BC", "MBC", "EBC", "SC"];
  return estados[index % estados.length];
}

function getRareza(index: number) {
  const rarezas = ["común", "escasa", "rara", "muy rara"];
  return rarezas[index % rarezas.length];
}

async function getOrCreateColeccion(nombre: string) {
  const existing = await db.select().from(colecciones).where(eq(colecciones.nombre, nombre));

  if (existing.length > 0) {
    return existing[0];
  }

  const now = Date.now();

  await db.insert(colecciones).values({
    nombre,
    descripcion: `Colección de ${nombre}`,
    fecha_creacion: now,
    activa: 1,
  });

  const created = await db.select().from(colecciones).where(eq(colecciones.nombre, nombre));
  return created[0];
}

async function piezaExiste(titulo: string, pais: string, anio: number | null, tipo: string) {
  const found = await db
    .select()
    .from(piezas)
    .where(
      eq(piezas.titulo, titulo)
    );

  return found.some(
    (p) =>
      p.titulo === titulo &&
      p.pais === pais &&
      p.anio === anio &&
      p.tipo === tipo
  );
}

export async function seedDemoDataSafe() {
  const now = Date.now();

  for (let i = 0; i < countries.length; i++) {
    const item = countries[i];
    const coleccion = await getOrCreateColeccion(item.continente);

    const registros = [
      {
        coleccion_id: coleccion.id,
        tipo: "moneda",
        titulo: item.moneda1.titulo,
        pais: item.pais,
        anio: item.moneda1.anio,
        valor_facial: item.moneda1.valor,
        material: item.moneda1.material,
        estado_conservacion: getEstado(i),
        rareza: getRareza(i),
        cantidad: (i % 3) + 1,
        tiene_error: i % 11 === 0 ? 1 : 0,
        observaciones: `Seed demo ${item.continente}`,
        fecha_alta: now,
        fecha_actualizacion: now,
      },
      {
        coleccion_id: coleccion.id,
        tipo: "moneda",
        titulo: item.moneda2.titulo,
        pais: item.pais,
        anio: item.moneda2.anio,
        valor_facial: item.moneda2.valor,
        material: item.moneda2.material,
        estado_conservacion: getEstado(i + 1),
        rareza: getRareza(i + 1),
        cantidad: 1,
        tiene_error: i % 7 === 0 ? 1 : 0,
        observaciones: `Seed demo ${item.continente}`,
        fecha_alta: now,
        fecha_actualizacion: now,
      },
      {
        coleccion_id: coleccion.id,
        tipo: "billete",
        titulo: item.billete.titulo,
        pais: item.pais,
        anio: item.billete.anio,
        valor_facial: item.billete.valor,
        material: item.billete.material ?? "Papel / polímero",
        estado_conservacion: getEstado(i + 2),
        rareza: getRareza(i + 2),
        cantidad: 1,
        tiene_error: 0,
        observaciones: `Seed demo ${item.continente}`,
        fecha_alta: now,
        fecha_actualizacion: now,
      },
    ];

    for (const registro of registros) {
      const existe = await piezaExiste(
        registro.titulo,
        registro.pais ?? "",
        registro.anio ?? null,
        registro.tipo ?? ""
      );

      if (!existe) {
        await db.insert(piezas).values(registro);
      }
    }
  }
}