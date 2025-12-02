/**
 * Scraper EcoleDirecte via popup
 * Ouvre EcoleDirecte dans une nouvelle fenêtre, attend la connexion
 */

class EcoleDirecteScraper {
    constructor() {
        this.loginUrl = 'https://www.ecoledirecte.com/';
        this.popupWindow = null;
        this.isConnected = false;
        this.userData = null;
        this.checkInterval = null;
        this.resolveConnection = null;
        this.rejectConnection = null;
    }

    /**
     * Ouvrir EcoleDirecte dans une nouvelle fenêtre
     */
    async connect() {
        return new Promise((resolve, reject) => {
            console.log('🌐 Ouverture d\'EcoleDirecte dans une nouvelle fenêtre...');

            this.resolveConnection = resolve;
            this.rejectConnection = reject;

            // Ouvrir dans une popup
            const width = 1200;
            const height = 800;
            const left = (window.screen.width - width) / 2;
            const top = (window.screen.height - height) / 2;
            
            this.popupWindow = window.open(
                this.loginUrl,
                'EcoleDirecteLogin',
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );

            if (!this.popupWindow) {
                reject(new Error('Les popups sont bloquées. Veuillez autoriser les popups pour ce site.'));
                return;
            }

            // Surveiller la fenêtre popup
            this.checkInterval = setInterval(() => {
                // Vérifier si la popup a été fermée
                if (this.popupWindow.closed) {
                    clearInterval(this.checkInterval);
                    
                    // Si pas encore connecté, c'est une annulation
                    if (!this.isConnected) {
                        reject(new Error('Connexion annulée par l\'utilisateur'));
                    }
                }
            }, 500);

            // Afficher les instructions
            this.showInstructions();

            // Timeout après 5 minutes
            setTimeout(() => {
                if (!this.isConnected && this.popupWindow && !this.popupWindow.closed) {
                    this.popupWindow.close();
                    clearInterval(this.checkInterval);
                    reject(new Error('Timeout - connexion non confirmée'));
                }
            }, 5 * 60 * 1000);
        });
    }

    /**
     * Afficher les instructions
     */
    showInstructions() {
        const overlay = document.createElement('div');
        overlay.id = 'ed-overlay';
        overlay.innerHTML = `
            <div class="ed-instructions-container">
                <div class="ed-header">
                    <h3>🔐 Connexion à EcoleDirecte</h3>
                    <button class="ed-close-btn" onclick="window.edScraper.cancel()">✕</button>
                </div>
                <div class="ed-content">
                    <div class="instruction-step">
                        <div class="step-number">1</div>
                        <p>Une nouvelle fenêtre EcoleDirecte s'est ouverte</p>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">2</div>
                        <p>Connectez-vous avec vos identifiants</p>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">3</div>
                        <p>Une fois connecté, la page va se rafraîchir automatiquement</p>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">4</div>
                        <p>Appuyez sur <strong>F12</strong>, allez dans <strong>Application</strong> → <strong>Local Storage</strong> → <strong>www.ecoledirecte.com</strong><br>
                        Cherchez la clé qui contient "token" et copiez sa valeur<br>
                        <small style="color:#666;">(Ou dans Console, essayez: <code>Object.keys(localStorage)</code> pour voir toutes les clés)</small></p>
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">5</div>
                        <p>Collez le token ici :</p>
                        <input type="text" id="ed-token-input" placeholder="Collez votre token ici" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;margin-top:5px;">
                    </div>
                </div>
                <div class="ed-footer">
                    <button class="ed-confirm-btn" onclick="window.edScraper.confirmConnection()">✅ Valider et continuer</button>
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

            .ed-instructions-container {
                width: 90%;
                max-width: 500px;
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

            .ed-content {
                padding: 30px;
            }

            .instruction-step {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                gap: 15px;
            }

            .step-number {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                flex-shrink: 0;
            }

            .instruction-step p {
                margin: 0;
                color: #333;
                font-size: 16px;
            }

            .ed-footer {
                background: #f5f5f5;
                padding: 20px;
                text-align: center;
            }

            .ed-confirm-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s;
            }

            .ed-confirm-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);
    }

    /**
     * Confirmer la connexion manuellement
     */
    async confirmConnection() {
        console.log('✅ Confirmation de connexion...');
        
        // Récupérer le token de l'input
        const tokenInput = document.getElementById('ed-token-input');
        const token = tokenInput ? tokenInput.value.trim() : null;

        if (!token) {
            alert('⚠️ Veuillez coller votre token dans le champ prévu');
            return;
        }

        // Changer le texte du bouton
        const confirmBtn = document.querySelector('.ed-confirm-btn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = '⏳ Récupération des données...';
        }

        try {
            // Récupérer les données avec le token
            const data = await this.fetchDataWithToken(token);
            
            if (data && data.code === 200) {
                console.log('✅ Données récupérées avec succès!');
                this.userData = {
                    token: token,
                    account: data.data.accounts[0],
                    timestamp: new Date().toISOString(),
                    source: 'api'
                };
            } else {
                throw new Error('Token invalide ou expiré');
            }
        } catch (error) {
            console.error('❌ Erreur récupération données:', error);
            alert('❌ Erreur: ' + error.message);
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = '✅ Valider et continuer';
            }
            return;
        }

        this.isConnected = true;
        
        // Fermer la popup
        if (this.popupWindow && !this.popupWindow.closed) {
            this.popupWindow.close();
        }
        
        // Fermer les overlays
        this.close();
        
        // Résoudre la promesse
        if (this.resolveConnection) {
            this.resolveConnection(this.userData);
        }
    }

    /**
     * Récupérer les données avec le token
     */
    async fetchDataWithToken(token) {
        try {
            console.log('📡 Récupération des données avec token...');

            // Utiliser le proxy pour récupérer les données
            const response = await fetch('/api/proxy?path=eleve/' + token.split('.')[0] + '/timeline.awp?verbe=get', {
                method: 'POST',
                headers: {
                    'X-Token': token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'data={}'
            });

            if (!response.ok) {
                throw new Error('Erreur API');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Erreur fetchDataWithToken:', error);
            throw error;
        }
    }

    /**
     * Fermer l'overlay
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
    }

    /**
     * Annuler la connexion
     */
    cancel() {
        // Fermer la popup
        if (this.popupWindow && !this.popupWindow.closed) {
            this.popupWindow.close();
        }

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
        localStorage.removeItem('ed_data');
        sessionStorage.clear();
        console.log('🔓 Déconnecté');
    }
}

// Instance globale
window.edScraper = new EcoleDirecteScraper();
