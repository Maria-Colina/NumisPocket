import { eq } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../src/db';
import { colecciones, fotos_pieza, piezas } from '../../src/db/schema';

function MonedaGrande() {
  return (
    <View style={styles.coinOuter}>
      <View style={styles.coinInner} />
    </View>
  );
}

function Campo({
  label,
  hint,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
}: {
  label: string;
  hint?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
      <View style={[styles.inputShell, multiline && styles.observacionesShell]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          underlineColorAndroid="transparent"
          style={[styles.inputText, multiline && styles.observacionesInputText]}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
}

export default function NewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const piezaId = rawId ? Number(rawId) : null;
  const editando = piezaId !== null;

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [pais, setPais] = useState('');
  const [anio, setAnio] = useState('');
  const [valor, setValor] = useState('');
  const [material, setMaterial] = useState('');
  const [estado, setEstado] = useState('');
  const [rareza, setRareza] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [observaciones, setObservaciones] = useState('');
  const [coleccionId, setColeccionId] = useState('');
  const [collections, setCollections] = useState<{ id: number; nombre: string | null }[]>([]);
  const [showColecModal, setShowColecModal] = useState(false);
  const [nuevaColeccionNombre, setNuevaColeccionNombre] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const cargarColecciones = useCallback(async () => {
    const res = await db.select().from(colecciones);
    setCollections(res as { id: number; nombre: string | null }[]);
  }, []);

  useEffect(() => {
    cargarColecciones();
  }, [cargarColecciones]);

  useEffect(() => {
    const cargar = async () => {
      if (!editando || piezaId === null) return;

      const res = await db.select().from(piezas).where(eq(piezas.id, piezaId));
      const p = res[0] as any;

      if (!p) return;

      setTitulo(p.titulo || '');
      setTipo(p.tipo || '');
      setPais(p.pais || '');
      setAnio(p.anio ? String(p.anio) : '');
      setValor(p.valor_facial || '');
      setMaterial(p.material || '');
      setEstado(p.estado_conservacion || '');
      setRareza(p.rareza || '');
      setCantidad(p.cantidad ? String(p.cantidad) : '1');
      setObservaciones(p.observaciones || '');
      setColeccionId(p.coleccion_id ? String(p.coleccion_id) : '');

      const fotos = await db.select().from(fotos_pieza).where(eq(fotos_pieza.pieza_id, piezaId));
      if (fotos.length > 0) {
        const principal = (fotos as any[]).find((f) => f.es_principal === 1) ?? fotos[0];
        setFotoUri((principal as any).uri_local || null);
      }
    };

    cargar();
  }, [editando, piezaId]);

  const nombreColeccionSeleccionada = useMemo(() => {
    if (!coleccionId) return 'Seleccionar colección';
    return collections.find((c) => String(c.id) === coleccionId)?.nombre ?? `Colección ${coleccionId}`;
  }, [coleccionId, collections]);

  const elegirDeGaleria = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Debes permitir acceso a la galería.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (resultado.canceled) return;

    const asset = resultado.assets[0];
    const fileName = asset.uri.split('/').pop() ?? `foto_${Date.now()}.jpg`;
    const newPath = FileSystem.documentDirectory + fileName;

    await FileSystem.copyAsync({ from: asset.uri, to: newPath });
    setFotoUri(newPath);
  };

  const crearColeccion = async () => {
    const nombre = nuevaColeccionNombre.trim();

    if (!nombre) {
      Alert.alert('Error', 'Escribe un nombre para la colección.');
      return;
    }

    await db.insert(colecciones).values({
      nombre,
      descripcion: null,
      fecha_creacion: Date.now(),
      activa: 1,
    });

    const res = await db.select().from(colecciones);
    const nuevas = res as { id: number; nombre: string | null }[];
    setCollections(nuevas);

    const creada = nuevas.find((c) => c.nombre === nombre);
    if (creada) setColeccionId(String(creada.id));

    setNuevaColeccionNombre('');
    setShowColecModal(false);
  };

  const guardar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio.');
      return;
    }

    const now = Date.now();

    if (editando && piezaId !== null) {
      await db
        .update(piezas)
        .set({
          titulo: titulo.trim(),
          tipo: tipo.trim() || null,
          pais: pais.trim() || null,
          anio: anio ? Number(anio) : null,
          valor_facial: valor.trim() || null,
          material: material.trim() || null,
          estado_conservacion: estado.trim() || null,
          rareza: rareza.trim() || null,
          cantidad: cantidad ? Number(cantidad) : 1,
          observaciones: observaciones.trim() || null,
          coleccion_id: coleccionId ? Number(coleccionId) : null,
          fecha_actualizacion: now,
        })
        .where(eq(piezas.id, piezaId));

      if (fotoUri) {
        const fotos = await db.select().from(fotos_pieza).where(eq(fotos_pieza.pieza_id, piezaId));
        const fotoExistente = fotos[0] as any;

        if (fotoExistente) {
          await db
            .update(fotos_pieza)
            .set({ uri_local: fotoUri, origen: 'galeria', es_principal: 1, fecha_captura: now })
            .where(eq(fotos_pieza.id, fotoExistente.id));
        } else {
          await db.insert(fotos_pieza).values({
            pieza_id: piezaId,
            uri_local: fotoUri,
            origen: 'galeria',
            descripcion: null,
            es_principal: 1,
            fecha_captura: now,
          });
        }
      }
    } else {
      await db.insert(piezas).values({
        titulo: titulo.trim(),
        tipo: tipo.trim() || null,
        pais: pais.trim() || null,
        anio: anio ? Number(anio) : null,
        valor_facial: valor.trim() || null,
        material: material.trim() || null,
        estado_conservacion: estado.trim() || null,
        rareza: rareza.trim() || null,
        cantidad: cantidad ? Number(cantidad) : 1,
        observaciones: observaciones.trim() || null,
        coleccion_id: coleccionId ? Number(coleccionId) : null,
        fecha_alta: now,
      });

      const inserted = await db.select().from(piezas).where(eq(piezas.fecha_alta, now));
      const newId = inserted[0]?.id;

      if (newId && fotoUri) {
        await db.insert(fotos_pieza).values({
          pieza_id: newId,
          uri_local: fotoUri,
          origen: 'galeria',
          descripcion: null,
          es_principal: 1,
          fecha_captura: now,
        });
      }
    }

    router.back();
  };

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
              <View style={styles.photoPlaceholder}>{fotoUri ? <Image source={{ uri: fotoUri }} style={styles.photoPreview} /> : <MonedaGrande />}</View>
            </View>
            <View style={styles.photoColumn}>
              <View style={styles.photoMetaColumn}>
                <Text style={styles.photoText}>Añadir foto</Text>
                <TouchableOpacity style={styles.photoButton} onPress={elegirDeGaleria}>
                  <Text style={styles.photoButtonText}>Cámara / Galería</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <Campo label="Título" hint="Nombre identificativo de la pieza" value={titulo} onChangeText={setTitulo} />
        <Campo label="Tipo" hint="Ejemplo: moneda, billete, conmemorativa" value={tipo} onChangeText={setTipo} />
        <Campo label="País" hint="Ejemplo: España" value={pais} onChangeText={setPais} />
        <Campo label="Año" hint="Ejemplo: 1992" value={anio} onChangeText={setAnio} keyboardType="numeric" />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Colección</Text>
          <Text style={styles.fieldHint}>Selecciona una colección existente</Text>
          <TouchableOpacity style={styles.inputShell} onPress={() => setShowColecModal(true)}>
            <Text style={styles.inputText}>{nombreColeccionSeleccionada}</Text>
          </TouchableOpacity>
        </View>

        <Campo label="Valor facial" hint="Ejemplo: 200 pesetas" value={valor} onChangeText={setValor} />
        <Campo label="Material" hint="Ejemplo: plata, cobre, níquel" value={material} onChangeText={setMaterial} />
        <Campo label="Estado" hint="Ejemplo: MBC" value={estado} onChangeText={setEstado} />
        <Campo label="Rareza" hint="Ejemplo: escasa, rara" value={rareza} onChangeText={setRareza} />
        <Campo label="Cantidad" hint="Número de ejemplares" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" />

        <Campo
          label="Observaciones"
          hint="Detalles, errores de acuñación, notas..."
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
        />

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionSaveButton} onPress={guardar}>
            <Text style={styles.actionSaveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showColecModal} transparent animationType="fade" onRequestClose={() => setShowColecModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Colecciones</Text>
              <View style={styles.createCollectionBox}>
                <Text style={styles.createCollectionLabel}>Nueva colección</Text>
                <TextInput
                  value={nuevaColeccionNombre}
                  onChangeText={setNuevaColeccionNombre}
                  style={styles.createCollectionInput}
                  placeholder="Ejemplo: Monedas españolas"
                  placeholderTextColor="#6B7280"
                />
                <TouchableOpacity style={styles.createCollectionButton} onPress={crearColeccion}>
                  <Text style={styles.createCollectionButtonText}>Crear colección</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {collections.length === 0 ? (
                  <Text style={styles.modalEmptyText}>No hay colecciones todavía.</Text>
                ) : (
                  collections.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => {
                        setColeccionId(String(c.id));
                        setShowColecModal(false);
                      }}
                      style={styles.modalItem}
                    >
                      <Text style={styles.modalItemText}>{c.nombre ?? `Colección ${c.id}`}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowColecModal(false)}>
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#2FC28B', borderRadius: 22, paddingVertical: 20, paddingHorizontal: 18, marginBottom: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: '#DDF7EC', fontSize: 13, marginTop: 4 },
  photoCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#D8DCE3' },
  photoRow: { flexDirection: 'row', alignItems: 'stretch', gap: 14 },
  photoColumn: { flex: 1, justifyContent: 'center' },
  photoPlaceholder: { height: 138, borderRadius: 20, backgroundColor: '#EAF4FB', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  photoMetaColumn: { minHeight: 138, justifyContent: 'center', alignItems: 'stretch', gap: 14 },
  photoText: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  photoButton: { backgroundColor: '#2FC28B', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  photoButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  fieldGroup: { marginBottom: 10 },
  fieldLabel: { fontSize: 14, color: '#202020', marginBottom: 4, fontWeight: '500' },
  fieldHint: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  inputShell: { backgroundColor: '#F3F4F6', borderRadius: 16, borderWidth: 1, borderColor: '#D1D5DB', paddingHorizontal: 14, paddingVertical: 10, justifyContent: 'center' },
  inputText: { fontSize: 15, color: '#111827', padding: 0, margin: 0, backgroundColor: 'transparent' },
  observacionesShell: { minHeight: 72, alignItems: 'stretch' },
  observacionesInputText: { minHeight: 44 },
  switchShell: { backgroundColor: '#F3F4F6', borderRadius: 16, borderWidth: 1, borderColor: '#D1D5DB', paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchText: { fontSize: 15, color: '#111827', fontWeight: '500' },
  actionsRow: { flexDirection: 'row', gap: 14, marginTop: 16, marginBottom: 8 },
  actionSaveButton: { flex: 1, backgroundColor: '#2FC28B', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionSaveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '86%', maxHeight: '72%', backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: '#E5E7EB' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 12 },
  createCollectionBox: { backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, marginBottom: 12 },
  createCollectionLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
  createCollectionInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, fontSize: 14, color: '#111827' },
  createCollectionButton: { backgroundColor: '#2FC28B', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  createCollectionButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  modalItem: { paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalItemText: { fontSize: 15, color: '#111827' },
  modalEmptyText: { color: '#6B7280', fontSize: 14, marginTop: 8 },
  modalCloseButton: { marginTop: 14, backgroundColor: '#E5E7EB', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  modalCloseButtonText: { color: '#111827', fontWeight: '700' },
  coinOuter: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#B78110', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#986A0B' },
  coinInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F4D768', borderWidth: 2, borderColor: '#E6BE45' },
});