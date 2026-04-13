import { db } from '@/db';
import { colecciones, fotos_pieza, piezas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Borders, Shadows } from '@/constants/theme';

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
          placeholderTextColor={Colors.light.textTertiary}
        />
      </View>
    </View>
  );
}

export default function NewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const rawCreate = Array.isArray(params.create) ? params.create[0] : params.create;

  const piezaId = rawId ? Number(rawId) : null;
  const creando = !!rawCreate;
  const editando = piezaId !== null && !creando;

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [pais, setPais] = useState('');
  const [anio, setAnio] = useState('');
  const [valor, setValor] = useState('');
  const [material, setMaterial] = useState('');
  const [estado, setEstado] = useState('');
  const [rareza, setRareza] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [tieneError, setTieneError] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  const [coleccionId, setColeccionId] = useState('');
  const [collections, setCollections] = useState<{ id: number; nombre: string | null }[]>([]);
  const [showColecModal, setShowColecModal] = useState(false);
  const [nuevaColeccionNombre, setNuevaColeccionNombre] = useState('');

  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoId, setFotoId] = useState<number | null>(null);

  const resetFormulario = useCallback(() => {
    setTitulo('');
    setTipo('');
    setPais('');
    setAnio('');
    setValor('');
    setMaterial('');
    setEstado('');
    setRareza('');
    setCantidad('1');
    setTieneError(false);
    setObservaciones('');
    setColeccionId('');
    setFotoUri(null);
    setFotoId(null);
  }, []);

  const cargarColecciones = useCallback(async () => {
    try {
      const res = await db.select().from(colecciones);
      setCollections(res as { id: number; nombre: string | null }[]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    cargarColecciones();
  }, [cargarColecciones]);

  useFocusEffect(
    useCallback(() => {
      if (creando) {
        resetFormulario();
      }
    }, [creando, resetFormulario])
  );

  useEffect(() => {
    const cargar = async () => {
      if (!editando || piezaId === null) return;

      const res = await db.select().from(piezas).where(eq(piezas.id, piezaId));
      const p = res[0] as any;

      if (!p) {
        resetFormulario();
        return;
      }

      setTitulo(p.titulo || '');
      setTipo(p.tipo || '');
      setPais(p.pais || '');
      setAnio(p.anio ? String(p.anio) : '');
      setValor(p.valor_facial || '');
      setMaterial(p.material || '');
      setEstado(p.estado_conservacion || '');
      setRareza(p.rareza || '');
      setCantidad(p.cantidad ? String(p.cantidad) : '1');
      setTieneError(Boolean(p.tiene_error));
      setObservaciones(p.observaciones || '');
      setColeccionId(p.coleccion_id ? String(p.coleccion_id) : '');

      const fotos = await db.select().from(fotos_pieza).where(eq(fotos_pieza.pieza_id, piezaId));
      if (fotos.length > 0) {
        const principal = (fotos as any[]).find((f) => f.es_principal === 1) ?? fotos[0];
        setFotoUri((principal as any).uri_local || null);
        setFotoId((principal as any).id ?? null);
      } else {
        setFotoUri(null);
        setFotoId(null);
      }
    };

    cargar();
  }, [piezaId, editando, resetFormulario]);

  const nombreColeccionSeleccionada = useMemo(() => {
    if (!coleccionId) return 'Seleccionar colección';
    return (
      collections.find((c) => String(c.id) === coleccionId)?.nombre ??
      `Colección ${coleccionId}`
    );
  }, [coleccionId, collections]);

  const elegirDeGaleria = async () => {
    try {
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

      await FileSystem.copyAsync({
        from: asset.uri,
        to: newPath,
      });

      setFotoUri(newPath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const crearColeccion = async () => {
    const nombre = nuevaColeccionNombre.trim();

    if (!nombre) {
      Alert.alert('Error', 'Escribe un nombre para la colección.');
      return;
    }

    try {
      const now = Date.now();

      await db.insert(colecciones).values({
        nombre,
        descripcion: null,
        fecha_creacion: now,
        activa: 1,
      });

      const res = await db.select().from(colecciones);
      const nuevas = res as { id: number; nombre: string | null }[];
      setCollections(nuevas);

      const creada = nuevas.find((c) => c.nombre === nombre);
      if (creada) {
        setColeccionId(String(creada.id));
      }

      setNuevaColeccionNombre('');
      setShowColecModal(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear la colección.');
    }
  };

  const validar = () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio.');
      return false;
    }

    if (
      anio &&
      (isNaN(Number(anio)) || Number(anio) < 0 || Number(anio) > new Date().getFullYear() + 1)
    ) {
      Alert.alert('Error', 'El año no es válido.');
      return false;
    }

    if (cantidad && (isNaN(Number(cantidad)) || Number(cantidad) < 1)) {
      Alert.alert('Error', 'La cantidad debe ser 1 o superior.');
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validar()) return;

    const now = Date.now();

    try {
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
            tiene_error: tieneError ? 1 : 0,
            observaciones: observaciones.trim() || null,
            coleccion_id: coleccionId ? Number(coleccionId) : null,
            fecha_actualizacion: now,
          })
          .where(eq(piezas.id, piezaId));

        if (fotoUri) {
          if (fotoId) {
            await db
              .update(fotos_pieza)
              .set({
                uri_local: fotoUri,
                origen: 'galeria',
                es_principal: 1,
                fecha_captura: now,
              })
              .where(eq(fotos_pieza.id, fotoId));
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
          tiene_error: tieneError ? 1 : 0,
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
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar.');
    }
  };

  const eliminar = async () => {
    if (!editando || piezaId === null) return;

    Alert.alert('Eliminar pieza', '¿Seguro que quieres eliminar esta pieza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await db.delete(piezas).where(eq(piezas.id, piezaId));
            router.back();
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo eliminar.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Alta y edición</Text>
            <Text style={styles.headerSubtitle}>Ficha numismática</Text>
          </View>

          <View style={styles.photoCard}>
            <View style={styles.photoRow}>
              <View style={styles.photoColumn}>
                <View style={styles.photoPlaceholder}>
                  {fotoUri ? (
                    <Image source={{ uri: fotoUri }} style={styles.photoPreview} />
                  ) : (
                    <MonedaGrande />
                  )}
                </View>
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

          <Campo
            label="Título"
            hint="Nombre identificativo de la pieza"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Campo
            label="Tipo"
            hint="Ejemplo: moneda, billete, conmemorativa"
            value={tipo}
            onChangeText={setTipo}
          />

          <Campo
            label="País"
            hint="Ejemplo: España"
            value={pais}
            onChangeText={setPais}
          />

          <Campo
            label="Año"
            hint="Ejemplo: 1992"
            value={anio}
            onChangeText={setAnio}
            keyboardType="numeric"
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Colección</Text>
            <Text style={styles.fieldHint}>Selecciona una colección existente</Text>
            <TouchableOpacity
              style={styles.inputShell}
              onPress={() => setShowColecModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.inputText}>{nombreColeccionSeleccionada}</Text>
            </TouchableOpacity>
          </View>

          <Campo
            label="Valor facial"
            hint="Ejemplo: 200 pesetas"
            value={valor}
            onChangeText={setValor}
          />

          <Campo
            label="Material"
            hint="Ejemplo: plata, cobre, níquel"
            value={material}
            onChangeText={setMaterial}
          />

          <Campo
            label="Estado"
            hint="Ejemplo: MBC"
            value={estado}
            onChangeText={setEstado}
          />

          <Campo
            label="Rareza"
            hint="Ejemplo: escasa, rara"
            value={rareza}
            onChangeText={setRareza}
          />

          <Campo
            label="Cantidad"
            hint="Número de ejemplares"
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="numeric"
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tiene error</Text>
            <Text style={styles.fieldHint}>
              Marca si la pieza presenta error de acuñación o impresión
            </Text>
            <View style={styles.switchShell}>
              <Text style={styles.switchText}>{tieneError ? 'Sí' : 'No'}</Text>
              <Switch value={tieneError} onValueChange={setTieneError} />
            </View>
          </View>

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

            <TouchableOpacity
              style={[styles.actionDeleteButton, !editando && styles.actionDisabled]}
              onPress={eliminar}
              disabled={!editando}
            >
              <Text style={styles.actionDeleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={showColecModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowColecModal(false)}
        >
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
                  placeholderTextColor={Colors.light.textTertiary}
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
                      <Text style={styles.modalItemText}>
                        {c.nombre ?? `Colección ${c.id}`}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowColecModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  container: {
    paddingHorizontal: Spacing[20],
    paddingTop: Spacing[16],
    paddingBottom: Spacing[36],
    backgroundColor: Colors.light.background,
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

  photoCard: {
    backgroundColor: Colors.light.background,
    borderRadius: Borders.radius.lg,
    padding: Spacing[16],
    marginBottom: Spacing[16],
    borderWidth: Borders.width.thin,
    borderColor: Colors.light.border,
  },

  photoRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing[14],
  },

  photoColumn: {
    flex: 1,
    justifyContent: 'center',
  },

  photoPlaceholder: {
    height: 138,
    borderRadius: Borders.radius.lg,
    backgroundColor: Colors.light.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  photoPreview: {
    width: '100%',
    height: '100%',
  },

  photoMetaColumn: {
    minHeight: 138,
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: Spacing[14],
  },

  photoText: {
    fontSize: Typography.body.size,
    fontWeight: Typography.label.weight,
    color: Colors.light.textPrimary,
  },

  photoButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: Borders.radius.md,
    paddingVertical: Spacing[12],
    paddingHorizontal: Spacing[16],
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoButtonText: {
    color: Colors.light.textInverse,
    fontWeight: Typography.label.weight,
    fontSize: Typography.label.size,
  },

  fieldGroup: {
    marginBottom: Spacing[10],
  },

  fieldLabel: {
    fontSize: Typography.label.size,
    color: Colors.light.textPrimary,
    marginBottom: Spacing[4],
    fontWeight: Typography.label.weight,
  },

  fieldHint: {
    fontSize: Typography.caption.size,
    color: Colors.light.textTertiary,
    marginBottom: Spacing[6],
  },

  inputShell: {
    backgroundColor: Colors.light.surface,
    borderRadius: Borders.radius.lg,
    borderWidth: Borders.width.thin,
    borderColor: Colors.light.borderStrong,
    paddingHorizontal: Spacing[14],
    paddingVertical: Spacing[10],
    justifyContent: 'center',
  },

  inputText: {
    fontSize: Typography.body.size,
    color: Colors.light.textPrimary,
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },

  observacionesShell: {
    minHeight: 72,
    alignItems: 'stretch',
  },

  observacionesInputText: {
    minHeight: 44,
  },

  switchShell: {
    backgroundColor: Colors.light.surface,
    borderRadius: Borders.radius.lg,
    borderWidth: Borders.width.thin,
    borderColor: Colors.light.borderStrong,
    paddingHorizontal: Spacing[14],
    paddingVertical: Spacing[10],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  switchText: {
    fontSize: Typography.body.size,
    color: Colors.light.textPrimary,
    fontWeight: Typography.label.weight,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing[14],
    marginTop: Spacing[16],
    marginBottom: Spacing[8],
  },

  actionSaveButton: {
    flex: 1,
    backgroundColor: Colors.light.accent,
    paddingVertical: Spacing[16],
    borderRadius: Borders.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionSaveButtonText: {
    color: Colors.light.textInverse,
    fontSize: Typography.body.size,
    fontWeight: '700',
  },

  actionDeleteButton: {
    flex: 1,
    backgroundColor: Colors.light.errorLight,
    paddingVertical: Spacing[16],
    borderRadius: Borders.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionDeleteButtonText: {
    color: Colors.light.error,
    fontSize: Typography.body.size,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[20],
  },

  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '70%',
    backgroundColor: Colors.light.background,
    borderRadius: Borders.radius.lg,
    padding: Spacing[16],
  },

  modalTitle: {
    fontSize: Typography.heading4.size,
    fontWeight: Typography.heading4.weight,
    color: Colors.light.textPrimary,
    marginBottom: Spacing[10],
  },

  createCollectionBox: {
    marginBottom: Spacing[14],
  },

  createCollectionLabel: {
    fontSize: Typography.label.size,
    fontWeight: Typography.label.weight,
    color: Colors.light.textPrimary,
    marginBottom: Spacing[8],
  },

  createCollectionInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: Borders.radius.md,
    borderWidth: Borders.width.thin,
    borderColor: Colors.light.borderStrong,
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[12],
    fontSize: Typography.body.size,
    color: Colors.light.textPrimary,
    marginBottom: Spacing[10],
  },

  createCollectionButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: Borders.radius.md,
    paddingVertical: Spacing[12],
    alignItems: 'center',
  },

  createCollectionButtonText: {
    color: Colors.light.textInverse,
    fontWeight: '700',
  },

  modalEmptyText: {
    paddingVertical: Spacing[12],
    color: Colors.light.textTertiary,
    fontSize: Typography.body.size,
  },

  modalItem: {
    paddingVertical: Spacing[14],
    borderBottomWidth: Borders.width.thin,
    borderBottomColor: Colors.light.backgroundSecondary,
  },

  modalItemText: {
    fontSize: Typography.bodyLarge.size,
    color: Colors.light.textPrimary,
  },

  modalCloseButton: {
    marginTop: Spacing[14],
    backgroundColor: Colors.light.accent,
    borderRadius: Borders.radius.md,
    paddingVertical: Spacing[14],
    alignItems: 'center',
  },

  modalCloseButtonText: {
    color: Colors.light.textInverse,
    fontWeight: '700',
    fontSize: Typography.body.size,
  },
});

export default function NewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const rawCreate = Array.isArray(params.create) ? params.create[0] : params.create;

  const piezaId = rawId ? Number(rawId) : null;
  const creando = !!rawCreate;
  const editando = piezaId !== null && !creando;

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [pais, setPais] = useState('');
  const [anio, setAnio] = useState('');
  const [valor, setValor] = useState('');
  const [material, setMaterial] = useState('');
  const [estado, setEstado] = useState('');
  const [rareza, setRareza] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [tieneError, setTieneError] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  const [coleccionId, setColeccionId] = useState('');
  const [collections, setCollections] = useState<{ id: number; nombre: string | null }[]>([]);
  const [showColecModal, setShowColecModal] = useState(false);
  const [nuevaColeccionNombre, setNuevaColeccionNombre] = useState('');

  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoId, setFotoId] = useState<number | null>(null);

  const resetFormulario = useCallback(() => {
    setTitulo('');
    setTipo('');
    setPais('');
    setAnio('');
    setValor('');
    setMaterial('');
    setEstado('');
    setRareza('');
    setCantidad('1');
    setTieneError(false);
    setObservaciones('');
    setColeccionId('');
    setFotoUri(null);
    setFotoId(null);
  }, []);

  const cargarColecciones = useCallback(async () => {
    try {
      const res = await db.select().from(colecciones);
      setCollections(res as { id: number; nombre: string | null }[]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    cargarColecciones();
  }, [cargarColecciones]);

  useFocusEffect(
    useCallback(() => {
      if (creando) {
        resetFormulario();
      }
    }, [creando, resetFormulario])
  );

  useEffect(() => {
    const cargar = async () => {
      if (!editando || piezaId === null) return;

      const res = await db.select().from(piezas).where(eq(piezas.id, piezaId));
      const p = res[0] as any;

      if (!p) {
        resetFormulario();
        return;
      }

      setTitulo(p.titulo || '');
      setTipo(p.tipo || '');
      setPais(p.pais || '');
      setAnio(p.anio ? String(p.anio) : '');
      setValor(p.valor_facial || '');
      setMaterial(p.material || '');
      setEstado(p.estado_conservacion || '');
      setRareza(p.rareza || '');
      setCantidad(p.cantidad ? String(p.cantidad) : '1');
      setTieneError(Boolean(p.tiene_error));
      setObservaciones(p.observaciones || '');
      setColeccionId(p.coleccion_id ? String(p.coleccion_id) : '');

      const fotos = await db.select().from(fotos_pieza).where(eq(fotos_pieza.pieza_id, piezaId));
      if (fotos.length > 0) {
        const principal = (fotos as any[]).find((f) => f.es_principal === 1) ?? fotos[0];
        setFotoUri((principal as any).uri_local || null);
        setFotoId((principal as any).id ?? null);
      } else {
        setFotoUri(null);
        setFotoId(null);
      }
    };

    cargar();
  }, [piezaId, editando, resetFormulario]);

  const nombreColeccionSeleccionada = useMemo(() => {
    if (!coleccionId) return 'Seleccionar colección';
    return (
      collections.find((c) => String(c.id) === coleccionId)?.nombre ??
      `Colección ${coleccionId}`
    );
  }, [coleccionId, collections]);

  const elegirDeGaleria = async () => {
    try {
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

      await FileSystem.copyAsync({
        from: asset.uri,
        to: newPath,
      });

      setFotoUri(newPath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const crearColeccion = async () => {
    const nombre = nuevaColeccionNombre.trim();

    if (!nombre) {
      Alert.alert('Error', 'Escribe un nombre para la colección.');
      return;
    }

    try {
      const now = Date.now();

      await db.insert(colecciones).values({
        nombre,
        descripcion: null,
        fecha_creacion: now,
        activa: 1,
      });

      const res = await db.select().from(colecciones);
      const nuevas = res as { id: number; nombre: string | null }[];
      setCollections(nuevas);

      const creada = nuevas.find((c) => c.nombre === nombre);
      if (creada) {
        setColeccionId(String(creada.id));
      }

      setNuevaColeccionNombre('');
      setShowColecModal(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear la colección.');
    }
  };

  const validar = () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio.');
      return false;
    }

    if (
      anio &&
      (isNaN(Number(anio)) || Number(anio) < 0 || Number(anio) > new Date().getFullYear() + 1)
    ) {
      Alert.alert('Error', 'El año no es válido.');
      return false;
    }

    if (cantidad && (isNaN(Number(cantidad)) || Number(cantidad) < 1)) {
      Alert.alert('Error', 'La cantidad debe ser 1 o superior.');
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validar()) return;

    const now = Date.now();

    try {
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
            tiene_error: tieneError ? 1 : 0,
            observaciones: observaciones.trim() || null,
            coleccion_id: coleccionId ? Number(coleccionId) : null,
            fecha_actualizacion: now,
          })
          .where(eq(piezas.id, piezaId));

        if (fotoUri) {
          if (fotoId) {
            await db
              .update(fotos_pieza)
              .set({
                uri_local: fotoUri,
                origen: 'galeria',
                es_principal: 1,
                fecha_captura: now,
              })
              .where(eq(fotos_pieza.id, fotoId));
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
          tiene_error: tieneError ? 1 : 0,
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
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar.');
    }
  };

  const eliminar = async () => {
    if (!editando || piezaId === null) return;

    Alert.alert('Eliminar pieza', '¿Seguro que quieres eliminar esta pieza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await db.delete(piezas).where(eq(piezas.id, piezaId));
            router.back();
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo eliminar.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Alta y edición</Text>
            <Text style={styles.headerSubtitle}>Ficha numismática</Text>
          </View>

          <View style={styles.photoCard}>
            <View style={styles.photoRow}>
              <View style={styles.photoColumn}>
                <View style={styles.photoPlaceholder}>
                  {fotoUri ? (
                    <Image source={{ uri: fotoUri }} style={styles.photoPreview} />
                  ) : (
                    <MonedaGrande />
                  )}
                </View>
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

          <Campo
            label="Título"
            hint="Nombre identificativo de la pieza"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Campo
            label="Tipo"
            hint="Ejemplo: moneda, billete, conmemorativa"
            value={tipo}
            onChangeText={setTipo}
          />

          <Campo
            label="País"
            hint="Ejemplo: España"
            value={pais}
            onChangeText={setPais}
          />

          <Campo
            label="Año"
            hint="Ejemplo: 1992"
            value={anio}
            onChangeText={setAnio}
            keyboardType="numeric"
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Colección</Text>
            <Text style={styles.fieldHint}>Selecciona una colección existente</Text>
            <TouchableOpacity
              style={styles.inputShell}
              onPress={() => setShowColecModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.inputText}>{nombreColeccionSeleccionada}</Text>
            </TouchableOpacity>
          </View>

          <Campo
            label="Valor facial"
            hint="Ejemplo: 200 pesetas"
            value={valor}
            onChangeText={setValor}
          />

          <Campo
            label="Material"
            hint="Ejemplo: plata, cobre, níquel"
            value={material}
            onChangeText={setMaterial}
          />

          <Campo
            label="Estado"
            hint="Ejemplo: MBC"
            value={estado}
            onChangeText={setEstado}
          />

          <Campo
            label="Rareza"
            hint="Ejemplo: escasa, rara"
            value={rareza}
            onChangeText={setRareza}
          />

          <Campo
            label="Cantidad"
            hint="Número de ejemplares"
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="numeric"
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tiene error</Text>
            <Text style={styles.fieldHint}>
              Marca si la pieza presenta error de acuñación o impresión
            </Text>
            <View style={styles.switchShell}>
              <Text style={styles.switchText}>{tieneError ? 'Sí' : 'No'}</Text>
              <Switch value={tieneError} onValueChange={setTieneError} />
            </View>
          </View>

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

            <TouchableOpacity
              style={[styles.actionDeleteButton, !editando && styles.actionDisabled]}
              onPress={eliminar}
              disabled={!editando}
            >
              <Text style={styles.actionDeleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={showColecModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowColecModal(false)}
        >
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
                      <Text style={styles.modalItemText}>
                        {c.nombre ?? `Colección ${c.id}`}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowColecModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

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

  photoPreview: {
    width: '100%',
    height: '100%',
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
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },

  observacionesShell: {
    minHeight: 72,
    alignItems: 'stretch',
  },

  observacionesInputText: {
    minHeight: 44,
  },

  switchShell: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  switchText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  createCollectionBox: {
    marginBottom: 14,
  },

  createCollectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },

  createCollectionInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 10,
  },

  createCollectionButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  createCollectionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  modalEmptyText: {
    paddingVertical: 12,
    color: '#6B7280',
    fontSize: 15,
  },

  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },

  modalItemText: {
    fontSize: 16,
    color: '#1F2937',
  },

  modalCloseButton: {
    marginTop: 14,
    backgroundColor: '#2FC28B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalCloseButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  });