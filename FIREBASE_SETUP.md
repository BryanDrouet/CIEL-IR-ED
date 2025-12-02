# 🔥 Configuration Firebase - Étapes restantes

Votre `config.js` est configuré ! Il reste 3 choses à faire dans la console Firebase :

## 1️⃣ Activer l'authentification anonyme

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **ciel-ir-ed**
3. Dans le menu de gauche : **Build** → **Authentication**
4. Cliquez sur **Get started**
5. Onglet **Sign-in method**
6. Cliquez sur **Anonymous**
7. **Activez** le bouton
8. Cliquez sur **Save**

✅ Résultat : Les utilisateurs pourront se connecter sans compte Firebase

## 2️⃣ Créer la base de données Firestore

1. Toujours dans Firebase Console
2. Menu gauche : **Build** → **Firestore Database**
3. Cliquez sur **Create database**
4. Choisissez le mode : **Production mode** (recommandé)
5. Sélectionnez la région : **europe-west1** (Belgique) ou **europe-west3** (Francfort)
6. Cliquez sur **Enable**

### Configurer les règles de sécurité

Une fois la base créée :

1. Onglet **Rules**
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture/écriture uniquement pour l'utilisateur authentifié
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Sous-collections (homework, etc.)
      match /{subcollection}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Cliquez sur **Publish**

✅ Résultat : Chaque utilisateur ne peut accéder qu'à ses propres données

## 3️⃣ Activer Cloud Messaging (notifications)

1. Menu gauche : **Build** → **Cloud Messaging**
2. Cliquez sur **Get started**
3. Suivez l'assistant (pas de configuration supplémentaire nécessaire)

### Générer une clé VAPID (pour les notifications web)

1. Dans Cloud Messaging
2. Onglet **Cloud Messaging API (Legacy)** ou **Settings**
3. Allez dans **Web configuration**
4. Cliquez sur **Generate key pair**
5. **Copiez** la clé publique VAPID

### Ajouter la clé VAPID dans votre code

Ouvrez `notifications.js` et trouvez cette ligne (vers la ligne 30) :

```javascript
const messaging = firebase.messaging();
await messaging.getToken({
    vapidKey: 'VOTRE_CLE_VAPID_ICI' // ← Remplacez par votre clé
});
```

Remplacez `'VOTRE_CLE_VAPID_ICI'` par la clé que vous venez de copier.

✅ Résultat : Les notifications push fonctionneront

## 4️⃣ Limiter les domaines autorisés (IMPORTANT)

Pour éviter que quelqu'un d'autre utilise votre Firebase :

1. Firebase Console → **Authentication**
2. Onglet **Settings**
3. Section **Authorized domains**
4. Supprimez tous les domaines sauf :
   - `localhost` (pour le développement local)
   - `ciel-ir-ed.firebaseapp.com` (domaine Firebase)
   - Votre domaine GitHub Pages : `VOTRE_USERNAME.github.io` (si vous déployez)

✅ Résultat : Seuls vos sites peuvent utiliser Firebase

## 5️⃣ Tester localement

1. Ouvrez `index.html` dans votre navigateur
2. Ouvrez la console (F12)
3. Vous devriez voir :
   ```
   Firebase initialized
   ```
4. Essayez de vous connecter avec vos identifiants EcoleDirecte

## ⚠️ Sécurité importante !

**SI VOUS ALLEZ PUSHER SUR GITHUB :**

1. Créez un fichier `.gitignore` à la racine :
```
config.local.js
node_modules/
.env
```

2. Déplacez vos clés Firebase dans `config.local.js` :
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBF0tLmeQTCW9HU4-RlVlFYBl_N-WMOK1s",
    authDomain: "ciel-ir-ed.firebaseapp.com",
    projectId: "ciel-ir-ed",
    storageBucket: "ciel-ir-ed.firebasestorage.app",
    messagingSenderId: "519195409240",
    appId: "1:519195409240:web:322d1bf78460b0b957032d"
};
```

3. Dans `config.js`, remettez :
```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
    // ...
};
```

4. Dans `index.html`, ajoutez avant la balise `</head>` :
```html
<script src="config.local.js"></script>
```

Lisez `SECURITY.md` pour plus de détails !

## ✅ Checklist finale

- [ ] Authentification anonyme activée
- [ ] Firestore créé avec règles de sécurité
- [ ] Cloud Messaging activé
- [ ] Clé VAPID ajoutée dans `notifications.js`
- [ ] Domaines autorisés limités
- [ ] Application testée localement
- [ ] (Si GitHub) Clés déplacées dans `config.local.js`

**C'est tout ! Votre Firebase est prêt ! 🚀**
