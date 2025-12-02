/**
 * Module de communication avec l'API EcoleDirecte
 * Gère l'authentification et la récupération des données
 * Basé sur la documentation : https://github.com/EduWireApps/ecoledirecte-api-docs
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
        this.gtkCookie = null;
        this.apiVersion = '4.75.0';
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36';
    }

    /**
     * Récupère le cookie GTK nécessaire pour l'authentification
     * Depuis le 24/03/2025, EcoleDirecte exige ce cookie avant le login
     */
    async getGtkCookie() {
        try {
            console.log('🔑 Récupération du cookie GTK...');
            
            // Si on utilise le proxy, il faut faire une requête spéciale pour récupérer le GTK
            if (this.useProxy) {
                const url = `${this.baseURL}?path=login.awp?gtk=1&v=${this.apiVersion}&getGtkCookie=true`;
                
                console.log('🌐 URL GTK:', url);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': this.userAgent
                    }
                });

                console.log('📥 Réponse GTK:', { status: response.status, ok: response.ok });

                if (response.ok) {
                    const data = await response.json();
                    console.log('📦 Données GTK reçues:', data);
                    
                    if (data.gtkCookie) {
                        this.gtkCookie = data.gtkCookie;
                        console.log('✅ Cookie GTK récupéré via proxy:', this.gtkCookie.substring(0, 50) + '...');
                        return true;
                    } else {
                        console.error('❌ Pas de gtkCookie dans la réponse:', data);
                    }
                } else {
                    const errorText = await response.text();
                    console.error('❌ Erreur HTTP GTK:', errorText);
                }
            } else {
                // Connexion directe (localhost)
                const url = `${this.baseURL}/login.awp?gtk=1&v=${this.apiVersion}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': this.userAgent
                    },
                    credentials: 'include'
                });

                console.log('📥 Réponse GTK:', { status: response.status, ok: response.ok });

                // Le cookie GTK est dans les headers de réponse
                const cookieHeader = response.headers.get('set-cookie');
                
                if (cookieHeader && cookieHeader.includes('GTK=')) {
                    const gtkMatch = cookieHeader.match(/GTK=([^;]+)/);
                    if (gtkMatch) {
                        this.gtkCookie = gtkMatch[1];
                        console.log('✅ Cookie GTK récupéré');
                        return true;
                    }
                }
            }
            
            console.warn('⚠️ Cookie GTK non trouvé dans les headers');
            return false;
        } catch (error) {
            console.error('❌ Erreur lors de la récupération du GTK:', error);
            return false;
        }
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
            
            // Étape 1 : Récupérer le cookie GTK
            const gtkSuccess = await this.getGtkCookie();
            console.log('🔑 Résultat récupération GTK:', { success: gtkSuccess, hasGtk: !!this.gtkCookie });
            
            // Étape 2 : Se connecter avec le cookie GTK
            const payload = {
                identifiant: username,
                motdepasse: password,
                isRelogin: false,
                uuid: ''
            };
            
            const formData = new URLSearchParams();
            formData.append('data', JSON.stringify(payload));
            
            const url = this.useProxy 
                ? `${this.baseURL}?path=login.awp?v=${this.apiVersion}`
                : `${this.baseURL}/login.awp?v=${this.apiVersion}`;
            
            console.log('📤 Requête:', { url, useProxy: this.useProxy, hasGtk: !!this.gtkCookie });
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': this.userAgent
            };
            
            // Ajouter le cookie GTK si disponible
            if (this.gtkCookie) {
                headers['X-Gtk'] = this.gtkCookie;
                console.log('🔑 Header X-Gtk ajouté:', this.gtkCookie.substring(0, 50) + '...');
            } else {
                console.warn('⚠️ Pas de cookie GTK disponible pour le login !');
            }   console.log('🔑 Header X-Gtk ajouté');
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData.toString(),
                credentials: 'include'
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
     */
    async getSchedule(year, week) {
        if (!this.token) {
            throw new Error('Non authentifié');
        }

        try {
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

    formatScheduleData(data) {
        return [];
    }

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

    formatMessagesData(data) {
        return [];
    }

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

    formatHomeworkData(data) {
        return [];
    }

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

    formatSchoolLifeData(data) {
        return { absences: [], delays: [], sanctions: [], encouragements: [] };
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

// Export de la classe
window.EcoleDirecteAPI = EcoleDirecteAPI;
