import { desc, eq, sql } from 'drizzle-orm';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db } from '../../src/db';
import { colecciones, fotos_pieza, piezas } from '../../src/db/schema';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

type TipoStat = { tipo: string; total: number };
type ContinenteStat = { continente: string; total: number };

export default function StatsScreen() {
  const [totalPiezas, setTotalPiezas] = useState(0);
  const [conFoto, setConFoto] = useState(0);
  const [totalPaises, setTotalPaises] = useState(0);
  const [totalColecciones, setTotalColecciones] = useState(0);
  const [tipos, setTipos] = useState<TipoStat[]>([]);
  const [continentes, setContinentes] = useState<ContinenteStat[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const totalPiezasRes = await db.select({ total: sql<number>`count(*)` }).from(piezas);
      const conFotoRes = await db
        .select({ total: sql<number>`count(distinct ${fotos_pieza.pieza_id})` })
        .from(fotos_pieza);
      const totalPaisesRes = await db
        .select({ total: sql<number>`count(distinct ${piezas.pais})` })
        .from(piezas);
      const totalColeccionesRes = await db.select({ total: sql<number>`count(*)` }).from(colecciones);

      const tiposRes = await db
        .select({ tipo: sql<string>`coalesce(${piezas.tipo}, 'Sin tipo')`, total: sql<number>`count(*)` })
        .from(piezas)
        .groupBy(piezas.tipo)
        .orderBy(desc(sql`count(*)`));

      const continentesRes = await db
        .select({ continente: sql<string>`coalesce(${colecciones.nombre}, 'Sin colección')`, total: sql<number>`count(*)` })
        .from(piezas)
        .leftJoin(colecciones, eq(piezas.coleccion_id, colecciones.id))
        .groupBy(colecciones.nombre)
        .orderBy(desc(sql`count(*)`))
        .limit(6);

      setTotalPiezas(Number(totalPiezasRes[0]?.total ?? 0));
      setConFoto(Number(conFotoRes[0]?.total ?? 0));
      setTotalPaises(Number(totalPaisesRes[0]?.total ?? 0));
      setTotalColecciones(Number(totalColeccionesRes[0]?.total ?? 0));
      setTipos(tiposRes.map((item) => ({ tipo: item.tipo, total: Number(item.total) })));
      setContinentes(
        continentesRes.map((item) => ({ continente: item.continente, total: Number(item.total) }))
      );
    };

    loadStats();
  }, []);

  const resumen = useMemo(() => {
    if (totalPiezas === 0) return 'Todavía no hay piezas registradas.';
    return `Tienes ${totalPiezas} piezas registradas, ${conFoto} con imagen, ${totalPaises} países y ${totalColecciones} colecciones.`;
  }, [totalPiezas, conFoto, totalPaises, totalColecciones]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Estadísticas</Text>
            <Text style={styles.headerSubtitle}>Resumen de la colección</Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Total piezas" value={String(totalPiezas)} />
            <StatCard label="Con foto" value={String(conFoto)} />
            <StatCard label="Países" value={String(totalPaises)} />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Piezas por continente</Text>
            {continentes.length === 0 ? (
              <Text style={styles.emptyText}>No hay datos todavía.</Text>
            ) : (
              continentes.map((item) => (
                <Text key={item.continente} style={styles.rowText}>
                  {item.continente}: {item.total}
                </Text>
              ))
            )}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución por tipo</Text>
            {tipos.length === 0 ? (
              <Text style={styles.emptyText}>No hay datos todavía.</Text>
            ) : (
              tipos.map((item) => (
                <Text key={item.tipo} style={styles.rowText}>
                  {item.tipo}: {item.total}
                </Text>
              ))
            )}
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{resumen}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 16, paddingBottom: 28 },
  header: { backgroundColor: '#F59E0B', borderRadius: 18, paddingVertical: 18, paddingHorizontal: 16, marginBottom: 12 },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: '#FEF3C7', fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DADDE3', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 10 },
  statLabel: { fontSize: 10, color: '#6B7280', marginBottom: 6 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#111827' },
  chartCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DADDE3', borderRadius: 16, padding: 14, marginBottom: 12 },
  chartTitle: { fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 12 },
  emptyText: { color: '#6B7280', fontSize: 14 },
  rowText: { color: '#374151', fontSize: 14, marginBottom: 6 },
  summaryCard: { backgroundColor: '#EDEFF8', borderRadius: 14, padding: 14, marginTop: 2 },
  summaryText: { color: '#4B5563', fontSize: 12, lineHeight: 18 },
});