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
                Benvenuto in NicheScribe AI
              </h2>
              <p className="text-slate-600 mb-6">
                La piattaforma AI per creare contenuti mirati per social media, 
                descrizioni prodotti e marketing personalizzato.
              </p>
              
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <a href="/api/login">
                  ACCEDI PER INIZIARE
                </a>
              </Button>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Funzionalità principali</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-center">
                    ✨ Generazione contenuti AI personalizzati
                  </div>
                  <div className="flex items-center justify-center">
                    🎯 Profili nicchia multipli
                  </div>
                  <div className="flex items-center justify-center">
                    📱 Post social e descrizioni prodotti
                  </div>
                  <div className="flex items-center justify-center">
                    📝 Editor integrato per personalizzazioni
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
