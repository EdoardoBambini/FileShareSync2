import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Crown, CreditCard, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function Account() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: profiles = [] } = useQuery({
    queryKey: ["/api/niche-profiles"],
  });

  const { data: generatedContent = [] } = useQuery({
    queryKey: ["/api/generated-content"],
  });

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      company: user?.company || "",
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", "/api/auth/user", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profilo aggiornato!",
        description: "Le modifiche sono state salvate con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento del profilo.",
        variant: "destructive",
      });
    },
  });

  const handleGoBack = () => {
    setLocation("/");
  };

  const handleProfileSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  const handlePasswordSubmit = (data: any) => {
    if (data.new !== data.confirm) {
      toast({
        title: "Errore",
        description: "Le password non corrispondono.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Funzionalità non disponibile",
      description: "Il cambio password sarà disponibile in una versione futura.",
    });
  };

  const getStats = () => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const thisMonthContent = generatedContent.filter((content: any) => 
      new Date(content.createdAt) >= thisMonth
    );

    return {
      profiles: profiles.length,
      contentGenerated: generatedContent.length,
      thisMonth: thisMonthContent.length,
    };
  };

  const stats = getStats();

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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">{t('nav.account')}</h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('account.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Informazioni Profilo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName")}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Cognome</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName")}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="mt-1 bg-slate-50"
                    />
                    <p className="text-xs text-slate-500 mt-1">L'email non può essere modificata</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Azienda (Opzionale)</Label>
                    <Input
                      id="company"
                      placeholder="La tua azienda"
                      {...profileForm.register("company")}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {updateProfileMutation.isPending ? "Salvataggio..." : "Salva Modifiche"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Cambia Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="current">Password Attuale</Label>
                    <Input
                      id="current"
                      type="password"
                      {...passwordForm.register("current")}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new">Nuova Password</Label>
                    <Input
                      id="new"
                      type="password"
                      {...passwordForm.register("new")}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm">Conferma Nuova Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      {...passwordForm.register("confirm")}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Aggiorna Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Stats & Settings */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Statistiche Utilizzo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Profili Nicchia</span>
                    <span className="font-semibold text-slate-900">{stats.profiles}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Contenuti Generati</span>
                    <span className="font-semibold text-slate-900">{stats.contentGenerated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Questo Mese</span>
                    <span className="font-semibold text-slate-900">{stats.thisMonth}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t('premium.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.subscriptionPlan === 'premium' ? (
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-sm font-medium rounded-full mb-4">
                      <Crown className="w-4 h-4 mr-2" />
                      Premium Attivo
                    </div>
                    <p className="text-slate-600 text-sm mb-4">{t('premium.unlimited')}</p>
                    <p className="text-slate-600 text-sm mb-4">{t('premium.fullContent')}</p>
                    <p className="text-slate-600 text-sm mb-6">{t('premium.noAds')}</p>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => setLocation("/subscribe")}
                    >
                      Gestisci Abbonamento
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-3">
                        Piano Gratuito
                      </Badge>
                      <p className="text-slate-600 text-sm mb-4">
                        {user?.weeklyCredits || 3} crediti rimanenti questa settimana
                      </p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-center mb-4">
                        <Crown className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                        <h3 className="font-semibold text-slate-900 mb-2">{t('premium.title')}</h3>
                        <p className="text-2xl font-bold text-primary mb-1">{t('premium.price')}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{t('premium.unlimited')}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{t('premium.fullContent')}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{t('premium.noAds')}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{t('premium.photoVideo')}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{t('premium.support')}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-3"
                        onClick={() => setLocation("/subscribe")}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        {t('premium.upgrade')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Zona Pericolosa</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Funzionalità non disponibile",
                      description: "L'eliminazione account sarà disponibile in una versione futura.",
                    });
                  }}
                >
                  Elimina Account
                </Button>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Questa azione non può essere annullata
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
