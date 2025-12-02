/**
 * Application principale
 * Orchestre tous les modules et gère le flux de l'application
 */

// Instances globales
let ecoleDirecteAPI;
let gradeCalculator;
let chartsManager;
let notificationManager;
let scheduleManager;
let messagingManager;
let homeworkManager;
let schoolLifeManager;
let navigationManager;
let currentUser = null;

/**
 * Initialisation de l'application
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser Firebase
    initFirebase();

    // Initialiser les modules
    ecoleDirecteAPI = new EcoleDirecteAPI();
    gradeCalculator = new GradeCalculator();
    chartsManager = new ChartsManager();
    notificationManager = new NotificationManager();
    scheduleManager = new ScheduleManager();
    messagingManager = new MessagingManager();
    homeworkManager = new HomeworkManager();
    schoolLifeManager = new SchoolLifeManager();
    navigationManager = new NavigationManager();

    // Rendre les managers accessibles globalement
    window.ecoleDirecteAPI = ecoleDirecteAPI;
    window.scheduleManager = scheduleManager;
    window.messagingManager = messagingManager;
    window.homeworkManager = homeworkManager;
    window.schoolLifeManager = schoolLifeManager;

    // Configurer les événements
    setupEventListeners();

    // Vérifier l'état d'authentification
    firebase.auth().onAuthStateChanged(handleAuthStateChange);
});

/**
 * Initialise Firebase
 */
function initFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}

/**
 * Configure les écouteurs d'événements
 */
function setupEventListeners() {
    // Formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Bouton de rafraîchissement
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefresh);
    }
}

/**
 * Gère le changement d'état d'authentification
 */
async function handleAuthStateChange(user) {
    if (user) {
        currentUser = user;
        await initDashboard();
    } else {
        currentUser = null;
        showLoginSection();
    }
}

/**
 * Gère la connexion
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    if (!username || !password) {
        showError(errorDiv, 'Veuillez remplir tous les champs');
        return;
    }

    showLoader(true);
    hideError(errorDiv);

    try {
        // Se connecter à EcoleDirecte
        const edResult = await ecoleDirecteAPI.login(username, password);

        if (!edResult.success) {
            throw new Error('Échec de la connexion à EcoleDirecte');
        }

        // Authentifier avec Firebase (anonyme pour cet exemple)
        await firebase.auth().signInAnonymously();

        // Le reste sera géré par onAuthStateChanged

    } catch (error) {
        console.error('Erreur de connexion:', error);
        showError(errorDiv, error.message || 'Erreur de connexion. Vérifiez vos identifiants.');
        showLoader(false);
    }
}

/**
 * Gère la déconnexion
 */
async function handleLogout() {
    try {
        // Nettoyer les notifications
        if (notificationManager) {
            notificationManager.cleanup();
        }

        // Nettoyer les graphiques
        if (chartsManager) {
            chartsManager.destroyAllCharts();
        }

        // Déconnexion Firebase
        await firebase.auth().signOut();

        // Réinitialiser les instances
        ecoleDirecteAPI = new EcoleDirecteAPI();
        gradeCalculator = new GradeCalculator();
        chartsManager = new ChartsManager();
        scheduleManager = new ScheduleManager();
        messagingManager = new MessagingManager();
        homeworkManager = new HomeworkManager();
        schoolLifeManager = new SchoolLifeManager();

    } catch (error) {
        console.error('Erreur de déconnexion:', error);
    }
}

/**
 * Gère le rafraîchissement des données
 */
async function handleRefresh() {
    showLoader(true);
    
    try {
        await loadDashboardData();
    } catch (error) {
        console.error('Erreur de rafraîchissement:', error);
        alert('Erreur lors du rafraîchissement des données');
    } finally {
        showLoader(false);
    }
}

/**
 * Initialise le tableau de bord
 */
async function initDashboard() {
    showLoader(true);

    try {
        // Initialiser le système de notifications
        await notificationManager.init();

        // Charger les données
        await loadDashboardData();

        // Afficher le tableau de bord
        showDashboardSection();

    } catch (error) {
        console.error('Erreur initialisation dashboard:', error);
        alert('Erreur lors du chargement du tableau de bord');
        await handleLogout();
    } finally {
        showLoader(false);
    }
}

/**
 * Charge les données du tableau de bord
 */
async function loadDashboardData() {
    try {
        // Reconnecter à EcoleDirecte si nécessaire
        const loginResult = await ecoleDirecteAPI.autoLogin();
        
        if (!loginResult) {
            throw new Error('Reconnexion nécessaire');
        }

        // Afficher le nom de l'utilisateur
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = loginResult.user.name;
        }

        // Récupérer les notes
        const gradesData = await ecoleDirecteAPI.getGrades();
        
        // Charger dans le calculateur
        gradeCalculator.loadGrades(gradesData);

        // Calculer les statistiques
        const statistics = gradeCalculator.getStatistics();

        // Mettre à jour l'interface
        updateStatistics(statistics);
        updateGradesDisplay(gradesData.subjects);
        
        // Mettre à jour les graphiques
        chartsManager.updateAllCharts(statistics);

        // Vérifier les nouvelles notes
        await notificationManager.checkForNewGrades(gradesData.allGrades);

    } catch (error) {
        console.error('Erreur chargement données:', error);
        throw error;
    }
}

/**
 * Met à jour les statistiques affichées
 */
function updateStatistics(stats) {
    // Moyenne générale
    const avgElement = document.getElementById('averageGeneral');
    if (avgElement) {
        avgElement.textContent = stats.generalAverage ? `${stats.generalAverage}/20` : '--';
    }

    // Tendance
    const trendElement = document.getElementById('averageTrend');
    if (trendElement && stats.evolution.length >= 2) {
        const lastTwo = stats.evolution.slice(-2);
        const diff = parseFloat(lastTwo[1].average) - parseFloat(lastTwo[0].average);
        
        if (diff > 0) {
            trendElement.textContent = `↗ +${diff.toFixed(2)}`;
            trendElement.className = 'stat-trend positive';
        } else if (diff < 0) {
            trendElement.textContent = `↘ ${diff.toFixed(2)}`;
            trendElement.className = 'stat-trend negative';
        } else {
            trendElement.textContent = '→ Stable';
            trendElement.className = 'stat-trend';
        }
    }

    // Nombre de notes
    const gradeCountElement = document.getElementById('gradeCount');
    if (gradeCountElement) {
        gradeCountElement.textContent = stats.totalGrades;
    }

    // Meilleure matière
    const bestSubjectElement = document.getElementById('bestSubject');
    if (bestSubjectElement && stats.bestSubject) {
        bestSubjectElement.textContent = `${stats.bestSubject.name} (${stats.bestSubject.average})`;
        bestSubjectElement.style.fontSize = '1.2em';
    }

    // Dernière mise à jour
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        lastUpdateElement.style.fontSize = '1.2em';
    }
}

/**
 * Met à jour l'affichage des notes par matière
 */
function updateGradesDisplay(subjects) {
    const container = document.getElementById('gradesContainer');
    if (!container) return;

    container.innerHTML = '';

    subjects.forEach(subject => {
        const average = gradeCalculator.calculateSubjectAverage(subject);
        if (average === null) return;

        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';

        const gradesList = subject.grades
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(grade => `
                <div class="grade-item">
                    <div class="grade-info">
                        <div class="grade-title">${grade.title || 'Devoir'}</div>
                        <div class="grade-date">${formatDate(grade.date)}</div>
                    </div>
                    <div class="grade-value">${grade.value}/${grade.max}</div>
                </div>
            `).join('');

        subjectCard.innerHTML = `
            <div class="subject-header">
                <span class="subject-name">${subject.name}</span>
                <span class="subject-average">${average.toFixed(2)}/20</span>
            </div>
            <div class="grades-list">
                ${gradesList}
            </div>
        `;

        container.appendChild(subjectCard);
    });
}

/**
 * Affiche la section de connexion
 */
function showLoginSection() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('dashboardSection').classList.add('hidden');
}

/**
 * Affiche la section du tableau de bord
 */
function showDashboardSection() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboardSection').classList.remove('hidden');
}

/**
 * Affiche/masque le loader
 */
function showLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        if (show) {
            loader.classList.remove('hidden');
        } else {
            loader.classList.add('hidden');
        }
    }
}

/**
 * Affiche un message d'erreur
 */
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

/**
 * Masque un message d'erreur
 */
function hideError(element) {
    if (element) {
        element.textContent = '';
        element.classList.remove('show');
    }
}

/**
 * Formate une date
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (notificationManager) {
        notificationManager.cleanup();
    }
});
