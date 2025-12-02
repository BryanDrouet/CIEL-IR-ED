# 🚀 Déploiement sur GitHub Pages + Vercel (Proxy)

## Architecture

```
GitHub Pages (Frontend)     →    Vercel (Proxy CORS)    →    EcoleDirecte API
  (votre-username.github.io)      (gratuit, serverless)       (api.ecoledirecte.com)
```

## 📋 Étape 1 : Déployer le proxy sur Vercel (5 min)

### A. Créer un compte Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **Sign Up**
3. Connectez-vous avec **GitHub** (recommandé)
4. Autorisez Vercel à accéder à votre GitHub

### B. Déployer le proxy

**Option A : Depuis le terminal (si vous avez installé Git)**

```bash
# Créer un nouveau dépôt pour le proxy
cd ..
mkdir ecoledirecte-proxy
cd ecoledirecte-proxy

# Copier les fichiers du proxy
copy "..\CIEL-IR-ED\api\proxy.js" "api\proxy.js"
copy "..\CIEL-IR-ED\vercel.json" "vercel.json"

# Initialiser Git
git init
git add .
git commit -m "Initial proxy setup"

# Créer un repo GitHub (via l'interface web)
# Puis pousser :
git remote add origin https://github.com/VOTRE_USERNAME/ecoledirecte-proxy.git
git push -u origin main
```

Ensuite sur **Vercel** :
1. Cliquez sur **New Project**
2. Sélectionnez votre repo `ecoledirecte-proxy`
3. Cliquez sur **Deploy**
4. Attendez 1 minute ⏱️
5. Notez l'URL : `https://ecoledirecte-proxy.vercel.app`

**Option B : Déploiement manuel (plus simple)**

1. Sur **Vercel**, cliquez sur **New Project**
2. Choisissez **Import Git Repository**
3. OU cliquez sur **Deploy from template** et choisissez **Blank**
4. Uploadez manuellement :
   - Le dossier `api/` avec `proxy.js`
   - Le fichier `vercel.json`
5. Cliquez sur **Deploy**
6. Notez l'URL donnée par Vercel

---

## 📋 Étape 2 : Configurer l'application (1 min)

### Modifier `config.js`

Ouvrez `config.js` et remplacez :

```javascript
window.PROXY_URL = null;
```

Par (avec VOTRE URL Vercel) :

```javascript
window.PROXY_URL = 'https://ecoledirecte-proxy.vercel.app/api';
```

**Exemple complet :**
```javascript
// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBF0tLmeQTCW9HU4-RlVlFYBl_N-WMOK1s",
    authDomain: "ciel-ir-ed.firebaseapp.com",
    projectId: "ciel-ir-ed",
    storageBucket: "ciel-ir-ed.firebasestorage.app",
    messagingSenderId: "519195409240",
    appId: "1:519195409240:web:322d1bf78460b0b957032d"
};

window.firebaseConfig = firebaseConfig;
window.PROXY_URL = 'https://ecoledirecte-proxy.vercel.app/api'; // ← Votre URL ici
```

---

## 📋 Étape 3 : Déployer sur GitHub Pages (3 min)

### A. Créer un dépôt GitHub

1. Allez sur **https://github.com/new**
2. Nom du dépôt : `ecoledirecte-dashboard`
3. **Public** (obligatoire pour GitHub Pages gratuit)
4. Ne cochez rien d'autre
5. Cliquez sur **Create repository**

### B. Pousser votre code

```bash
cd "c:\Users\bdrouet\OneDrive - Saint Gabriel-Saint Michel\CIEL-IR-ED"

# Initialiser Git
git init
git add .
git commit -m "Initial commit"

# Lier au dépôt GitHub
git remote add origin https://github.com/VOTRE_USERNAME/ecoledirecte-dashboard.git
git branch -M main
git push -u origin main
```

### C. Activer GitHub Pages

1. Sur GitHub, allez dans votre dépôt
2. **Settings** → **Pages**
3. Source : **Deploy from a branch**
4. Branch : **main** / **root**
5. Cliquez sur **Save**
6. Attendez 2-3 minutes
7. Votre site est disponible sur : `https://VOTRE_USERNAME.github.io/ecoledirecte-dashboard/`

---

## ✅ Étape 4 : Tester

1. Ouvrez `https://VOTRE_USERNAME.github.io/ecoledirecte-dashboard/`
2. Connectez-vous avec vos identifiants EcoleDirecte
3. Vérifiez que tout fonctionne !

---

## 🔧 Dépannage

### "Failed to fetch"

- Vérifiez que `window.PROXY_URL` est bien configuré dans `config.js`
- Vérifiez que votre proxy Vercel est bien déployé
- Testez directement le proxy : `https://VOTRE-PROXY.vercel.app/api?path=login.awp`

### Erreur CORS persistante

- Assurez-vous que `vercel.json` est bien présent
- Redéployez le proxy sur Vercel
- Videz le cache du navigateur (Ctrl + Shift + Delete)

### Le site GitHub Pages ne se charge pas

- Attendez 5-10 minutes (GitHub Pages peut être lent)
- Vérifiez que le dépôt est **Public**
- Vérifiez dans Settings → Pages que le déploiement est actif

---

## 🎯 Résumé

1. ✅ Déployez le proxy sur **Vercel** (gratuit)
2. ✅ Notez l'URL : `https://VOTRE-PROXY.vercel.app/api`
3. ✅ Mettez l'URL dans `config.js` → `window.PROXY_URL`
4. ✅ Poussez sur **GitHub**
5. ✅ Activez **GitHub Pages**
6. ✅ Profitez !

---

## 💰 Coûts

- **GitHub Pages** : Gratuit (sites publics)
- **Vercel** : Gratuit (100GB bandwidth/mois)
- **Firebase** : Gratuit (jusqu'à 10K utilisateurs)

**Total : 0€** 🎉

---

## 🔒 Sécurité

### ⚠️ Important

Votre dépôt GitHub contient maintenant vos clés Firebase **EN CLAIR** !

Pour sécuriser :

1. Créez `.gitignore` avec :
```
config.local.js
```

2. Déplacez vos clés dans `config.local.js`

3. Utilisez GitHub Actions avec Secrets (voir `DEPLOY.md`)

**OU** acceptez que les clés soient publiques mais :
- Configurez les **règles Firestore** strictes
- Limitez les **domaines autorisés** dans Firebase
- Activez **App Check**

---

Besoin d'aide ? Consultez `DEPLOY.md` pour plus de détails.
