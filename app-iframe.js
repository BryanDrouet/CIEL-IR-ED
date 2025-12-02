/**
 * Application avec connexion via iframe EcoleDirecte
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application chargée');

    // Vérifier si déjà connecté
    checkExistingConnection();

    // Gérer le bouton de connexion
    const loginBtn = document.getElementById('ed-login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    // Gérer le bouton de déconnexion
    const logoutBtn = document.getElementById('ed-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Gérer le bouton de rafraîchissement
    const refreshBtn = document.getElementById('ed-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefresh);
    }
});

/**
 * Vérifier si une connexion existe déjà
 */
function checkExistingConnection() {
    const token = localStorage.getItem('ed_token');
    const account = localStorage.getItem('ed_account');

    if (token && account) {
        console.log('✅ Session existante trouvée');
        displayConnectedState(JSON.parse(account));
    } else {
        displayDisconnectedState();
    }
}

/**
 * Gérer la connexion
 */
async function handleLogin() {
    console.log('🔐 Démarrage de la connexion...');
    
    const loginBtn = document.getElementById('ed-login-btn');
    const statusDiv = document.getElementById('ed-status');

    // Désactiver le bouton
    loginBtn.disabled = true;
    loginBtn.textContent = '⏳ Connexion...';

    if (statusDiv) {
        statusDiv.innerHTML = '<p class="status-info">🌐 Ouverture d\'EcoleDirecte...</p>';
    }

    try {
        // Ouvrir l'iframe et attendre la connexion
        const data = await window.edScraper.connect();
        
        console.log('✅ Connexion réussie!', data);

        if (statusDiv) {
            statusDiv.innerHTML = '<p class="status-success">✅ Connecté avec succès!</p>';
        }

        // Sauvegarder les données
        if (data.token) {
            localStorage.setItem('ed_token', data.token);
        }
        if (data.account) {
            localStorage.setItem('ed_account', JSON.stringify(data.account));
        }
        localStorage.setItem('ed_data', JSON.stringify(data));
        localStorage.setItem('ed_last_sync', new Date().toISOString());

        // Afficher les données
        displayUserData(data);
        displayConnectedState(data.account || {});

    } catch (error) {
        console.error('❌ Erreur de connexion:', error);
        
        if (statusDiv) {
            statusDiv.innerHTML = `<p class="status-error">❌ Erreur: ${error.message}</p>`;
        }

        loginBtn.disabled = false;
        loginBtn.textContent = '🔐 Se connecter avec EcoleDirecte';
    }
}

/**
 * Gérer la déconnexion
 */
function handleLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        window.edScraper.disconnect();
        
        const dataDiv = document.getElementById('ed-data');
        if (dataDiv) {
            dataDiv.innerHTML = '';
        }

        const statusDiv = document.getElementById('ed-status');
        if (statusDiv) {
            statusDiv.innerHTML = '<p class="status-info">🔓 Déconnecté</p>';
        }

        displayDisconnectedState();
    }
}

/**
 * Gérer le rafraîchissement
 */
async function handleRefresh() {
    console.log('🔄 Rafraîchissement des données...');
    
    const refreshBtn = document.getElementById('ed-refresh-btn');
    const statusDiv = document.getElementById('ed-status');

    refreshBtn.disabled = true;
    refreshBtn.textContent = '⏳ Rafraîchissement...';

    if (statusDiv) {
        statusDiv.innerHTML = '<p class="status-info">🔄 Veuillez vous reconnecter...</p>';
    }

    // Effacer les anciennes données
    localStorage.removeItem('ed_data');
    window.edScraper.disconnect();

    // Relancer la connexion
    await handleLogin();

    refreshBtn.disabled = false;
    refreshBtn.textContent = '🔄 Rafraîchir';
}

/**
 * Afficher l'état connecté
 */
function displayConnectedState(account) {
    const loginBtn = document.getElementById('ed-login-btn');
    const logoutBtn = document.getElementById('ed-logout-btn');
    const refreshBtn = document.getElementById('ed-refresh-btn');

    if (loginBtn) {
        loginBtn.style.display = 'none';
    }
    if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
    }
    if (refreshBtn) {
        refreshBtn.style.display = 'inline-block';
    }

    // Afficher les données sauvegardées
    const savedData = localStorage.getItem('ed_data');
    if (savedData) {
        displayUserData(JSON.parse(savedData));
    }
}

/**
 * Afficher l'état déconnecté
 */
function displayDisconnectedState() {
    const loginBtn = document.getElementById('ed-login-btn');
    const logoutBtn = document.getElementById('ed-logout-btn');
    const refreshBtn = document.getElementById('ed-refresh-btn');

    if (loginBtn) {
        loginBtn.style.display = 'inline-block';
        loginBtn.disabled = false;
        loginBtn.textContent = '🔐 Se connecter avec EcoleDirecte';
    }
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
    if (refreshBtn) {
        refreshBtn.style.display = 'none';
    }
}

/**
 * Afficher les données utilisateur
 */
function displayUserData(data) {
    const dataDiv = document.getElementById('ed-data');
    if (!dataDiv) return;

    let html = '<div class="user-data">';
    
    // Nom d'utilisateur
    if (data.userName) {
        html += `<h3>👤 ${data.userName}</h3>`;
    }

    // Compte
    if (data.account) {
        html += `<div class="account-info">
            <p><strong>Type:</strong> ${data.account.typeCompte || 'N/A'}</p>
            <p><strong>ID:</strong> ${data.account.id || 'N/A'}</p>
        </div>`;
    }

    // Notes
    if (data.grades && data.grades.length > 0) {
        html += '<h4>📊 Notes récentes</h4><ul class="grades-list">';
        data.grades.slice(0, 10).forEach(grade => {
            html += `<li>
                <span class="subject">${grade.subject || 'N/A'}</span>
                <span class="value">${grade.value || 'N/A'}</span>
                <span class="date">${grade.date || 'N/A'}</span>
            </li>`;
        });
        html += '</ul>';
    }

    // Emploi du temps
    if (data.schedule && data.schedule.length > 0) {
        html += '<h4>📅 Emploi du temps</h4><ul class="schedule-list">';
        data.schedule.slice(0, 10).forEach(lesson => {
            html += `<li>
                <span class="time">${lesson.time || 'N/A'}</span>
                <span class="subject">${lesson.subject || 'N/A'}</span>
                <span class="room">${lesson.room || ''}</span>
            </li>`;
        });
        html += '</ul>';
    }

    // Dernière synchronisation
    const lastSync = localStorage.getItem('ed_last_sync');
    if (lastSync) {
        const syncDate = new Date(lastSync);
        html += `<p class="last-sync">🕐 Dernière synchro: ${syncDate.toLocaleString('fr-FR')}</p>`;
    }

    html += '</div>';

    dataDiv.innerHTML = html;
}
