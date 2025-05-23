import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Facebook, Instagram, ShoppingBag, FileText, Video } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NicheProfile } from "@shared/schema";

export default function ContentInput() {
  const [, setLocation] = useLocation();
  const [selectedProfile, setSelectedProfile] = useState<NicheProfile | null>(null);
  const [contentType, setContentType] = useState<string>("");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      topic: "",
      cta: "",
      hashtags: "",
      name: "",
      features: "",
      benefits: "",
      angle: "",
      keywords: "",
      platform: "",
    },
  });

  useEffect(() => {
    const profileData = sessionStorage.getItem("selectedProfile");
    const typeData = sessionStorage.getItem("contentType");
    
    // Se mancano i dati essenziali, reindirizza intelligentemente
    if (!profileData) {
      console.log("Profilo mancante, reindirizzamento alla dashboard...");
      setLocation("/");
      return;
    }
    
    if (!typeData) {
      console.log("Tipo contenuto mancante, reindirizzamento alla selezione...");
      setLocation("/content-type");
      return;
    }

    try {
      const profile = JSON.parse(profileData);
      setSelectedProfile(profile);
      setContentType(typeData);
    } catch (error) {
      console.error("Errore nel parsing dei dati:", error);
      setLocation("/");
    }
  }, [setLocation]);

  const generateMutation = useMutation({
    mutationFn: async (inputData: any) => {
      const response = await apiRequest("POST", "/api/generate-content", {
        nicheProfileId: selectedProfile?.id,
        contentType,
        inputData,
      });
      return response.json();
    },
    onSuccess: (data) => {
      sessionStorage.setItem("generatedContent", JSON.stringify(data));
      setLocation("/content-output");
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la generazione del contenuto.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    // Filter out empty fields
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );
    generateMutation.mutate(filteredData);
  };

  const handleGoBack = () => {
    setLocation("/content-type");
  };

  if (!selectedProfile || !contentType) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-slate-600">Caricamento...</div>
          </div>
        </div>
      </div>
    );
  }

  const getContentTypeInfo = () => {
    switch (contentType) {
      case "facebook":
        return {
          title: "Crea il tuo Post Facebook",
          description: "Fornisci i dettagli per generare un post coinvolgente",
          icon: Facebook,
          color: "bg-blue-100 text-blue-600"
        };
      case "instagram":
        return {
          title: "Crea il tuo Post Instagram", 
          description: "Fornisci i dettagli per generare una caption accattivante",
          icon: Instagram,
          color: "bg-pink-100 text-pink-600"
        };
      case "product":
        return {
          title: "Crea la tua Descrizione Prodotto",
          description: "Descrivi il tuo prodotto per generare una descrizione persuasiva",
          icon: ShoppingBag,
          color: "bg-green-100 text-green-600"
        };
      case "blog":
        return {
          title: "Crea la tua Idea Articolo Blog",
          description: "Fornisci i dettagli per generare titolo e scaletta",
          icon: FileText,
          color: "bg-purple-100 text-purple-600"
        };
      case "video":
        return {
          title: "Crea il tuo Script Video",
          description: "Fornisci i dettagli per generare uno script coinvolgente",
          icon: Video,
          color: "bg-red-100 text-red-600"
        };
      default:
        return {
          title: "Crea Contenuto",
          description: "",
          icon: FileText,
          color: "bg-slate-100 text-slate-600"
        };
    }
  };

  const typeInfo = getContentTypeInfo();
  const IconComponent = typeInfo.icon;

  const renderFormFields = () => {
    switch (contentType) {
      case "facebook":
      case "instagram":
        return (
          <>
            <div>
              <Label htmlFor="topic">Argomento principale del post o messaggio chiave</Label>
              <Textarea
                id="topic"
                rows={3}
                placeholder="Es: 5 errori comuni nella cura dei bonsai e come evitarli"
                {...form.register("topic", { required: true })}
                className="mt-1 resize-none"
              />
            </div>
            
            <div>
              <Label htmlFor="cta">Call to Action (Opzionale)</Label>
              <Input
                id="cta"
                placeholder="Es: Visita il nostro sito, Commenta qui sotto"
                {...form.register("cta")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="hashtags">Hashtag suggeriti (Opzionale)</Label>
              <Input
                id="hashtags"
                placeholder="#bonsai #curapiante #giardinaggio"
                {...form.register("hashtags")}
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">Separa gli hashtag con spazi</p>
            </div>
          </>
        );

      case "product":
        return (
          <>
            <div>
              <Label htmlFor="name">Nome Prodotto</Label>
              <Input
                id="name"
                placeholder="Es: Bonsai Ficus Ginseng 'Little Gem'"
                {...form.register("name", { required: true })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="features">Caratteristiche Chiave del Prodotto</Label>
              <Textarea
                id="features"
                rows={4}
                placeholder="- Altezza: 20cm&#10;- Vaso in ceramica incluso&#10;- Facile da curare&#10;- Perfetto per interni"
                {...form.register("features", { required: true })}
                className="mt-1 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">Usa elenchi puntati per una migliore formattazione</p>
            </div>
            
            <div>
              <Label htmlFor="benefits">Benefici per il Cliente</Label>
              <Textarea
                id="benefits"
                rows={4}
                placeholder="- Aggiunge un tocco di natura alla tua casa&#10;- Regalo perfetto per gli amanti delle piante&#10;- Migliora la qualità dell'aria&#10;- Riduce lo stress quotidiano"
                {...form.register("benefits", { required: true })}
                className="mt-1 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">Concentrati sui vantaggi emotivi e pratici</p>
            </div>
            
            <div>
              <Label htmlFor="cta">Call to Action (Opzionale)</Label>
              <Input
                id="cta"
                placeholder="Es: Aggiungi al carrello ora!, Scopri di più"
                {...form.register("cta")}
                className="mt-1"
              />
            </div>
          </>
        );

      case "blog":
        return (
          <>
            <div>
              <Label htmlFor="topic">Argomento dell'articolo</Label>
              <Textarea
                id="topic"
                rows={3}
                placeholder="Es: Come prendersi cura dei bonsai in appartamento durante l'inverno"
                {...form.register("topic", { required: true })}
                className="mt-1 resize-none"
              />
            </div>
            
            <div>
              <Label htmlFor="angle">Angolatura o approccio specifico (Opzionale)</Label>
              <Input
                id="angle"
                placeholder="Es: Guida per principianti, Errori da evitare, Consigli avanzati"
                {...form.register("angle")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="keywords">Keywords SEO (Opzionale)</Label>
              <Input
                id="keywords"
                placeholder="bonsai inverno, cura piante appartamento, giardinaggio indoor"
                {...form.register("keywords")}
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">Separa le keywords con virgole</p>
            </div>
          </>
        );

      case "video":
        return (
          <>
            <div>
              <Label htmlFor="topic">Argomento del video</Label>
              <Textarea
                id="topic"
                rows={3}
                placeholder="Es: 3 errori fatali nella cura dei bonsai che rovinano le tue piante"
                {...form.register("topic", { required: true })}
                className="mt-1 resize-none"
              />
            </div>
            
            <div>
              <Label htmlFor="platform">Piattaforma di destinazione (Opzionale)</Label>
              <Input
                id="platform"
                placeholder="Es: TikTok, Instagram Reels, YouTube Shorts"
                {...form.register("platform")}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="cta">Call to Action (Opzionale)</Label>
              <Input
                id="cta"
                placeholder="Es: Seguimi per altri consigli, Salva questo video"
                {...form.register("cta")}
                className="mt-1"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${typeInfo.color}`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl mb-2">{typeInfo.title}</CardTitle>
              <p className="text-slate-600">{typeInfo.description}</p>
              <div className="text-sm text-slate-500 mt-2">
                <span className="font-medium">{selectedProfile.name}</span> • {typeInfo.title}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {renderFormFields()}
              
              <div className="flex justify-center space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleGoBack}
                  disabled={generateMutation.isPending}
                >
                  Indietro
                </Button>
                <Button 
                  type="submit"
                  disabled={generateMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {generateMutation.isPending ? "Generazione..." : "GENERA BOZZA"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
