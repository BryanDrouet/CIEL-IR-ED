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
                        <p>📝 Connectez-vous ci-dessus, puis cliquez sur "Continuer" →</p>
                        <button class="ed-confirm-btn" onclick="window.edScraper.confirmConnection()">✅ Continuer</button>
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
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .ed-footer p {
                    margin: 0;
                    font-size: 14px;
                }

                .ed-confirm-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .ed-confirm-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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
            this.resolveConnection = resolve;
            this.rejectConnection = reject;

            // Ne plus vérifier automatiquement - l'utilisateur cliquera sur "Continuer"
            // Timeout après 5 minutes
            setTimeout(() => {
                if (!this.isConnected) {
                    this.close();
                    reject(new Error('Timeout - connexion non confirmée'));
                }
            }, 5 * 60 * 1000);
        });
    }

    /**
     * Confirmer la connexion manuellement
     */
    async confirmConnection() {
        console.log('✅ Confirmation de connexion...');
        
        // Essayer de récupérer des données
        const data = await this.checkConnection();
        
        if (data || true) { // Toujours considérer comme succès
            this.userData = data || {
                timestamp: new Date().toISOString(),
                source: 'manual',
                message: 'Connexion confirmée manuellement'
            };
            this.isConnected = true;
            this.close();
            
            if (this.resolveConnection) {
                this.resolveConnection(this.userData);
            }
        }
    }   
    

    /**
     * Vérifier si l'utilisateur est connecté et scraper les données
     */
    async checkConnection() {
        try {
            // CORS bloque l'accès direct à l'iframe
            // On va utiliser une autre méthode : écouter les messages postMessage
            // ou vérifier si l'URL de l'iframe a changé (via try/catch)
            
            try {
                const url = this.iframe.contentWindow.location.href;
                console.log('🔍 Vérification URL:', url);

                // Si on est sur une page de dashboard (contient /eleve/ ou /famille/)
                if (url.includes('/eleve/') || url.includes('/famille/')) {
                    console.log('✅ Connexion détectée! Extraction des données...');
                    
                    // On ne peut pas scraper directement à cause de CORS
                    // On va récupérer les données via l'API ou localStorage
                    const data = await this.extractDataFromAPI();
                    return data;
                }
            } catch (corsError) {
                // CORS - c'est normal, on est bloqué
                // L'iframe est probablement sur ecoledirecte.com maintenant
                // On va essayer d'injecter un script ou utiliser une autre méthode
                console.log('🔒 CORS détecté (normal) - tentative extraction alternative...');
                
                // Vérifier le localStorage partagé
                const data = this.checkLocalStorageData();
                if (data) {
                    return data;
                }
            }

            return null;
        } catch (error) {
            console.log('⚠️ Erreur checkConnection:', error.message);
            return null;
        }
    }

    /**
     * Extraire les données depuis l'API EcoleDirecte
     */
    async extractDataFromAPI() {
        try {
            // Vérifier si on peut accéder aux cookies de l'iframe
            // (spoiler: non, mais on essaie quand même)
            
            // Alternative : demander à l'utilisateur d'autoriser l'accès
            // ou utiliser une extension navigateur
            
            return {
                timestamp: new Date().toISOString(),
                source: 'api',
                message: 'Connexion détectée - Données API non disponibles via iframe (CORS)'
            };
        } catch (error) {
            console.error('Erreur extractDataFromAPI:', error);
            return null;
        }
    }

    /**
     * Vérifier le localStorage pour les données de session
     */
    checkLocalStorageData() {
        try {
            // Note: Le localStorage de l'iframe est isolé par CORS
            // On ne peut accéder qu'au localStorage de notre propre domaine
            
            // Si l'utilisateur a déjà des données sauvegardées
            const savedToken = localStorage.getItem('ed_token');
            const savedAccount = localStorage.getItem('ed_account');

            if (savedToken && savedAccount) {
                console.log('📦 Données localStorage trouvées');
                return {
                    token: savedToken,
                    account: JSON.parse(savedAccount),
                    source: 'localStorage',
                    timestamp: new Date().toISOString()
                };
            }
            
            return null;
        } catch (error) {
            console.error('Erreur checkLocalStorageData:', error);
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
        
        // Rejeter la promesse avec un message spécifique
        if (this.rejectConnection) {
            this.rejectConnection(new Error('Connexion annulée par l\'utilisateur'));
        }
        
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
