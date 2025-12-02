const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Gérer les requêtes OPTIONS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Extraire le chemin de l'API
        const path = event.path.replace('/.netlify/functions/proxy', '');
        const apiPath = event.queryStringParameters.path || 'login.awp';
        const ecoleDirecteUrl = `https://api.ecoledirecte.com/v3/${apiPath}`;

        console.log(`[PROXY] ${event.httpMethod} ${ecoleDirecteUrl}`);

        // Préparer la requête
        const options = {
            method: event.httpMethod,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0'
            }
        };

        // Ajouter le body pour POST
        if (event.httpMethod === 'POST' && event.body) {
            const body = JSON.parse(event.body);
            const formData = new URLSearchParams();
            formData.append('data', JSON.stringify(body));
            options.body = formData.toString();
        }

        // Faire la requête
        const response = await fetch(ecoleDirecteUrl, options);
        const data = await response.json();

        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('[PROXY] Erreur:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ code: 500, message: error.message })
        };
    }
};
