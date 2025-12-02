/**
 * Module de gestion de la vie scolaire
 */

class SchoolLifeManager {
    constructor() {
        this.absences = [];
        this.delays = [];
        this.sanctions = [];
        this.encouragements = [];
    }

    /**
     * Récupère les données de vie scolaire depuis l'API
     */
    async fetchSchoolLife(api) {
        try {
            const response = await api.getSchoolLife();
            this.absences = response.absences || [];
            this.delays = response.delays || [];
            this.sanctions = response.sanctions || [];
            this.encouragements = response.encouragements || [];
            return response;
        } catch (error) {
            console.error('Erreur récupération vie scolaire:', error);
            return this.getMockSchoolLife();
        }
    }

    /**
     * Affiche les données de vie scolaire
     */
    displaySchoolLife() {
        this.displayAbsences();
        this.displayDelays();
        this.displaySanctions();
        this.displayEncouragements();
    }

    /**
     * Affiche les absences
     */
    displayAbsences() {
        const container = document.getElementById('absencesContainer');
        if (!container) return;

        if (this.absences.length === 0) {
            container.innerHTML = '<p class="info-message">✅ Aucune absence</p>';
            return;
        }

        container.innerHTML = this.absences.map(absence => `
            <div class="schoollife-item absence">
                <div class="schoollife-date">${this.formatDate(absence.date)}</div>
                <div class="schoollife-reason">${absence.reason || 'Non précisée'}</div>
                <span class="schoollife-status ${absence.justified ? 'justified' : 'not-justified'}">
                    ${absence.justified ? 'Justifiée' : 'Non justifiée'}
                </span>
            </div>
        `).join('');
    }

    /**
     * Affiche les retards
     */
    displayDelays() {
        const container = document.getElementById('delaysContainer');
        if (!container) return;

        if (this.delays.length === 0) {
            container.innerHTML = '<p class="info-message">✅ Aucun retard</p>';
            return;
        }

        container.innerHTML = this.delays.map(delay => `
            <div class="schoollife-item delay">
                <div class="schoollife-date">${this.formatDate(delay.date)}</div>
                <div class="schoollife-reason">Durée: ${delay.duration || 'Non précisée'}</div>
                <span class="schoollife-status ${delay.justified ? 'justified' : 'not-justified'}">
                    ${delay.justified ? 'Justifié' : 'Non justifié'}
                </span>
            </div>
        `).join('');
    }

    /**
     * Affiche les sanctions
     */
    displaySanctions() {
        const container = document.getElementById('sanctionsContainer');
        if (!container) return;

        if (this.sanctions.length === 0) {
            container.innerHTML = '<p class="info-message">✅ Aucune sanction</p>';
            return;
        }

        container.innerHTML = this.sanctions.map(sanction => `
            <div class="schoollife-item sanction">
                <div class="schoollife-date">${this.formatDate(sanction.date)}</div>
                <div class="schoollife-reason">
                    <strong>${sanction.type}</strong><br>
                    ${sanction.reason}
                </div>
            </div>
        `).join('');
    }

    /**
     * Affiche les encouragements
     */
    displayEncouragements() {
        const container = document.getElementById('encouragementsContainer');
        if (!container) return;

        if (this.encouragements.length === 0) {
            container.innerHTML = '<p class="info-message">Aucun encouragement pour le moment</p>';
            return;
        }

        container.innerHTML = this.encouragements.map(encouragement => `
            <div class="schoollife-item encouragement">
                <div class="schoollife-date">${this.formatDate(encouragement.date)}</div>
                <div class="schoollife-reason">
                    <strong>${encouragement.type}</strong><br>
                    ${encouragement.comment}
                </div>
            </div>
        `).join('');
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
     * Données de démonstration
     */
    getMockSchoolLife() {
        const today = new Date();
        return {
            absences: [
                {
                    date: new Date(today - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    reason: 'Rendez-vous médical',
                    justified: true
                },
                {
                    date: new Date(today - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    reason: 'Maladie',
                    justified: true
                }
            ],
            delays: [
                {
                    date: new Date(today - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    duration: '15 minutes',
                    justified: false
                }
            ],
            sanctions: [],
            encouragements: [
                {
                    date: new Date(today - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    type: 'Félicitations',
                    comment: 'Excellent travail ce trimestre'
                }
            ]
        };
    }
}

window.SchoolLifeManager = SchoolLifeManager;
