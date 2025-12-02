/**
 * Version simplifiée - Redirection vers EcoleDirecte
 */

class SimpleEcoleDirecte {
    constructor() {
        this.loginUrl = 'https://www.ecoledirecte.com/login';
    }

    /**
     * Redirection simple vers EcoleDirecte avec auto-remplissage des identifiants
     */
    loginAndRedirect(username, password) {
        console.log('🔐 Redirection vers EcoleDirecte...');
        
        // Sauvegarder les identifiants pour auto-remplissage
        if (username) {
            sessionStorage.setItem('ed_username', username);
        }
        if (password) {
            sessionStorage.setItem('ed_password', password);
        }

        // Créer un formulaire invisible qui sera soumis
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.loginUrl;
        form.target = '_blank';
        form.style.display = 'none';

        // Ajouter les champs
        const usernameField = document.createElement('input');
        usernameField.type = 'text';
        usernameField.name = 'identifiant';
        usernameField.value = username;
        form.appendChild(usernameField);

        const passwordField = document.createElement('input');
        passwordField.type = 'password';
        passwordField.name = 'motdepasse';
        passwordField.value = password;
        form.appendChild(passwordField);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        return {
            success: true,
            message: 'Redirection vers EcoleDirecte...'
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
