# 🧹 Cómo Limpiar Cache para Solucionar el Error de Privy

## El Error que Estás Viendo

```
Uncaught TypeError: i is not iterable
🌐 Current Domain: https://www.auktrafi.xyz
Make sure this domain is added to Privy Dashboard → Settings → Allowed Domains
```

## ✅ Pasos para Limpiar Cache

### Opción 1: Hard Refresh (Más Rápido)

**Chrome/Edge:**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Firefox:**
- Windows: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Opción 2: Limpiar Cache Completo

**Chrome:**
1. Presiona `F12` para abrir DevTools
2. Click derecho en el botón de refresh (↻)
3. Selecciona **"Empty Cache and Hard Reload"**

**O manualmente:**
1. `Ctrl/Cmd + Shift + Delete`
2. Selecciona **"Cached images and files"**
3. Time range: **Last hour**
4. Click **Clear data**

### Opción 3: Ventana Incógnito (Recomendado)

1. Abre ventana incógnito: `Ctrl/Cmd + Shift + N`
2. Ve a: `https://www.auktrafi.xyz`
3. Prueba login

Si funciona en incógnito, es 100% problema de cache.

### Opción 4: Limpiar Service Workers

1. Presiona `F12`
2. Ve a **Application** tab
3. Click en **Service Workers** (sidebar izquierdo)
4. Click **Unregister** en todos
5. Click en **Clear storage**
6. Recarga la página

## ⏱️ Esperar Cache de Privy

Después de agregar el dominio en Privy Dashboard:
- **Espera mínimo 2-3 minutos**
- En algunos casos hasta **5 minutos**
- Privy necesita actualizar su CDN global

## 🔄 Si Aún No Funciona

### Verificar Configuración de Privy

1. Ve a: https://dashboard.privy.io
2. Configuration → App settings → Basic configuration
3. Verifica que tengas:

**Allowed domains:**
```
www.auktrafi.xyz
auktrafi.xyz
localhost:3000
```

**Allowed origins:**
```
https://www.auktrafi.xyz
https://auktrafi.xyz
http://localhost:3000
```

4. Si falta alguno, agrégalo
5. Guarda
6. **Espera 5 minutos completos**
7. Limpia cache y recarga

### Trigger Redeploy en Vercel

A veces el código nuevo no está deployado:

```bash
cd /Users/williammartinez/digitalhouse/digitalhouse-frontend
git commit --allow-empty -m "force redeploy to fix privy"
git push
```

Espera 2-3 minutos para que Vercel termine el deployment.

## 🎯 Checklist Final

- [ ] Dominio agregado en "Allowed domains" (sin https://)
- [ ] Dominio agregado en "Allowed origins" (con https://)
- [ ] Guardado en Privy Dashboard
- [ ] Esperado 5 minutos
- [ ] Limpiado cache del browser (Hard refresh)
- [ ] Probado en ventana incógnito
- [ ] Si es necesario, trigger redeploy en Vercel

## ✅ Cómo Saber que Funcionó

En la Console (F12) deberías ver:
```
✅ Privy App ID configured
🌐 Current Domain: https://www.auktrafi.xyz
✅ Base Account SDK Initialized
(Sin error "i is not iterable")
```

Y el modal de Privy debería abrirse al hacer click en "Connect with Passkey".

---

## 🚨 Si NADA de Esto Funciona

Comparte:
1. Screenshot de Privy Dashboard → Allowed Domains
2. Screenshot de Privy Dashboard → Allowed Origins
3. Screenshot de Console (F12) con todos los errores
4. Hora exacta cuando agregaste el dominio en Privy

Y te ayudaré a diagnosticar el problema específico.

