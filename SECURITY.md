# 🔐 Guide de sécurité

## ⚠️ IMPORTANT - À lire avant de déployer

### 🚫 Ce qu'il ne faut JAMAIS faire

1. **Ne JAMAIS committer vos vraies clés Firebase**
   - ❌ Pas dans `config.js`
   - ❌ Pas dans `config.local.js`
   - ❌ Pas dans aucun fichier versionné
   
2. **Ne JAMAIS stocker les mots de passe en clair**
   - Le mot de passe EcoleDirecte est encodé (base64) mais pas chiffré
   - Pour la production, utilisez un vrai chiffrement (AES-256)

3. **Ne JAMAIS désactiver les règles de sécurité Firestore**
   - Les règles protègent vos données
   - Testez toujours les règles avant de déployer

## ✅ Bonnes pratiques

### Configuration Firebase

#### 1. Utiliser les GitHub Secrets (Production)

```yaml
# .github/workflows/deploy.yml
env:
  FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
```

#### 2. Règles Firestore strictes

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bloquer tout par défaut
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Autoriser uniquement l'utilisateur pour ses données
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /{subcollection}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

#### 3. Limiter les domaines autorisés

Firebase Console > Authentication > Settings > Authorized domains

Ajoutez UNIQUEMENT:
- `localhost` (développement)
- `VOTRE_USERNAME.github.io` (production)

#### 4. Activer App Check

```javascript
// Dans index.html après Firebase
const appCheck = firebase.appCheck();
appCheck.activate(
  'VOTRE_RECAPTCHA_SITE_KEY',
  true // Rafraîchissement automatique
);
```

### Sécurité des identifiants

#### 1. Chiffrement des mots de passe

**Actuellement (base64 - PAS SÉCURISÉ) :**
```javascript
const encrypted = btoa(JSON.stringify({ username, password }));
```

**Recommandé (AES-256) :**
```javascript
// Utiliser crypto-js
const encrypted = CryptoJS.AES.encrypt(
  JSON.stringify({ username, password }),
  VOTRE_CLE_SECRETE
).toString();
```

#### 2. Ne jamais logger les données sensibles

```javascript
// ❌ MAL
console.log('User:', username, password);

// ✅ BIEN
console.log('User logged in:', username);
```

### Déploiement sécurisé

#### 1. Checklist avant commit

- [ ] `config.local.js` dans `.gitignore`
- [ ] Pas de `console.log` avec données sensibles
- [ ] Pas de clés API en dur
- [ ] Règles Firestore testées
- [ ] App Check activé (production)

#### 2. Variables d'environnement

**GitHub Actions:**
```yaml
env:
  API_KEY: ${{ secrets.FIREBASE_API_KEY }}
```

**Netlify/Vercel:**
```env
FIREBASE_API_KEY=votre_clé
FIREBASE_AUTH_DOMAIN=votre_domain
```

#### 3. HTTPS obligatoire

- GitHub Pages utilise HTTPS automatiquement ✅
- Ne jamais utiliser HTTP en production
- Les Service Workers nécessitent HTTPS

### Protection contre les attaques

#### 1. XSS (Cross-Site Scripting)

```javascript
// ❌ DANGEREUX
element.innerHTML = userInput;

// ✅ SÉCURISÉ
element.textContent = userInput;
// ou
const sanitized = DOMPurify.sanitize(userInput);
element.innerHTML = sanitized;
```

#### 2. CSRF (Cross-Site Request Forgery)

Firebase gère ça automatiquement avec ses tokens.

#### 3. Rate Limiting

```javascript
// Limiter les tentatives de connexion
let loginAttempts = 0;
const MAX_ATTEMPTS = 5;

async function login() {
  if (loginAttempts >= MAX_ATTEMPTS) {
    throw new Error('Trop de tentatives. Attendez 5 minutes.');
  }
  loginAttempts++;
  // ...
}
```

### Monitoring et logs

#### 1. Firebase Analytics (optionnel)

```javascript
firebase.analytics().logEvent('login', {
  method: 'anonymous'
});
```

#### 2. Error tracking

```javascript
window.addEventListener('error', (event) => {
  // Ne pas logger les données sensibles !
  console.error('Error:', event.error.message);
});
```

### Conformité RGPD

#### 1. Informations collectées

- Identifiants EcoleDirecte (chiffrés)
- Données scolaires (notes, absences, etc.)
- Token Firebase anonyme

#### 2. Politique de confidentialité

Créez une page `privacy.html` avec:
- Quelles données sont collectées
- Comment elles sont utilisées
- Comment les supprimer
- Contact pour questions

#### 3. Droit à l'oubli

```javascript
async function deleteUserData() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  
  // Supprimer toutes les données
  await db.collection('users').doc(user.uid).delete();
  
  // Supprimer le compte
  await user.delete();
}
```

## 🚨 En cas de compromission

### Si vos clés Firebase sont exposées

1. **Immédiatement:**
   - Allez sur Firebase Console
   - Générez de nouvelles clés
   - Révoquezles anciennes
   - Mettez à jour GitHub Secrets

2. **Vérifiez:**
   - Les règles Firestore
   - Les domaines autorisés
   - Les utilisateurs Firebase
   - Les logs d'accès

3. **Communiquez:**
   - Avertissez les utilisateurs si nécessaire
   - Documentez l'incident
   - Renforcez la sécurité

### Si un mot de passe EcoleDirecte est compromis

1. Changez le mot de passe sur EcoleDirecte
2. Supprimez les données de Firebase
3. Reconnectez-vous avec le nouveau mot de passe

## 📋 Audit de sécurité

Checklist mensuelle:

- [ ] Vérifier les règles Firestore
- [ ] Vérifier les domaines autorisés
- [ ] Vérifier les logs Firebase
- [ ] Mettre à jour les dépendances
- [ ] Tester l'App Check
- [ ] Vérifier les GitHub Secrets
- [ ] Scanner les vulnérabilités

## 🔗 Ressources

- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [App Check Documentation](https://firebase.google.com/docs/app-check)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [RGPD - CNIL](https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on)

---

**La sécurité est l'affaire de tous. Restez vigilants ! 🔐**
