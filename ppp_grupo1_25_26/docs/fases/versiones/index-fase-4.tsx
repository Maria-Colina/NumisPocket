import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../src/db';
import { fotos_pieza, piezas } from '../../src/db/schema';

type PiezaListItem = {
  id: number;
  titulo: string;
  pais: string | null;
  anio: number | null;
  tipo: string | null;
  valor_facial: string | null;
  tieneFoto: boolean;
};

function MonedaMini() {
  return (
    <View style={styles.coinOuter}>
      <View style={styles.coinInner} />
    </View>
  );
}

function PiezaCard({
  titulo,
  detalle,
  color,
  onVer,
}: {
  titulo: string;
  detalle: string;
  color: string;
  onVer: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardThumb, { backgroundColor: color }]}>
        <MonedaMini />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{titulo}</Text>
        <Text style={styles.cardDetail}>{detalle}</Text>
      </View>

      <TouchableOpacity style={styles.cardButton} onPress={onVer}>
        <Text style={styles.cardButtonText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );
}

function colorPorIndice(index: number) {
  const colores = ['#E8F0FF', '#EAF7E8', '#FFF4D9', '#F1E8FF'];
  return colores[index % colores.length];
}

function construirDetalle(pieza: PiezaListItem) {
  const partes = [
    pieza.pais ?? null,
    pieza.anio ? String(pieza.anio) : null,
    pieza.valor_facial ?? null,
    pieza.tipo ?? null,
    pieza.tieneFoto ? 'con foto' : 'sin foto',
  ].filter(Boolean);

  return partes.join(' · ');
}

export default function IndexScreen() {
  const router = useRouter();
  const [lista, setLista] = useState<PiezaListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);

      const resultadoPiezas = await db.select().from(piezas);
      const resultadoFotos = await db.select().from(fotos_pieza);

      const idsConFoto = new Set(
        (resultadoFotos as any[])
          .map((f) => f.pieza_id)
          .filter((id) => id !== null && id !== undefined)
      );

      const listaFinal = (resultadoPiezas as any[]).map((pieza) => ({
        ...pieza,
        tieneFoto: idsConFoto.has(pieza.id),
      })) as PiezaListItem[];

      setLista(listaFinal);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Colección</Text>
            <Text style={styles.headerSubtitle}>Listado general y filtros</Text>
          </View>

          <TextInput
            placeholder="Buscar país, año o valor..."
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
          />

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
            {loading ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Cargando piezas...</Text>
              </View>
            ) : lista.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Todavía no hay piezas guardadas.</Text>
              </View>
            ) : (
              lista.map((pieza, index) => (
                <PiezaCard
                  key={pieza.id}
                  titulo={pieza.titulo}
                  detalle={construirDetalle(pieza)}
                  color={colorPorIndice(index)}
                  onVer={() =>
                    router.push({
                      pathname: '/(tabs)/new',
                      params: { id: String(pieza.id) },
                    })
                  }
                />
              ))
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            router.push({
              pathname: '/(tabs)/new',
              params: { create: String(Date.now()) },
            })
          }
        >
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
  cardThumb: { width: 60, height: 60, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardDetail: { fontSize: 13, color: '#4B5563' },
  cardButton: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginLeft: 10 },
  cardButtonText: { color: '#2563EB', fontSize: 13, fontWeight: '700' },
  coinOuter: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#B9770E', justifyContent: 'center', alignItems: 'center' },
  coinInner: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F7E58B' },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 64, height: 64, borderRadius: 20, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', shadowColor: '#000000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  fabText: { color: '#FFFFFF', fontSize: 34, fontWeight: '300', marginTop: -2 },
});