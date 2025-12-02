# ⚡ Configuration rapide - 5 minutes

## 🚀 Démarrage ultra-rapide

### Étape 1: Configuration Firebase (2 min)

1. **Créer le projet** : https://console.firebase.google.com/
   - Cliquer "Ajouter un projet"
   - Nom: `ecoledirecte-dashboard`
   - Désactiver Analytics ✓

2. **Activer Authentication** :
   - Menu > Authentication > Commencer
   - Sign-in method > Anonyme > Activer

3. **Activer Firestore** :
   - Menu > Firestore Database > Créer
   - Mode test > Europe (eur3) > Activer

4. **Obtenir les clés** :
   - Engrenage ⚙️ > Paramètres du projet
   - Vos applications > Web </> > Nom: "Dashboard" > Enregistrer
   - **COPIER** le firebaseConfig

### Étape 2: Configuration locale (1 min)

Créez `config.local.js` :

```javascript
const firebaseConfigLocal = {
    apiKey: "AIza...",  // COLLEZ ICI
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123:web:abc"
};
```

### Étape 3: Règles de sécurité (1 min)

Dans Firestore > Règles, collez :

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

Publier ✓

### Étape 4: Tester (1 min)

1. Ouvrir `index.html` dans Chrome/Firefox/Edge
2. Se connecter avec identifiants EcoleDirecte
3. ✅ Ça marche !

---

## 🌐 Déployer sur GitHub Pages (optionnel)

### Configuration GitHub Secrets

Settings > Secrets and variables > Actions > New repository secret

Ajoutez :
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

### Activer GitHub Pages

Settings > Pages > Source: GitHub Actions

Push votre code :

```bash
git add .
git commit -m "Initial commit"
git push
```

✅ Site disponible à : `https://VOTRE_USERNAME.github.io/REPO/`

---

## 🔒 Sécurité - Checklist

- [ ] config.local.js dans .gitignore
- [ ] Règles Firestore configurées
- [ ] Auth anonyme activée
- [ ] Domaines autorisés configurés (Firebase > Auth > Settings)
- [ ] App Check activé (optionnel mais recommandé)

---

## ❓ Problème ?

**Erreur "Firebase not defined"**
→ Vérifiez que config.local.js existe et est bien configuré

**Erreur "Permission denied"**
→ Vérifiez les règles Firestore et l'auth anonyme

**Page blanche**
→ F12 > Console > Regardez les erreurs

**API EcoleDirecte ne répond pas**
→ Normal, l'API peut bloquer les requêtes CORS. Les données de démo s'affichent.

---

## 📚 Documentation complète

- [README.md](README.md) - Documentation complète
- [DEPLOY.md](DEPLOY.md) - Guide déploiement détaillé
- [GUIDE.html](GUIDE.html) - Guide visuel pas à pas

---

**Besoin d'aide ?** Ouvrez la console (F12) et regardez les messages d'erreur !
