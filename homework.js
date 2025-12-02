/**
 * Module de gestion du cahier de texte (devoirs)
 */

class HomeworkManager {
    constructor() {
        this.homework = [];
        this.currentFilter = 'all';
    }

    /**
     * Récupère les devoirs depuis l'API
     */
    async fetchHomework(api) {
        try {
            const response = await api.getHomework();
            this.homework = response;
            return response;
        } catch (error) {
            console.error('Erreur récupération devoirs:', error);
            return this.getMockHomework();
        }
    }

    /**
     * Affiche les devoirs
     */
    displayHomework(filter = 'all') {
        this.currentFilter = filter;
        const container = document.getElementById('homeworkContainer');
        if (!container) return;

        const filteredHomework = this.filterHomework(filter);

        if (filteredHomework.length === 0) {
            container.innerHTML = '<p class="info-message">Aucun devoir à afficher</p>';
            return;
        }

        container.innerHTML = filteredHomework.map(hw => {
            const isLate = new Date(hw.dueDate) < new Date() && !hw.done;
            const statusClass = hw.done ? 'done' : (isLate ? 'late' : '');

            return `
                <div class="homework-item ${statusClass}" data-id="${hw.id}">
                    <div class="homework-header">
                        <div>
                            <div class="homework-subject">${hw.subject}</div>
                            <div class="homework-date">
                                📅 Pour le ${this.formatDate(hw.dueDate)}
                                ${isLate && !hw.done ? '<span style="color: var(--danger-color)"> • EN RETARD</span>' : ''}
                            </div>
                        </div>
                        <label class="homework-actions">
                            <input type="checkbox" 
                                   class="homework-checkbox" 
                                   ${hw.done ? 'checked' : ''}
                                   data-id="${hw.id}">
                            <span style="margin-left: 5px;">Fait</span>
                        </label>
                    </div>
                    <div class="homework-content">
                        ${hw.description}
                    </div>
                    ${hw.documents && hw.documents.length > 0 ? `
                        <div class="homework-documents">
                            <strong>📎 Documents:</strong>
                            ${hw.documents.map(doc => `<span class="doc-link">${doc}</span>`).join(', ')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Ajouter les événements pour les checkboxes
        container.querySelectorAll('.homework-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const hwId = parseInt(e.target.dataset.id);
                this.toggleHomeworkStatus(hwId);
            });
        });
    }

    /**
     * Change le statut d'un devoir
     */
    toggleHomeworkStatus(homeworkId) {
        const homework = this.homework.find(hw => hw.id === homeworkId);
        if (homework) {
            homework.done = !homework.done;
            this.saveHomeworkStatus();
            this.displayHomework(this.currentFilter);
        }
    }

    /**
     * Sauvegarde le statut des devoirs
     */
    async saveHomeworkStatus() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return;

            const homeworkStatus = this.homework.reduce((acc, hw) => {
                acc[hw.id] = hw.done;
                return acc;
            }, {});

            await firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .collection('homework')
                .doc('status')
                .set({
                    status: homeworkStatus,
                    lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
                });
        } catch (error) {
            console.error('Erreur sauvegarde statut devoirs:', error);
        }
    }

    /**
     * Charge le statut des devoirs
     */
    async loadHomeworkStatus() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return;

            const doc = await firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .collection('homework')
                .doc('status')
                .get();

            if (doc.exists) {
                const savedStatus = doc.data().status;
                this.homework.forEach(hw => {
                    if (savedStatus.hasOwnProperty(hw.id)) {
                        hw.done = savedStatus[hw.id];
                    }
                });
            }
        } catch (error) {
            console.error('Erreur chargement statut devoirs:', error);
        }
    }

    /**
     * Filtre les devoirs
     */
    filterHomework(filter) {
        const now = new Date();
        
        switch (filter) {
            case 'todo':
                return this.homework.filter(hw => !hw.done);
            case 'done':
                return this.homework.filter(hw => hw.done);
            case 'late':
                return this.homework.filter(hw => !hw.done && new Date(hw.dueDate) < now);
            case 'all':
            default:
                return this.homework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
    }

    /**
     * Formate une date
     */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Devoirs de démonstration
     */
    getMockHomework() {
        const today = new Date();
        return [
            {
                id: 1,
                subject: 'Mathématiques',
                description: 'Exercices 12 à 18 page 47. Bien détailler les calculs.',
                dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                done: false,
                documents: []
            },
            {
                id: 2,
                subject: 'Français',
                description: 'Lire le chapitre 3 du livre et préparer un résumé de 10 lignes.',
                dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                done: false,
                documents: ['chapitre3.pdf']
            },
            {
                id: 3,
                subject: 'Anglais',
                description: 'Apprendre le vocabulaire de la leçon 5. Interrogation prévue.',
                dueDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                done: false,
                documents: []
            },
            {
                id: 4,
                subject: 'Histoire-Géographie',
                description: 'Faire la fiche de révision sur la Révolution française.',
                dueDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                done: false,
                documents: ['fiche_revision.pdf']
            },
            {
                id: 5,
                subject: 'SVT',
                description: 'Compléter le schéma du système digestif.',
                dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                done: true,
                documents: []
            },
            {
                id: 6,
                subject: 'Physique-Chimie',
                description: 'Rédiger le compte-rendu du TP sur les réactions chimiques.',
                dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                done: false,
                documents: ['tp_reactions.pdf']
            }
        ];
    }
}

window.HomeworkManager = HomeworkManager;
