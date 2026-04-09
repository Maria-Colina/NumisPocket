import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function MonedaGrande() {
  return (
    <View style={styles.coinOuter}>
      <View style={styles.coinInner} />
    </View>
  );
}

function CampoPreview({
  label,
  hint,
}: {
  label: string;
  hint?: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
      <View style={styles.inputShell}>
        <Text style={styles.inputText}>Pendiente de implementar</Text>
      </View>
    </View>
  );
}

export default function NewScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alta y edición</Text>
          <Text style={styles.headerSubtitle}>Ficha numismática</Text>
        </View>

        <View style={styles.photoCard}>
          <View style={styles.photoRow}>
            <View style={styles.photoColumn}>
              <View style={styles.photoPlaceholder}>
                <MonedaGrande />
              </View>
            </View>

            <View style={styles.photoColumn}>
              <View style={styles.photoMetaColumn}>
                <Text style={styles.photoText}>Añadir foto</Text>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={() => Alert.alert('Fase 1', 'La selección de imagen llegará después.')}
                >
                  <Text style={styles.photoButtonText}>Cámara / Galería</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <CampoPreview label="Título" hint="Nombre identificativo de la pieza" />
        <CampoPreview label="Tipo" hint="Ejemplo: moneda, billete, conmemorativa" />
        <CampoPreview label="País" hint="Ejemplo: España" />
        <CampoPreview label="Año" hint="Ejemplo: 1992" />
        <CampoPreview label="Colección" hint="Se habilitará más adelante" />
        <CampoPreview label="Valor facial" hint="Ejemplo: 200 pesetas" />
        <CampoPreview label="Material" hint="Ejemplo: plata, cobre, níquel" />
        <CampoPreview label="Estado" hint="Ejemplo: MBC" />
        <CampoPreview label="Rareza" hint="Ejemplo: escasa, rara" />
        <CampoPreview label="Cantidad" hint="Número de ejemplares" />
        <CampoPreview label="Tiene error" hint="Marcado más adelante con interruptor" />
        <CampoPreview label="Observaciones" hint="Notas libres de la pieza" />

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionSaveButton}
            onPress={() => Alert.alert('Fase 1', 'Guardar se conectará en fases posteriores.')}
          >
            <Text style={styles.actionSaveButtonText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionDeleteButton, styles.actionDisabled]}>
            <Text style={styles.actionDeleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2FC28B',
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#DDF7EC',
    fontSize: 13,
    marginTop: 4,
  },
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D8DCE3',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
  },
  photoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  photoPlaceholder: {
    height: 138,
    borderRadius: 20,
    backgroundColor: '#EAF4FB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoMetaColumn: {
    minHeight: 138,
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 14,
  },
  photoText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  photoButton: {
    backgroundColor: '#2FC28B',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#202020',
    marginBottom: 4,
    fontWeight: '500',
  },
  fieldHint: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  inputShell: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 15,
    color: '#111827',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  actionSaveButton: {
    flex: 1,
    backgroundColor: '#2FC28B',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionDeleteButton: {
    flex: 1,
    backgroundColor: '#F7DCDD',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDeleteButtonText: {
    color: '#A44D56',
    fontSize: 15,
    fontWeight: '600',
  },
  actionDisabled: {
    opacity: 0.45,
  },
  coinOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#B78110',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#986A0B',
  },
  coinInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F4D768',
    borderWidth: 2,
    borderColor: '#E6BE45',
  },
});