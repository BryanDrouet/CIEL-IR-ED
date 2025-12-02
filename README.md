# 🎓 EcoleDirecte Dashboard

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://VOTRE_USERNAME.github.io/ecoledirecte-dashboard/demo.html)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Responsive](https://img.shields.io/badge/responsive-yes-brightgreen.svg)](https://VOTRE_USERNAME.github.io/ecoledirecte-dashboard)

Application web complète pour consulter toutes vos données EcoleDirecte : notes, moyennes, emploi du temps, messagerie, devoirs et vie scolaire.

**🔗 [Démo en ligne](https://VOTRE_USERNAME.github.io/ecoledirecte-dashboard/demo.html)** | **📖 [Documentation](https://github.com/VOTRE_USERNAME/ecoledirecte-dashboard/wiki)** | **⚡ [Configuration rapide](QUICKSTART.md)**

## 🚀 Fonctionnalités

### 📊 Vue d'ensemble
- ✅ **Calcul automatique** de la moyenne générale et par matière
- 📈 **Graphiques interactifs** (évolution des moyennes, comparaison par matière)
- 📊 **Statistiques détaillées** (meilleure matière, nombre de notes, tendances)
- 🎯 **Simulateur de notes** pour prédire votre moyenne

### 📅 Emploi du temps
- ✅ **Planning hebdomadaire** interactif
- 🔄 **Navigation** entre les semaines
- 📍 **Informations détaillées** (salle, professeur, matière)
- 🎨 **Code couleur** par matière

### ✉️ Messagerie
- ✅ **Consultation des messages** de l'administration et des professeurs
- 🔔 **Badge de notifications** pour messages non lus
- 🔍 **Filtres** : tous, non lus, envoyés
- 📎 **Pièces jointes** supportées

### 📚 Cahier de texte
- ✅ **Liste des devoirs** avec dates d'échéance
- ✅ **Marquer comme fait** avec sauvegarde automatique
- ⚠️ **Alertes** pour devoirs en retard
- 🔍 **Filtres** : tous, à faire, terminés, en retard

### 🏫 Vie scolaire
- 📊 **Absences** (justifiées/non justifiées)
- ⏰ **Retards** avec durée
- ⚠️ **Sanctions** et avertissements
- 🌟 **Encouragements** et félicitations

### 👥 Vie de classe
- 📢 **Annonces** de la classe
- 📅 **Événements** à venir
- 📋 **Documents** partagés

### 🔔 Notifications
- 🍽️ **Nouveaux menus** de la cantine
- 📝 **Nouvelles notes** ajoutées
- ⚡ **Mises à jour** en temps réel

### 📱 Responsive Design
- 💻 **Desktop** optimisé
- 📱 **Mobile** et tablette
- 🎨 **Interface moderne** et intuitive
- 🌙 **Thème sombre** pour le confort visuel

## 📋 Prérequis

1. Un compte EcoleDirecte
2. Un compte Firebase (gratuit)
3. Un navigateur web moderne

## 🛠️ Installation

### 1. Pour développement local

1. Clonez ou téléchargez le projet
2. Copiez `config.local.example.js` en `config.local.js`
3. Configurez Firebase (voir section Configuration Firebase)
4. Ajoutez vos clés dans `config.local.js`
5. Ouvrez `index.html` dans votre navigateur

### 2. Pour déploiement GitHub Pages

Consultez le fichier [DEPLOY.md](DEPLOY.md) pour les instructions complètes.

**Points clés:**
- ✅ Ne committez JAMAIS config.local.js
- ✅ Utilisez les GitHub Secrets pour les clés
- ✅ Configurez les domaines autorisés dans Firebase
- ✅ Activez App Check pour la sécurité

## 📁 Structure du projet

```
CIEL-IR-ED/
├── index.html                 # Page principale avec navigation par onglets
├── styles.css                 # Styles de base
├── styles-extended.css        # Styles pour nouvelles fonctionnalités
├── config.js                  # Configuration Firebase (placeholders)
├── config.local.example.js    # Exemple de configuration locale
├── app.js                     # Application principale
├── ecoleDirecte.js           # API EcoleDirecte complète
├── calculator.js             # Calcul des moyennes
├── charts.js                 # Gestion des graphiques
├── notifications.js          # Système de notifications
├── schedule.js               # Gestion de l'emploi du temps
├── messaging.js              # Gestion de la messagerie
├── homework.js               # Gestion du cahier de texte
├── schoollife.js             # Gestion de la vie scolaire
├── navigation.js             # Navigation entre onglets
├── service-worker.js         # Support PWA
├── manifest.json             # Métadonnées PWA
├── .gitignore               # Fichiers à ignorer
├── README.md                # Documentation
├── DEPLOY.md                # Guide de déploiement GitHub Pages
├── GUIDE.html               # Guide de configuration visuel
└── CHECKLIST.md             # Liste de vérification
```

## 🔧 Technologies utilisées

- **HTML5/CSS3** - Interface utilisateur responsive
- **JavaScript (Vanilla)** - Logique applicative
- **Firebase** - Authentification et base de données
- **Chart.js** - Graphiques interactifs
- **EcoleDirecte API** - Récupération des données
- **Service Worker** - Support PWA et notifications

## 📱 Support des appareils

L'application est optimisée pour tous les appareils :

| Appareil | Résolution | Support |
|----------|-----------|---------|
| 📱 Mobile S | 320px+ | ✅ Full |
| 📱 Mobile M | 375px+ | ✅ Full |
| 📱 Mobile L | 425px+ | ✅ Full |
| 📱 Tablette | 768px+ | ✅ Full |
| 💻 Laptop | 1024px+ | ✅ Full |
| 🖥️ Desktop | 1440px+ | ✅ Full |

### Fonctionnalités responsive :
- Navigation par onglets avec scroll horizontal
- Grilles adaptatives
- Tables scrollables horizontalement
- Polices et espacements ajustés
- Interfaces tactiles optimisées

## 🔐 Sécurité

### Points de sécurité implémentés :

1. **Authentification Firebase** - Connexion anonyme sécurisée
2. **Chiffrement des identifiants** - Les identifiants ED sont encodés (base64)
3. **Règles Firestore** - Accès limité aux données de l'utilisateur connecté
4. **HTTPS** - Recommandé pour la production
5. **Validation des données** - Vérification côté client

### ⚠️ Recommandations pour la production :

1. **NE JAMAIS** committer vos vraies clés Firebase
2. Utiliser des variables d'environnement
3. Activer Firebase **App Check**
4. Passer Firestore en mode **production**
5. Implémenter un chiffrement plus robuste (AES)
6. Héberger sur HTTPS (Firebase Hosting, Netlify, etc.)
7. Configurer les CORS correctement

## 📱 Notifications

### Configuration des notifications push :

1. Dans Firebase Console, allez dans **Cloud Messaging**
2. Générez une paire de clés VAPID
3. Copiez la clé publique dans `notifications.js` :

```javascript
const token = await this.messaging.getToken({
    vapidKey: 'VOTRE_CLE_VAPID_PUBLIQUE'
});
```

## 🎯 Fonctionnalités détaillées

### 📊 Calcul des moyennes
- Moyenne générale pondérée par coefficients
- Moyenne par matière avec détail des notes
- Évolution chronologique avec graphique
- Simulation de notes pour prédire l'impact
- Identification de la meilleure et pire matière

### 📅 Emploi du temps
- Affichage hebdomadaire (Lundi à Vendredi)
- Navigation entre les semaines (précédent/suivant)
- Retour rapide à la semaine actuelle
- Code couleur par matière
- Informations complètes : matière, professeur, salle
- Créneaux de 08h à 18h

### ✉️ Messagerie
- Lecture des messages reçus
- Filtrage : tous / non lus / envoyés
- Badge de notification pour messages non lus
- Affichage des pièces jointes
- Interface liste/détail
- Marquer comme lu automatiquement

### 📚 Cahier de texte
- Liste des devoirs par date d'échéance
- Checkbox pour marquer comme fait
- Sauvegarde automatique du statut
- Alertes visuelles pour devoirs en retard
- Affichage des documents joints
- Filtres : tous / à faire / terminés / en retard

### 🏫 Vie scolaire
- **Absences** : date, motif, justification
- **Retards** : date, durée, justification  
- **Sanctions** : type et motif
- **Encouragements** : type et commentaire
- Statut visuel (justifié/non justifié)
- Compteur pour chaque catégorie

### 👥 Vie de classe
- Annonces importantes de la classe
- Événements à venir avec date et lieu
- Documents de classe téléchargeables
- Organisation chronologique

### 🔔 Notifications
- Nouveaux menus de cantine
- Nouvelles notes ajoutées
- Vérification automatique toutes les 5 minutes
- Notifications système + bannières in-app
- Historique des notifications

### 📈 Graphiques
- **Évolution de la moyenne** : courbe chronologique
- **Moyennes par matière** : diagramme en barres
- Infobulles détaillées au survol
- Animations fluides
- Export possible (via Chart.js)

## 🐛 Dépannage

### Erreur de connexion EcoleDirecte
- Vérifiez vos identifiants
- Vérifiez votre connexion internet
- L'API EcoleDirecte peut être temporairement indisponible
- Erreur CORS : l'API peut bloquer les requêtes cross-origin

### Les graphiques ne s'affichent pas
- Vérifiez que Chart.js est bien chargé
- Ouvrez la console (F12) pour voir les erreurs
- Vérifiez que vous avez des notes

### Les notifications ne fonctionnent pas
- Autorisez les notifications dans votre navigateur
- Vérifiez la clé VAPID dans `notifications.js`
- Certains navigateurs bloquent les notifications sur HTTP
- Utilisez HTTPS pour GitHub Pages

### Les onglets ne s'affichent pas
- Vérifiez que tous les fichiers JS sont chargés
- Consultez la console pour les erreurs
- Videz le cache du navigateur

### Firebase ne fonctionne pas
- Vérifiez que `config.local.js` existe
- Vérifiez vos clés de configuration
- Assurez-vous que les règles Firestore sont correctes
- Vérifiez que l'authentification anonyme est activée

### GitHub Pages - Clés Firebase non trouvées
- Vérifiez les GitHub Secrets
- Vérifiez le workflow GitHub Actions
- Consultez les logs de déploiement
- Assurez-vous que config.local.js est généré

## 📄 Licence

Ce projet est fourni à des fins éducatives. Utilisez-le de manière responsable.

## ⚖️ Avertissement

- Ce projet n'est **pas officiel** et n'est **pas affilié** à EcoleDirecte
- Utilisez vos identifiants à vos **propres risques**
- L'auteur n'est **pas responsable** d'une utilisation abusive
- Respectez les conditions d'utilisation d'EcoleDirecte

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Ajouter des fonctionnalités

## 📞 Support

Pour toute question ou problème :
1. Vérifiez d'abord la section **Dépannage**
2. Consultez les logs de la console navigateur
3. Vérifiez la configuration Firebase

---

**Fait avec ❤️ pour les étudiants**
