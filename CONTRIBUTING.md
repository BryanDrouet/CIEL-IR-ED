# Contribuer au projet EcoleDirecte Dashboard

Merci de votre intérêt pour contribuer ! Voici comment vous pouvez aider.

## 🐛 Signaler un bug

1. Vérifiez qu'il n'existe pas déjà dans les [Issues](https://github.com/VOTRE_USERNAME/VOTRE_REPO/issues)
2. Créez une nouvelle issue avec :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Captures d'écran si pertinent
   - Version du navigateur

## ✨ Proposer une fonctionnalité

1. Ouvrez une issue avec le tag `enhancement`
2. Décrivez la fonctionnalité en détail
3. Expliquez pourquoi elle serait utile
4. Proposez une implémentation si possible

## 🔧 Contribuer du code

### 1. Fork & Clone

```bash
git clone https://github.com/VOTRE_USERNAME/ecoledirecte-dashboard.git
cd ecoledirecte-dashboard
```

### 2. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 3. Développer

- Suivez le style de code existant
- Commentez votre code
- Testez sur différents navigateurs
- Testez sur mobile

### 4. Commit

```bash
git add .
git commit -m "feat: ajoute la fonctionnalité X"
```

**Convention de commits :**
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, style
- `refactor:` refactoring
- `test:` ajout de tests
- `chore:` maintenance

### 5. Push & Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Créez une Pull Request sur GitHub avec :
- Titre clair
- Description détaillée
- Captures d'écran si UI
- Tests effectués

## 📋 Checklist avant PR

- [ ] Le code fonctionne sans erreur
- [ ] Testé sur Chrome, Firefox, Safari
- [ ] Testé sur mobile
- [ ] Code commenté
- [ ] Pas de console.log oubliés
- [ ] Pas de clés sensibles
- [ ] README mis à jour si nécessaire

## 🎨 Style de code

### JavaScript

```javascript
// Utiliser const/let, pas var
const monObjet = {};
let maVariable = 0;

// Noms descriptifs en camelCase
function calculerMoyenne() { }

// Commentaires en français
/**
 * Calcule la moyenne générale
 * @param {Array} notes - Liste des notes
 * @returns {number} Moyenne
 */
```

### CSS

```css
/* BEM naming */
.mon-composant { }
.mon-composant__element { }
.mon-composant--modifier { }

/* Variables CSS */
:root {
    --couleur-principale: #4A90E2;
}
```

### HTML

```html
<!-- Indentation 4 espaces -->
<!-- Attributs entre guillemets -->
<!-- Classes descriptives -->
<div class="mon-composant">
    <button class="btn btn-primary">Cliquer</button>
</div>
```

## 🧪 Tests

Testez sur :
- ✅ Chrome (dernière version)
- ✅ Firefox (dernière version)
- ✅ Safari (si possible)
- ✅ Mobile Chrome
- ✅ Mobile Safari

Testez les résolutions :
- 📱 320px (mobile S)
- 📱 375px (mobile M)
- 📱 768px (tablette)
- 💻 1024px (laptop)
- 🖥️ 1440px (desktop)

## 📁 Structure des fichiers

Nouveaux fichiers JavaScript :
- Un fichier = Une classe/fonctionnalité
- Nom en camelCase : `monModule.js`
- Exporter : `window.MonModule = MonModule;`

Nouveaux fichiers CSS :
- Préfixer les classes pour éviter conflits
- Grouper les styles par composant
- Utiliser les variables CSS existantes

## ⚠️ Choses à éviter

- ❌ Committer des clés Firebase
- ❌ Committer config.local.js
- ❌ Code non commenté
- ❌ console.log en production
- ❌ Modifier les fichiers de base sans raison
- ❌ Supprimer des fonctionnalités existantes

## 🤝 Code de conduite

- Soyez respectueux
- Acceptez les critiques constructives
- Focalisez sur ce qui est mieux pour le projet
- Aidez les nouveaux contributeurs

## 📞 Questions ?

- Ouvrez une issue
- Consultez la documentation
- Regardez les PR existantes

## 🎉 Merci !

Chaque contribution compte, même petite ! Merci de rendre ce projet meilleur.

---

**Développé par et pour les étudiants** 🎓
