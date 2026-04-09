import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

const datosDemo = [
  { id: 1, titulo: 'Pieza de ejemplo', pais: 'España', anio: 1992, tipo: 'moneda', valor_facial: '100 ptas', tieneFoto: true },
  { id: 2, titulo: 'Billete conmemorativo', pais: 'Francia', anio: 2001, tipo: 'billete', valor_facial: '20 EUR', tieneFoto: false },
  { id: 3, titulo: 'Moneda histórica', pais: 'Italia', anio: 1987, tipo: 'moneda', valor_facial: '500 L', tieneFoto: true },
];

function construirDetalle(pieza: (typeof datosDemo)[number]) {
  const partes = [pieza.pais, String(pieza.anio), pieza.valor_facial, pieza.tipo, pieza.tieneFoto ? 'con foto' : 'sin foto'];
  return partes.join(' · ');
}

export default function IndexScreen() {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<'todas' | 'monedas' | 'billetes' | 'conFoto'>('todas');

  const listaFiltrada = useMemo(() => {
    return datosDemo.filter((pieza) => {
      const texto = `${pieza.titulo} ${pieza.pais} ${pieza.anio} ${pieza.valor_facial} ${pieza.tipo}`.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda.toLowerCase());
      const coincideFiltro =
        filtro === 'todas'
          ? true
          : filtro === 'monedas'
            ? pieza.tipo === 'moneda'
            : filtro === 'billetes'
              ? pieza.tipo === 'billete'
              : pieza.tieneFoto;

      return coincideBusqueda && coincideFiltro;
    });
  }, [busqueda, filtro]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Colección</Text>
            <Text style={styles.headerSubtitle}>Listado general y filtros</Text>
          </View>

          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar país, año o valor..."
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
          />

          <View style={styles.filtersRow}>
            {[
              { key: 'todas', label: 'Todas' },
              { key: 'monedas', label: 'Monedas' },
              { key: 'billetes', label: 'Billetes' },
              { key: 'conFoto', label: 'Con foto' },
            ].map((item) => {
              const activo = filtro === item.key;

              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.filterChip, activo && styles.filterChipActive]}
                  onPress={() => setFiltro(item.key as typeof filtro)}
                >
                  <Text style={[styles.filterChipText, activo && styles.filterChipTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.list}>
            {listaFiltrada.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No hay piezas que coincidan con la búsqueda.</Text>
              </View>
            ) : (
              listaFiltrada.map((pieza) => (
                <PiezaCardPreview key={pieza.id} titulo={pieza.titulo} detalle={construirDetalle(pieza)} />
              ))
            )}
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
  searchInput: { backgroundColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: '#111827', marginBottom: 14 },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterChip: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#DBEAFE' },
  filterChipText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: '#2563EB' },
  list: { gap: 12 },
  emptyCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 18, padding: 18 },
  emptyText: { color: '#4B5563', fontSize: 14 },
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