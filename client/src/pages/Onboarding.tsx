import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import NicheProfileForm from "@/components/NicheProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertNicheProfile, NicheProfile } from "@shared/schema";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [editId, setEditId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check for edit mode from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editParam = urlParams.get("edit");
    if (editParam) {
      setEditId(parseInt(editParam));
    }
  }, []);

  // Fetch profile data if editing
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: [`/api/niche-profiles/${editId}`],
    enabled: !!editId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<InsertNicheProfile, "userId">) => {
      const response = await apiRequest("POST", "/api/niche-profiles", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/niche-profiles"] });
      toast({
        title: "Successo!",
        description: "Profilo nicchia creato con successo.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la creazione del profilo.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Omit<InsertNicheProfile, "userId">) => {
      const response = await apiRequest("PUT", `/api/niche-profiles/${editId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/niche-profiles"] });
      queryClient.invalidateQueries({ queryKey: [`/api/niche-profiles/${editId}`] });
      toast({
        title: "Successo!",
        description: "Profilo nicchia aggiornato con successo.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento del profilo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: Omit<InsertNicheProfile, "userId">) => {
    if (editId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    setLocation("/");
  };

  if (editId && isLoadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-slate-600">Caricamento profilo...</div>
          </div>
        </div>
      </div>
    );
  }

  const isFirstProfile = !editId;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isFirstProfile && (
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-6 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Dashboard
          </Button>
        )}

        {/* Progress Bar for first profile */}
        {isFirstProfile && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                <span className="ml-2 text-sm font-medium text-slate-700">Profilo Nicchia</span>
              </div>
              <div className="w-16 h-1 bg-slate-200 rounded"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-sm font-medium">2</div>
                <span className="ml-2 text-sm text-slate-500">Dashboard</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {isFirstProfile && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Iniziamo! Definisci la tua Prima Nicchia
              </h1>
              <p className="text-lg text-slate-600">
                Questo profilo aiuterà l'AI a generare contenuti perfetti per te.
              </p>
            </div>
          )}

          <NicheProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending || updateMutation.isPending}
            title={isFirstProfile ? undefined : (editId ? undefined : "Crea Nuovo Profilo Nicchia")}
          />
        </div>
      </div>
    </div>
  );
}
