import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Facebook, Instagram, ShoppingBag, FileText, Video } from "lucide-react";
import type { NicheProfile } from "@shared/schema";

export default function ContentTypeSelection() {
  const [, setLocation] = useLocation();
  const [selectedProfile, setSelectedProfile] = useState<NicheProfile | null>(null);

  useEffect(() => {
    const profileData = sessionStorage.getItem("selectedProfile");
    
    if (!profileData) {
      console.log("Profilo mancante per selezione tipo, reindirizzamento alla dashboard...");
      setLocation("/");
      return;
    }

    try {
      const profile = JSON.parse(profileData);
      setSelectedProfile(profile);
    } catch (error) {
      console.error("Errore nel parsing del profilo:", error);
      setLocation("/");
    }
  }, [setLocation]);

  const handleContentTypeSelect = (contentType: string) => {
    if (selectedProfile) {
      sessionStorage.setItem("contentType", contentType);
      setLocation("/content-input");
    }
  };

  const handleGoBack = () => {
    setLocation("/");
  };

  if (!selectedProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-slate-600">Caricamento...</div>
          </div>
        </div>
      </div>
    );
  }

  const contentTypes = [
    {
      id: "facebook",
      title: "Post Facebook",
      description: "Crea post coinvolgenti per la tua pagina Facebook",
      icon: Facebook,
      color: "bg-blue-100 group-hover:bg-blue-200 text-blue-600"
    },
    {
      id: "instagram", 
      title: "Post Instagram",
      description: "Genera caption accattivanti per i tuoi post Instagram",
      icon: Instagram,
      color: "bg-pink-100 group-hover:bg-pink-200 text-pink-600"
    },
    {
      id: "product",
      title: "Descrizione Prodotto", 
      description: "Descrizioni persuasive per i tuoi prodotti e-commerce",
      icon: ShoppingBag,
      color: "bg-green-100 group-hover:bg-green-200 text-green-600"
    },
    {
      id: "blog",
      title: "Idea Articolo Blog",
      description: "Titoli e scalette per articoli del tuo blog", 
      icon: FileText,
      color: "bg-purple-100 group-hover:bg-purple-200 text-purple-600"
    },
    {
      id: "video",
      title: "Script Breve Video",
      description: "Script per video di 30-60 secondi",
      icon: Video,
      color: "bg-red-100 group-hover:bg-red-200 text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla Dashboard
        </Button>

        <div className="text-center mb-12">
          <div className="text-sm text-slate-600 mb-2">
            Progetto Attivo: <span className="font-medium text-slate-900">{selectedProfile.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Cosa vuoi creare oggi?</h1>
          <p className="text-lg text-slate-600">Scegli il tipo di contenuto che desideri generare</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => {
            const IconComponent = type.icon;
            
            return (
              <Card 
                key={type.id}
                className="hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer group"
                onClick={() => handleContentTypeSelect(type.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${type.color}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{type.title}</h3>
                  <p className="text-slate-600 text-sm">{type.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
