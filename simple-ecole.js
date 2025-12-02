/**
 * Version simplifiée - Connexion automatique via proxy
 */

class SimpleEcoleDirecte {
    constructor() {
        this.loginUrl = 'https://www.ecoledirecte.com/login';
        this.apiUrl = 'https://api.ecoledirecte.com/v3';
        this.proxyUrl = '/api/proxy';
    }

    /**
     * Connexion automatique et redirection vers le panel
     */
    async loginAndRedirect(username, password) {
        console.log('🔐 Connexion automatique en cours...');
        
        try {
            // Étape 1: Récupérer le cookie GTK
            console.log('📋 Récupération du cookie GTK...');
            const gtkCookie = await this.getGtkCookie();
            
            if (!gtkCookie) {
                console.error('❌ Impossible de récupérer le cookie GTK');
                return this.fallbackToManualLogin(username, password);
            }
            
            console.log('✅ Cookie GTK récupéré:', gtkCookie);

            // Étape 2: Se connecter avec l'API
            console.log('📋 Connexion à l\'API...');
            const loginResult = await this.loginWithGtk(username, password, gtkCookie);
            
            if (loginResult.success) {
                console.log('✅ Connexion réussie!');
                
                // Sauvegarder le token et les données
                sessionStorage.setItem('ed_token', loginResult.token);
                sessionStorage.setItem('ed_account', JSON.stringify(loginResult.account));
                
                // Rediriger vers le panel EcoleDirecte
                window.location.href = `https://www.ecoledirecte.com/${loginResult.account.typeCompte.toLowerCase()}/${loginResult.account.id}`;
                
                return {
                    success: true,
                    message: '✅ Connexion réussie! Redirection...'
                };
            } else {
                console.error('❌ Échec de connexion:', loginResult.error);
                return this.fallbackToManualLogin(username, password);
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la connexion:', error);
            return this.fallbackToManualLogin(username, password);
        }
    }

    /**
     * Récupérer le cookie GTK via le proxy
     */
    async getGtkCookie() {
        try {
            const response = await fetch(`${this.proxyUrl}?path=login.awp&getGtkCookie=true&gtk=1&v=4.75.0`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('📋 Réponse GTK:', data);
            return data.gtkCookie || null;
            
        } catch (error) {
            console.error('Erreur getGtkCookie:', error);
            return null;
        }
    }

    /**
     * Se connecter avec le cookie GTK
     */
    async loginWithGtk(username, password, gtkCookie) {
        try {
            const payload = {
                identifiant: username,
                motdepasse: password
            };

            const response = await fetch(`${this.proxyUrl}?path=login.awp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Gtk': gtkCookie
                },
                credentials: 'include',
                body: `data=${encodeURIComponent(JSON.stringify(payload))}`
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (data.code === 200) {
                return {
                    success: true,
                    token: data.token,
                    account: data.data.accounts[0]
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Identifiants invalides'
                };
            }
            
        } catch (error) {
            console.error('Erreur loginWithGtk:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Fallback: Ouvrir EcoleDirecte manuellement
     */
    fallbackToManualLogin(username, password) {
        console.log('🔄 Passage en mode manuel...');
        
        // Sauvegarder les identifiants pour une future utilisation
        if (username) {
            sessionStorage.setItem('ed_username', username);
        }

        // Ouvrir EcoleDirecte dans un nouvel onglet
        const loginWindow = window.open(this.loginUrl, 'EcoleDirecte', 'width=1200,height=800');
        
        if (!loginWindow) {
            return {
                success: false,
                message: '⚠️ Les popups sont bloquées. Veuillez autoriser les popups pour ce site.'
            };
        }

        return {
            success: true,
            message: '⚠️ Connexion automatique impossible - utilisez la fenêtre ouverte',
            showInstructions: true
        };
    }

    /**
     * Ouvrir EcoleDirecte dans un nouvel onglet
     */
    openEcoleDirecte() {
        window.open(this.loginUrl, '_blank');
    }

    /**
     * Intégrer EcoleDirecte dans une iframe
     */
    embedEcoleDirecte(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container non trouvé:', containerId);
            return;
        }

        const iframe = document.createElement('iframe');
        iframe.src = this.loginUrl;
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.allow = 'clipboard-write; clipboard-read';
        
        container.innerHTML = '';
        container.appendChild(iframe);

        return iframe;
    }
}

window.SimpleEcoleDirecte = SimpleEcoleDirecte;
