import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lightbulb, Target, MessageCircle, ShoppingBag, FileText, Video, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NicheProfile } from "@shared/schema";

interface ContentSuggestion {
  type: string;
  title: string;
  description: string;
  reason: string;
  icon: any;
}

export default function ContentSuggestion() {
  const [, setLocation] = useLocation();
  const [selectedProfile, setSelectedProfile] = useState<NicheProfile | null>(null);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      objective: "",
    },
  });

  useEffect(() => {
    const profileData = sessionStorage.getItem("selectedProfile");
    
    if (!profileData) {
      console.log("Profilo mancante per suggerimenti, reindirizzamento alla dashboard...");
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

  const suggestionMutation = useMutation({
    mutationFn: async (objective: string) => {
      const response = await apiRequest("POST", "/api/suggest-content-types", {
        nicheProfileId: selectedProfile?.id,
        objective,
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Dati ricevuti:", data);
      if (data && data.suggestions) {
        const mappedSuggestions = data.suggestions.map((suggestion: any) => ({
          ...suggestion,
          icon: getIconForType(suggestion.type),
        }));
        setSuggestions(mappedSuggestions);
      } else {
        console.error("Formato dati non valido:", data);
        toast({
          title: "Errore",
          description: "Formato dati non valido ricevuto dal server.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'analisi dell'obiettivo.",
        variant: "destructive",
      });
    },
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "facebook":
      case "instagram":
        return MessageCircle;
      case "product":
        return ShoppingBag;
      case "blog":
        return FileText;
      case "video":
        return Video;
      default:
        return Target;
    }
  };

  const handleSubmit = (data: { objective: string }) => {
    suggestionMutation.mutate(data.objective);
  };

  const handleSelectSuggestion = (suggestion: ContentSuggestion) => {
    sessionStorage.setItem("contentType", suggestion.type);
    sessionStorage.setItem("contentObjective", form.getValues("objective"));
    sessionStorage.setItem("contentTitle", suggestion.title);
    sessionStorage.setItem("contentDescription", suggestion.description);
    sessionStorage.setItem("aiSuggested", "true");
    setLocation("/content-output");
  };

  const handleManualSelection = () => {
    sessionStorage.setItem("contentObjective", form.getValues("objective"));
    setLocation("/content-type");
  };

  const handleGoBack = () => {
    setLocation("/");
  };

  // Non mostrare la pagina se non c'è il profilo selezionato
  // L'useEffect sopra già gestisce il redirect alla dashboard
  if (!selectedProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla Dashboard
        </Button>

        <div className="text-center mb-8">
          <div className="text-sm text-muted-foreground mb-2">
            Progetto Attivo: <span className="font-medium text-foreground">{selectedProfile.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Cosa vuoi comunicare oggi?</h1>
          <p className="text-lg text-muted-foreground">
            Descrivi il tuo obiettivo e l'AI suggerirà i formati di contenuto più efficaci
          </p>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Lightbulb className="w-5 h-5 mr-2 text-primary" />
              Analisi Intelligente del Contenuto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="objective">Di cosa vuoi parlare? Qual è il tuo obiettivo?</Label>
                <Textarea
                  id="objective"
                  rows={4}
                  placeholder="Esempio: Voglio lanciare un nuovo prodotto per la cura dei bonsai che risolve il problema della sovra-irrigazione..."
                  {...form.register("objective", { required: true })}
                  className="mt-1 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Più dettagli fornisci, migliori saranno i suggerimenti dell'AI
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  type="submit"
                  disabled={suggestionMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {suggestionMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analisi in corso...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      ANALIZZA E SUGGERISCI
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {suggestions && suggestions.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Suggerimenti Personalizzati</h2>
              <p className="text-muted-foreground">
                L'AI ha analizzato il tuo obiettivo e suggerisce questi formati di contenuto
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                
                return (
                  <Card 
                    key={index}
                    className="hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer group"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{suggestion.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                          <div className="bg-accent p-3 rounded-lg">
                            <p className="text-xs font-medium text-accent-foreground mb-1">Perché questo formato:</p>
                            <p className="text-xs text-accent-foreground">{suggestion.reason}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Non convinto dai suggerimenti? Puoi sempre scegliere manualmente
              </p>
              <Button 
                variant="outline"
                onClick={handleManualSelection}
              >
                Scegli Manualmente il Tipo di Contenuto
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}