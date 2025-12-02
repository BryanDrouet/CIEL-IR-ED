/**
 * Serveur proxy CORS pour EcoleDirecte
 * À déployer sur Vercel, Netlify ou Cloudflare Workers (GRATUIT)
 * 
 * Ce fichier permet de contourner le CORS pour GitHub Pages
 */

// Configuration CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
    // Gérer les requêtes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }

    try {
        // Extraire le chemin de l'API depuis l'URL
        const apiPath = req.query.path || 'login.awp';
        const ecoleDirecteUrl = `https://api.ecoledirecte.com/v3/${apiPath}`;

        console.log(`[PROXY] ${req.method} ${ecoleDirecteUrl}`);

        // Préparer les options de la requête
        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        };

        // Ajouter le body pour POST
        if (req.method === 'POST' && req.body) {
            // Convertir le JSON en form-urlencoded
            const formData = new URLSearchParams();
            formData.append('data', JSON.stringify(req.body));
            options.body = formData.toString();
        }

        // Faire la requête à EcoleDirecte
        const response = await fetch(ecoleDirecteUrl, options);
        const data = await response.json();

        console.log(`[PROXY] Response: ${response.status}`);

        // Ajouter les headers CORS
        Object.keys(corsHeaders).forEach(key => {
            res.setHeader(key, corsHeaders[key]);
        });

        // Renvoyer la réponse
        return res.status(response.status).json(data);

    } catch (error) {
        console.error('[PROXY] Erreur:', error);

        Object.keys(corsHeaders).forEach(key => {
            res.setHeader(key, corsHeaders[key]);
        });

        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
}
