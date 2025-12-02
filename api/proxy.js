/**
 * Proxy API pour contourner les restrictions CORS d'EcoleDirecte
 * Déployé sur Vercel comme serverless function
 */

export default async function handler(req, res) {
    // Autoriser les CORS avec support des cookies
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, X-Token, X-Gtk, User-Agent');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

    // Gérer les requêtes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Extraire le chemin de l'API depuis l'URL
        const { path, getGtkCookie } = req.query;
        
        if (!path) {
            res.status(400).json({ error: 'Path parameter is required' });
            return;
        }

        // Construire l'URL de l'API EcoleDirecte (le path contient déjà les query params)
        const apiUrl = `https://api.ecoledirecte.com/v3/${path}`;

        // Préparer les headers
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        };

        // Ajouter le token si présent
        if (req.headers['x-token']) {
            headers['X-Token'] = req.headers['x-token'];
        }

        // Ajouter le cookie GTK si présent
        if (req.headers['x-gtk']) {
            headers['X-Gtk'] = req.headers['x-gtk'];
        }

        // Préparer le body
        let body = undefined;
        if (req.method !== 'GET' && req.body) {
            // Si le body est un objet, le convertir en URLSearchParams
            if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
                body = new URLSearchParams(req.body).toString();
            } else if (typeof req.body === 'string') {
                body = req.body;
            } else {
                body = req.body.toString();
            }
        }

        console.log('Proxy request:', { apiUrl, method: req.method, bodyLength: body?.length });

        // Faire la requête vers EcoleDirecte
        const response = await fetch(apiUrl, {
            method: req.method,
            headers: headers,
            body: body,
        });

        // Logger tous les headers de réponse pour debug
        console.log('📋 Headers de réponse EcoleDirecte:');
        for (const [key, value] of response.headers.entries()) {
            console.log(`  ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
        }

        // Récupérer les cookies de la réponse (compatible Vercel)
        let setCookieHeaders = null;
        
        // Essayer plusieurs méthodes pour récupérer les cookies
        if (response.headers.getSetCookie) {
            // Node.js 18+ / Edge runtime
            setCookieHeaders = response.headers.getSetCookie();
            console.log('✅ Cookies via getSetCookie():', setCookieHeaders?.length || 0);
        } else if (response.headers.get('set-cookie')) {
            // Fallback
            const cookieHeader = response.headers.get('set-cookie');
            setCookieHeaders = cookieHeader ? [cookieHeader] : null;
            console.log('✅ Cookies via get(set-cookie):', setCookieHeaders?.length || 0);
        } else {
            console.log('❌ Aucune méthode de récupération de cookies disponible');
        }

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            res.setHeader('Set-Cookie', setCookieHeaders);
        }

        // Pour les requêtes GET spéciales (récupération GTK), extraire et retourner le cookie
        if (req.method === 'GET' && getGtkCookie === 'true') {
            console.log('🔍 Proxy GET GTK response:', { 
                status: response.status, 
                hasCookies: !!setCookieHeaders,
                cookiesCount: setCookieHeaders?.length || 0
            });
            
            let gtkCookie = null;
            if (setCookieHeaders && setCookieHeaders.length > 0) {
                console.log('🍪 Cookies bruts:', setCookieHeaders);
                const cookieString = setCookieHeaders.join(';');
                console.log('🍪 Cookie string:', cookieString.substring(0, 200) + '...');
                const gtkMatch = cookieString.match(/GTK=([^;]+)/);
                if (gtkMatch) {
                    gtkCookie = gtkMatch[1];
                    console.log('✅ GTK extrait:', gtkCookie.substring(0, 50) + '...');
                } else {
                    console.error('❌ Pattern GTK= non trouvé dans:', cookieString.substring(0, 100));
                }
            } else {
                console.error('❌ Aucun cookie Set-Cookie dans la réponse');
            }
            
            const result = {
                success: !!gtkCookie, 
                gtkCookie: gtkCookie,
                status: response.status,
                debug: {
                    hasCookies: !!setCookieHeaders,
                    cookiesCount: setCookieHeaders?.length || 0
                }
            };
            
            console.log('📤 Retour JSON GTK:', result);
            res.status(200).json(result);
            return;
        }

        // Pour les autres requêtes GET, retourner le statut et les headers
        if (req.method === 'GET') {
            console.log('Proxy GET response:', { status: response.status, hasCookies: !!setCookieHeaders });
            res.status(response.status).end();
            return;
        }

        // Pour les requêtes POST, retourner le JSON
        const data = await response.json();

        console.log('Proxy response:', { status: response.status, code: data.code });

        // Retourner la réponse
        res.status(response.status).json(data);

    } catch (error) {
        console.error('Erreur proxy:', error);
        res.status(500).json({ 
            error: 'Erreur du proxy',
            message: error.message,
            stack: error.stack
        });
    }
}
