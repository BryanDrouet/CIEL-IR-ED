# 🎓 EcoleDirecte - Version Simplifiée

## 🚀 Nouvelle approche

Après avoir rencontré des difficultés avec l'API EcoleDirecte (système GTK, cookies, CORS), nous avons simplifié l'application :

### ✅ Ce qui fonctionne maintenant

**Redirection automatique vers EcoleDirecte officiel**
- Saisir vos identifiants sur https://ciel-ir-ed.vercel.app
- Cliquer sur "Se connecter"
- → Redirection automatique vers www.ecoledirecte.com avec vos identifiants pré-remplis
- → Vous accédez au vrai site EcoleDirecte avec toutes les fonctionnalités

### 🎯 Avantages

- ✅ **100% fiable** : Utilise le site officiel EcoleDirecte
- ✅ **Toutes les fonctionnalités** : Notes, emploi du temps, messagerie, etc.
- ✅ **Sécurisé** : Vos identifiants ne transitent que vers EcoleDirecte
- ✅ **À jour** : Toujours la dernière version du site officiel
- ✅ **Pas de maintenance** : Fonctionne même si EcoleDirecte change leur API

### 💡 Fonctionnalités

1. **Se souvenir de moi** : Sauvegarde votre nom d'utilisateur
2. **Auto-remplissage** : Les identifiants sont pré-remplis dans le formulaire
3. **Nouvel onglet** : S'ouvre dans un nouvel onglet pour garder l'accès à l'application

### 🔧 Utilisation

```javascript
// Option 1 : Redirection automatique (défaut)
simpleED.loginAndRedirect(username, password);

// Option 2 : Ouvrir dans un nouvel onglet
simpleED.openEcoleDirecte();

// Option 3 : Intégrer dans une iframe (si EcoleDirecte l'autorise)
simpleED.embedEcoleDirecte('container-id');
```

### 📝 Note technique

L'ancienne version avec scraping API est toujours disponible dans les fichiers :
- `ecoleDirecte.js` - API avec système GTK
- `api/proxy.js` - Proxy Vercel pour contourner CORS
- `app.js` - Application complète avec dashboard

Si vous souhaitez réactiver l'ancien système, il suffit de modifier les imports dans `index.html`.

---

**Développé pour le projet CIEL-IR-ED**
