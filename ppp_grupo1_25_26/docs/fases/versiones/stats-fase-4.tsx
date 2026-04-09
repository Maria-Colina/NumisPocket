import { desc, eq, sql } from 'drizzle-orm';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { G, Path } from 'react-native-svg';

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
type StatsData = {
  totalPiezas: number;
  conFoto: number;
  totalPaises: number;
  totalColecciones: number;
  tipos: TipoStat[];
  continentes: ContinenteStat[];
};

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, 'Z'].join(' ');
}

function PieChart({ data, size = 92 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const radius = size / 2;

  if (total === 0) {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#E5E7EB' }} />
      </View>
    );
  }

  let startAngle = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G>
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const endAngle = startAngle + angle;
            const path = describeArc(radius, radius, radius, startAngle, endAngle);
            startAngle = endAngle;

            return <Path key={`${item.label}-${index}`} d={path} fill={item.color} />;
          })}
        </G>
      </Svg>
    </View>
  );
}

function shortContinentLabel(label: string) {
  if (label === 'América del Norte') return 'Am. N.';
  if (label === 'América del Sur') return 'Am. S.';
  return label;
}

export default function StatsScreen() {
  const [stats, setStats] = useState<StatsData>({
    totalPiezas: 0,
    conFoto: 0,
    totalPaises: 0,
    totalColecciones: 0,
    tipos: [],
    continentes: [],
  });

  const loadStats = useCallback(async () => {
    try {
      const totalPiezasRes = await db.select({ total: sql<number>`count(*)` }).from(piezas);
      const conFotoRes = await db.select({ total: sql<number>`count(distinct ${fotos_pieza.pieza_id})` }).from(fotos_pieza);
      const totalPaisesRes = await db.select({ total: sql<number>`count(distinct ${piezas.pais})` }).from(piezas);
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

      setStats({
        totalPiezas: Number(totalPiezasRes[0]?.total ?? 0),
        conFoto: Number(conFotoRes[0]?.total ?? 0),
        totalPaises: Number(totalPaisesRes[0]?.total ?? 0),
        totalColecciones: Number(totalColeccionesRes[0]?.total ?? 0),
        tipos: tiposRes.map((item) => ({ tipo: item.tipo, total: Number(item.total) })),
        continentes: continentesRes.map((item) => ({ continente: item.continente, total: Number(item.total) })),
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const porcentajeConFoto = useMemo(() => {
    if (stats.totalPiezas === 0) return 0;
    return Math.round((stats.conFoto / stats.totalPiezas) * 100);
  }, [stats.conFoto, stats.totalPiezas]);

  const maxContinente = useMemo(() => {
    if (stats.continentes.length === 0) return 1;
    return Math.max(...stats.continentes.map((item) => item.total));
  }, [stats.continentes]);

  const totalTipos = useMemo(() => stats.tipos.reduce((acc, item) => acc + item.total, 0), [stats.tipos]);

  const tipoChartData = useMemo(() => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

    return stats.tipos.map((item, index) => ({
      label: item.tipo.toLowerCase() === 'moneda' ? 'Monedas' : item.tipo.toLowerCase() === 'billete' ? 'Billetes' : item.tipo,
      value: item.total,
      color: colors[index % colors.length],
    }));
  }, [stats.tipos]);

  const resumen = useMemo(() => {
    if (stats.totalPiezas === 0) {
      return 'Todavía no hay piezas registradas.';
    }

    const continenteTop = stats.continentes[0];
    const tipoTop = tipoChartData[0];

    let texto = `Resumen: tienes ${stats.totalPiezas} piezas registradas y ${stats.conFoto} con imagen (${porcentajeConFoto}% del total).`;

    if (continenteTop) {
      texto += ` El continente más representado es ${continenteTop.continente} con ${continenteTop.total} piezas.`;
    }

    if (tipoTop) {
      texto += ` El tipo más frecuente es ${tipoTop.label.toLowerCase()}.`;
    }

    return texto;
  }, [stats, porcentajeConFoto, tipoChartData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Estadísticas</Text>
            <Text style={styles.headerSubtitle}>Resumen de la colección</Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Total piezas" value={String(stats.totalPiezas)} />
            <StatCard label="Con foto" value={String(stats.conFoto)} />
            <StatCard label="Países" value={String(stats.totalPaises)} />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Piezas por continente</Text>

            {stats.continentes.length === 0 ? (
              <Text style={styles.emptyText}>No hay datos todavía.</Text>
            ) : (
              <>
                <View style={styles.barRow}>
                  {stats.continentes.map((item, index) => {
                    const height = Math.max((item.total / maxContinente) * 82, 10);
                    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#14B8A6'];

                    return (
                      <View key={`${item.continente}-${index}`} style={styles.barItem}>
                        <Text style={styles.barValue}>{item.total}</Text>
                        <View style={[styles.bar, { height, backgroundColor: colors[index % colors.length] }]} />
                      </View>
                    );
                  })}
                </View>

                <View style={styles.labelsRow}>
                  {stats.continentes.map((item, index) => (
                    <Text key={`${item.continente}-${index}`} style={styles.axisLabel} numberOfLines={1} ellipsizeMode="tail">
                      {shortContinentLabel(item.continente)}
                    </Text>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución por tipo</Text>

            {tipoChartData.length === 0 ? (
              <Text style={styles.emptyText}>No hay datos todavía.</Text>
            ) : (
              <View style={styles.pieWrap}>
                <PieChart data={tipoChartData} size={92} />

                <View style={styles.legend}>
                  {tipoChartData.map((item, index) => {
                    const porcentaje = totalTipos > 0 ? Math.round((item.value / totalTipos) * 100) : 0;

                    return (
                      <View key={`${item.label}-${index}`} style={styles.legendItemRow}>
                        <View style={styles.legendItem}>
                          <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                          <Text style={styles.legendText}>{item.label}</Text>
                        </View>

                        <Text style={styles.legendValue}>
                          {item.value} ({porcentaje}%)
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
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
  barRow: { height: 100, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: 8 },
  barItem: { alignItems: 'center', justifyContent: 'flex-end', flex: 1 },
  barValue: { fontSize: 11, color: '#374151', marginBottom: 4, fontWeight: '700' },
  bar: { width: 24, borderRadius: 4 },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-around', gap: 6 },
  axisLabel: { flex: 1, textAlign: 'center', fontSize: 10, color: '#6B7280' },
  pieWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 18 },
  legend: { gap: 10, flex: 1 },
  legendItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: '#374151' },
  legendValue: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  summaryCard: { backgroundColor: '#EDEFF8', borderRadius: 14, padding: 14, marginTop: 2 },
  summaryText: { color: '#4B5563', fontSize: 12, lineHeight: 18 },
  emptyText: { color: '#6B7280', fontSize: 14 },
});