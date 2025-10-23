# 🔧 Configuración de App Client en Privy Dashboard

## ⚠️ Error Actual

```
Application error: a client-side exception has occurred while loading www.auktrafi.xyz
```

Este error típicamente ocurre por:
1. ❌ Allowed Origins no configurados correctamente
2. ❌ Dominio no agregado en Privy
3. ❌ Logo URL inválido (ya corregido)

## 🎯 Solución: Configurar App Client

Según la [documentación de Privy](https://docs.privy.io/basics/get-started/dashboard/app-clients), aunque los App Clients son **opcionales** para React SDK, configurarlos ayuda a resolver problemas de CORS y cookies.

### Paso 1: Ir a Privy Dashboard

🔗 https://dashboard.privy.io

### Paso 2: Navegar a App Settings

```
Configuration → App settings → Basics
```

### Paso 3: Configurar Allowed Origins

En **"Allowed origins"**, agrega:

```
http://localhost:3000
https://www.auktrafi.xyz
https://auktrafi.xyz
https://*.vercel.app
```

**Formato correcto:**
```
✅ https://www.auktrafi.xyz
✅ http://localhost:3000
✅ https://*.vercel.app

❌ www.auktrafi.xyz (falta https://)
❌ https://www.auktrafi.xyz/ (no incluir slash final)
```

### Paso 4: Configurar App Domain

En **"App domain"**, configura:
```
www.auktrafi.xyz
```

Esto habilita cookies HttpOnly automáticamente.

## 🍪 Configuración de Cookies (Opcional pero Recomendado)

### Habilitar HttpOnly Cookies

1. En **App settings → Basics**
2. Encuentra **"HttpOnly cookies"**
3. Activa el toggle
4. Configura **App domain**: `www.auktrafi.xyz`

**Beneficios:**
- ✅ Mayor seguridad
- ✅ Tokens no accesibles desde JavaScript
- ✅ Protección contra XSS

## 📝 Configuración Completa para auktrafi.xyz

### Settings → Basics

| Campo | Valor |
|-------|-------|
| **App domain** | `www.auktrafi.xyz` |
| **HttpOnly cookies** | ✅ Enabled |
| **Allowed origins** | Ver lista abajo ⬇️ |

### Allowed Origins (Lista Completa)
```
http://localhost:3000
http://localhost:3001
https://www.auktrafi.xyz
https://auktrafi.xyz
https://auktrafi-frontend.vercel.app
https://*.vercel.app
```

### Allowed Domains (Settings → Basic configuration)
```
localhost:3000
www.auktrafi.xyz
auktrafi.xyz
*.vercel.app
```

**Nota:** "Allowed domains" es diferente de "Allowed origins":
- **Allowed domains**: Sin `https://`
- **Allowed origins**: Con `https://`

## 🎨 Configuración del Logo

### Logo URL Correcto

El logo debe estar en una URL pública accesible:

**Opción 1: Usar tu dominio**
```typescript
logo: 'https://www.auktrafi.xyz/logo.png'
```

**Opción 2: Usar CDN público**
```typescript
logo: 'https://your-cdn.com/auktrafi-logo.png'
```

**Opción 3: Omitir (usar logo por defecto de Privy)**
```typescript
// Eliminar la línea del logo
appearance: {
  theme: 'light',
  accentColor: '#676FFF',
  walletChainType: 'ethereum-only',
},
```

### Agregar Logo a tu Proyecto

1. Coloca tu logo en `/public/logo.png`
2. Accederás a él en: `https://www.auktrafi.xyz/logo.png`
3. Actualiza la URL en el código

## 🔍 Debug del Error

### 1. Verificar en Browser Console

Presiona **F12** → **Console** y busca:

```javascript
// Error típico de CORS
❌ Access to fetch at 'https://auth.privy.io/...' from origin 'https://www.auktrafi.xyz' has been blocked by CORS policy

// Solución: Agregar www.auktrafi.xyz en Allowed Origins
```

### 2. Verificar Network Tab

**F12** → **Network** → Buscar requests a `privy.io`:
- ✅ Status 200: Bien
- ❌ Status 403/401: Problema de autenticación
- ❌ Status 0/CORS: Problema de Allowed Origins

### 3. Verificar Logo URL

Abre en navegador: `https://www.auktrafi.xyz/logo.png`
- ✅ Se carga: Bien
- ❌ 404: Logo no existe, usar otra URL o remover

## 📋 Checklist de Verificación

### En Privy Dashboard:
- [ ] Allowed origins incluye `https://www.auktrafi.xyz`
- [ ] Allowed domains incluye `www.auktrafi.xyz`
- [ ] App domain configurado: `www.auktrafi.xyz`
- [ ] HttpOnly cookies habilitado (recomendado)

### En tu Código:
- [x] Logo URL corregido (ya hecho)
- [ ] Logo existe en `/public/logo.png`

### En Vercel:
- [ ] Variable `NEXT_PUBLIC_PRIVY_APP_ID` configurada
- [ ] Proyecto re-deployado

## 🚀 Pasos para Solucionar

1. **Ve a Privy Dashboard**: https://dashboard.privy.io
2. **Settings → Basics → Allowed origins**
3. **Agrega**: `https://www.auktrafi.xyz`
4. **Save**
5. **Espera 1-2 minutos**
6. **Limpia cache**: Ctrl+Shift+R
7. **Refresca**: `https://www.auktrafi.xyz`
8. **Prueba login**

## 🎯 Alternativa: Crear App Client (Opcional)

Si quieres configuración más granular:

### Paso 1: Crear App Client
```
Configuration → App settings → Clients → Add app client
```

### Paso 2: Configurar
- **Name**: Production Web
- **Type**: Web
- **Allowed origins**: `https://www.auktrafi.xyz`
- **Session duration**: 30 days

### Paso 3: Usar Client ID en el Código

```typescript
<PrivyProvider
  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
  clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID} // Opcional
  config={{...}}
>
```

**Nota:** Para React SDK web, el **Client ID es opcional**.

## ⚡ Solución Rápida (Recomendada)

Si solo quieres que funcione rápido:

1. **Privy Dashboard** → Settings → Basics
2. **Allowed origins** → Agregar `https://www.auktrafi.xyz`
3. **Guardar**
4. **Esperar 2 minutos**
5. **Refrescar app**

## 📞 Si el Error Persiste

Comparte:
1. **Screenshot del error** en Console (F12)
2. **Screenshot de Privy Dashboard** (Allowed origins)
3. **URL exacta** donde ocurre el error
4. **Paso específico** donde falla (al abrir modal, al hacer login, etc.)

---

## 🎉 Resumen

**Problema**: Logo URL inválido + Allowed origins no configurado
**Solución**: 
1. ✅ Logo corregido a URL válida
2. ⏳ Agregar `https://www.auktrafi.xyz` en Allowed Origins
3. ⏳ Refrescar y probar

Una vez configurado, el login debería funcionar correctamente! 🚀

