# ⚡ Démarrage INSTANTANÉ (sans installation)

## 🚨 Problème CORS

L'API EcoleDirecte bloque les requêtes directes depuis le navigateur pour des raisons de sécurité.

## 💡 3 Solutions

### Solution 1 : Installer Python (RECOMMANDÉ - 5 min)

**Étape 1 : Installer Python**
1. Téléchargez : https://www.python.org/downloads/
2. **IMPORTANT** : Cochez "Add Python to PATH" pendant l'installation
3. Installez

**Étape 2 : Double-cliquez sur `start.bat`**

C'est tout ! L'application s'ouvre automatiquement sur http://localhost:3000

---

### Solution 2 : Installer Node.js (5 min)

**Étape 1 : Installer Node.js**
1. Téléchargez : https://nodejs.org/
2. Installez (suivez les étapes par défaut)

**Étape 2 : Ouvrir PowerShell dans ce dossier**
```powershell
npm install
npm start
```

**Étape 3 : Ouvrir http://localhost:3000**

---

### Solution 3 : Utiliser un proxy public (IMMÉDIAT mais limité)

J'ai préparé une version qui utilise un proxy CORS public.

**⚠️ ATTENTION** : Cette solution :
- ❌ N'est PAS sécurisée (vos identifiants passent par un serveur tiers)
- ❌ Peut être lente
- ❌ Peut ne pas fonctionner tout le temps
- ✅ Fonctionne IMMÉDIATEMENT sans installation

**Pour l'utiliser :**
1. Ouvrez `index-cors-proxy.html` dans votre navigateur
2. Connectez-vous

---

## 🎯 Quelle solution choisir ?

| Solution | Temps | Sécurité | Fiabilité | Recommandé |
|----------|-------|----------|-----------|------------|
| **Python** | 5 min | ✅ Excellente | ✅ Excellente | ⭐⭐⭐⭐⭐ |
| **Node.js** | 5 min | ✅ Excellente | ✅ Excellente | ⭐⭐⭐⭐⭐ |
| **Proxy public** | 0 min | ❌ Faible | ⚠️ Variable | ⭐ (test uniquement) |

---

## 📞 Besoin d'aide ?

### Python n'est pas dans le PATH ?

Après installation, redémarrez votre PC et réessayez.

### Node.js ne fonctionne pas ?

Redémarrez votre PC après l'installation.

### Aucune solution ne marche ?

Utilisez temporairement `index-cors-proxy.html` pour tester, puis installez Python ou Node.js quand vous avez le temps.

---

**Recommandation : Installez Python (c'est le plus simple) et utilisez `start.bat`** 🚀
