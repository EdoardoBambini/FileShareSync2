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

  useEffect(() => {
    const profileData = sessionStorage.getItem("selectedProfile");
    const typeData = sessionStorage.getItem("contentType");
    const contentData = sessionStorage.getItem("generatedContent");
    
    if (profileData && typeData && contentData) {
      setSelectedProfile(JSON.parse(profileData));
      setContentType(typeData);
      const content = JSON.parse(contentData);
      setGeneratedContent(content);
      setEditedText(content.generatedText);
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
        title: "Grazie per il feedback!",
        description: "La tua valutazione ci aiuta a migliorare.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: "Errore durante l'invio della valutazione.",
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
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il contenuto.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contentType}-${selectedProfile?.name || "content"}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download avviato!",
      description: "Il file è stato scaricato.",
    });
  };

  const handleGoBack = () => {
    setLocation("/content-input");
  };

  const handleGenerateNew = () => {
    setLocation("/");
  };

  const getContentStats = () => {
    const words = editedText.trim().split(/\s+/).length;
    const characters = editedText.length;
    const hashtags = (editedText.match(/#\w+/g) || []).length;
    
    return { words, characters, hashtags };
  };

  const getContentTypeLabel = () => {
    const labels: Record<string, string> = {
      facebook: "Post Facebook",
      instagram: "Post Instagram", 
      product: "Descrizione Prodotto",
      blog: "Idea Articolo Blog",
      video: "Script Video"
    };
    return labels[contentType] || contentType;
  };

  if (!selectedProfile || !contentType || !generatedContent) {
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

  const stats = getContentStats();

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
          Indietro
        </Button>

        <Card className="shadow-lg">
          {/* Header */}
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Ecco la tua Bozza!</h1>
                <p className="text-slate-600">Il contenuto è stato generato con successo. Puoi modificarlo come preferisci.</p>
                <div className="text-sm text-slate-500 mt-2">
                  <span className="font-medium">{selectedProfile.name}</span> • {getContentTypeLabel()}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopy}
                  className="text-slate-600 hover:text-slate-800"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copiato!" : "Copia"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  size="sm"
                  onClick={() => generateVariationMutation.mutate()}
                  disabled={generateVariationMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${generateVariationMutation.isPending ? "animate-spin" : ""}`} />
                  {generateVariationMutation.isPending ? "Generazione..." : "Genera Variante"}
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Content Editor */}
          <CardContent className="p-6">
            <div className="mb-4">
              <Label htmlFor="content">Contenuto Generato</Label>
              <Textarea
                id="content"
                rows={12}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="mt-1 resize-none font-mono text-sm"
              />
            </div>

            {/* Save Options */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salva Bozza
                  </Button>
                  
                  {/* Feedback */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">Valuta questo contenuto:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => ratingMutation.mutate(1)}
                      className="text-slate-400 hover:text-green-500"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => ratingMutation.mutate(-1)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateNew}
                  className="bg-primary hover:bg-primary/90"
                >
                  Genera Nuovo Contenuto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.words}</div>
              <div className="text-sm text-slate-600">Parole</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.characters}</div>
              <div className="text-sm text-slate-600">Caratteri</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.hashtags}</div>
              <div className="text-sm text-slate-600">Hashtag</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
