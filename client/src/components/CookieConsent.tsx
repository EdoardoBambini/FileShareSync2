import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Shield, Cookie } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('ads-consent', 'true');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('ads-consent', 'false');
    setShowBanner(false);
  };

  const translations = {
    it: {
      title: "Utilizziamo i cookie",
      description: "Utilizziamo cookie e tecnologie simili per pubblicità personalizzate, analisi e miglioramento dei servizi. I nostri partner pubblicitari possono utilizzare queste informazioni.",
      accept: "Accetta tutti",
      decline: "Solo necessari",
      learnMore: "Leggi di più"
    },
    en: {
      title: "We use cookies",
      description: "We use cookies and similar technologies for personalized advertising, analytics, and service improvements. Our advertising partners may use this information.",
      accept: "Accept all",
      decline: "Essential only",
      learnMore: "Learn more"
    },
    es: {
      title: "Usamos cookies",
      description: "Utilizamos cookies y tecnologías similares para publicidad personalizada, análisis y mejora de servicios. Nuestros socios publicitarios pueden usar esta información.",
      accept: "Aceptar todo",
      decline: "Solo esenciales",
      learnMore: "Leer más"
    }
  };

  const text = translations[language];

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-2xl mx-auto shadow-2xl border-2 border-primary/20 bg-white dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {text.title}
                </h3>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {text.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAccept}
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {text.accept}
                </Button>
                
                <Button 
                  onClick={handleDecline}
                  variant="outline"
                  className="font-medium px-6 py-2"
                >
                  {text.decline}
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={() => window.open('/privacy-policy', '_blank')}
                  className="text-primary hover:text-primary/80 font-medium px-3 py-2"
                >
                  {text.learnMore}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Function to check if ads are consented
export const isAdsConsented = () => {
  return localStorage.getItem('ads-consent') === 'true';
};

// Function to check if user is above minimum age for ads
export const checkAgeForAds = () => {
  const ageVerified = localStorage.getItem('age-verified');
  return ageVerified === 'true';
};