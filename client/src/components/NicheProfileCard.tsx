import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, MessageCircle, Edit } from "lucide-react";
import type { NicheProfile } from "@shared/schema";

interface NicheProfileCardProps {
  profile: NicheProfile;
  onEdit: (profile: NicheProfile) => void;
  onGenerateContent: (profile: NicheProfile) => void;
}

export default function NicheProfileCard({ profile, onEdit, onGenerateContent }: NicheProfileCardProps) {
  const goalLabels = {
    informare: "Informare",
    vendere: "Vendere", 
    intrattenere: "Intrattenere",
    autorita: "Costruire Autorità"
  };

  const toneLabels = {
    formale: "Formale",
    amichevole: "Amichevole",
    tecnico: "Tecnico", 
    umoristico: "Umoristico",
    empatico: "Empatico"
  };

  return (
    <Card className="hover:shadow-xl transition-shadow border border-slate-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{profile.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {goalLabels[profile.contentGoal as keyof typeof goalLabels] || profile.contentGoal}
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {toneLabels[profile.toneOfVoice as keyof typeof toneLabels] || profile.toneOfVoice}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(profile)}
            className="text-slate-400 hover:text-slate-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-3">
          {profile.targetAudience}
        </p>
        
        <Button 
          onClick={() => onGenerateContent(profile)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          GENERA CONTENUTO
        </Button>
      </CardContent>
    </Card>
  );
}
