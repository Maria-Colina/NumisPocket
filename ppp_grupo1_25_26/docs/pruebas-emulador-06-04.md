## 6. Pruebas de ejecución en emulador (06/04/2026)

### 6.1 Objetivo

Verificar el correcto funcionamiento inicial de la aplicación NumisPocket en entorno de desarrollo mediante emulador Android, comprobando que la aplicación arranca sin errores críticos y que la navegación base es operativa.

---

### 6.2 Entorno de pruebas

* **Dispositivo**: Emulador Android (Pixel 7)
* **Sistema operativo**: Android (emulado)
* **Framework**: Expo (React Native)
* **Herramientas utilizadas**:

  * Node.js
  * Expo CLI (`npx expo start`)
  * Android Studio (emulador)

---

### 6.3 Proceso de ejecución

1. Instalación de dependencias del proyecto:

   ```bash
   npm install
   ```

2. Arranque del servidor de desarrollo:

   ```bash
   npx expo start
   ```

3. Apertura del emulador Android:

   * Mediante tecla `a` en consola de Expo

4. Carga de la aplicación en el emulador

---

### 6.4 Incidencias detectadas

Durante las primeras ejecuciones se detectaron los siguientes problemas:

* Errores de resolución de módulos (`@/db`)
* Dependencias no instaladas:

  * `drizzle-orm`
  * `expo-image-picker`
  * `expo-file-system`
  * `expo-sqlite`
  * `react-native-svg`
* Problemas de rutas de importación en varios archivos
* Configuración incompleta del acceso a base de datos local

---

### 6.5 Correcciones aplicadas

Para solucionar las incidencias se realizaron las siguientes acciones:

* Sustitución de imports con alias (`@/...`) por rutas relativas
* Instalación de dependencias necesarias mediante:

  ```bash
  npx expo install expo-sqlite
  npx expo install expo-image-picker
  npx expo install expo-file-system
  npx expo install react-native-svg
  npm install drizzle-orm
  ```
* Ajuste de configuración del proyecto (`app.json`)
* Corrección de imports 
---

### 6.6 Resultado de las pruebas

Tras aplicar las correcciones:

* La aplicación **arranca correctamente en el emulador**
* No se producen errores críticos en tiempo de ejecución
* Se muestra la interfaz principal de la aplicación

Pantalla visible actualmente:

* Pantalla de listado inicial (estructura base)
* Barra inferior de navegación (tabs):

  * Inicio
  * Nueva
  * Stats

---

### 6.7 Limitaciones actuales

En esta fase inicial:

* El listado de piezas aún no está implementado 
* No se muestran datos reales en pantalla
* Algunas funcionalidades (alta, estadísticas, detalle) no están 
* La integración completa con base de datos está en desarrollo

---

### 6.8 Evidencia de funcionamiento

Se ha verificado visualmente:

* Correcto arranque de la aplicación
* Renderizado de la interfaz base
* Funcionamiento de la navegación inferior

(Se adjunta captura de pantalla del emulador como evidencia)

---

### 6.9 Conclusión

La aplicación alcanza un estado funcional básico que permite continuar con el desarrollo de las siguientes funcionalidades. El entorno de ejecución está correctamente configurado y preparado para avanzar hacia la implementación completa del sistema.
