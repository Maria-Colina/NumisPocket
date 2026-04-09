import { desc, eq, sql } from 'drizzle-orm';
import { useEffect, useMemo, useState } from 'react';
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

function PieChart({
  data,
  size = 92,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
}) {
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

export default function StatsScreen() {
  const [totalPiezas, setTotalPiezas] = useState(0);
  const [conFoto, setConFoto] = useState(0);
  const [totalPaises, setTotalPaises] = useState(0);
  const [totalColecciones, setTotalColecciones] = useState(0);
  const [tipos, setTipos] = useState<{ tipo: string; total: number }[]>([]);
  const [continentes, setContinentes] = useState<{ continente: string; total: number }[]>([]);

  useEffect(() => {
    const loadStats = async () => {
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

      setTotalPiezas(Number(totalPiezasRes[0]?.total ?? 0));
      setConFoto(Number(conFotoRes[0]?.total ?? 0));
      setTotalPaises(Number(totalPaisesRes[0]?.total ?? 0));
      setTotalColecciones(Number(totalColeccionesRes[0]?.total ?? 0));
      setTipos(tiposRes.map((item) => ({ tipo: item.tipo, total: Number(item.total) })));
      setContinentes(continentesRes.map((item) => ({ continente: item.continente, total: Number(item.total) })));
    };

    loadStats();
  }, []);

  const totalTipos = useMemo(() => tipos.reduce((acc, item) => acc + item.total, 0), [tipos]);

  const tipoChartData = useMemo(() => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

    return tipos.map((item, index) => ({
      label: item.tipo,
      value: item.total,
      color: colors[index % colors.length],
    }));
  }, [tipos]);

  const resumen = useMemo(() => {
    if (totalPiezas === 0) return 'Todavía no hay piezas registradas.';
    return `Tienes ${totalPiezas} piezas registradas y ${conFoto} con imagen.`;
  }, [totalPiezas, conFoto]);

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
                <Text key={item.continente} style={styles.rowText}>{item.continente}: {item.total}</Text>
              ))
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
                        <Text style={styles.legendValue}>{item.value} ({porcentaje}%)</Text>
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
  emptyText: { color: '#6B7280', fontSize: 14 },
  rowText: { color: '#374151', fontSize: 14, marginBottom: 6 },
  pieWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 18 },
  legend: { gap: 10, flex: 1 },
  legendItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: '#374151' },
  legendValue: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  summaryCard: { backgroundColor: '#EDEFF8', borderRadius: 14, padding: 14, marginTop: 2 },
  summaryText: { color: '#4B5563', fontSize: 12, lineHeight: 18 },
});