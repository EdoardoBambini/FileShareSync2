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
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                🚀 Accedi al tuo account
              </h2>
              <p className="text-slate-600 mb-6">
                Crea contenuti professionali per social media, prodotti e marketing 
                con l'intelligenza artificiale più avanzata.
              </p>
              
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                <a href="/api/login">
                  ✨ ACCEDI CON REPLIT
                </a>
              </Button>
              
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                🔒 <strong>Login sicuro:</strong> Verrai reindirizzato al sistema di autenticazione Replit. 
                I tuoi dati sono protetti e crittografati.
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
                
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✅</span>
                    <strong>3 generazioni gratuite</strong> per iniziare
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-blue-500 mr-2">🎯</span>
                    Suggerimenti AI intelligenti
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-purple-500 mr-2">📱</span>
                    Post Facebook, Instagram, blog e prodotti
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-orange-500 mr-2">👥</span>
                    Gestione progetti multipli
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-pink-500 mr-2">✨</span>
                    <strong>Premium €4.99/mese</strong> - contenuti illimitati
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
