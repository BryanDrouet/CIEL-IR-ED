/**
 * Module de communication avec l'API EcoleDirecte
 * Gère l'authentification et la récupération des données
 */

class EcoleDirecteAPI {
    constructor() {
        // Détecter l'environnement
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Environnement local - API directe
            this.baseURL = 'https://api.ecoledirecte.com/v3';
            this.useProxy = false;
        } else if (hostname.includes('github.io')) {
            // GitHub Pages - API directe (CORS peut poser problème)
            this.baseURL = 'https://api.ecoledirecte.com/v3';
            this.useProxy = false;
            console.warn('⚠️ GitHub Pages détecté - utilisez Vercel pour éviter les problèmes CORS');
        } else if (hostname.includes('vercel.app')) {
            // Vercel - utiliser le proxy
            this.baseURL = '/api/proxy';
            this.useProxy = true;
        } else {
            // Autre domaine - tenter le proxy
            this.baseURL = '/api/proxy';
            this.useProxy = true;
        }
        
        console.log(`📡 API Endpoint: ${this.baseURL} (Proxy: ${this.useProxy})`);
        
        this.token = null;
        this.accountData = null;
    }

    /**
     * Authentification auprès d'EcoleDirecte
     * @param {string} username - Identifiant
     * @param {string} password - Mot de passe
     * @returns {Promise<Object>} Données de l'utilisateur
     */
    async login(username, password) {
        try {
            console.log('🔐 Tentative de connexion...', { username, passwordLength: password.length });
            
            // Nettoyer l'identifiant (enlever underscore si présent)
            const cleanUsername = username.replace(/_/g, '').toLowerCase();
            console.log('🧹 Identifiant nettoyé:', cleanUsername);
            
            // Préparer les données au format form-urlencoded
            const payload = {
                identifiant: cleanUsername,
                motdepasse: password
            };
            
            const formData = new URLSearchParams();
            formData.append('data', JSON.stringify(payload));
            
            const url = this.useProxy 
                ? `${this.baseURL}?path=login.awp`
                : `${this.baseURL}/login.awp`;
            
            console.log('📤 Requête:', { url, useProxy: this.useProxy, bodyLength: formData.toString().length });
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            console.log('📥 Réponse HTTP:', { status: response.status, ok: response.ok });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur serveur:', errorText);
                throw new Error('Erreur de connexion au serveur EcoleDirecte');
            }

            const data = await response.json();
            console.log('📦 Données reçues:', { code: data.code, message: data.message, hasToken: !!data.token });

            if (data.code !== 200) {
                console.error('❌ Code erreur:', data.code, 'Message:', data.message);
                throw new Error(data.message || 'Identifiants incorrects');
            }

            this.token = data.token;
            this.accountInfo = data.data.accounts[0];

            console.log('✅ Connexion réussie:', { 
                id: this.accountInfo.id, 
                nom: this.accountInfo.nom,
                prenom: this.accountInfo.prenom 
            });

            // Stocker le token dans le localStorage
            localStorage.setItem('edToken', this.token);
            localStorage.setItem('edAccountInfo', JSON.stringify(this.accountInfo));

            return {
                success: true,
                user: {
                    id: this.accountInfo.id,
                    name: `${this.accountInfo.prenom} ${this.accountInfo.nom}`,
                    type: this.accountInfo.typeCompte,
                    classe: this.accountInfo.profile?.classe?.libelle || 'N/A'
                }
            };

        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            throw error;
        }
    }

    /**
     * Récupère les notes de l'élève
     * @returns {Promise<Object>} Notes et moyennes
     */
    async getGrades() {
        if (!this.token) {
            throw new Error('Non authentifié');
        }

        try {
            const periodeActuelle = 'A001'; // Période actuelle, à adapter selon les besoins

            const url = this.useProxy 
                ? `${this.baseURL}?path=eleves/${this.accountInfo.id}/notes.awp?verbe=get&`
                : `${this.baseURL}/eleves/${this.accountInfo.id}/notes.awp?verbe=get&`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Token': this.token
                },
                body: `data=${encodeURIComponent(JSON.stringify({
                    anneeScolaire: ''
                }))}`
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des notes');
            }

            const data = await response.json();

            if (data.code !== 200) {
                throw new Error(data.message || 'Impossible de récupérer les notes');
            }

            return this.formatGradesData(data.data);

        } catch (error) {
            console.error('Erreur récupération notes:', error);
            throw error;
        }
    }

    /**
     * Formate les données des notes pour l'application
     */
    formatGradesData(data) {
        const subjects = {};
        const allGrades = [];

        // Parcourir toutes les notes
        if (data.notes && Array.isArray(data.notes)) {
            data.notes.forEach(note => {
                const subjectName = note.libelleMatiere;
                
                if (!subjects[subjectName]) {
                    subjects[subjectName] = {
                        name: subjectName,
                        grades: [],
                        coefficient: parseFloat(note.coef) || 1
                    };
                }

                const gradeValue = parseFloat(note.valeur);
                const gradeMax = parseFloat(note.noteSur);

                if (!isNaN(gradeValue) && !isNaN(gradeMax)) {
                    const grade = {
                        value: gradeValue,
                        max: gradeMax,
                        coefficient: parseFloat(note.coef) || 1,
                        date: note.date,
                        title: note.devoir,
                        period: note.codePeriode
                    };

                    subjects[subjectName].grades.push(grade);
                    allGrades.push({
                        ...grade,
                        subject: subjectName
                    });
                }
            });
        }

        return {
            subjects: Object.values(subjects),
            allGrades: allGrades.sort((a, b) => new Date(b.date) - new Date(a.date)),
            periods: data.periodes || []
        };
    }

    /**
     * Récupère l'emploi du temps
     * @param {number} year - Année
     * @param {number} week - Numéro de semaine
     * @returns {Promise<Array>} Emploi du temps
     */
    async getSchedule(year, week) {
        if (!this.token) {
            throw new Error('Non authentifié');
        }

        try {
            // Note: L'API réelle nécessiterait les bons paramètres
            const url = this.useProxy 
                ? `${this.baseURL}?path=E/${this.accountInfo.id}/emploidutemps.awp?verbe=get&`
                : `${this.baseURL}/E/${this.accountInfo.id}/emploidutemps.awp?verbe=get&`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Token': this.token
                },
                body: `data=${encodeURIComponent(JSON.stringify({
                    dateDebut: '',
                    dateFin: '',
                    avecTrous: false
                }))}`
            });

            if (!response.ok) {
                console.warn('Emploi du temps non disponible');
                return [];
            }

            const data = await response.json();
            return data.code === 200 ? this.formatScheduleData(data.data) : [];

        } catch (error) {
            console.warn('Erreur récupération emploi du temps:', error);
            return [];
        }
    }

    /**
     * Récupère les messages
     * @returns {Promise<Array>} Messages
     */
    async getMessages() {
        if (!this.token) {
            throw new Error('Non authentifié');
        }

        try {
            const url = this.useProxy 
                ? `${this.baseURL}?path=E/${this.accountInfo.id}/messages.awp?verbe=get&orderBy=date&order=desc&page=0&itemsPerPage=20`
                : `${this.baseURL}/E/${this.accountInfo.id}/messages.awp?verbe=get&orderBy=date&order=desc&page=0&itemsPerPage=20`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Token': this.token
                },
                body: `data={}`
            });

            if (!response.ok) {
                console.warn('Messages non disponibles');
                return [];
            }

            const data = await response.json();
            return data.code === 200 ? this.formatMessagesData(data.data) : [];

        } catch (error) {
            console.warn('Erreur récupération messages:', error);
            return [];
        }
    }

    /**
     * Récupère le cahier de texte
     * @returns {Promise<Array>} Devoirs
     */
    async getHomework() {
        if (!this.token) {
            throw new Error('Non authentifié');
        }

        try {
            const url = this.useProxy 
                ? `${this.baseURL}?path=Eleves/${this.accountInfo.id}/cahierdetexte.awp?verbe=get&`
                : `${this.baseURL}/Eleves/${this.accountInfo.id}/cahierdetexte.awp?verbe=get&`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Token': this.token
                },
                body: `data={}`
            });

            if (!response.ok) {
                console.warn('Cahier de texte non disponible');
                return [];
            }

            const data = await response.json();
            return data.code === 200 ? this.formatHomeworkData(data.data) : [];

        } catch (error) {
            console.warn('Erreur récupération cahier de texte:', error);
            return [];
        }
    }

    /**
     * Récupère les données de vie scolaire
     * @returns {Promise<Object>} Vie scolaire
     */
    async getSchoolLife() {
        if (!this.token) {
            throw new Error('Non authentifié');
        }

        try {
            const url = this.useProxy 
                ? `${this.baseURL}?path=E/${this.accountInfo.id}/viescolaire.awp?verbe=get&`
                : `${this.baseURL}/E/${this.accountInfo.id}/viescolaire.awp?verbe=get&`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Token': this.token
                },
                body: `data={}`
            });

            if (!response.ok) {
                console.warn('Vie scolaire non disponible');
                return { absences: [], delays: [], sanctions: [], encouragements: [] };
            }

            const data = await response.json();
            return data.code === 200 ? this.formatSchoolLifeData(data.data) : { absences: [], delays: [], sanctions: [], encouragements: [] };

        } catch (error) {
            console.warn('Erreur récupération vie scolaire:', error);
            return { absences: [], delays: [], sanctions: [], encouragements: [] };
        }
    }

    /**
     * Formate les données de l'emploi du temps
     */
    formatScheduleData(data) {
        // À adapter selon la structure réelle de l'API
        return [];
    }

    /**
     * Formate les données des messages
     */
    formatMessagesData(data) {
        // À adapter selon la structure réelle de l'API
        return [];
    }

    /**
     * Formate les données du cahier de texte
     */
    formatHomeworkData(data) {
        // À adapter selon la structure réelle de l'API
        return [];
    }

    /**
     * Formate les données de vie scolaire
     */
    formatSchoolLifeData(data) {
        // À adapter selon la structure réelle de l'API
        return { absences: [], delays: [], sanctions: [], encouragements: [] };
    }

    /**
     * Récupère les menus de la cantine
     * @returns {Promise<Array>} Liste des menus
     */
    async getMenus() {
        if (!this.token) {
            throw new Error('Non authentifié');
        }

        try {
            const today = new Date();
            const dateDebut = this.formatDate(today);
            const dateFin = this.formatDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)); // 30 jours

            const url = this.useProxy 
                ? `${this.baseURL}?path=E/${this.accountInfo.id}/cantines.awp?verbe=get&`
                : `${this.baseURL}/E/${this.accountInfo.id}/cantines.awp?verbe=get&`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Token': this.token
                },
                body: `data=${encodeURIComponent(JSON.stringify({
                    dateDebut: dateDebut,
                    dateFin: dateFin
                }))}`
            });

            if (!response.ok) {
                console.warn('Menus non disponibles');
                return [];
            }

            const data = await response.json();

            if (data.code === 200 && data.data) {
                return this.formatMenusData(data.data);
            }

            return [];

        } catch (error) {
            console.warn('Erreur récupération menus:', error);
            return [];
        }
    }

    /**
     * Formate les données des menus
     */
    formatMenusData(data) {
        const menus = [];

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(day => {
                if (day.repas && Array.isArray(day.repas)) {
                    day.repas.forEach(repas => {
                        menus.push({
                            date: day.date,
                            type: repas.nom,
                            plats: repas.platMenus || []
                        });
                    });
                }
            });
        }

        return menus;
    }

    /**
     * Formate une date au format YYYY-MM-DD
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Sauvegarde les identifiants de manière sécurisée dans Firebase
     */
    async saveCredentialsToFirebase(username, password) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return;

            // Chiffrer les identifiants (simple encodage pour l'exemple, à améliorer)
            const encrypted = btoa(JSON.stringify({ username, password }));

            await firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .set({
                    ecoleDirecteCredentials: encrypted,
                    lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });

        } catch (error) {
            console.error('Erreur sauvegarde identifiants:', error);
        }
    }

    /**
     * Récupère les identifiants depuis Firebase
     */
    async getCredentialsFromFirebase() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return null;

            const doc = await firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .get();

            if (doc.exists && doc.data().ecoleDirecteCredentials) {
                const decrypted = JSON.parse(atob(doc.data().ecoleDirecteCredentials));
                return decrypted;
            }

            return null;

        } catch (error) {
            console.error('Erreur récupération identifiants:', error);
            return null;
        }
    }

    /**
     * Reconnexion automatique
     */
    async autoLogin() {
        const credentials = await this.getCredentialsFromFirebase();
        if (credentials) {
            return await this.login(credentials.username, credentials.password);
        }
        return null;
    }
}

// Export de la classe
window.EcoleDirecteAPI = EcoleDirecteAPI;
