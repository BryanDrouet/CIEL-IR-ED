/**
 * Module de gestion de la messagerie
 */

class MessagingManager {
    constructor() {
        this.messages = [];
        this.currentFilter = 'all';
        this.selectedMessage = null;
    }

    /**
     * Récupère les messages depuis l'API
     */
    async fetchMessages(api) {
        try {
            const response = await api.getMessages();
            this.messages = response;
            return response;
        } catch (error) {
            console.error('Erreur récupération messages:', error);
            return this.getMockMessages();
        }
    }

    /**
     * Affiche la liste des messages
     */
    displayMessages(filter = 'all') {
        this.currentFilter = filter;
        const container = document.getElementById('messagesList');
        if (!container) return;

        const filteredMessages = this.filterMessages(filter);

        if (filteredMessages.length === 0) {
            container.innerHTML = '<p class="info-message">Aucun message</p>';
            return;
        }

        container.innerHTML = filteredMessages.map(msg => `
            <div class="message-item ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
                <div class="message-header">
                    <span class="message-sender">${msg.from}</span>
                    <span class="message-date">${this.formatDate(msg.date)}</span>
                </div>
                <div class="message-subject">${msg.subject}</div>
                <div class="message-preview">${msg.preview}</div>
            </div>
        `).join('');

        // Ajouter les événements de clic
        container.querySelectorAll('.message-item').forEach(item => {
            item.addEventListener('click', () => {
                const msgId = parseInt(item.dataset.id);
                this.showMessageDetail(msgId);
            });
        });

        // Mettre à jour le badge des non-lus
        this.updateUnreadBadge();
    }

    /**
     * Affiche le détail d'un message
     */
    showMessageDetail(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (!message) return;

        this.selectedMessage = message;
        message.read = true;

        const listContainer = document.getElementById('messagesList');
        const detailContainer = document.getElementById('messageDetail');
        const contentContainer = document.getElementById('messageContent');

        if (!detailContainer || !contentContainer) return;

        contentContainer.innerHTML = `
            <div class="message-detail-header">
                <h3>${message.subject}</h3>
                <div class="message-meta">
                    <strong>De:</strong> ${message.from}<br>
                    <strong>Date:</strong> ${this.formatDate(message.date)}
                </div>
            </div>
            <div class="message-body">
                ${message.content}
            </div>
            ${message.attachments ? `
                <div class="message-attachments">
                    <h4>📎 Pièces jointes:</h4>
                    ${message.attachments.map(att => `
                        <div class="attachment-item">
                            <span>📄 ${att.name}</span>
                            <span class="attachment-size">${att.size}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;

        listContainer.classList.add('hidden');
        detailContainer.classList.remove('hidden');

        this.updateUnreadBadge();
    }

    /**
     * Retour à la liste des messages
     */
    backToList() {
        const listContainer = document.getElementById('messagesList');
        const detailContainer = document.getElementById('messageDetail');

        if (listContainer && detailContainer) {
            listContainer.classList.remove('hidden');
            detailContainer.classList.add('hidden');
        }

        this.displayMessages(this.currentFilter);
    }

    /**
     * Filtre les messages
     */
    filterMessages(filter) {
        switch (filter) {
            case 'unread':
                return this.messages.filter(m => !m.read);
            case 'sent':
                return this.messages.filter(m => m.sent);
            case 'all':
            default:
                return this.messages.filter(m => !m.sent);
        }
    }

    /**
     * Met à jour le badge des messages non lus
     */
    updateUnreadBadge() {
        const badge = document.getElementById('unreadBadge');
        if (!badge) return;

        const unreadCount = this.messages.filter(m => !m.read && !m.sent).length;
        
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    /**
     * Formate une date
     */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Hier';
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jours`;
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    }

    /**
     * Messages de démonstration
     */
    getMockMessages() {
        const now = new Date();
        return [
            {
                id: 1,
                from: 'M. Dupont (Mathématiques)',
                subject: 'Contrôle de mathématiques',
                preview: 'Le prochain contrôle aura lieu vendredi prochain...',
                content: 'Bonjour,<br><br>Le prochain contrôle de mathématiques aura lieu vendredi prochain. Il portera sur les chapitres 3 et 4.<br><br>Cordialement,<br>M. Dupont',
                date: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
                read: false,
                sent: false
            },
            {
                id: 2,
                from: 'Vie scolaire',
                subject: 'Absence non justifiée',
                preview: 'Nous avons constaté une absence le 28/11...',
                content: 'Bonjour,<br><br>Nous avons constaté une absence non justifiée le 28/11. Merci de fournir un justificatif.<br><br>Vie scolaire',
                date: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
                read: false,
                sent: false
            },
            {
                id: 3,
                from: 'Administration',
                subject: 'Réunion parents-professeurs',
                preview: 'La réunion parents-professeurs aura lieu le...',
                content: 'Bonjour,<br><br>La réunion parents-professeurs aura lieu le 15 décembre à 18h00.<br><br>Cordialement',
                date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                sent: false,
                attachments: [
                    { name: 'convocation.pdf', size: '125 Ko' }
                ]
            },
            {
                id: 4,
                from: 'Mme Martin (Français)',
                subject: 'Exposé de français',
                preview: 'N\'oubliez pas votre exposé pour mardi prochain...',
                content: 'Bonjour,<br><br>N\'oubliez pas votre exposé de français prévu pour mardi prochain.<br><br>Mme Martin',
                date: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                sent: false
            }
        ];
    }
}

window.MessagingManager = MessagingManager;
