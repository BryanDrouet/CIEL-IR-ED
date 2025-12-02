/**
 * Module de gestion des notifications
 * Gère les notifications push pour les nouveaux menus et notes
 */

class NotificationManager {
    constructor() {
        this.db = null;
        this.messaging = null;
        this.checkInterval = null;
        this.lastMenuCheck = null;
    }

    /**
     * Initialise le système de notifications
     */
    async init() {
        try {
            this.db = firebase.firestore();

            // Demander la permission pour les notifications
            await this.requestPermission();

            // Initialiser Firebase Messaging si disponible
            if (firebase.messaging.isSupported()) {
                this.messaging = firebase.messaging();
                await this.setupMessaging();
            }

            // Démarrer la vérification périodique
            this.startPeriodicCheck();

        } catch (error) {
            console.warn('Notifications non disponibles:', error);
        }
    }

    /**
     * Demande la permission pour les notifications
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Ce navigateur ne supporte pas les notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    /**
     * Configure Firebase Cloud Messaging
     */
    async setupMessaging() {
        try {
            // Obtenir le token FCM
            const token = await this.messaging.getToken({
                vapidKey: 'VOTRE_VAPID_KEY' // À remplacer par votre clé VAPID
            });

            if (token) {
                await this.saveTokenToDatabase(token);
            }

            // Écouter les messages en arrière-plan
            this.messaging.onMessage((payload) => {
                console.log('Message reçu:', payload);
                this.showNotification(
                    payload.notification.title,
                    payload.notification.body
                );
            });

        } catch (error) {
            console.warn('Erreur configuration messaging:', error);
        }
    }

    /**
     * Sauvegarde le token FCM dans Firebase
     */
    async saveTokenToDatabase(token) {
        const user = firebase.auth().currentUser;
        if (!user) return;

        try {
            await this.db.collection('users').doc(user.uid).set({
                fcmToken: token,
                tokenUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error('Erreur sauvegarde token:', error);
        }
    }

    /**
     * Affiche une notification système
     */
    showNotification(title, body, options = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: '/icon.png',
                badge: '/badge.png',
                vibrate: [200, 100, 200],
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Afficher aussi la bannière dans l'application
            this.showBanner(title, body);
        }
    }

    /**
     * Affiche une bannière de notification dans l'application
     */
    showBanner(title, message) {
        const banner = document.getElementById('notificationBanner');
        const text = document.getElementById('notificationText');

        if (banner && text) {
            text.textContent = `${title}: ${message}`;
            banner.classList.remove('hidden');

            // Masquer après 10 secondes
            setTimeout(() => {
                banner.classList.add('hidden');
            }, 10000);
        }
    }

    /**
     * Démarre la vérification périodique des menus
     */
    startPeriodicCheck() {
        // Vérifier toutes les 5 minutes
        this.checkInterval = setInterval(() => {
            this.checkForNewMenus();
        }, 5 * 60 * 1000);

        // Vérification initiale
        this.checkForNewMenus();
    }

    /**
     * Arrête la vérification périodique
     */
    stopPeriodicCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Vérifie les nouveaux menus
     */
    async checkForNewMenus() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return;

            // Récupérer les derniers menus stockés
            const lastMenusDoc = await this.db
                .collection('users')
                .doc(user.uid)
                .collection('menus')
                .doc('latest')
                .get();

            const lastMenus = lastMenusDoc.exists ? lastMenusDoc.data().items : [];

            // Récupérer les nouveaux menus depuis l'API
            const api = new EcoleDirecteAPI();
            await api.autoLogin();
            const currentMenus = await api.getMenus();

            // Comparer et détecter les nouveaux menus
            const newMenus = this.findNewMenus(lastMenus, currentMenus);

            if (newMenus.length > 0) {
                // Notifier l'utilisateur
                newMenus.forEach(menu => {
                    this.showNotification(
                        '🍽️ Nouveau menu disponible',
                        `Menu du ${this.formatDate(menu.date)} - ${menu.type}`,
                        { tag: 'menu-' + menu.date }
                    );

                    // Ajouter à l'interface
                    this.addMenuToInterface(menu);
                });

                // Sauvegarder les menus actuels
                await this.db
                    .collection('users')
                    .doc(user.uid)
                    .collection('menus')
                    .doc('latest')
                    .set({
                        items: currentMenus,
                        lastCheck: firebase.firestore.FieldValue.serverTimestamp()
                    });
            }

        } catch (error) {
            console.error('Erreur vérification menus:', error);
        }
    }

    /**
     * Trouve les nouveaux menus
     */
    findNewMenus(oldMenus, newMenus) {
        const oldDates = new Set(oldMenus.map(m => m.date + m.type));
        return newMenus.filter(menu => !oldDates.has(menu.date + menu.type));
    }

    /**
     * Ajoute un menu à l'interface
     */
    addMenuToInterface(menu) {
        const container = document.getElementById('menuNotifications');
        if (!container) return;

        // Supprimer le message info s'il existe
        const infoMsg = container.querySelector('.info-message');
        if (infoMsg) {
            infoMsg.remove();
        }

        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="menu-item-header">
                <span class="menu-date">${this.formatDate(menu.date)}</span>
                <span class="menu-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="menu-content">
                <strong>${menu.type}</strong><br>
                ${menu.plats.map(p => p.nom).join(', ') || 'Menu non détaillé'}
            </div>
        `;

        container.insertBefore(menuItem, container.firstChild);
    }

    /**
     * Vérifie les nouvelles notes
     */
    async checkForNewGrades(currentGrades) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return;

            // Récupérer les dernières notes stockées
            const lastGradesDoc = await this.db
                .collection('users')
                .doc(user.uid)
                .collection('grades')
                .doc('latest')
                .get();

            const lastGradeCount = lastGradesDoc.exists ? lastGradesDoc.data().count : 0;

            if (currentGrades.length > lastGradeCount) {
                const newCount = currentGrades.length - lastGradeCount;
                
                this.showNotification(
                    '📝 Nouvelles notes disponibles',
                    `${newCount} nouvelle(s) note(s) ajoutée(s)`,
                    { tag: 'grades-update' }
                );

                // Mettre à jour le compteur
                await this.db
                    .collection('users')
                    .doc(user.uid)
                    .collection('grades')
                    .doc('latest')
                    .set({
                        count: currentGrades.length,
                        lastCheck: firebase.firestore.FieldValue.serverTimestamp()
                    });
            }

        } catch (error) {
            console.error('Erreur vérification notes:', error);
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
     * Nettoie les ressources
     */
    cleanup() {
        this.stopPeriodicCheck();
    }
}

// Fermer la bannière de notification
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeNotification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const banner = document.getElementById('notificationBanner');
            if (banner) {
                banner.classList.add('hidden');
            }
        });
    }
});

// Export de la classe
window.NotificationManager = NotificationManager;
