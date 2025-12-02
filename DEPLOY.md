# 🎓 EcoleDirecte Dashboard - Guide de déploiement GitHub Pages

## 🚀 Déploiement sur GitHub Pages

### Étape 1: Créer un dépôt GitHub

1. Allez sur [GitHub](https://github.com)
2. Créez un nouveau dépôt (Repository)
3. Nommez-le `ecoledirecte-dashboard` ou le nom de votre choix
4. **Important:** Cochez "Public" (requis pour GitHub Pages gratuit)

### Étape 2: Configurer Firebase (SANS EXPOSER LES CLÉS)

#### Option A: Configuration locale (développement)

1. Copiez `config.local.example.js` en `config.local.js`
2. Remplacez les valeurs par vos vraies clés Firebase
3. Chargez ce fichier dans `index.html` (déjà configuré)
4. **Le fichier config.local.js est ignoré par Git**

#### Option B: GitHub Actions (production recommandée)

Créez un fichier `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Create config file
        run: |
          cat > config.local.js << EOF
          const firebaseConfigLocal = {
            apiKey: "${{ secrets.FIREBASE_API_KEY }}",
            authDomain: "${{ secrets.FIREBASE_AUTH_DOMAIN }}",
            projectId: "${{ secrets.FIREBASE_PROJECT_ID }}",
            storageBucket: "${{ secrets.FIREBASE_STORAGE_BUCKET }}",
            messagingSenderId: "${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}",
            appId: "${{ secrets.FIREBASE_APP_ID }}"
          };
          EOF
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

Puis configurez vos secrets GitHub:
1. Dans votre dépôt, allez dans `Settings` > `Secrets and variables` > `Actions`
2. Ajoutez chaque clé Firebase comme secret

### Étape 3: Pousser le code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git push -u origin main
```

### Étape 4: Activer GitHub Pages

1. Allez dans `Settings` > `Pages`
2. Source: `Deploy from a branch`
3. Branch: `main` ou `gh-pages` (selon votre config)
4. Folder: `/ (root)`
5. Cliquez sur `Save`

Votre site sera disponible à: `https://VOTRE_USERNAME.github.io/VOTRE_REPO/`

## 🔐 Sécurité Firebase pour GitHub Pages

### Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Limiter les domaines autorisés

1. Allez dans Firebase Console > Authentication > Settings
2. Sous "Authorized domains", ajoutez uniquement:
   - `VOTRE_USERNAME.github.io`
   - `localhost` (pour développement)

### Activer App Check

1. Dans Firebase Console, allez dans `App Check`
2. Enregistrez votre application
3. Activez reCAPTCHA v3 pour le web
4. Ajoutez le code dans `index.html`:

```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check-compat.js"></script>
<script>
  const appCheck = firebase.appCheck();
  appCheck.activate('VOTRE_RECAPTCHA_SITE_KEY', true);
</script>
```

## 📱 Configuration responsive

L'application est déjà optimisée pour:
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large écran (1440px+)

## 🔧 Personnalisation

### Changer les couleurs

Éditez `styles.css`:

```css
:root {
    --primary-color: #4A90E2;  /* Couleur principale */
    --secondary-color: #50C878; /* Couleur secondaire */
    --dark-bg: #1a1a2e;        /* Fond sombre */
    --card-bg: #16213e;        /* Fond des cartes */
}
```

### Ajouter votre logo

Remplacez dans `index.html`:
```html
<h1>🎓 EcoleDirecte Dashboard</h1>
<!-- par -->
<h1><img src="logo.png" alt="Logo"> Votre École</h1>
```

## 📊 Fonctionnalités disponibles

- ✅ Vue d'ensemble (notes, moyennes, graphiques)
- ✅ Emploi du temps interactif
- ✅ Messagerie avec filtres
- ✅ Cahier de texte (devoirs)
- ✅ Vie scolaire (absences, retards, sanctions)
- ✅ Vie de classe (annonces, événements, documents)
- ✅ Notifications en temps réel
- ✅ Interface responsive

## ⚠️ Important

1. **Ne JAMAIS committer config.local.js**
2. Utilisez les GitHub Secrets pour la production
3. Configurez correctement les règles Firebase
4. Testez en local avant de déployer
5. L'API EcoleDirecte peut bloquer les requêtes CORS

## 🐛 Dépannage

### Les clés Firebase ne sont pas chargées
- Vérifiez que config.local.js existe
- Vérifiez que le fichier est chargé dans index.html
- Consultez la console du navigateur (F12)

### GitHub Pages ne se met pas à jour
- Attendez quelques minutes (peut prendre jusqu'à 10min)
- Videz le cache du navigateur
- Vérifiez que le workflow GitHub Actions s'est bien exécuté

### CORS errors avec EcoleDirecte
- L'API EcoleDirecte peut bloquer les requêtes cross-origin
- Solution: Créer un backend proxy (Netlify Functions, Vercel, etc.)

## 📞 Support

Pour toute question:
1. Vérifiez la console du navigateur (F12)
2. Consultez les logs GitHub Actions
3. Vérifiez les règles Firebase

---

**Développé pour les étudiants 🎓**
