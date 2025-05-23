import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import NicheProfileCard from "@/components/NicheProfileCard";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { NicheProfile } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
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
    setLocation("/content-type");
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
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">I Miei Profili Nicchia</h1>
            <p className="text-slate-600">Gestisci i tuoi profili e crea contenuti personalizzati</p>
          </div>
          <Button 
            onClick={handleCreateProfile}
            className="bg-primary hover:bg-primary/90 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            CREA NUOVO PROFILO NICCHIA
          </Button>
        </div>

        {/* Profiles Grid */}
        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="text-slate-400 text-3xl w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Nessun Profilo Nicchia</h3>
            <p className="text-slate-600 mb-6">
              Non hai ancora creato nessun profilo nicchia. Clicca sul pulsante qui sopra per iniziare.
            </p>
            <Button 
              onClick={handleCreateProfile}
              className="bg-primary hover:bg-primary/90"
            >
              + CREA IL TUO PRIMO PROFILO
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
