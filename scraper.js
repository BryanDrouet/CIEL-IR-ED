/**
 * Scraper pour EcoleDirecte
 * Utilise une iframe ou une fenêtre cachée pour se connecter au site officiel
 */

class EcoleDirecteScraper {
    constructor() {
        this.loginUrl = 'https://www.ecoledirecte.com/login';
        this.dashboardUrl = 'https://www.ecoledirecte.com/Eleves';
    }

    /**
     * Connexion via iframe
     */
    async login(username, password) {
        return new Promise((resolve, reject) => {
            console.log('🔐 Connexion via scraping...');
            
            // Créer une iframe cachée
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = this.loginUrl;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    // Remplir le formulaire
                    const usernameField = iframeDoc.querySelector('input[name="identifiant"]') || 
                                         iframeDoc.querySelector('input[type="text"]');
                    const passwordField = iframeDoc.querySelector('input[name="motdepasse"]') || 
                                         iframeDoc.querySelector('input[type="password"]');
                    const submitButton = iframeDoc.querySelector('button[type="submit"]') || 
                                        iframeDoc.querySelector('input[type="submit"]');

                    if (!usernameField || !passwordField) {
                        throw new Error('Formulaire non trouvé - le site a peut-être changé');
                    }

                    console.log('📝 Remplissage du formulaire...');
                    usernameField.value = username;
                    passwordField.value = password;

                    // Soumettre
                    setTimeout(() => {
                        console.log('📤 Soumission...');
                        if (submitButton) {
                            submitButton.click();
                        } else {
                            iframeDoc.querySelector('form').submit();
                        }

                        // Vérifier le succès après un délai
                        setTimeout(() => {
                            try {
                                const currentUrl = iframe.contentWindow.location.href;
                                if (currentUrl.includes('Eleves') || currentUrl.includes('dashboard')) {
                                    console.log('✅ Connexion réussie !');
                                    this.extractData(iframe).then(data => {
                                        document.body.removeChild(iframe);
                                        resolve({ success: true, data });
                                    });
                                } else {
                                    throw new Error('Échec de connexion - vérifiez vos identifiants');
                                }
                            } catch (error) {
                                document.body.removeChild(iframe);
                                reject(error);
                            }
                        }, 3000);
                    }, 500);

                } catch (error) {
                    document.body.removeChild(iframe);
                    reject(error);
                }
            };

            iframe.onerror = () => {
                document.body.removeChild(iframe);
                reject(new Error('Impossible de charger le site EcoleDirecte'));
            };
        });
    }

    /**
     * Extraire les données depuis la page
     */
    async extractData(iframe) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Extraire le nom de l'élève
            const nameElement = iframeDoc.querySelector('.user-name') || 
                               iframeDoc.querySelector('.eleve-nom') ||
                               iframeDoc.querySelector('h1');
            
            const name = nameElement ? nameElement.textContent.trim() : 'Élève';
            
            // Extraire la classe
            const classeElement = iframeDoc.querySelector('.user-classe') || 
                                 iframeDoc.querySelector('.classe');
            
            const classe = classeElement ? classeElement.textContent.trim() : 'N/A';

            return {
                name,
                classe,
                url: iframe.contentWindow.location.href
            };
        } catch (error) {
            console.error('Erreur extraction données:', error);
            return { name: 'Élève', classe: 'N/A' };
        }
    }

    /**
     * Ouvrir le dashboard dans une nouvelle fenêtre
     */
    async openDashboard(username, password) {
        console.log('🌐 Ouverture du dashboard EcoleDirecte...');
        
        // Ouvrir une popup pour que l'utilisateur se connecte manuellement
        const popup = window.open(this.loginUrl, 'EcoleDirecte', 'width=1200,height=800');
        
        if (!popup) {
            throw new Error('Les popups sont bloquées. Autorisez les popups pour ce site.');
        }

        return new Promise((resolve) => {
            // Pré-remplir si possible (ne fonctionne pas à cause de CORS)
            const checkInterval = setInterval(() => {
                try {
                    if (popup.closed) {
                        clearInterval(checkInterval);
                        resolve({ success: false, message: 'Fenêtre fermée' });
                    } else if (popup.location.href.includes('Eleves')) {
                        clearInterval(checkInterval);
                        resolve({ success: true, popup });
                    }
                } catch (e) {
                    // CORS - on ne peut pas accéder à popup.location
                }
            }, 1000);
        });
    }
}

window.EcoleDirecteScraper = EcoleDirecteScraper;
