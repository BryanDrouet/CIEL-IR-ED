# 🎓 EcoleDirecte Dashboard

Dashboard moderne pour EcoleDirecte avec moyennes en temps réel, graphiques, et toutes vos données scolaires.

[![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-success)](https://VOTRE_USERNAME.github.io/ecoledirecte-dashboard/)
[![Firebase](https://img.shields.io/badge/backend-Firebase-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Fonctionnalités

- 📊 **Notes & Moyennes** : Calcul auto, graphiques, simulation
- 📅 **Emploi du temps** : Vue hebdomadaire interactive
- 💬 **Messagerie** : Inbox avec filtres et notifications
- 📝 **Cahier de texte** : Suivi fait/à faire persistant
- 🎓 **Vie scolaire** : Absences, retards, sanctions
- 🏫 **Vie de classe** : Annonces, événements, documents
- 🔔 **Notifications** : Nouveaux menus et notes
- 📱 **Responsive** : Mobile, tablette, desktop

## 🚀 Déployer en 15 minutes

### Étape 1 : Proxy CORS (5 min)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Nouveau projet → Upload `api/proxy.js` et `vercel.json`
3. Deploy → Notez l'URL : `https://votre-proxy.vercel.app`

### Étape 2 : Configuration (2 min)

Dans `config.js`, ajoutez :
```javascript
window.PROXY_URL = 'https://votre-proxy.vercel.app/api';
```

### Étape 3 : GitHub Pages (5 min)

1. Nouveau dépôt GitHub (public)
2. Upload tous les fichiers
3. Settings → Pages → Deploy from main
4. Attendez 2 min → C'est en ligne ! 🎉

📖 **Guide complet** : Ouvrez `DEPLOYER.html` dans votre navigateur

## 🔥 Configuration Firebase

1. Test rapide : Ouvrez `test-firebase.html`
2. Si OK ✅ : Passez à GitHub Pages
3. Sinon : Consultez `FIREBASE_SETUP.md`

## 📂 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `DEPLOYER.html` | 🎯 Guide visuel de déploiement |
| `GITHUB_PAGES.md` | 📖 Documentation complète |
| `FIREBASE_SETUP.md` | 🔥 Config Firebase détaillée |
| `test-firebase.html` | 🧪 Tester Firebase |
| `api/proxy.js` | 🔌 Serveur proxy pour Vercel |
| `config.js` | ⚙️ Configuration (Firebase + Proxy) |

## 🛠️ Stack technique

- **Frontend** : HTML5, CSS3, Vanilla JS
- **Backend** : Firebase (Auth, Firestore, Messaging)
- **Charts** : Chart.js v4
- **API** : EcoleDirecte API v3
- **Proxy** : Vercel Functions
- **Hosting** : GitHub Pages

## 💰 Coûts

- GitHub Pages : **Gratuit**
- Vercel : **Gratuit** (100GB/mois)
- Firebase : **Gratuit** (plan Spark)

**Total : 0€** 🎉

## 🔒 Sécurité

⚠️ **Important** : Vos clés Firebase sont dans `config.js`

Pour sécuriser :
1. Configurez les **règles Firestore** strictes
2. Limitez les **domaines autorisés** dans Firebase Console
3. Activez **Firebase App Check**

Ou utilisez GitHub Actions avec Secrets (voir `GITHUB_PAGES.md`)

## 📱 Captures d'écran

*À venir*

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez `CONTRIBUTING.md`

## 📄 Licence

MIT © 2025 - Voir [LICENSE](LICENSE)

**Disclaimer** : Projet non officiel, non affilié à EcoleDirecte.

---

**🚀 Pour commencer** : Ouvrez `DEPLOYER.html` !
