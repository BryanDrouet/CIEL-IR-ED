/**
 * Application simplifiée - Redirection directe vers EcoleDirecte
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application EcoleDirecte Simplifiée');

    const simpleED = new SimpleEcoleDirecte();
    
    // Charger les identifiants sauvegardés
    loadSavedCredentials();

    // Gérer la connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            console.log('📝 Connexion:', { username, rememberMe });

            // Sauvegarder le nom d'utilisateur si demandé
            if (rememberMe) {
                localStorage.setItem('ed_saved_username', username);
                console.log('💾 Nom d\'utilisateur sauvegardé');
            } else {
                localStorage.removeItem('ed_saved_username');
            }

            // Afficher un message
            showMessage('🌐 Redirection vers EcoleDirecte...', 'info');

            // Attendre un peu pour que l'utilisateur voie le message
            setTimeout(() => {
                // Ouvrir EcoleDirecte dans un nouvel onglet avec les identifiants
                simpleED.loginAndRedirect(username, password);
                
                // Ou intégrer dans une iframe
                // simpleED.embedEcoleDirecte('main-content');
                
                showMessage('✅ EcoleDirecte ouvert dans un nouvel onglet', 'success');
            }, 500);
        });
    }

    // Bouton "Ouvrir EcoleDirecte"
    const openButton = document.getElementById('open-ecoledirecte');
    if (openButton) {
        openButton.addEventListener('click', () => {
            simpleED.openEcoleDirecte();
        });
    }

    // Bouton "Intégrer dans la page"
    const embedButton = document.getElementById('embed-ecoledirecte');
    if (embedButton) {
        embedButton.addEventListener('click', () => {
            hideLoginScreen();
            simpleED.embedEcoleDirecte('main-content');
        });
    }
});

/**
 * Charger les identifiants sauvegardés
 */
function loadSavedCredentials() {
    const savedUsername = localStorage.getItem('ed_saved_username');
    if (savedUsername) {
        const usernameField = document.getElementById('username');
        const rememberMeCheckbox = document.getElementById('remember-me');
        
        if (usernameField) {
            usernameField.value = savedUsername;
            console.log('📥 Nom d\'utilisateur chargé:', savedUsername);
        }
        
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }
}

/**
 * Afficher un message à l'utilisateur
 */
function showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Créer un élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Retirer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Masquer l'écran de connexion
 */
function hideLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.style.display = 'none';
    }
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
