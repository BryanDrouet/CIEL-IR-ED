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
            e.stopPropagation();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            console.log('📝 Connexion:', { username, rememberMe });

            // Effacer l'URL pour éviter que les identifiants y apparaissent
            if (window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // Sauvegarder le nom d'utilisateur si demandé
            if (rememberMe) {
                localStorage.setItem('ed_saved_username', username);
                console.log('💾 Nom d\'utilisateur sauvegardé');
            } else {
                localStorage.removeItem('ed_saved_username');
            }

            // Afficher un message
            showMessage('🌐 Ouverture d\'EcoleDirecte...', 'info');

            // Attendre un peu pour que l'utilisateur voie le message
            setTimeout(() => {
                // Ouvrir EcoleDirecte
                const result = simpleED.loginAndRedirect(username, password);
                
                if (result.success) {
                    showMessage('✅ EcoleDirecte ouvert - Connectez-vous avec vos identifiants', 'success');
                    
                    // Afficher les instructions
                    showInstructions(username, password);
                } else {
                    showMessage(result.message, 'error');
                }
            }, 500);
            
            return false;
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

/**
 * Afficher les instructions de connexion
 */
function showInstructions(username, password) {
    const modal = document.createElement('div');
    modal.className = 'instruction-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h2>📋 Instructions de connexion</h2>
            <p>Une fenêtre EcoleDirecte s'est ouverte. Voici vos identifiants :</p>
            
            <div class="credentials-box">
                <div class="credential-item">
                    <label>👤 Identifiant :</label>
                    <div class="credential-value">
                        <code>${username}</code>
                        <button onclick="navigator.clipboard.writeText('${username}'); this.textContent='✅ Copié!'; setTimeout(() => this.textContent='📋 Copier', 2000)" class="copy-btn">📋 Copier</button>
                    </div>
                </div>
                <div class="credential-item">
                    <label>🔒 Mot de passe :</label>
                    <div class="credential-value">
                        <code>${'•'.repeat(password.length)}</code>
                        <button onclick="navigator.clipboard.writeText('${password.replace(/'/g, "\\'")}'); this.textContent='✅ Copié!'; setTimeout(() => this.textContent='📋 Copier', 2000)" class="copy-btn">📋 Copier</button>
                    </div>
                </div>
            </div>
            
            <div class="tip-box">
                💡 <strong>Astuce :</strong> Utilisez le gestionnaire de mots de passe de votre navigateur pour sauvegarder vos identifiants EcoleDirecte.
            </div>
            
            <button onclick="this.closest('.instruction-modal').remove()" class="btn btn-primary">J'ai compris</button>
        </div>
    `;
    
    document.body.appendChild(modal);
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
    
    .instruction-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        position: relative;
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    }
    
    .modal-content h2 {
        margin: 0 0 16px 0;
        color: #1a1a1a;
    }
    
    .modal-content p {
        color: #666;
        margin: 0 0 24px 0;
    }
    
    .credentials-box {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 16px;
        margin: 24px 0;
    }
    
    .credential-item {
        margin-bottom: 16px;
    }
    
    .credential-item:last-child {
        margin-bottom: 0;
    }
    
    .credential-item label {
        display: block;
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
    }
    
    .credential-value {
        display: flex;
        gap: 12px;
        align-items: center;
    }
    
    .credential-value code {
        flex: 1;
        background: white;
        padding: 12px;
        border-radius: 6px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        border: 1px solid #ddd;
    }
    
    .copy-btn {
        padding: 8px 16px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        white-space: nowrap;
        transition: background 0.2s;
    }
    
    .copy-btn:hover {
        background: #1976d2;
    }
    
    .tip-box {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        padding: 12px 16px;
        border-radius: 4px;
        margin: 24px 0;
        font-size: 14px;
        color: #1565c0;
    }
    
    .modal-content .btn {
        width: 100%;
        margin-top: 8px;
    }
`;
document.head.appendChild(style);
