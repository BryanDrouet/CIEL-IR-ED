/**
 * Module de calcul des moyennes
 * Calcule les moyennes générales et par matière en temps réel
 */

class GradeCalculator {
    constructor() {
        this.subjects = [];
        this.allGrades = [];
    }

    /**
     * Charge les données de notes
     * @param {Object} gradesData - Données formatées des notes
     */
    loadGrades(gradesData) {
        this.subjects = gradesData.subjects || [];
        this.allGrades = gradesData.allGrades || [];
    }

    /**
     * Calcule la moyenne d'une matière
     * @param {Object} subject - Matière avec ses notes
     * @returns {number} Moyenne de la matière
     */
    calculateSubjectAverage(subject) {
        if (!subject.grades || subject.grades.length === 0) {
            return null;
        }

        let totalPoints = 0;
        let totalCoefficients = 0;

        subject.grades.forEach(grade => {
            // Normaliser la note sur 20
            const normalizedGrade = (grade.value / grade.max) * 20;
            const coefficient = grade.coefficient || 1;

            totalPoints += normalizedGrade * coefficient;
            totalCoefficients += coefficient;
        });

        return totalCoefficients > 0 ? totalPoints / totalCoefficients : null;
    }

    /**
     * Calcule la moyenne générale
     * @returns {number} Moyenne générale
     */
    calculateGeneralAverage() {
        if (this.subjects.length === 0) {
            return null;
        }

        let totalPoints = 0;
        let totalCoefficients = 0;

        this.subjects.forEach(subject => {
            const subjectAverage = this.calculateSubjectAverage(subject);
            
            if (subjectAverage !== null) {
                const coefficient = subject.coefficient || 1;
                totalPoints += subjectAverage * coefficient;
                totalCoefficients += coefficient;
            }
        });

        return totalCoefficients > 0 ? totalPoints / totalCoefficients : null;
    }

    /**
     * Obtient toutes les moyennes par matière
     * @returns {Array} Tableau des matières avec leurs moyennes
     */
    getAllSubjectAverages() {
        return this.subjects.map(subject => ({
            name: subject.name,
            average: this.calculateSubjectAverage(subject),
            gradeCount: subject.grades.length,
            coefficient: subject.coefficient
        })).filter(s => s.average !== null);
    }

    /**
     * Trouve la meilleure matière
     * @returns {Object} Matière avec la meilleure moyenne
     */
    getBestSubject() {
        const averages = this.getAllSubjectAverages();
        
        if (averages.length === 0) {
            return null;
        }

        return averages.reduce((best, current) => 
            current.average > best.average ? current : best
        );
    }

    /**
     * Trouve la matière à améliorer
     * @returns {Object} Matière avec la moyenne la plus basse
     */
    getWorstSubject() {
        const averages = this.getAllSubjectAverages();
        
        if (averages.length === 0) {
            return null;
        }

        return averages.reduce((worst, current) => 
            current.average < worst.average ? current : worst
        );
    }

    /**
     * Calcule l'évolution de la moyenne au fil du temps
     * @returns {Array} Évolution chronologique
     */
    getAverageEvolution() {
        if (this.allGrades.length === 0) {
            return [];
        }

        // Trier les notes par date
        const sortedGrades = [...this.allGrades].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );

        const evolution = [];
        const subjectGrades = {};

        sortedGrades.forEach(grade => {
            if (!subjectGrades[grade.subject]) {
                subjectGrades[grade.subject] = [];
            }
            subjectGrades[grade.subject].push(grade);

            // Recalculer la moyenne générale à ce point
            const currentAverage = this.calculateAverageAtPoint(subjectGrades);
            
            evolution.push({
                date: grade.date,
                average: currentAverage,
                gradeAdded: {
                    subject: grade.subject,
                    value: grade.value,
                    max: grade.max
                }
            });
        });

        return evolution;
    }

    /**
     * Calcule la moyenne générale à un point donné de l'historique
     */
    calculateAverageAtPoint(subjectGradesMap) {
        const subjects = Object.keys(subjectGradesMap);
        let totalPoints = 0;
        let totalCoefficients = 0;

        subjects.forEach(subjectName => {
            const grades = subjectGradesMap[subjectName];
            const subject = this.subjects.find(s => s.name === subjectName);
            
            if (!subject) return;

            let subjectPoints = 0;
            let subjectCoeffs = 0;

            grades.forEach(grade => {
                const normalizedGrade = (grade.value / grade.max) * 20;
                const coeff = grade.coefficient || 1;
                subjectPoints += normalizedGrade * coeff;
                subjectCoeffs += coeff;
            });

            if (subjectCoeffs > 0) {
                const subjectAverage = subjectPoints / subjectCoeffs;
                const subjectCoeff = subject.coefficient || 1;
                totalPoints += subjectAverage * subjectCoeff;
                totalCoefficients += subjectCoeff;
            }
        });

        return totalCoefficients > 0 ? totalPoints / totalCoefficients : null;
    }

    /**
     * Calcule les statistiques détaillées
     * @returns {Object} Statistiques complètes
     */
    getStatistics() {
        const generalAverage = this.calculateGeneralAverage();
        const subjectAverages = this.getAllSubjectAverages();
        const bestSubject = this.getBestSubject();
        const worstSubject = this.getWorstSubject();
        const evolution = this.getAverageEvolution();

        return {
            generalAverage: generalAverage ? generalAverage.toFixed(2) : null,
            totalGrades: this.allGrades.length,
            totalSubjects: this.subjects.length,
            subjectAverages: subjectAverages.map(s => ({
                ...s,
                average: s.average.toFixed(2)
            })),
            bestSubject: bestSubject ? {
                name: bestSubject.name,
                average: bestSubject.average.toFixed(2)
            } : null,
            worstSubject: worstSubject ? {
                name: worstSubject.name,
                average: worstSubject.average.toFixed(2)
            } : null,
            evolution: evolution.map(e => ({
                ...e,
                average: e.average ? e.average.toFixed(2) : null
            })),
            lastUpdate: new Date().toLocaleString('fr-FR')
        };
    }

    /**
     * Simule l'ajout d'une note pour prédire la nouvelle moyenne
     * @param {string} subjectName - Nom de la matière
     * @param {number} grade - Note
     * @param {number} max - Note maximale
     * @param {number} coefficient - Coefficient de la note
     * @returns {Object} Nouvelle moyenne simulée
     */
    simulateGrade(subjectName, grade, max = 20, coefficient = 1) {
        const currentAverage = this.calculateGeneralAverage();
        
        // Créer une copie temporaire
        const tempSubjects = JSON.parse(JSON.stringify(this.subjects));
        const subject = tempSubjects.find(s => s.name === subjectName);
        
        if (!subject) {
            return { error: 'Matière non trouvée' };
        }

        // Ajouter la note simulée
        subject.grades.push({
            value: grade,
            max: max,
            coefficient: coefficient,
            date: new Date().toISOString(),
            title: 'Simulation',
            simulated: true
        });

        // Calculer temporairement
        const tempCalculator = new GradeCalculator();
        tempCalculator.subjects = tempSubjects;
        const newAverage = tempCalculator.calculateGeneralAverage();

        return {
            currentAverage: currentAverage ? currentAverage.toFixed(2) : null,
            newAverage: newAverage ? newAverage.toFixed(2) : null,
            difference: (newAverage - currentAverage).toFixed(2)
        };
    }

    /**
     * Formate un nombre pour l'affichage
     * @param {number} value - Valeur à formater
     * @param {number} decimals - Nombre de décimales
     * @returns {string} Valeur formatée
     */
    static formatNumber(value, decimals = 2) {
        if (value === null || value === undefined || isNaN(value)) {
            return '--';
        }
        return parseFloat(value).toFixed(decimals);
    }
}

// Export de la classe
window.GradeCalculator = GradeCalculator;
