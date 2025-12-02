/**
 * Proxy API pour contourner les restrictions CORS d'EcoleDirecte
 * Déployé sur Vercel comme serverless function
 */

export default async function handler(req, res) {
    // Autoriser les CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, X-Token');

    // Gérer les requêtes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Extraire le chemin de l'API depuis l'URL
        const { path } = req.query;
        
        if (!path) {
            res.status(400).json({ error: 'Path parameter is required' });
            return;
        }

        // Construire l'URL de l'API EcoleDirecte
        const apiUrl = `https://api.ecoledirecte.com/v3/${path}`;

        // Préparer les headers
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        // Ajouter le token si présent
        if (req.headers['x-token']) {
            headers['X-Token'] = req.headers['x-token'];
        }

        // Faire la requête vers EcoleDirecte
        const response = await fetch(apiUrl, {
            method: req.method,
            headers: headers,
            body: req.method !== 'GET' ? req.body : undefined,
        });

        const data = await response.json();

        // Retourner la réponse
        res.status(response.status).json(data);

    } catch (error) {
        console.error('Erreur proxy:', error);
        res.status(500).json({ 
            error: 'Erreur du proxy',
            message: error.message 
        });
    }
}
