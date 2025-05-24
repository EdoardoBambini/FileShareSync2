import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function AgeVerification() {
  const [showVerification, setShowVerification] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const ageVerified = localStorage.getItem('age-verified');
    if (!ageVerified) {
      setShowVerification(true);
    }
  }, []);

  const handleConfirmAge = () => {
    localStorage.setItem('age-verified', 'true');
    setShowVerification(false);
  };

  const handleUnderAge = () => {
    localStorage.setItem('age-verified', 'false');
    localStorage.setItem('ads-consent', 'false');
    setShowVerification(false);
  };

  const translations = {
    it: {
      title: "Verifica dell'età",
      description: "Per utilizzare questa app e visualizzare contenuti pubblicitari personalizzati, devi confermare di avere almeno 13 anni di età.",
      warning: "Questa verifica è richiesta per la conformità alle normative sulla privacy e pubblicità.",
      confirm: "Ho almeno 13 anni",
      decline: "Ho meno di 13 anni",
      legal: "Richiesto per legge"
    },
    en: {
      title: "Age Verification",
      description: "To use this app and view personalized advertising content, you must confirm that you are at least 13 years old.",
      warning: "This verification is required for compliance with privacy and advertising regulations.",
      confirm: "I am 13 or older",
      decline: "I am under 13",
      legal: "Required by law"
    },
    es: {
      title: "Verificación de edad",
      description: "Para usar esta aplicación y ver contenido publicitario personalizado, debes confirmar que tienes al menos 13 años de edad.",
      warning: "Esta verificación es requerida para cumplir con las regulaciones de privacidad y publicidad.",
      confirm: "Tengo 13 años o más",
      decline: "Soy menor de 13",
      legal: "Requerido por ley"
    }
  };

  const text = translations[language];

  if (!showVerification) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto shadow-2xl border-2 border-primary/20 bg-white dark:bg-gray-900">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {text.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
            {text.description}
          </p>
          
          <div className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {text.warning}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleConfirmAge}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
            >
              <Shield className="w-4 h-4 mr-2" />
              {text.confirm}
            </Button>
            
            <Button 
              onClick={handleUnderAge}
              variant="outline"
              className="w-full font-medium py-3"
            >
              {text.decline}
            </Button>
          </div>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            <Shield className="w-3 h-3 inline mr-1" />
            {text.legal}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}