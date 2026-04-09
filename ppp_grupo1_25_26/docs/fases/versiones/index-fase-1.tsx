import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function MonedaMini() {
  return (
    <View style={styles.coinOuter}>
      <View style={styles.coinInner} />
    </View>
  );
}

function PiezaCardPreview({ titulo, detalle }: { titulo: string; detalle: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardThumb}>
        <MonedaMini />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{titulo}</Text>
        <Text style={styles.cardDetail}>{detalle}</Text>
      </View>

      <TouchableOpacity style={styles.cardButton}>
        <Text style={styles.cardButtonText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function IndexScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Colección</Text>
            <Text style={styles.headerSubtitle}>Listado general y filtros</Text>
          </View>

          <View style={styles.searchInput}>
            <Text style={styles.searchPlaceholder}>Buscar país, año o valor...</Text>
          </View>

          <View style={styles.filtersRow}>
            <View style={[styles.filterChip, styles.filterChipActive]}>
              <Text style={[styles.filterChipText, styles.filterChipTextActive]}>Todas</Text>
            </View>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Monedas</Text>
            </View>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Billetes</Text>
            </View>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Con foto</Text>
            </View>
          </View>

          <View style={styles.list}>
            <PiezaCardPreview titulo="Pieza de ejemplo" detalle="España · 1992 · 100 ptas · moneda · con foto" />
            <PiezaCardPreview titulo="Billete conmemorativo" detalle="Francia · 2001 · 20 EUR · billete · sin foto" />
            <PiezaCardPreview titulo="Moneda histórica" detalle="Italia · 1987 · 500 L · moneda · con foto" />
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 20, paddingBottom: 120 },
  header: { backgroundColor: '#2563EB', borderRadius: 20, paddingVertical: 20, paddingHorizontal: 18, marginBottom: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: '#DBEAFE', fontSize: 13, marginTop: 4 },
  searchInput: { backgroundColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 14 },
  searchPlaceholder: { color: '#6B7280', fontSize: 15 },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterChip: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#DBEAFE' },
  filterChipText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: '#2563EB' },
  list: { gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 18, padding: 12 },
  cardThumb: { width: 60, height: 60, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12, backgroundColor: '#E8F0FF' },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardDetail: { fontSize: 13, color: '#4B5563' },
  cardButton: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginLeft: 10 },
  cardButtonText: { color: '#2563EB', fontSize: 13, fontWeight: '700' },
  coinOuter: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#B9770E', justifyContent: 'center', alignItems: 'center' },
  coinInner: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F7E58B' },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 64, height: 64, borderRadius: 20, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#FFFFFF', fontSize: 34, fontWeight: '300', marginTop: -2 },
});