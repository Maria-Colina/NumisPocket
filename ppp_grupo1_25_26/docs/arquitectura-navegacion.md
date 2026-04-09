# Arquitectura por capas y flujo de navegación: NumisPocket

## 1. Objetivo
Definir la organización técnica de NumisPocket y el flujo de navegación entre sus pantallas principales.

---

## 2. Arquitectura por capas

### 2.1 Capa de presentación
Responsable de las pantallas, layouts, navegación y componentes visuales que interactúan con el usuario.
* **Incluye:** Pantallas en `src/app`, navegación mediante Expo Router y componentes visuales reutilizables.

### 2.2 Capa de lógica
Responsable de coordinar acciones de la aplicación, gestionar eventos y conectar la interfaz con los datos.
* **Incluye:** Gestión de eventos de usuario, validaciones básicas y coordinación entre UI y base de datos.

### 2.3 Capa de datos
Responsable del acceso a la base de datos local, el esquema SQLite y la persistencia mediante Drizzle.
* **Incluye:** Definición de esquemas, consultas a SQLite y persistencia local de datos.

---

## 3. Flujo de navegación
La navegación principal de NumisPocket se organiza alrededor de una vista de listado desde la que el usuario puede consultar piezas, acceder al formulario de alta/edición, entrar al detalle de una pieza y revisar estadísticas generales.

* **3.1 Pantalla de listado:** Es el punto de entrada principal de la aplicación. Desde aquí se muestran las piezas registradas y se ofrecen accesos a otras secciones.
* **3.2 Alta y edición:** Desde el listado, el usuario puede abrir el formulario para registrar una nueva pieza. Ese mismo formulario puede reutilizarse posteriormente para editar registros existentes.
* **3.3 Detalle de pieza:** Cada pieza puede abrir una vista de detalle con su información completa, imágenes asociadas y posibles acciones de edición.
* **3.4 Estadísticas:** La aplicación incorpora una pantalla de estadísticas para mostrar métricas resumidas de la colección y apoyar la consulta general de datos.

### 3.5 Navegación general
El flujo principal previsto es:
* **Listado** -> Alta
* **Listado** -> Detalle
* **Detalle** -> Edición
* **Navegación por pestañas** -> Estadísticas

---

## 4. Relación entre capas

La capa de **presentación** recoge las acciones del usuario y muestra la información en pantalla. Esta capa no debe encargarse directamente de la persistencia de datos.

La capa de **lógica** actúa como intermediaria entre la interfaz y la base de datos. Su función es coordinar eventos, aplicar validaciones y decidir qué operaciones deben ejecutarse.

La capa de **datos** encapsula el acceso a SQLite mediante Drizzle, incluyendo esquema, consultas y persistencia local.

**El flujo técnico general es el siguiente:**
1. La interfaz captura una acción del usuario.
2. La lógica procesa la acción.
3. La capa de datos consulta o actualiza la base local.
4. El resultado vuelve a la interfaz para refrescar la pantalla.
