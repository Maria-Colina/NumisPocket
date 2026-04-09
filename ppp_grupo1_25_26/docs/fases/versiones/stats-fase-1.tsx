import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Estadísticas</Text>
            <Text style={styles.headerSubtitle}>Resumen de la colección</Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Total piezas" value="0" />
            <StatCard label="Con foto" value="0" />
            <StatCard label="Países" value="0" />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Piezas por continente</Text>
            <Text style={styles.emptyText}>Bloque reservado para el gráfico.</Text>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución por tipo</Text>
            <Text style={styles.emptyText}>Bloque reservado para el gráfico circular.</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Todavía no hay estadísticas calculadas.</Text>
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
  summaryCard: { backgroundColor: '#EDEFF8', borderRadius: 14, padding: 14, marginTop: 2 },
  summaryText: { color: '#4B5563', fontSize: 12, lineHeight: 18 },
});