/**
 * Configuration Firebase
 * 
 * IMPORTANT: Pour GitHub Pages, NE METTEZ PAS vos vraies clés ici !
 * 
 * Méthode recommandée :
 * 1. Créez un fichier config.local.js (ajouté au .gitignore)
 * 2. Mettez-y vos vraies clés
 * 3. Pour le déploiement, utilisez les GitHub Secrets ou les variables d'environnement
 */

const firebaseConfig = {
    apiKey: "AIzaSyBF0tLmeQTCW9HU4-RlVlFYBl_N-WMOK1s",
    authDomain: "ciel-ir-ed.firebaseapp.com",
    projectId: "ciel-ir-ed",
    storageBucket: "ciel-ir-ed.firebasestorage.app",
    messagingSenderId: "519195409240",
    appId: "1:519195409240:web:322d1bf78460b0b957032d"
};

/**
 * CONFIGURATION POUR GITHUB PAGES:
 * 
 * Option 1: Fichier de configuration local (recommandé pour développement)
 * - Créez un fichier config.local.js avec vos vraies clés
 * - Ajoutez config.local.js à .gitignore
 * - Dans index.html, chargez config.local.js si il existe
 * 
 * Option 2: GitHub Secrets (recommandé pour production)
 * - Configurez vos clés Firebase comme GitHub Secrets
 * - Utilisez une GitHub Action pour remplacer les valeurs lors du build
 * 
 * Option 3: Variables d'environnement
 * - Utilisez un service comme Netlify ou Vercel
 * - Configurez les variables d'environnement dans le panneau
 * 
 * SÉCURITÉ:
 * - Activez Firebase App Check
 * - Configurez correctement les règles de sécurité Firestore
 * - Limitez les domaines autorisés dans la console Firebase
 * - Utilisez l'authentification pour protéger vos données
 */

// Tentative de chargement de la configuration locale
if (typeof firebaseConfigLocal !== 'undefined') {
    Object.assign(firebaseConfig, firebaseConfigLocal);
}

// Export de la configuration
window.firebaseConfig = firebaseConfig;

/**
 * URL du proxy CORS pour GitHub Pages
 * 
 * Après avoir déployé le proxy sur Vercel/Netlify, remplacez l'URL ci-dessous
 * Exemple: window.PROXY_URL = 'https://mon-proxy.vercel.app/api';
 */
window.PROXY_URL = null; // À configurer après déploiement du proxy
