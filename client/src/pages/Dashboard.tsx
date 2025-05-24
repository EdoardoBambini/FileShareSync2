import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import NicheProfileCard from "@/components/NicheProfileCard";
import AdBanner from "@/components/AdBanner";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { NicheProfile } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["/api/niche-profiles"],
  });

  const handleCreateProfile = () => {
    setLocation("/onboarding");
  };

  const handleEditProfile = (profile: NicheProfile) => {
    setLocation(`/onboarding?edit=${profile.id}`);
  };

  const handleGenerateContent = (profile: NicheProfile) => {
    // Store selected profile in sessionStorage for content generation flow
    sessionStorage.setItem("selectedProfile", JSON.stringify(profile));
    setLocation("/content-suggestion");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-slate-600">Caricamento...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">I Miei Progetti</h1>
            <p className="text-slate-600 text-sm sm:text-base">Gestisci i tuoi progetti e crea contenuti personalizzati con AI</p>
          </div>
          <Button 
            onClick={handleCreateProfile}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            CREA NUOVO PROGETTO
          </Button>
        </div>

        {/* Banner pubblicitario top per utenti gratuiti */}
        <AdBanner size="leaderboard" position="top" />

        {/* Profiles Grid - Super responsive */}
        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {profiles.map((profile: NicheProfile) => (
              <NicheProfileCard
                key={profile.id}
                profile={profile}
                onEdit={handleEditProfile}
                onGenerateContent={handleGenerateContent}
              />
            ))}
          </div>
        ) : (
          /* Empty State - Mobile optimized */
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <UserPlus className="text-slate-400 w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Inizia il tuo primo progetto</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              Crea il tuo primo progetto per iniziare a generare contenuti personalizzati con l'intelligenza artificiale.
            </p>
            <Button 
              onClick={handleCreateProfile}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              CREA IL TUO PRIMO PROGETTO
            </Button>
          </div>
        )}
        
        {/* Banner pubblicitario bottom per utenti gratuiti */}
        <AdBanner size="banner" position="bottom" />
      </div>
    </div>
  );
}
