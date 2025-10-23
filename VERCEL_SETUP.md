# 🚀 Vercel Deployment Setup Guide

## ⚠️ Problema: Privy no conecta en Vercel

### Solución Paso a Paso

## 1️⃣ Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel:
1. Dashboard → Tu Proyecto → **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

```env
# REQUERIDO
NEXT_PUBLIC_PRIVY_APP_ID=tu_privy_app_id_aqui

# OPCIONAL (mejora performance)
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/tu-api-key
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/tu-api-key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/tu-api-key
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/tu-api-key
```

**IMPORTANTE**: Todas deben estar en **Production**, **Preview** y **Development**

## 2️⃣ Configurar Dominios en Privy Dashboard

### Ir a Privy Dashboard
🔗 https://dashboard.privy.io

### Pasos:
1. Selecciona tu App
2. Ve a **Settings** → **Basic**
3. En **Allowed Domains**, agrega:

```
localhost:3000
localhost:3001
localhost:3002
tu-proyecto.vercel.app
tu-proyecto-*.vercel.app  (para preview deployments)
tu-dominio-personalizado.com  (si tienes)
```

### Formato correcto:
```
✅ Correcto:
- localhost:3000
- auktrafi-frontend.vercel.app
- *.vercel.app

❌ Incorrecto:
- http://localhost:3000  (no incluir http://)
- https://auktrafi-frontend.vercel.app  (no incluir https://)
```

## 3️⃣ Configurar Redirect URIs

En **Settings** → **Login Methods**:

Agrega estas redirect URIs:
```
http://localhost:3000
http://localhost:3001
http://localhost:3002
https://tu-proyecto.vercel.app
https://tu-proyecto-*.vercel.app
```

## 4️⃣ Verificar Login Methods Habilitados

En **Settings** → **Login Methods**, asegúrate que estén habilitados:
- ✅ Email
- ✅ Wallet
- ✅ Google (OAuth configurado)
- ✅ Passkeys

## 5️⃣ Verificar CORS Settings

En **Settings** → **API**:
- **Allow all origins**: ✅ Habilitado (para desarrollo)
- O agregar tus dominios específicos

## 6️⃣ Re-deployar en Vercel

Después de configurar todo:

```bash
# Opción 1: Desde Vercel Dashboard
Dashboard → Deployments → ... → Redeploy

# Opción 2: Hacer un push
git commit --allow-empty -m "trigger vercel redeploy"
git push
```

## 7️⃣ Verificar Errores en Browser Console

Abre tu app en Vercel y presiona **F12** → **Console**

Busca errores como:
```
❌ "Privy: domain not allowed"
❌ "Privy: invalid app id"
❌ "Network request failed"
```

## 8️⃣ Checklist de Verificación

### En Vercel:
- [ ] Variable `NEXT_PUBLIC_PRIVY_APP_ID` está configurada
- [ ] Variables están en Production, Preview y Development
- [ ] Proyecto re-deployado después de agregar variables

### En Privy Dashboard:
- [ ] Dominio de Vercel agregado en "Allowed Domains"
- [ ] Wildcards configurados (*.vercel.app)
- [ ] Redirect URIs configurados
- [ ] Login methods habilitados

### En Browser:
- [ ] No hay errores en Console (F12)
- [ ] Network tab muestra requests a privy.io
- [ ] Cookie settings permiten third-party cookies

## 🔍 Debug: Encontrar tu Dominio de Vercel

```bash
# Tu dominio es algo como:
https://auktrafi-frontend.vercel.app
https://auktrafi-frontend-git-main-usuario.vercel.app
https://auktrafi-frontend-xxxx.vercel.app
```

Copia el dominio exacto y agrégalo a Privy Dashboard.

## 🚨 Errores Comunes

### Error: "Domain not allowed"
**Solución**: Agregar dominio exacto en Privy Dashboard

### Error: "Invalid App ID"
**Solución**: Verificar que `NEXT_PUBLIC_PRIVY_APP_ID` es correcto en Vercel

### Error: "Network request failed"
**Solución**: 
1. Verificar conexión a internet
2. Revisar que Privy service está up: https://status.privy.io
3. Verificar CORS settings en Privy

### Login modal no aparece
**Solución**:
1. Limpiar cache del navegador
2. Probar en ventana incógnito
3. Verificar que `PrivyProvider` está en layout correcto

## 📝 Ejemplo de Configuración Correcta

### Vercel Environment Variables:
```
NEXT_PUBLIC_PRIVY_APP_ID=cmgsuc7ao011cl80ckoxcd775
```

### Privy Allowed Domains:
```
localhost:3000
auktrafi-frontend.vercel.app
auktrafi-frontend-git-main-ekinoxis-evm.vercel.app
*.vercel.app
```

### Privy Redirect URIs:
```
http://localhost:3000
https://auktrafi-frontend.vercel.app
https://*.vercel.app
```

## 🎯 Test de Conexión

Después de configurar, prueba:

1. **Desarrollo Local**:
```bash
npm run dev
# Visita http://localhost:3000
# Click en "Connect with Passkey"
```

2. **Vercel Production**:
```
# Visita https://tu-proyecto.vercel.app
# Click en "Connect with Passkey"
# Debe abrir modal de Privy
```

## 📞 Soporte

Si el problema persiste:

1. **Privy Support**: https://privy.io/support
2. **Vercel Support**: https://vercel.com/support
3. **GitHub Issues**: Reporta el issue con:
   - URL de tu proyecto
   - Screenshot del error en Console
   - Configuración de Privy Dashboard

## 🔧 Script de Diagnóstico

Agrega esto temporalmente en tu código para debug:

```typescript
// En src/providers/PrivyProvider.tsx
useEffect(() => {
  console.log('Privy App ID:', process.env.NEXT_PUBLIC_PRIVY_APP_ID)
  console.log('Current Domain:', window.location.origin)
}, [])
```

Revisa la console para verificar que el App ID está cargando correctamente.

---

## ✅ Solución Rápida (Resumen)

1. **Vercel**: Agregar `NEXT_PUBLIC_PRIVY_APP_ID` en Environment Variables
2. **Privy**: Agregar dominio de Vercel en "Allowed Domains"
3. **Vercel**: Re-deployar
4. **Browser**: Limpiar cache y probar

¡Esto debería resolver el 99% de los problemas de conexión! 🎉

