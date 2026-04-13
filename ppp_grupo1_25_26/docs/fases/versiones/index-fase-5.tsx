import { db } from '@/db';
import { fotos_pieza, piezas } from '@/db/schema';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Borders, Shadows } from '@/constants/theme';

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
  return Colors.light.cardPalette[index % Colors.light.cardPalette.length];
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
            placeholderTextColor={Colors.light.textTertiary}
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
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  container: {
    padding: Spacing[20],
    paddingBottom: 120,
  },

  header: {
    backgroundColor: Colors.light.accent,
    borderRadius: Borders.radius.lg,
    paddingVertical: Spacing[20],
    paddingHorizontal: Spacing[18],
    marginBottom: Spacing[16],
  },

  headerTitle: {
    color: Colors.light.textInverse,
    fontSize: Typography.heading2.size,
    fontWeight: Typography.heading2.weight,
  },

  headerSubtitle: {
    color: Colors.light.accentLight,
    fontSize: Typography.label.size,
    marginTop: Spacing[4],
  },

  searchInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: Borders.radius.md,
    paddingHorizontal: Spacing[14],
    paddingVertical: Spacing[14],
    fontSize: Typography.body.size,
    color: Colors.light.textPrimary,
    marginBottom: Spacing[14],
  },

  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[8],
    marginBottom: Spacing[16],
  },

  filterChip: {
    backgroundColor: Colors.light.surface,
    borderRadius: Borders.radius.md,
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[8],
  },

  filterChipActive: {
    backgroundColor: Colors.light.accentLight,
  },

  filterChipText: {
    color: Colors.light.textSecondary,
    fontSize: Typography.label.size,
    fontWeight: Typography.label.weight,
  },

  filterChipTextActive: {
    color: Colors.light.accent,
  },

  list: {
    gap: Spacing[12],
  },

  emptyCard: {
    backgroundColor: Colors.light.background,
    borderWidth: Borders.width.thin,
    borderColor: Colors.light.border,
    borderRadius: Borders.radius.lg,
    padding: Spacing[18],
  },

  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: Typography.body.size,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: Borders.width.thin,
    borderColor: Colors.light.border,
    borderRadius: Borders.radius.lg,
    padding: Spacing[12],
  },

  cardThumb: {
    width: 60,
    height: 60,
    borderRadius: Borders.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[12],
  },

  cardBody: {
    flex: 1,
  },

  cardTitle: {
    fontSize: Typography.bodySmall.size,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing[4],
  },

  cardDetail: {
    fontSize: Typography.caption.size,
    color: Colors.light.textSecondary,
  },

  cardButton: {
    backgroundColor: Colors.light.accentLight,
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[8],
    borderRadius: Borders.radius.sm,
    marginLeft: Spacing[10],
  },
  cardButtonText: {
    color: Colors.light.accent,
    fontSize: Typography.label.size,
    fontWeight: Typography.label.weight,
  },

  coinOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#B9770E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  coinInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F7E58B',
  },

  fab: {
    position: 'absolute',
    right: Spacing[20],
    bottom: Spacing[24],
    width: 64,
    height: 64,
    borderRadius: Borders.radius.lg,
    backgroundColor: Colors.light.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },

  fabText: {
    color: Colors.light.textInverse,
    fontSize: 34,
    fontWeight: '300',
    marginTop: -2,
  },
});