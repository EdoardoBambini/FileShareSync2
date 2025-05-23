import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Privacy Policy</CardTitle>
            <p className="text-muted-foreground text-center">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </CardHeader>
          
          <CardContent className="prose max-w-none">
            <h2>1. Raccolta dei Dati</h2>
            <p>
              NicheScribe AI raccoglie le seguenti informazioni quando utilizzi il nostro servizio:
            </p>
            <ul>
              <li><strong>Dati di account:</strong> Email, nome e informazioni di autenticazione tramite Replit</li>
              <li><strong>Dati dei progetti:</strong> Profili creati, contenuti generati e preferenze</li>
              <li><strong>Dati di pagamento:</strong> Gestiti in modo sicuro da Stripe (non memorizziamo carte di credito)</li>
              <li><strong>Dati di utilizzo:</strong> Statistiche anonime per migliorare il servizio</li>
            </ul>

            <h2>2. Utilizzo dei Dati</h2>
            <p>Utilizziamo i tuoi dati per:</p>
            <ul>
              <li>Fornire e migliorare il servizio NicheScribe AI</li>
              <li>Elaborare pagamenti tramite Stripe</li>
              <li>Generare contenuti personalizzati tramite OpenAI</li>
              <li>Inviare comunicazioni importanti sul servizio</li>
              <li>Garantire la sicurezza e prevenire frodi</li>
            </ul>

            <h2>3. Condivisione dei Dati</h2>
            <p>I tuoi dati possono essere condivisi con:</p>
            <ul>
              <li><strong>OpenAI:</strong> Per la generazione di contenuti (dati anonimi)</li>
              <li><strong>Stripe:</strong> Per l'elaborazione sicura dei pagamenti</li>
              <li><strong>Replit:</strong> Per l'hosting e l'autenticazione</li>
            </ul>
            <p>Non vendiamo mai i tuoi dati personali a terze parti.</p>

            <h2>4. Sicurezza dei Dati</h2>
            <p>
              Implementiamo misure di sicurezza avanzate per proteggere i tuoi dati:
            </p>
            <ul>
              <li>Crittografia SSL/TLS per tutte le comunicazioni</li>
              <li>Database sicuri con backup automatici</li>
              <li>Accesso limitato ai dati del personale</li>
              <li>Conformità agli standard di sicurezza di Stripe e Replit</li>
            </ul>

            <h2>5. I Tuoi Diritti (GDPR)</h2>
            <p>Hai il diritto di:</p>
            <ul>
              <li><strong>Accesso:</strong> Richiedere una copia dei tuoi dati</li>
              <li><strong>Rettifica:</strong> Correggere dati errati</li>
              <li><strong>Cancellazione:</strong> Richiedere la cancellazione del tuo account</li>
              <li><strong>Portabilità:</strong> Esportare i tuoi dati</li>
              <li><strong>Limitazione:</strong> Limitare il trattamento dei dati</li>
            </ul>

            <h2>6. Conservazione dei Dati</h2>
            <p>
              Conserviamo i tuoi dati finché il tuo account è attivo. Dopo la cancellazione dell'account, 
              i dati vengono eliminati entro 30 giorni, eccetto quando richiesto per obblighi legali.
            </p>

            <h2>7. Cookie e Tracking</h2>
            <p>
              Utilizziamo cookie essenziali per il funzionamento del servizio. Non utilizziamo 
              cookie di tracciamento di terze parti senza il tuo consenso.
            </p>

            <h2>8. Modifiche alla Privacy Policy</h2>
            <p>
              Ci riserviamo il diritto di aggiornare questa privacy policy. Gli utenti verranno 
              notificati di cambiamenti significativi tramite email o notifica nell'app.
            </p>

            <h2>9. Contatti</h2>
            <p>
              Per domande sulla privacy o per esercitare i tuoi diritti, contattaci a:
            </p>
            <ul>
              <li>Email: privacy@nichescribe.ai</li>
              <li>Tramite l'app nella sezione "Supporto"</li>
            </ul>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Nota legale:</strong> Questa privacy policy è conforme al GDPR (Regolamento Generale 
                sulla Protezione dei Dati) e alle normative italiane sulla privacy. NicheScribe AI si impegna 
                a proteggere la tua privacy e i tuoi dati personali.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}