import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, ArrowLeft, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Pagamento Fallito",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento Completato!",
        description: "Benvenuto in NicheScribe Premium!",
        variant: "default",
      });
      setLocation("/dashboard");
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3"
      >
        <Crown className="w-4 h-4 mr-2" />
        {isProcessing ? "Elaborazione..." : "Attiva Premium €4.99/mese"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Sicuro e protetto da Stripe. Cancella in qualsiasi momento.
      </p>
    </form>
  );
};

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-subscription", {});
      return response.json();
    },
    onSuccess: (data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else if (data.message === "Abbonamento già attivo") {
        toast({
          title: "Abbonamento Attivo",
          description: "Hai già un abbonamento Premium attivo!",
          variant: "default",
        });
        setLocation("/dashboard");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella creazione dell'abbonamento",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    createSubscriptionMutation.mutate();
  }, []);

  if (createSubscriptionMutation.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Preparazione del pagamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Dashboard
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Errore nel caricamento del modulo di pagamento.</p>
              <Button onClick={() => setLocation("/dashboard")} className="mt-4">
                Torna alla Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla Dashboard
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full mb-4">
            <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Passa a NicheScribe Premium
          </h1>
          <p className="text-muted-foreground">
            Sblocca il potenziale completo della generazione di contenuti AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Piano Gratuito */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Piano Gratuito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">€0/mese</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  3 generazioni gratuite
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Anteprima contenuti
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Suggerimenti AI base
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Piano Premium */}
          <Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-amber-600" />
                Piano Premium
                <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                  Popolare
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4 text-amber-700 dark:text-amber-300">
                €4.99/mese
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  <strong>Generazioni illimitate</strong>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  <strong>Contenuti completi</strong>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  <strong>Suggerimenti foto e video</strong>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  <strong>Suggerimenti design avanzati</strong>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Supporto prioritario
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Completa il tuo abbonamento Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscribeForm clientSecret={clientSecret} />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}