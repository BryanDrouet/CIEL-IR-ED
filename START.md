# 🚀 Démarrage Rapide - 2 minutes

## Problème CORS résolu !

L'API EcoleDirecte bloque les requêtes directes depuis le navigateur. J'ai créé un serveur proxy Node.js pour contourner ce problème.

## 📦 Installation (1 minute)

### Étape 1 : Installer Node.js (si pas déjà fait)

Téléchargez et installez depuis : https://nodejs.org/

### Étape 2 : Installer les dépendances

Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
npm install
```

Cela va installer :
- `express` - Serveur web
- `cors` - Gestion du CORS
- `node-fetch` - Pour faire des requêtes HTTP

## 🚀 Lancement (30 secondes)

### Démarrer le serveur proxy

```powershell
npm start
```

Vous devriez voir :

```
╔═══════════════════════════════════════════════════════╗
║  🚀 Serveur proxy EcoleDirecte démarré !              ║
║                                                       ║
║  📍 Application:  http://localhost:3000              ║
║  🔗 API Proxy:    http://localhost:3000/api/        ║
║                                                       ║
║  💡 Ouvrez http://localhost:3000 dans votre        ║
║     navigateur pour utiliser l'application            ║
╚═══════════════════════════════════════════════════════╝
```

### Ouvrir l'application

1. Ouvrez votre navigateur
2. Allez sur **http://localhost:3000**
3. Connectez-vous avec vos identifiants EcoleDirecte

## ✅ C'est tout !

L'application devrait maintenant fonctionner sans erreur CORS.

## 🛠️ Commandes utiles

```powershell
# Démarrer le serveur
npm start

# Démarrer avec rechargement automatique (développement)
npm run dev

# Arrêter le serveur
Ctrl + C
```

## 🔧 Dépannage

### Port 3000 déjà utilisé ?

Modifiez le port dans `proxy-server.js` ligne 6 :

```javascript
const PORT = 3001; // Changer 3000 en 3001 (ou autre)
```

### Erreur "npm not found" ?

Node.js n'est pas installé. Installez-le depuis https://nodejs.org/

### L'application ne charge pas ?

1. Vérifiez que le serveur est bien démarré (`npm start`)
2. Vérifiez que vous êtes sur `http://localhost:3000` (pas `127.0.0.1:5500`)
3. Regardez la console (F12) pour les erreurs

## 📱 Prochaines étapes

Une fois que ça fonctionne en local :

1. Testez la connexion EcoleDirecte
2. Vérifiez vos notes et moyennes
3. Explorez les autres onglets (emploi du temps, messagerie, etc.)

Pour déployer en production (GitHub Pages), voir `DEPLOY.md`.

---

**Temps total : 2 minutes ⏱️**
