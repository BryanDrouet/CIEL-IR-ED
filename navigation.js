/**
 * Module de gestion de la navigation entre onglets
 */

class NavigationManager {
    constructor() {
        this.currentTab = 'overview';
        this.setupEventListeners();
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Navigation par onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Emploi du temps
        const prevWeekBtn = document.getElementById('prevWeek');
        const nextWeekBtn = document.getElementById('nextWeek');
        const todayBtn = document.getElementById('todayBtn');

        if (prevWeekBtn) {
            prevWeekBtn.addEventListener('click', () => {
                if (window.scheduleManager) {
                    window.scheduleManager.previousWeek();
                }
            });
        }

        if (nextWeekBtn) {
            nextWeekBtn.addEventListener('click', () => {
                if (window.scheduleManager) {
                    window.scheduleManager.nextWeek();
                }
            });
        }

        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                if (window.scheduleManager) {
                    window.scheduleManager.goToToday();
                }
            });
        }

        // Messagerie
        const backToListBtn = document.getElementById('backToList');
        if (backToListBtn) {
            backToListBtn.addEventListener('click', () => {
                if (window.messagingManager) {
                    window.messagingManager.backToList();
                }
            });
        }

        // Filtres de messagerie
        document.querySelectorAll('.message-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.message-filters .filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                if (window.messagingManager) {
                    window.messagingManager.displayMessages(filter);
                }
            });
        });

        // Filtre du cahier de texte
        const homeworkFilter = document.getElementById('homeworkFilter');
        if (homeworkFilter) {
            homeworkFilter.addEventListener('change', (e) => {
                if (window.homeworkManager) {
                    window.homeworkManager.displayHomework(e.target.value);
                }
            });
        }
    }

    /**
     * Change d'onglet
     */
    switchTab(tabName) {
        // Désactiver tous les onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activer l'onglet sélectionné
        const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabBtn) {
            tabBtn.classList.add('active');
        }

        const tabContent = document.getElementById(`${tabName}Tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }

        this.currentTab = tabName;

        // Charger les données spécifiques à l'onglet si nécessaire
        this.loadTabData(tabName);
    }

    /**
     * Charge les données d'un onglet
     */
    async loadTabData(tabName) {
        switch (tabName) {
            case 'schedule':
                if (window.scheduleManager && window.ecoleDirecteAPI) {
                    await window.scheduleManager.fetchSchedule(window.ecoleDirecteAPI);
                    window.scheduleManager.displaySchedule();
                }
                break;

            case 'messages':
                if (window.messagingManager && window.ecoleDirecteAPI) {
                    await window.messagingManager.fetchMessages(window.ecoleDirecteAPI);
                    window.messagingManager.displayMessages();
                }
                break;

            case 'homework':
                if (window.homeworkManager && window.ecoleDirecteAPI) {
                    await window.homeworkManager.fetchHomework(window.ecoleDirecteAPI);
                    await window.homeworkManager.loadHomeworkStatus();
                    window.homeworkManager.displayHomework();
                }
                break;

            case 'schoollife':
                if (window.schoolLifeManager && window.ecoleDirecteAPI) {
                    await window.schoolLifeManager.fetchSchoolLife(window.ecoleDirecteAPI);
                    window.schoolLifeManager.displaySchoolLife();
                }
                break;

            case 'classlife':
                // Les données de vie de classe sont déjà chargées ou sont statiques
                this.displayClassLife();
                break;
        }
    }

    /**
     * Affiche les données de vie de classe
     */
    displayClassLife() {
        // Annonces
        const announcementsContainer = document.getElementById('classAnnouncementsContainer');
        if (announcementsContainer) {
            const announcements = this.getMockAnnouncements();
            if (announcements.length === 0) {
                announcementsContainer.innerHTML = '<p class="info-message">Aucune annonce pour le moment</p>';
            } else {
                announcementsContainer.innerHTML = announcements.map(ann => `
                    <div class="announcement-item">
                        <div class="announcement-header">
                            <span class="announcement-title">${ann.title}</span>
                            <span class="announcement-date">${this.formatDate(ann.date)}</span>
                        </div>
                        <div class="announcement-content">${ann.content}</div>
                    </div>
                `).join('');
            }
        }

        // Événements
        const eventsContainer = document.getElementById('classEventsContainer');
        if (eventsContainer) {
            const events = this.getMockEvents();
            if (events.length === 0) {
                eventsContainer.innerHTML = '<p class="info-message">Aucun événement prévu</p>';
            } else {
                eventsContainer.innerHTML = events.map(evt => `
                    <div class="event-item">
                        <div class="event-date">${this.formatDate(evt.date)}</div>
                        <div class="event-title">${evt.title}</div>
                        <div class="event-location">${evt.location}</div>
                    </div>
                `).join('');
            }
        }

        // Documents
        const documentsContainer = document.getElementById('classDocumentsContainer');
        if (documentsContainer) {
            const documents = this.getMockDocuments();
            if (documents.length === 0) {
                documentsContainer.innerHTML = '<p class="info-message">Aucun document disponible</p>';
            } else {
                documentsContainer.innerHTML = documents.map(doc => `
                    <div class="document-item">
                        <span class="document-icon">${this.getDocumentIcon(doc.type)}</span>
                        <div class="document-info">
                            <div class="document-name">${doc.name}</div>
                            <div class="document-size">${doc.size}</div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    /**
     * Formate une date
     */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * Retourne l'icône selon le type de document
     */
    getDocumentIcon(type) {
        const icons = {
            pdf: '📄',
            doc: '📝',
            xls: '📊',
            ppt: '📽️',
            img: '🖼️'
        };
        return icons[type] || '📎';
    }

    /**
     * Données de démonstration - Annonces
     */
    getMockAnnouncements() {
        const today = new Date();
        return [
            {
                title: 'Sortie scolaire',
                content: 'La sortie au musée prévue pour le 15 décembre est confirmée. N\'oubliez pas votre autorisation parentale.',
                date: new Date(today - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                title: 'Photo de classe',
                content: 'La photo de classe aura lieu le jeudi 7 décembre. Merci de porter la tenue réglementaire.',
                date: new Date(today - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
    }

    /**
     * Données de démonstration - Événements
     */
    getMockEvents() {
        const today = new Date();
        return [
            {
                title: 'Conseil de classe',
                date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Salle des professeurs'
            },
            {
                title: 'Remise des bulletins',
                date: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Amphithéâtre'
            }
        ];
    }

    /**
     * Données de démonstration - Documents
     */
    getMockDocuments() {
        return [
            {
                name: 'Règlement intérieur',
                type: 'pdf',
                size: '245 Ko'
            },
            {
                name: 'Planning des devoirs surveillés',
                type: 'pdf',
                size: '128 Ko'
            },
            {
                name: 'Liste des fournitures',
                type: 'doc',
                size: '56 Ko'
            }
        ];
    }
}

window.NavigationManager = NavigationManager;
