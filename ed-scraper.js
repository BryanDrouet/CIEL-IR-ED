/**
 * Scraper EcoleDirecte via iframe
 * Ouvre EcoleDirecte, attend la connexion, scrape les données, puis ferme
 */

class EcoleDirecteScraper {
    constructor() {
        this.loginUrl = 'https://www.ecoledirecte.com/';
        this.iframe = null;
        this.isConnected = false;
        this.userData = null;
        this.checkInterval = null;
    }

    /**
     * Ouvrir EcoleDirecte dans une iframe et attendre la connexion
     */
    async connect() {
        return new Promise((resolve, reject) => {
            console.log('🌐 Ouverture d\'EcoleDirecte...');

            // Créer l'overlay
            const overlay = document.createElement('div');
            overlay.id = 'ed-overlay';
            overlay.innerHTML = `
                <div class="ed-iframe-container">
                    <div class="ed-header">
                        <h3>🔐 Connectez-vous à EcoleDirecte</h3>
                        <button class="ed-close-btn" onclick="window.edScraper.cancel()">✕</button>
                    </div>
                    <iframe id="ed-iframe" src="${this.loginUrl}" frameborder="0"></iframe>
                    <div class="ed-footer">
                        <p>Connexion en cours... Entrez vos identifiants ci-dessus</p>
                    </div>
                </div>
            `;

            // Ajouter les styles
            const style = document.createElement('style');
            style.textContent = `
                #ed-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .ed-iframe-container {
                    width: 90%;
                    max-width: 1200px;
                    height: 90%;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }

                .ed-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .ed-header h3 {
                    margin: 0;
                    font-size: 20px;
                }

                .ed-close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    transition: all 0.3s;
                }

                .ed-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                #ed-iframe {
                    flex: 1;
                    width: 100%;
                    border: none;
                }

                .ed-footer {
                    background: #f5f5f5;
                    padding: 15px;
                    text-align: center;
                    color: #666;
                }

                .ed-footer p {
                    margin: 0;
                    font-size: 14px;
                }

                .ed-loading {
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(overlay);

            this.iframe = document.getElementById('ed-iframe');

            // Surveiller la connexion
            this.checkInterval = setInterval(() => {
                this.checkConnection()
                    .then(data => {
                        if (data) {
                            clearInterval(this.checkInterval);
                            this.userData = data;
                            this.isConnected = true;
                            this.close();
                            resolve(data);
                        }
                    })
                    .catch(err => {
                        // CORS - on ne peut pas accéder à l'iframe
                        // On va utiliser une autre méthode
                    });
            }, 1000);

            // Timeout après 5 minutes
            setTimeout(() => {
                if (!this.isConnected) {
                    clearInterval(this.checkInterval);
                    this.close();
                    reject(new Error('Timeout - connexion non détectée'));
                }
            }, 5 * 60 * 1000);
        });
    }

    /**
     * Vérifier si l'utilisateur est connecté et scraper les données
     */
    async checkConnection() {
        try {
            // Tenter d'accéder à l'iframe
            const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            const url = this.iframe.contentWindow.location.href;

            console.log('🔍 Vérification URL:', url);

            // Si on est sur une page de dashboard (contient /eleve/ ou /famille/)
            if (url.includes('/eleve/') || url.includes('/famille/')) {
                console.log('✅ Connexion détectée! Scraping...');
                
                // Scraper les données
                const data = await this.scrapeData(iframeDoc);
                return data;
            }

            return null;
        } catch (error) {
            // CORS bloque l'accès - c'est normal
            // On va utiliser localStorage pour communiquer
            return this.checkLocalStorage();
        }
    }

    /**
     * Vérifier le localStorage pour les données de session
     */
    checkLocalStorage() {
        try {
            // EcoleDirecte stocke le token dans localStorage
            const token = localStorage.getItem('ed_token');
            const account = localStorage.getItem('ed_account');

            if (token && account) {
                return {
                    token: token,
                    account: JSON.parse(account),
                    source: 'localStorage'
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Scraper les données de la page
     */
    async scrapeData(doc) {
        try {
            const data = {
                timestamp: new Date().toISOString(),
                source: 'scraping'
            };

            // Chercher les données dans le DOM
            const userNameElement = doc.querySelector('.user-name, .student-name, .nom-utilisateur');
            if (userNameElement) {
                data.userName = userNameElement.textContent.trim();
            }

            // Chercher les notes
            const grades = [];
            const gradeElements = doc.querySelectorAll('.note, .grade, .devoir');
            gradeElements.forEach(el => {
                const grade = {
                    subject: el.querySelector('.matiere, .subject')?.textContent.trim(),
                    value: el.querySelector('.valeur, .value')?.textContent.trim(),
                    date: el.querySelector('.date')?.textContent.trim()
                };
                if (grade.subject || grade.value) {
                    grades.push(grade);
                }
            });

            if (grades.length > 0) {
                data.grades = grades;
            }

            // Chercher l'emploi du temps
            const schedule = [];
            const scheduleElements = doc.querySelectorAll('.cours, .lesson, .event');
            scheduleElements.forEach(el => {
                const lesson = {
                    subject: el.querySelector('.matiere, .subject')?.textContent.trim(),
                    time: el.querySelector('.heure, .time')?.textContent.trim(),
                    room: el.querySelector('.salle, .room')?.textContent.trim()
                };
                if (lesson.subject) {
                    schedule.push(lesson);
                }
            });

            if (schedule.length > 0) {
                data.schedule = schedule;
            }

            return data;
        } catch (error) {
            console.error('Erreur scraping:', error);
            return {
                timestamp: new Date().toISOString(),
                error: error.message
            };
        }
    }

    /**
     * Fermer l'iframe
     */
    close() {
        const overlay = document.getElementById('ed-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }

        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        // Ajouter l'animation de sortie
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Annuler la connexion
     */
    cancel() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        this.close();
        console.log('❌ Connexion annulée');
    }

    /**
     * Obtenir les données utilisateur
     */
    getUserData() {
        return this.userData;
    }

    /**
     * Vérifier si connecté
     */
    isUserConnected() {
        return this.isConnected;
    }

    /**
     * Déconnecter
     */
    disconnect() {
        this.isConnected = false;
        this.userData = null;
        localStorage.removeItem('ed_token');
        localStorage.removeItem('ed_account');
        sessionStorage.clear();
        console.log('🔓 Déconnecté');
    }
}

// Instance globale
window.edScraper = new EcoleDirecteScraper();
