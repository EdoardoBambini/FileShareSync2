import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <PenTool className="text-primary-foreground text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">NicheScribe AI</h1>
          <p className="text-slate-600">AI-Powered Content Generation</p>
        </div>

        {/* Welcome Card */}
        <Card className="shadow-lg">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Accedi al tuo account
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Crea contenuti professionali per social media, prodotti e marketing 
                con l'intelligenza artificiale più avanzata.
              </p>
              
              <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-lg py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold">
                <a href="/api/login">
                  ACCEDI CON REPLIT
                </a>
              </Button>
              
              <p className="text-xs text-slate-500 mt-6 leading-relaxed px-4">
                <span className="font-medium">Login sicuro:</span> Verrai reindirizzato al sistema di autenticazione Replit. 
                I tuoi dati sono protetti con crittografia avanzata.
              </p>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Funzionalità principali</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <span className="font-semibold">3 generazioni gratuite</span>
                      <span className="text-slate-500 ml-1">per iniziare</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>Suggerimenti AI intelligenti</div>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div>Post Facebook, Instagram, blog e prodotti</div>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <div>Gestione progetti multipli</div>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <div>
                      <span className="font-semibold">Premium €4.99/mese</span>
                      <span className="text-slate-500 ml-1">- contenuti illimitati</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer legale */}
        <div className="mt-8 text-center text-xs text-slate-400 space-x-4">
          <a href="/privacy" className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-slate-600 transition-colors">
            Termini di Servizio
          </a>
          <span>•</span>
          <span>© 2025 NicheScribe AI</span>
        </div>
      </div>
    </div>
  );
}
