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
 * Se connecter à EcoleDirecte via l'API
 */
async function loginToEcoleDirecte(username, password) {
    try {
        const payload = {
            identifiant: username,
            motdepasse: password
        };

        const response = await fetch('/api/proxy?path=login.awp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${encodeURIComponent(JSON.stringify(payload))}`
        });

        if (!response.ok) {
            throw new Error('Erreur de connexion');
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
        console.error('Erreur loginToEcoleDirecte:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Récupérer les données EcoleDirecte via l'API
 */
async function fetchEcoleDirecteData(token, accountId) {
    try {
        console.log('📡 Récupération des données EcoleDirecte...');

        if (!token || !accountId) {
            console.error('Token ou accountId manquant');
            return null;
        }

        // Récupérer les notes
        const gradesResponse = await fetch(`/api/proxy?path=eleve/${accountId}/notes.awp?verbe=get`, {
            method: 'POST',
            headers: {
                'X-Token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data={}'
        });

        let grades = [];
        if (gradesResponse.ok) {
            const gradesData = await gradesResponse.json();
            if (gradesData.code === 200 && gradesData.data && gradesData.data.notes) {
                grades = gradesData.data.notes.map(note => ({
                    subject: note.libelleMatiere,
                    value: note.valeur + '/' + note.noteSur,
                    date: note.date,
                    coef: note.coef
                }));
            }
        }

        // Récupérer l'emploi du temps
        const scheduleResponse = await fetch(`/api/proxy?path=eleve/${accountId}/emploidutemps.awp?verbe=get`, {
            method: 'POST',
            headers: {
                'X-Token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data={}'
        });

        let schedule = [];
        if (scheduleResponse.ok) {
            const scheduleData = await scheduleResponse.json();
            if (scheduleData.code === 200 && scheduleData.data) {
                schedule = scheduleData.data.map(cours => ({
                    time: cours.start_date + ' - ' + cours.end_date,
                    subject: cours.text,
                    room: cours.salle || '',
                    teacher: cours.prof || ''
                }));
            }
        }

        // Récupérer les messages
        const messagesResponse = await fetch(`/api/proxy?path=eleve/${accountId}/messages.awp?verbe=get`, {
            method: 'POST',
            headers: {
                'X-Token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data={}'
        });

        let messages = [];
        if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            if (messagesData.code === 200 && messagesData.data && messagesData.data.messages) {
                messages = messagesData.data.messages.map(msg => ({
                    from: msg.from,
                    subject: msg.subject,
                    date: msg.date,
                    read: msg.read
                }));
            }
        }

        return {
            timestamp: new Date().toISOString(),
            grades: grades,
            schedule: schedule,
            messages: messages
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
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Sauvegarder le nom d'utilisateur si demandé
    if (rememberMe) {
        localStorage.setItem('ed_saved_username', username);
    } else {
        localStorage.removeItem('ed_saved_username');
    }

    // Afficher le loader
    if (loader) {
        loader.classList.remove('hidden');
    }

    if (loginError) {
        loginError.style.display = 'none';
    }

    try {
        // Connexion via l'API EcoleDirecte
        console.log('📡 Connexion à l\'API EcoleDirecte...');
        
        const loginResult = await loginToEcoleDirecte(username, password);
        
        if (!loginResult.success) {
            throw new Error(loginResult.error || 'Identifiants incorrects');
        }

        console.log('✅ Connexion réussie!');

        // Masquer le loader
        if (loader) {
            loader.classList.add('hidden');
        }

        // Récupérer toutes les données
        const fullData = await fetchEcoleDirecteData(loginResult.token, loginResult.account.id);
        
        // Fusionner avec les données du compte
        const completeData = {
            token: loginResult.token,
            account: loginResult.account,
            ...fullData
        };
        
        // Sauvegarder les données
        localStorage.setItem('ed_token', loginResult.token);
        localStorage.setItem('ed_account', JSON.stringify(loginResult.account));
        localStorage.setItem('ed_data', JSON.stringify(completeData));
        localStorage.setItem('ed_last_sync', new Date().toISOString());

        // Afficher le dashboard
        displayDashboard(loginResult.account);

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

