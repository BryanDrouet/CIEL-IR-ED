# Configuration Firebase - Liste de vérification

## ✅ Étapes à suivre

### 1. Création du projet Firebase
- [ ] Aller sur https://console.firebase.google.com/
- [ ] Créer un nouveau projet
- [ ] Désactiver Google Analytics (optionnel)

### 2. Authentication
- [ ] Activer Authentication
- [ ] Activer le mode "Anonyme" dans Sign-in method

### 3. Firestore Database
- [ ] Créer une base de données Firestore
- [ ] Démarrer en mode "test" (pour développement)
- [ ] Choisir une région (europe-west1 recommandé)

### 4. Règles de sécurité
- [ ] Copier les règles depuis GUIDE.html
- [ ] Publier les règles dans Firestore

### 5. Configuration Web
- [ ] Ajouter une application Web dans Paramètres du projet
- [ ] Copier les clés de configuration
- [ ] Remplacer les valeurs dans config.js

### 6. Notifications (Optionnel)
- [ ] Générer une paire de clés VAPID dans Cloud Messaging
- [ ] Ajouter la clé publique dans notifications.js

## 🔐 Sécurité - Points à vérifier

- [ ] Les clés Firebase ne sont PAS dans un dépôt public
- [ ] Les règles Firestore limitent l'accès par utilisateur
- [ ] L'authentification anonyme est activée
- [ ] Mode test Firestore expirera dans 30 jours (passer en production après)

## 🧪 Tests

- [ ] Ouvrir index.html dans le navigateur
- [ ] Se connecter avec des identifiants EcoleDirecte
- [ ] Vérifier que les notes s'affichent
- [ ] Vérifier que les graphiques apparaissent
- [ ] Tester les notifications (si configurées)
- [ ] Vérifier la console (F12) pour les erreurs

## 📝 Notes importantes

**Identifiants stockés** : Les identifiants EcoleDirecte sont encodés (base64) et stockés dans Firebase. Pour une meilleure sécurité en production, utilisez un chiffrement AES.

**Limite gratuite Firebase** :
- Authentication : Illimité
- Firestore : 1 Go stockage, 50K lectures/jour, 20K écritures/jour
- Cloud Messaging : Illimité

**CORS** : L'API EcoleDirecte peut bloquer les requêtes. Si vous rencontrez des problèmes CORS, vous devrez créer un backend proxy.

## 🌐 Déploiement (Production)

Pour déployer en production :

1. **Firebase Hosting** (recommandé)
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

2. **Netlify / Vercel**
   - Drag & drop tous les fichiers
   - Configurer les variables d'environnement

3. **Sécurité production**
   - Passer Firestore en mode production
   - Activer App Check
   - Utiliser HTTPS uniquement
   - Implémenter un vrai chiffrement pour les mots de passe
   - Ajouter rate limiting

## ❓ Problèmes fréquents

**"Firebase not defined"**
→ Vérifiez que config.js est bien chargé avant app.js

**"Permission denied" dans Firestore**
→ Vérifiez les règles de sécurité et l'authentification

**API EcoleDirecte ne répond pas**
→ L'API peut être temporairement indisponible ou bloquer les requêtes CORS

**Les graphiques ne s'affichent pas**
→ Vérifiez que Chart.js est chargé et que vous avez des données

## 📞 Support

En cas de problème :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez l'onglet "Console" pour les erreurs
3. Vérifiez l'onglet "Network" pour les requêtes échouées
4. Consultez le GUIDE.html pour les instructions détaillées
