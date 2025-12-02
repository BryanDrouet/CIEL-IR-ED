/**
 * Version simplifiée - Redirection vers EcoleDirecte
 */

class SimpleEcoleDirecte {
    constructor() {
        this.loginUrl = 'https://www.ecoledirecte.com/login';
    }

    /**
     * Redirection simple vers EcoleDirecte
     * Note: EcoleDirecte bloque les POST automatiques (405), donc on ouvre juste le site
     */
    loginAndRedirect(username, password) {
        console.log('🔐 Ouverture d\'EcoleDirecte...');
        
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
            message: '✅ EcoleDirecte ouvert - connectez-vous avec vos identifiants'
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
