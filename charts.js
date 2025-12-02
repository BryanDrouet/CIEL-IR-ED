/**
 * Module de gestion des graphiques avec Chart.js
 * Affiche l'évolution des moyennes et les statistiques visuelles
 */

class ChartsManager {
    constructor() {
        this.evolutionChart = null;
        this.subjectsChart = null;
        this.chartColors = {
            primary: '#4A90E2',
            success: '#50C878',
            danger: '#E74C3C',
            warning: '#F39C12',
            purple: '#9B59B6',
            orange: '#E67E22',
            teal: '#1ABC9C',
            pink: '#E91E63'
        };
    }

    /**
     * Initialise le graphique d'évolution de la moyenne générale
     * @param {Array} evolutionData - Données d'évolution
     */
    initEvolutionChart(evolutionData) {
        const ctx = document.getElementById('evolutionChart');
        if (!ctx) return;

        // Détruire le graphique existant
        if (this.evolutionChart) {
            this.evolutionChart.destroy();
        }

        // Préparer les données
        const labels = evolutionData.map(d => this.formatDate(d.date));
        const averages = evolutionData.map(d => parseFloat(d.average) || 0);

        // Créer le graphique
        this.evolutionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Moyenne générale',
                    data: averages,
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.createGradient(ctx, this.chartColors.primary),
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.chartColors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(22, 33, 62, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.chartColors.primary,
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `Moyenne: ${context.parsed.y.toFixed(2)}/20`;
                            },
                            afterLabel: function(context) {
                                const dataPoint = evolutionData[context.dataIndex];
                                if (dataPoint.gradeAdded) {
                                    const grade = dataPoint.gradeAdded;
                                    return `Note ajoutée: ${grade.value}/${grade.max} (${grade.subject})`;
                                }
                                return '';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0,
                        max: 20,
                        ticks: {
                            color: '#a8a8a8',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#a8a8a8',
                            font: {
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    /**
     * Initialise le graphique des moyennes par matière
     * @param {Array} subjectAverages - Moyennes par matière
     */
    initSubjectsChart(subjectAverages) {
        const ctx = document.getElementById('subjectsChart');
        if (!ctx) return;

        // Détruire le graphique existant
        if (this.subjectsChart) {
            this.subjectsChart.destroy();
        }

        // Trier par moyenne décroissante
        const sortedSubjects = [...subjectAverages].sort((a, b) => b.average - a.average);

        // Préparer les données
        const labels = sortedSubjects.map(s => this.truncateLabel(s.name, 15));
        const averages = sortedSubjects.map(s => parseFloat(s.average) || 0);
        const colors = this.generateColors(sortedSubjects.length);

        // Créer le graphique
        this.subjectsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Moyenne',
                    data: averages,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 33, 62, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.chartColors.primary,
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const index = context.dataIndex;
                                const subject = sortedSubjects[index];
                                return [
                                    `Moyenne: ${subject.average}/20`,
                                    `Notes: ${subject.gradeCount}`,
                                    `Coefficient: ${subject.coefficient}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0,
                        max: 20,
                        ticks: {
                            color: '#a8a8a8',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#a8a8a8',
                            font: {
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    /**
     * Crée un dégradé pour le graphique
     */
    createGradient(ctx, color) {
        const canvas = ctx.canvas;
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, color + '80');
        gradient.addColorStop(1, color + '00');
        return gradient;
    }

    /**
     * Génère des couleurs pour les barres
     */
    generateColors(count) {
        const baseColors = Object.values(this.chartColors);
        const background = [];
        const border = [];

        for (let i = 0; i < count; i++) {
            const color = baseColors[i % baseColors.length];
            background.push(color + '80');
            border.push(color);
        }

        return { background, border };
    }

    /**
     * Formate une date pour l'affichage
     */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    }

    /**
     * Tronque un label trop long
     */
    truncateLabel(label, maxLength) {
        if (label.length <= maxLength) return label;
        return label.substring(0, maxLength - 3) + '...';
    }

    /**
     * Met à jour tous les graphiques
     * @param {Object} statistics - Statistiques calculées
     */
    updateAllCharts(statistics) {
        if (statistics.evolution && statistics.evolution.length > 0) {
            this.initEvolutionChart(statistics.evolution);
        }

        if (statistics.subjectAverages && statistics.subjectAverages.length > 0) {
            this.initSubjectsChart(statistics.subjectAverages);
        }
    }

    /**
     * Détruit tous les graphiques
     */
    destroyAllCharts() {
        if (this.evolutionChart) {
            this.evolutionChart.destroy();
            this.evolutionChart = null;
        }

        if (this.subjectsChart) {
            this.subjectsChart.destroy();
            this.subjectsChart = null;
        }
    }
}

// Export de la classe
window.ChartsManager = ChartsManager;
