# Sadhana (Flutter)

Base architecture para una app móvil multiplataforma (Android/iOS) enfocada en ciclos espirituales, tareas diarias y rachas.

## Stack
- Flutter + Dart
- Riverpod (estado)
- Hive (persistencia local; hooks preparados)
- flutter_local_notifications + workmanager (Android) + background fetch (iOS plan)

## Estructura
- `lib/core`
- `lib/data`
  - `models`
  - `repositories`
  - `datasources`
- `lib/features`
  - `cycles`
  - `tasks`
  - `dashboard`
  - `streaks`
  - `calendar`
  - `notifications`

## Reglas implementadas
1. No eliminar tareas en ciclo activo (`TaskService.delete`).
2. No editar sankalpa después de iniciar (`CycleService.update`).
3. Cierre automático del día a las 23:59 vía `DayClosureService` (listo para scheduler).
4. Cálculo de racha actual/máxima en `StreakService`.

## Cómo descargar el código
### Opción 1: clonar el repositorio
```bash
git clone <URL_DEL_REPO>
cd <NOMBRE_DEL_REPO>/sadhana
```

### Opción 2: generar un ZIP del proyecto `sadhana`
Desde la raíz del repositorio ejecuta:
```bash
bash sadhana/scripts/export_sadhana.sh
```
El script crea un archivo `sadhana_YYYYMMDD_HHMMSS.zip` en el directorio actual.

Si quieres elegir otra carpeta de salida:
```bash
bash sadhana/scripts/export_sadhana.sh /ruta/de/salida
```

### Opción 3: crear una carpeta única con todo el código
Desde la raíz del repositorio ejecuta:
```bash
bash sadhana/scripts/prepare_download_folder.sh
```
Esto crea la carpeta `sadhana_descarga/` (con todos los archivos del proyecto en un solo lugar).

Si quieres otro destino:
```bash
bash sadhana/scripts/prepare_download_folder.sh /ruta/de/mi/carpeta
```

## Build y tests
```bash
flutter pub get
flutter analyze
flutter test --coverage
flutter test
flutter build apk
flutter build ios
```

## Cobertura
Objetivo recomendado: `>=70%` combinando unit tests y widget tests.
