/**
 * Script à injecter dans la page EcoleDirecte pour capturer le token
 * L'utilisateur devra copier ce code dans la console de la popup
 */

(function() {
    console.log('🔍 Interception du token EcoleDirecte...');
    
    // Intercepter les requêtes fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            // Cloner la réponse pour pouvoir la lire
            const clonedResponse = response.clone();
            
            // Essayer de lire le JSON
            clonedResponse.json().then(data => {
                if (data && data.token) {
                    console.log('✅ TOKEN TROUVÉ:', data.token);
                    console.log('📋 Copiez ce token:', data.token);
                    
                    // Essayer de copier automatiquement
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(data.token).then(() => {
                            console.log('✅ Token copié dans le presse-papiers!');
                            alert('✅ Token copié! Collez-le dans le champ sur la page principale.');
                        });
                    }
                }
            }).catch(() => {});
            
            return response;
        });
    };
    
    // Intercepter XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };
    
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            try {
                const data = JSON.parse(this.responseText);
                if (data && data.token) {
                    console.log('✅ TOKEN TROUVÉ (XHR):', data.token);
                    console.log('📋 Copiez ce token:', data.token);
                    
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(data.token).then(() => {
                            console.log('✅ Token copié dans le presse-papiers!');
                            alert('✅ Token copié! Collez-le dans le champ sur la page principale.');
                        });
                    }
                }
            } catch(e) {}
        });
        return originalSend.apply(this, arguments);
    };
    
    console.log('✅ Interception activée! Connectez-vous maintenant...');
})();
