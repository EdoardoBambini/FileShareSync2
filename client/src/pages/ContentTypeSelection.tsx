import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Facebook, Instagram, ShoppingBag, FileText, Video } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { NicheProfile } from "@shared/schema";

export default function ContentTypeSelection() {
  const [, setLocation] = useLocation();
  const [selectedProfile, setSelectedProfile] = useState<NicheProfile | null>(null);
  const { t } = useLanguage();

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

  // Non mostrare la pagina se non c'è il profilo selezionato
  // L'useEffect sopra già gestisce il redirect alla dashboard
  if (!selectedProfile) {
    return null;
  }

  const contentTypes = [
    {
      id: "facebook",
      title: t('content.facebook'),
      description: "Crea post coinvolgenti per la tua pagina Facebook",
      icon: Facebook,
      color: "bg-blue-100 group-hover:bg-blue-200 text-blue-600"
    },
    {
      id: "instagram", 
      title: t('content.instagram'),
      description: "Genera caption accattivanti per i tuoi post Instagram",
      icon: Instagram,
      color: "bg-pink-100 group-hover:bg-pink-200 text-pink-600"
    },
    {
      id: "product",
      title: t('content.product'),
      description: "Descrizioni persuasive per i tuoi prodotti e-commerce",
      icon: ShoppingBag,
      color: "bg-green-100 group-hover:bg-green-200 text-green-600"
    },
    {
      id: "blog",
      title: t('content.blog'),
      description: "Titoli e scalette per articoli del tuo blog", 
      icon: FileText,
      color: "bg-purple-100 group-hover:bg-purple-200 text-purple-600"
    },
    {
      id: "video",
      title: t('content.video'),
      description: "Script per video di 30-60 secondi",
      icon: Video,
      color: "bg-red-100 group-hover:bg-red-200 text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('output.backToDashboard')}
        </Button>

        <div className="text-center mb-8 sm:mb-12">
          <div className="text-sm text-slate-600 mb-3 font-medium">
            Progetto Attivo: <span className="text-primary font-semibold">{selectedProfile.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {t('content.whatToday')}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('content.chooseType')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contentTypes.map((type) => {
            const IconComponent = type.icon;
            
            return (
              <Card 
                key={type.id}
                className="hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                onClick={() => handleContentTypeSelect(type.id)}
              >
                <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors shadow-sm ${type.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-tight">{type.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{type.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
