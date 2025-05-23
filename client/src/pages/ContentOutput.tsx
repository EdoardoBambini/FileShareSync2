import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Download, RefreshCw, Save, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NicheProfile, GeneratedContent } from "@shared/schema";

export default function ContentOutput() {
  const [, setLocation] = useLocation();
  const [selectedProfile, setSelectedProfile] = useState<NicheProfile | null>(null);
  const [contentType, setContentType] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Funzione per generare contenuto dai suggerimenti AI
  const generateContentFromAI = (profile: NicheProfile, contentType: string, objective: string) => {
    const inputData = {
      objective: objective,
      specificDetails: `Genera contenuto basato sull'obiettivo: ${objective}`
    };

    generateContentMutation.mutate({
      nicheProfileId: profile.id,
      contentType,
      inputData
    });
  };

  const generateContentMutation = useMutation({
    mutationFn: async (data: { nicheProfileId: number; contentType: string; inputData: any }) => {
      const response = await apiRequest("POST", "/api/generate-content", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      setEditedText(data.generatedText);
      sessionStorage.setItem("generatedContent", JSON.stringify(data));
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la generazione del contenuto.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const profileData = sessionStorage.getItem("selectedProfile");
    const typeData = sessionStorage.getItem("contentType");
    const contentData = sessionStorage.getItem("generatedContent");
    const aiSuggested = sessionStorage.getItem("aiSuggested");
    const objective = sessionStorage.getItem("contentObjective");
    
    if (profileData && typeData) {
      setSelectedProfile(JSON.parse(profileData));
      setContentType(typeData);
      
      // Se viene dai suggerimenti AI, cancella il vecchio contenuto e genera nuovo
      if (aiSuggested === "true") {
        console.log("Generazione da suggerimento AI...");
        sessionStorage.removeItem("generatedContent");
        sessionStorage.removeItem("aiSuggested");
        
        if (objective) {
          generateContentFromAI(JSON.parse(profileData), typeData, objective);
        }
      }
      // Se ha già il contenuto generato normale, lo mostra
      else if (contentData) {
        const content = JSON.parse(contentData);
        setGeneratedContent(content);
        setEditedText(content.generatedText);
      }
      else {
        setLocation("/");
      }
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const generateVariationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-content-variation", {
        contentId: generatedContent?.id,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      setEditedText(data.generatedText);
      toast({
        title: "Variazione generata!",
        description: "Una nuova variazione del contenuto è stata creata.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la generazione della variazione.",
        variant: "destructive",
      });
    },
  });

  const ratingMutation = useMutation({
    mutationFn: async (rating: number) => {
      const response = await apiRequest("PATCH", `/api/generated-content/${generatedContent?.id}/rating`, {
        rating,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback registrato!",
        description: "Grazie per il tuo feedback, ci aiuta a migliorare.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la registrazione del feedback.",
        variant: "destructive",
      });
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      toast({
        title: "Copiato!",
        description: "Il contenuto è stato copiato negli appunti.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il contenuto.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `contenuto-${contentType}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGoBack = () => {
    setLocation("/");
  };

  const getContentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      facebook: "Post Facebook",
      instagram: "Post Instagram", 
      product: "Descrizione Prodotto",
      blog: "Idea Articolo Blog",
      video: "Script Video"
    };
    return types[type] || type;
  };

  if (!selectedProfile || !generatedContent) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">
              {generateContentMutation.isPending ? "Generazione contenuto in corso..." : "Caricamento..."}
            </div>
          </div>
        </div>
      </div>
    );
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
            Progetto: <span className="font-medium text-foreground">{selectedProfile.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getContentTypeLabel(contentType)}
          </h1>
          <p className="text-muted-foreground">
            Contenuto generato dall'AI - Modifica e personalizza come preferisci
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Editor */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Contenuto Generato</h2>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      disabled={copied}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copiato
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copia
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Scarica
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content">Modifica il contenuto:</Label>
                    <Textarea
                      id="content"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={12}
                      className="mt-1 resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Generate Variation */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Genera Variazione</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Crea una nuova versione di questo contenuto mantenendo lo stesso messaggio
                </p>
                <Button
                  onClick={() => generateVariationMutation.mutate()}
                  disabled={generateVariationMutation.isPending}
                  className="w-full"
                  variant="outline"
                >
                  {generateVariationMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generazione...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Nuova Variazione
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Valuta il Contenuto</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Il tuo feedback ci aiuta a migliorare la qualità dei contenuti generati
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => ratingMutation.mutate(1)}
                    variant="outline"
                    size="sm"
                    disabled={ratingMutation.isPending}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => ratingMutation.mutate(-1)}
                    variant="outline"
                    size="sm"
                    disabled={ratingMutation.isPending}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Info Progetto</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">PUBBLICO TARGET</p>
                  <p className="text-sm">{selectedProfile.targetAudience}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">TONO DI VOCE</p>
                  <p className="text-sm">{selectedProfile.toneOfVoice}</p>
                </div>
                {selectedProfile.keywords && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">KEYWORDS</p>
                    <p className="text-sm">{selectedProfile.keywords}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}