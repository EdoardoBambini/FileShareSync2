import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Termini di Servizio</CardTitle>
            <p className="text-muted-foreground text-center">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </CardHeader>
          
          <CardContent className="prose max-w-none">
            <h2>1. Accettazione dei Termini</h2>
            <p>
              Utilizzando NicheScribe AI, accetti questi Termini di Servizio. Se non accetti 
              questi termini, non utilizzare il nostro servizio.
            </p>

            <h2>2. Descrizione del Servizio</h2>
            <p>
              NicheScribe AI è una piattaforma di intelligenza artificiale che aiuta a creare 
              contenuti per social media, descrizioni prodotti e materiali di marketing.
            </p>
            <ul>
              <li><strong>Piano Gratuito:</strong> 3 generazioni di contenuti incluse</li>
              <li><strong>Piano Premium:</strong> €4.99/mese per contenuti illimitati e funzionalità avanzate</li>
            </ul>

            <h2>3. Registrazione Account</h2>
            <p>Per utilizzare il servizio devi:</p>
            <ul>
              <li>Avere almeno 18 anni o il consenso di un genitore/tutore</li>
              <li>Fornire informazioni accurate e aggiornate</li>
              <li>Mantenere la sicurezza del tuo account</li>
              <li>Utilizzare l'autenticazione Replit fornita</li>
            </ul>

            <h2>4. Pagamenti e Abbonamenti</h2>
            <h3>4.1 Abbonamento Premium</h3>
            <ul>
              <li>L'abbonamento Premium costa €4.99/mese</li>
              <li>I pagamenti sono elaborati in modo sicuro da Stripe</li>
              <li>L'abbonamento si rinnova automaticamente ogni mese</li>
              <li>Puoi annullare in qualsiasi momento dalle impostazioni account</li>
            </ul>

            <h3>4.2 Politica di Rimborso</h3>
            <ul>
              <li>I rimborsi sono valutati caso per caso</li>
              <li>Non sono previsti rimborsi per utilizzo parziale del servizio</li>
              <li>Problemi tecnici persistenti possono essere rimborsati</li>
            </ul>

            <h2>5. Uso Accettabile</h2>
            <p>Ti impegni a NON utilizzare il servizio per:</p>
            <ul>
              <li>Creare contenuti illegali, diffamatori o dannosi</li>
              <li>Violare diritti di proprietà intellettuale</li>
              <li>Generare spam o contenuti ingannevoli</li>
              <li>Tentare di aggirare le limitazioni del servizio</li>
              <li>Utilizzare il servizio per scopi commerciali oltre il consentito</li>
            </ul>

            <h2>6. Proprietà Intellettuale</h2>
            <h3>6.1 Contenuti Generati</h3>
            <ul>
              <li>I contenuti che generi appartengono a te</li>
              <li>Sei responsabile per l'uso dei contenuti generati</li>
              <li>NicheScribe AI non rivendica diritti sui tuoi contenuti</li>
            </ul>

            <h3>6.2 Servizio NicheScribe AI</h3>
            <ul>
              <li>Il software e la piattaforma sono di proprietà di NicheScribe AI</li>
              <li>Ti concediamo una licenza limitata per l'uso personale/commerciale</li>
            </ul>

            <h2>7. Limitazioni del Servizio</h2>
            <p>Il servizio è fornito "così com'è" e:</p>
            <ul>
              <li>Non garantiamo disponibilità continua al 100%</li>
              <li>L'AI può generare contenuti imprecisi o inappropriati</li>
              <li>Sei responsabile della revisione e uso dei contenuti</li>
              <li>Ci riserviamo il diritto di modificare le funzionalità</li>
            </ul>

            <h2>8. Limitazione di Responsabilità</h2>
            <p>
              NicheScribe AI non è responsabile per danni diretti, indiretti, 
              incidentali o consequenziali derivanti dall'uso del servizio.
            </p>

            <h2>9. Cancellazione Account</h2>
            <h3>9.1 Da parte tua</h3>
            <ul>
              <li>Puoi cancellare il tuo account in qualsiasi momento</li>
              <li>I dati vengono eliminati secondo la Privacy Policy</li>
            </ul>

            <h3>9.2 Da parte nostra</h3>
            <p>Possiamo sospendere o cancellare account per:</p>
            <ul>
              <li>Violazione di questi termini</li>
              <li>Attività fraudolenta o illegale</li>
              <li>Mancato pagamento dell'abbonamento</li>
            </ul>

            <h2>10. Modifiche ai Termini</h2>
            <p>
              Ci riserviamo il diritto di modificare questi termini. Gli utenti 
              verranno notificati delle modifiche significative tramite email 
              o notifica nell'app.
            </p>

            <h2>11. Legge Applicabile</h2>
            <p>
              Questi termini sono regolati dalla legge italiana. Eventuali 
              controversie saranno risolte dai tribunali competenti in Italia.
            </p>

            <h2>12. Servizi di Terze Parti</h2>
            <p>Il nostro servizio utilizza:</p>
            <ul>
              <li><strong>OpenAI:</strong> Per la generazione di contenuti AI</li>
              <li><strong>Stripe:</strong> Per l'elaborazione sicura dei pagamenti</li>
              <li><strong>Replit:</strong> Per l'hosting e l'autenticazione</li>
            </ul>
            <p>L'uso di questi servizi è soggetto ai loro rispettivi termini.</p>

            <h2>13. Contatti</h2>
            <p>Per domande sui termini di servizio:</p>
            <ul>
              <li>Email: support@nichescribe.ai</li>
              <li>Tramite l'app nella sezione "Supporto"</li>
            </ul>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Nota legale:</strong> Questi termini sono conformi alle normative italiane 
                e UE per servizi digitali e pagamenti online. Utilizzando NicheScribe AI accetti 
                questi termini nella loro interezza.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}