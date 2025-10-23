# 🔐 Configuración de Dominios en Privy Dashboard

## 🎯 Tu Error Específico

```
🌐 Current Domain: https://www.auktrafi.xyz
Make sure this domain is added to Privy Dashboard → Settings → Allowed Domains
```

## ✅ Solución: Configurar Dominios en Privy

### Paso 1: Ir a Privy Dashboard

🔗 https://dashboard.privy.io

### Paso 2: Navegar a Configuración

```
Dashboard → Tu App → Settings → Basic configuration
```

### Paso 3: Agregar Dominios Permitidos

En la sección **"Allowed domains"**, agrega:

```
localhost:3000
www.auktrafi.xyz
auktrafi.xyz
*.vercel.app
```

### ⚠️ IMPORTANTE: Formato Correcto

```
✅ CORRECTO:
- www.auktrafi.xyz
- auktrafi.xyz
- localhost:3000

❌ INCORRECTO:
- https://www.auktrafi.xyz    (NO incluir https://)
- http://localhost:3000        (NO incluir http://)
- www.auktrafi.xyz/           (NO incluir slash final)
```

## 📋 Configuración Completa para auktrafi.xyz

### Allowed Domains
```
localhost:3000
localhost:3001
www.auktrafi.xyz
auktrafi.xyz
auktrafi-frontend.vercel.app
*.vercel.app
```

### Redirect URIs (Settings → Embedded wallets)
```
http://localhost:3000
https://www.auktrafi.xyz
https://auktrafi.xyz
https://auktrafi-frontend.vercel.app
```

## 🔑 Sobre el App Secret

### ❌ NO lo necesitas en el frontend

El **App Secret** es SOLO para backend/servidor:
- ❌ NO lo agregues a `.env.local`
- ❌ NO lo uses en variables `NEXT_PUBLIC_*`
- ❌ NO lo expongas en el código del frontend

### ✅ Solo necesitas el App ID

```env
# .env.local (Vercel Environment Variables)
NEXT_PUBLIC_PRIVY_APP_ID=cmgsuc7ao011cl80ckoxcd775
```

El App ID es público y seguro de exponer.

## 🎨 Configuración de Login Methods

### Métodos Actuales Habilitados
```typescript
loginMethods: ['email', 'wallet', 'google', 'passkey']
```

### Para Agregar Farcaster y Telegram

1. Ve a Privy Dashboard → **Settings** → **Login methods**
2. Encuentra **Farcaster** y click en **Enable**
3. Sigue el wizard de configuración
4. Repite para **Telegram**
5. Una vez habilitados, puedes agregar al código:

```typescript
loginMethods: ['email', 'wallet', 'google', 'passkey', 'farcaster', 'telegram']
```

## 🐛 Debug del Error

Tu error específico:
```
Uncaught TypeError: i is not iterable
```

Este error era causado por:
1. ❌ Typo: `'users-without-wallet '` (espacio extra)
2. ❌ Login methods no habilitados: `'farcaster'`, `'telegram'`
3. ❌ Dominio no agregado en Privy

### ✅ Ya Corregido:
- Typo arreglado: `'users-without-wallets'`
- Métodos removidos hasta que los habilites
- Logo actualizado a: `https://public.ekinoxis.com/logo.png`

## 📝 Checklist Final

Antes de que funcione, verifica:

### En Privy Dashboard:
- [ ] `www.auktrafi.xyz` agregado en Allowed Domains
- [ ] `auktrafi.xyz` agregado en Allowed Domains
- [ ] `*.vercel.app` agregado en Allowed Domains
- [ ] Redirect URIs configurados
- [ ] Login methods habilitados (email, wallet, google, passkey)

### En Vercel:
- [ ] Variable `NEXT_PUBLIC_PRIVY_APP_ID` configurada
- [ ] Re-deployado después de los cambios

### En el Código:
- [x] Typo corregido (ya hecho)
- [x] Login methods ajustados (ya hecho)
- [x] Logo actualizado (ya hecho)

## 🚀 Después de Configurar

1. **Guarda los cambios en Privy Dashboard**
2. **Espera 1-2 minutos** (cache de Privy)
3. **Refresca tu app**: `https://www.auktrafi.xyz`
4. **Limpia cache del browser**: Ctrl+Shift+R (o Cmd+Shift+R en Mac)
5. **Prueba conectar wallet**

## 🎯 Test de Conexión

Si todo está bien, deberías ver en Console (F12):
```
✅ Privy App ID configured
🌐 Current Domain: https://www.auktrafi.xyz
✅ (No error de "not iterable")
```

Y el botón "Connect with Passkey" debería abrir el modal de Privy.

## 📞 Si Aún No Funciona

Comparte:
1. Screenshot de Privy Dashboard → Allowed Domains
2. Screenshot de Console (F12) con errores
3. URL exacta de tu app

---

## 🎉 Resumen Rápido

1. **Privy Dashboard** → Settings → Allowed Domains → Agregar `www.auktrafi.xyz`
2. **Privy Dashboard** → Settings → Allowed Domains → Agregar `auktrafi.xyz`
3. **Guardar** y esperar 1-2 minutos
4. **Refrescar** tu app
5. **Probar** conectar wallet

¡Eso debería solucionar el problema! 🚀

