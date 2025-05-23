import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, X } from "lucide-react";
import { useLocation } from "wouter";

interface AdBannerProps {
  size?: "banner" | "square" | "leaderboard";
  position?: "top" | "bottom" | "sidebar";
}

export default function AdBanner({ size = "banner", position = "top" }: AdBannerProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Non mostrare banner agli utenti Premium
  if ((user as any)?.subscriptionPlan === "premium") {
    return null;
  }

  const handleUpgrade = () => {
    setLocation("/subscribe");
  };

  const getSizeClasses = () => {
    switch (size) {
      case "banner":
        return "w-full h-24";
      case "square":
        return "w-64 h-64";
      case "leaderboard":
        return "w-full h-16";
      default:
        return "w-full h-24";
    }
  };

  const getAdContent = () => {
    // In produzione, qui inseriresti il codice Google AdSense
    // Per ora mostriamo un banner promozionale per il Premium
    
    const adContents = [
      {
        title: "🚀 Contenuti Illimitati",
        subtitle: "Passa a Premium e genera tutto quello che vuoi!",
        cta: "Scopri Premium"
      },
      {
        title: "📸 Suggerimenti Foto & Video",
        subtitle: "Solo con Premium: idee complete con immagini!",
        cta: "Attiva Premium"
      },
      {
        title: "⚡ Niente Più Limitazioni",
        subtitle: "Premium: genera contenuti senza limiti",
        cta: "Upgrade Ora"
      }
    ];

    const randomAd = adContents[Math.floor(Math.random() * adContents.length)];

    return (
      <Card className={`${getSizeClasses()} bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 relative overflow-hidden`}>
        <div className="absolute top-1 right-1">
          <div className="text-[10px] text-muted-foreground/60 bg-background/80 px-1 rounded">
            Sponsorizzato
          </div>
        </div>
        
        <div className="h-full flex items-center justify-between p-3">
          <div className="flex-1">
            <div className="font-semibold text-sm text-foreground flex items-center">
              <Crown className="w-4 h-4 mr-1 text-primary" />
              {randomAd.title}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {randomAd.subtitle}
            </div>
          </div>
          
          <Button 
            size="sm" 
            onClick={handleUpgrade}
            className="ml-3 h-8 text-xs"
          >
            {randomAd.cta}
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 w-16 h-16 bg-primary/10 rounded-full"></div>
        <div className="absolute -left-4 -bottom-4 w-8 h-8 bg-primary/5 rounded-full"></div>
      </Card>
    );
  };

  // Google AdSense Component (da attivare in produzione)
  const GoogleAdSense = () => {
    useEffect(() => {
      try {
        // In produzione, decommentare e inserire il tuo Google AdSense ID
        // (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.log("AdSense non ancora configurato");
      }
    }, []);

    return (
      <div className={getSizeClasses()}>
        {/* In produzione, sostituire con il codice AdSense reale */}
        {/* <ins className="adsbygoogle"
             style={{ display: "block" }}
             data-ad-client="ca-pub-XXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins> */}
        
        {/* Per ora mostra il banner promozionale */}
        {getAdContent()}
      </div>
    );
  };

  return (
    <div className={`${position === "sidebar" ? "mb-4" : "my-4"}`}>
      <GoogleAdSense />
    </div>
  );
}