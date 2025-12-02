/**
 * Module de gestion de l'emploi du temps
 */

class ScheduleManager {
    constructor() {
        this.currentWeek = this.getWeekNumber(new Date());
        this.currentYear = new Date().getFullYear();
        this.scheduleData = [];
    }

    /**
     * Récupère l'emploi du temps depuis l'API
     */
    async fetchSchedule(api) {
        try {
            const response = await api.getSchedule(this.currentYear, this.currentWeek);
            this.scheduleData = response;
            return response;
        } catch (error) {
            console.error('Erreur récupération emploi du temps:', error);
            return this.getMockSchedule();
        }
    }

    /**
     * Affiche l'emploi du temps
     */
    displaySchedule() {
        const container = document.getElementById('scheduleContainer');
        if (!container) return;

        container.innerHTML = '';

        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
        const timeSlots = [
            '08:00-09:00',
            '09:00-10:00',
            '10:00-11:00',
            '11:00-12:00',
            '12:00-13:00',
            '13:00-14:00',
            '14:00-15:00',
            '15:00-16:00',
            '16:00-17:00',
            '17:00-18:00'
        ];

        // En-têtes des jours
        const headerCell = document.createElement('div');
        headerCell.className = 'schedule-header';
        headerCell.textContent = 'Heures';
        container.appendChild(headerCell);

        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'schedule-header';
            dayHeader.textContent = day;
            container.appendChild(dayHeader);
        });

        // Créneaux horaires
        timeSlots.forEach(timeSlot => {
            const timeCell = document.createElement('div');
            timeCell.className = 'schedule-time';
            timeCell.textContent = timeSlot;
            container.appendChild(timeCell);

            days.forEach((day, dayIndex) => {
                const slot = document.createElement('div');
                slot.className = 'schedule-slot';

                const course = this.findCourse(dayIndex, timeSlot);
                
                if (course) {
                    slot.classList.add('has-course');
                    slot.innerHTML = `
                        <div class="course-name">${course.subject}</div>
                        <div class="course-teacher">${course.teacher}</div>
                        <div class="course-room">${course.room}</div>
                    `;
                }

                container.appendChild(slot);
            });
        });

        this.updateWeekDisplay();
    }

    /**
     * Trouve un cours pour un jour et créneau donnés
     */
    findCourse(dayIndex, timeSlot) {
        const [startTime] = timeSlot.split('-');
        
        if (this.scheduleData.length === 0) {
            return this.getMockCourse(dayIndex, startTime);
        }

        return this.scheduleData.find(course => 
            course.dayIndex === dayIndex && course.startTime === startTime
        );
    }

    /**
     * Obtient le numéro de semaine
     */
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    /**
     * Semaine précédente
     */
    previousWeek() {
        this.currentWeek--;
        if (this.currentWeek < 1) {
            this.currentWeek = 52;
            this.currentYear--;
        }
        this.displaySchedule();
    }

    /**
     * Semaine suivante
     */
    nextWeek() {
        this.currentWeek++;
        if (this.currentWeek > 52) {
            this.currentWeek = 1;
            this.currentYear++;
        }
        this.displaySchedule();
    }

    /**
     * Retour à la semaine actuelle
     */
    goToToday() {
        const today = new Date();
        this.currentWeek = this.getWeekNumber(today);
        this.currentYear = today.getFullYear();
        this.displaySchedule();
    }

    /**
     * Met à jour l'affichage de la semaine
     */
    updateWeekDisplay() {
        const display = document.getElementById('currentWeek');
        if (display) {
            display.textContent = `Semaine ${this.currentWeek} - ${this.currentYear}`;
        }
    }

    /**
     * Données de démonstration
     */
    getMockSchedule() {
        return [
            { dayIndex: 0, startTime: '08:00', subject: 'Mathématiques', teacher: 'M. Dupont', room: 'Salle 101' },
            { dayIndex: 0, startTime: '09:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 205' },
            { dayIndex: 0, startTime: '10:00', subject: 'Anglais', teacher: 'Mrs. Smith', room: 'Salle 302' },
            { dayIndex: 1, startTime: '08:00', subject: 'Physique-Chimie', teacher: 'M. Bernard', room: 'Lab 1' },
            { dayIndex: 1, startTime: '10:00', subject: 'Histoire-Géo', teacher: 'Mme Dubois', room: 'Salle 210' },
            { dayIndex: 2, startTime: '08:00', subject: 'EPS', teacher: 'M. Leroy', room: 'Gymnase' },
            { dayIndex: 3, startTime: '09:00', subject: 'SVT', teacher: 'Mme Petit', room: 'Lab 2' },
            { dayIndex: 3, startTime: '14:00', subject: 'Arts plastiques', teacher: 'M. Moreau', room: 'Atelier' },
            { dayIndex: 4, startTime: '08:00', subject: 'Espagnol', teacher: 'Sra. Garcia', room: 'Salle 305' },
            { dayIndex: 4, startTime: '10:00', subject: 'Technologie', teacher: 'M. Roux', room: 'Salle info' }
        ];
    }

    getMockCourse(dayIndex, startTime) {
        const schedule = this.getMockSchedule();
        return schedule.find(c => c.dayIndex === dayIndex && c.startTime === startTime);
    }
}

window.ScheduleManager = ScheduleManager;
