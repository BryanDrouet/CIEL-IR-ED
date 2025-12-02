"""
Serveur proxy simple pour EcoleDirecte
Alternative à proxy-server.js - fonctionne avec Python (pas besoin de Node.js)

Lancement: python proxy-server.py
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import urllib.parse
import json
import os

class ProxyHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        """Gérer les requêtes POST vers l'API EcoleDirecte"""
        if self.path.startswith('/api/'):
            self.proxy_request()
        else:
            super().do_POST()
    
    def do_GET(self):
        """Gérer les requêtes GET - servir les fichiers statiques"""
        if self.path.startswith('/api/'):
            self.proxy_request()
        else:
            super().do_GET()
    
    def proxy_request(self):
        """Proxifier la requête vers EcoleDirecte"""
        try:
            # Extraire le chemin de l'API
            api_path = self.path.replace('/api/', '')
            ecoledirecte_url = f'https://api.ecoledirecte.com/v3/{api_path}'
            
            print(f'[PROXY] {self.command} {ecoledirecte_url}')
            
            # Lire le body pour POST
            content_length = int(self.headers.get('Content-Length', 0))
            body = None
            
            if content_length > 0:
                body_bytes = self.rfile.read(content_length)
                body_json = json.loads(body_bytes.decode('utf-8'))
                
                # Convertir en format form-urlencoded pour EcoleDirecte
                form_data = urllib.parse.urlencode({
                    'data': json.dumps(body_json)
                }).encode('utf-8')
                body = form_data
            
            # Créer la requête
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            req = urllib.request.Request(
                ecoledirecte_url,
                data=body,
                headers=headers,
                method=self.command
            )
            
            # Envoyer la requête
            with urllib.request.urlopen(req) as response:
                response_data = response.read()
                
                # Renvoyer la réponse
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response_data)
                
                print(f'[PROXY] Response: 200 OK')
        
        except Exception as e:
            print(f'[PROXY] Erreur: {e}')
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = json.dumps({
                'code': 500,
                'message': str(e)
            }).encode('utf-8')
            self.wfile.write(error_response)
    
    def do_OPTIONS(self):
        """Gérer les requêtes OPTIONS (preflight CORS)"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def end_headers(self):
        """Ajouter les headers CORS à toutes les réponses"""
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server(port=3000):
    """Démarrer le serveur"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ProxyHandler)
    
    print(f"""
╔═══════════════════════════════════════════════════════╗
║  🚀 Serveur proxy EcoleDirecte démarré !              ║
║                                                       ║
║  📍 Application:  http://localhost:{port}              ║
║  🔗 API Proxy:    http://localhost:{port}/api/        ║
║                                                       ║
║  💡 Ouvrez http://localhost:{port} dans votre        ║
║     navigateur pour utiliser l'application            ║
║                                                       ║
║  ⏹️  Arrêter: Ctrl + C                                 ║
╚═══════════════════════════════════════════════════════╝
    """)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ Serveur arrêté")
        httpd.shutdown()

if __name__ == '__main__':
    # Changer le répertoire vers le dossier du script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run_server(3000)
