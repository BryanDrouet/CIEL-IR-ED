# Guide de déploiement Vercel - Étape par étape

## 🎯 Vous êtes sur Vercel, parfait !

Vous êtes ici : https://vercel.com/new?teamSlug=bryan-drouets-projects

## 📋 Étapes à suivre MAINTENANT

### Option A : Importer depuis GitHub (RECOMMANDÉ)

1. **Cliquez sur "Import Git Repository"**

2. **Autorisez Vercel à accéder à GitHub**
   - Cliquez sur "Add GitHub Account"
   - Autorisez l'accès

3. **Sélectionnez votre dépôt**
   - Cherchez : `BryanDrouet/CIEL-IR-ED`
   - Cliquez sur **Import**

4. **Configuration du projet**
   - Project Name : `ecoledirecte-proxy` (ou laissez par défaut)
   - Framework Preset : **Other**
   - Root Directory : `./` (racine)
   - Ne changez rien d'autre

5. **Cliquez sur "Deploy"**

6. **Attendez 30 secondes** ⏱️

7. **NOTEZ L'URL** qui s'affiche :
   ```
   https://ciel-ir-ed-XXXXXX.vercel.app
   ```

---

### Option B : Upload manuel (si Option A ne marche pas)

1. **Cliquez sur "Browse" ou "Upload"**

2. **Sélectionnez ces 2 fichiers** depuis votre PC :
   - `api/proxy.js`
   - `vercel.json`

3. **Cliquez sur "Deploy"**

4. **Notez l'URL**

---

## ✅ Une fois déployé

### Étape 1 : Testez le proxy

Ouvrez dans votre navigateur :
```
https://VOTRE-URL.vercel.app/api?path=login.awp
```

Vous devriez voir une réponse JSON (même si erreur, c'est normal sans identifiants).

### Étape 2 : Configurez l'application

1. **Ouvrez le fichier : `config.js`**

2. **Trouvez cette ligne** (vers la fin) :
   ```javascript
   window.PROXY_URL = null;
   ```

3. **Remplacez par** (avec VOTRE URL Vercel) :
   ```javascript
   window.PROXY_URL = 'https://VOTRE-URL.vercel.app/api';
   ```

4. **Sauvegardez le fichier**

### Étape 3 : Poussez sur GitHub

Ouvrez PowerShell dans le dossier du projet :

```powershell
# Ajouter tous les fichiers
git add .

# Faire un commit avec le proxy configuré
git commit -m "Configuration proxy Vercel"

# Pousser sur GitHub
git push
```

### Étape 4 : Activez GitHub Pages

1. Sur GitHub : https://github.com/BryanDrouet/CIEL-IR-ED
2. **Settings** → **Pages**
3. Source : **Deploy from a branch**
4. Branch : **main** / **root**
5. **Save**
6. Attendez 2-3 minutes
7. Votre URL sera : `https://bryandrouet.github.io/CIEL-IR-ED/`

---

## 🎉 C'est prêt !

Votre application sera accessible sur :
```
https://bryandrouet.github.io/CIEL-IR-ED/
```

---

## 🔧 Si vous avez des problèmes

### Le proxy ne se déploie pas sur Vercel

- Vérifiez que `vercel.json` est bien à la racine du projet
- Vérifiez que `api/proxy.js` existe bien

### Erreur "Failed to fetch"

- Vérifiez que `window.PROXY_URL` dans `config.js` contient bien votre URL Vercel
- Vérifiez que l'URL se termine par `/api`

---

## 📝 Votre configuration actuelle

Dépôt GitHub : https://github.com/BryanDrouet/CIEL-IR-ED
Proxy Vercel : https://______________.vercel.app (à compléter)
GitHub Pages : https://bryandrouet.github.io/CIEL-IR-ED/ (disponible après activation)

---

**Prochaine étape : Déployez sur Vercel maintenant !** 🚀
