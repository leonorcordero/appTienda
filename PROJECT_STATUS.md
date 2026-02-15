# Estatus del proyecto (actual)

## Estado general
- **Operativo:** Sí (compila en producción con `npm run build`).
- **Arquitectura:** Frontend React + Vite con persistencia local en `localStorage`.
- **Cobertura de testing automatizado:** Aún no configurada (no hay script de `test` en `package.json`).

## Mejoras ya implementadas
- Login por roles con flujo de credenciales y **PIN administrativo** configurable por `VITE_ADMIN_PIN` (fallback `1234`).
- Persistencia de sesión (`selibre_auth`, `selibre_role`, `selibre_user_name`) y limpieza al cerrar sesión.
- Validaciones de ventas extraídas a un módulo reusable (`salesValidation.ts`) con chequeos de stock disponible, coherencia pagos+deuda y datos mínimos.
- Refactor parcial de sesión/autenticación a hook dedicado (`useSession.ts`) para reducir acoplamiento en `App.tsx`.
- Utilidad de fecha local (`getLocalDateISO`) aplicada para evitar desfases por zona horaria en formularios y movimientos.
- Mejora de inventario: alerta de **stock bajo** con umbral fijo.
- Limpieza de datos de app por claves (`clearAppData`) evitando `localStorage.clear()` global.

## Pendientes relevantes
- Configurar y ejecutar pruebas automatizadas (unitarias/integración).
- Continuar el refactor para desacoplar el CRUD de ventas/stock de `App.tsx` hacia hooks/servicios (la sesión ya fue extraída a `useSession.ts`).
- Backend/multiusuario/auditoría (actualmente la app sigue siendo local-first con `localStorage`).
- Mejoras de performance del bundle (Vite reporta chunk principal >500 kB).

## Riesgos / observaciones
- El warning de Vite por tamaño de chunks indica oportunidad de code-splitting.
- Al no existir test suite, la validación sigue centrada en build + pruebas manuales.

## Recomendación siguiente iteración
1. Incorporar Vitest + React Testing Library con casos críticos de ventas/stock.
2. Mover lógica de autenticación/sesión y CRUD de ventas a hooks (`useAuth`, `useSales`).
3. Plan de fase backend (si se requiere operación multiusuario real).
