/**
 * Serveur proxy pour contourner le CORS de l'API EcoleDirecte
 * 
 * Installation:
 * npm install express cors node-fetch
 * 
 * Lancement:
 * node proxy-server.js
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Activer CORS pour toutes les requêtes
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Route proxy pour l'API EcoleDirecte
app.all('/api/*', async (req, res) => {
    try {
        // Construire l'URL de l'API EcoleDirecte
        const apiPath = req.params[0];
        const ecoleDirecteUrl = `https://api.ecoledirecte.com/v3/${apiPath}`;
        
        console.log(`[PROXY] ${req.method} ${ecoleDirecteUrl}`);
        
        // Options de la requête
        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };
        
        // Ajouter le body pour POST/PUT
        if (req.method !== 'GET' && req.body) {
            // Convertir en form-urlencoded
            const formData = new URLSearchParams();
            formData.append('data', JSON.stringify(req.body));
            options.body = formData;
        }
        
        // Faire la requête à EcoleDirecte
        const response = await fetch(ecoleDirecteUrl, options);
        const data = await response.json();
        
        console.log(`[PROXY] Response: ${response.status}`);
        
        // Renvoyer la réponse
        res.json(data);
        
    } catch (error) {
        console.error('[PROXY] Erreur:', error);
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║  🚀 Serveur proxy EcoleDirecte démarré !              ║
║                                                       ║
║  📍 Application:  http://localhost:${PORT}              ║
║  🔗 API Proxy:    http://localhost:${PORT}/api/        ║
║                                                       ║
║  💡 Ouvrez http://localhost:${PORT} dans votre        ║
║     navigateur pour utiliser l'application            ║
╚═══════════════════════════════════════════════════════╝
    `);
});
