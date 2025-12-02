/**
 * Application avec connexion via iframe EcoleDirecte
 * Adaptée au design existant
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application chargée');

    // Vérifier si déjà connecté
    checkExistingConnection();

    // Gérer le formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            await handleLogin();
            
            return false;
        });
    }

    // Gérer le bouton de déconnexion (s'il existe)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

/**
 * Récupérer les données EcoleDirecte via l'API
 */
async function fetchEcoleDirecteData() {
    try {
        console.log('📡 Récupération des données EcoleDirecte...');

        // L'utilisateur est maintenant connecté sur ecoledirecte.com
        // On va essayer de récupérer les données via notre proxy
        
        // TODO: Pour l'instant on retourne des données factices
        // Car on ne peut pas accéder aux cookies de la popup (Same-Origin Policy)
        
        // Solution future: Extension navigateur ou serveur proxy avec session
        
        return {
            timestamp: new Date().toISOString(),
            account: {
                nom: 'Utilisateur',
                prenom: 'EcoleDirecte',
                typeCompte: 'Élève'
            },
            grades: [
                { subject: 'Mathématiques', value: '15/20', date: '01/12/2025' },
                { subject: 'Français', value: '14/20', date: '30/11/2025' },
                { subject: 'Histoire-Géo', value: '16/20', date: '29/11/2025' }
            ],
            schedule: [
                { time: '08:00 - 09:00', subject: 'Mathématiques', room: 'Salle 101' },
                { time: '09:00 - 10:00', subject: 'Français', room: 'Salle 205' },
                { time: '10:15 - 11:15', subject: 'Anglais', room: 'Salle 303' }
            ],
            messages: [
                { from: 'Administration', subject: 'Réunion parents-profs', date: '02/12/2025' }
            ]
        };

    } catch (error) {
        console.error('❌ Erreur fetchEcoleDirecteData:', error);
        return null;
    }
}

/**
 * Vérifier si une connexion existe déjà
 */
function checkExistingConnection() {
    const token = localStorage.getItem('ed_token');
    const account = localStorage.getItem('ed_account');

    if (token && account) {
        console.log('✅ Session existante trouvée');
        displayDashboard(JSON.parse(account));
    }
}

/**
 * Gérer la connexion
 */
async function handleLogin() {
    console.log('🔐 Démarrage de la connexion...');
    
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loader = document.getElementById('loader');
    const loginError = document.getElementById('loginError');

    // Afficher le loader
    if (loader) {
        loader.classList.remove('hidden');
    }

    try {
        // Ouvrir l'iframe et attendre la connexion
        const data = await window.edScraper.connect();
        
        console.log('✅ Connexion réussie!', data);

        // Masquer le loader
        if (loader) {
            loader.classList.add('hidden');
        }

        // Message de récupération des données
        if (loginError) {
            loginError.className = 'status-info';
            loginError.textContent = '📥 Récupération de vos données...';
            loginError.style.display = 'block';
        }

        // Récupérer les données réelles
        const realData = await fetchEcoleDirecteData();
        
        if (realData) {
            // Sauvegarder les données
            if (realData.token) {
                localStorage.setItem('ed_token', realData.token);
            }
            if (realData.account) {
                localStorage.setItem('ed_account', JSON.stringify(realData.account));
            }
            localStorage.setItem('ed_data', JSON.stringify(realData));
            localStorage.setItem('ed_last_sync', new Date().toISOString());

            // Afficher le dashboard
            displayDashboard(realData.account || {});
        } else {
            // Pas de données récupérées, afficher quand même le dashboard
            displayDashboard({});
        }

    } catch (error) {
        console.error('❌ Erreur de connexion:', error);
        
        // Masquer le loader
        if (loader) {
            loader.classList.add('hidden');
        }

        // Remettre la section de connexion visible
        if (loginSection) {
            loginSection.classList.remove('hidden');
        }
        if (dashboardSection) {
            dashboardSection.classList.add('hidden');
        }

        // Afficher l'erreur
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.textContent = error.message.includes('annulée') ? 
                '⚠️ Connexion annulée' : 
                `❌ Erreur: ${error.message}`;
            loginError.style.display = 'block';
            
            // Masquer l'erreur après 5 secondes
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 5000);
        }
    }
}

/**
 * Afficher le dashboard
 */
function displayDashboard(account) {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    if (loginSection) {
        loginSection.classList.add('hidden');
    }
    if (dashboardSection) {
        dashboardSection.classList.remove('hidden');
    }

    // Afficher les informations utilisateur
    const userInfo = document.getElementById('userInfo');
    if (userInfo && account) {
        userInfo.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">👤</div>
                <div class="user-details">
                    <h3>${account.prenom || ''} ${account.nom || ''}</h3>
                    <p>${account.typeCompte || 'Élève'}</p>
                </div>
            </div>
        `;
    }

    // Charger et afficher les données
    const savedData = localStorage.getItem('ed_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        displayGrades(data.grades);
        displaySchedule(data.schedule);
    }
}

/**
 * Afficher les notes
 */
function displayGrades(grades) {
    const gradesContainer = document.getElementById('gradesContainer');
    if (!gradesContainer || !grades || grades.length === 0) return;

    let html = '<div class="grades-list">';
    
    grades.slice(0, 20).forEach(grade => {
        html += `
            <div class="grade-item">
                <div class="grade-subject">${grade.subject || 'N/A'}</div>
                <div class="grade-value">${grade.value || 'N/A'}</div>
                <div class="grade-date">${grade.date || 'N/A'}</div>
            </div>
        `;
    });
    
    html += '</div>';
    gradesContainer.innerHTML = html;
}

/**
 * Afficher l'emploi du temps
 */
function displaySchedule(schedule) {
    const scheduleContainer = document.getElementById('scheduleContainer');
    if (!scheduleContainer || !schedule || schedule.length === 0) return;

    let html = '<div class="schedule-list">';
    
    schedule.slice(0, 20).forEach(lesson => {
        html += `
            <div class="schedule-item">
                <div class="schedule-time">${lesson.time || 'N/A'}</div>
                <div class="schedule-subject">${lesson.subject || 'N/A'}</div>
                <div class="schedule-room">${lesson.room || ''}</div>
            </div>
        `;
    });
    
    html += '</div>';
    scheduleContainer.innerHTML = html;
}

/**
 * Gérer la déconnexion
 */
function handleLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        window.edScraper.disconnect();
        
        const loginSection = document.getElementById('loginSection');
        const dashboardSection = document.getElementById('dashboardSection');

        if (loginSection) {
            loginSection.classList.remove('hidden');
        }
        if (dashboardSection) {
            dashboardSection.classList.add('hidden');
        }

        // Effacer le formulaire
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.reset();
        }
    }
}

