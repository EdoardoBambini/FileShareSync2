import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertNicheProfileSchema, type InsertNicheProfile, type NicheProfile } from "@shared/schema";
import { z } from "zod";

const formSchema = insertNicheProfileSchema.omit({ userId: true });

interface NicheProfileFormProps {
  profile?: NicheProfile;
  onSubmit: (data: Omit<InsertNicheProfile, "userId">) => void;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
}

export default function NicheProfileForm({ 
  profile, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  title 
}: NicheProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      targetAudience: profile?.targetAudience || "",
      contentGoal: profile?.contentGoal || "",
      toneOfVoice: profile?.toneOfVoice || "",
      keywords: profile?.keywords || "",
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {title || (profile ? `Modifica Progetto: ${profile.name}` : "Crea Nuovo Progetto")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Nome del Progetto</Label>
            <Input
              id="name"
              placeholder="Es: Cura di bonsai da interno per principianti"
              {...form.register("name")}
              className="mt-1"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="targetAudience">Descrizione del Pubblico Target</Label>
            <Textarea
              id="targetAudience"
              rows={4}
              placeholder="Chi sono, cosa cercano, livello di conoscenza, loro problemi e aspirazioni..."
              {...form.register("targetAudience")}
              className="mt-1 resize-none"
            />
            {form.formState.errors.targetAudience && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.targetAudience.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contentGoal">Obiettivo Principale dei Contenuti</Label>
              <Select 
                value={form.watch("contentGoal")} 
                onValueChange={(value) => form.setValue("contentGoal", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona obiettivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informare">Informare</SelectItem>
                  <SelectItem value="vendere">Vendere</SelectItem>
                  <SelectItem value="intrattenere">Intrattenere</SelectItem>
                  <SelectItem value="autorita">Costruire Autorità</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.contentGoal && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.contentGoal.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="toneOfVoice">Tono di Voce Preferito</Label>
              <Select 
                value={form.watch("toneOfVoice")} 
                onValueChange={(value) => form.setValue("toneOfVoice", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formale">Formale</SelectItem>
                  <SelectItem value="amichevole">Amichevole</SelectItem>
                  <SelectItem value="tecnico">Tecnico</SelectItem>
                  <SelectItem value="umoristico">Umoristico</SelectItem>
                  <SelectItem value="empatico">Empatico</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.toneOfVoice && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.toneOfVoice.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="keywords">Keywords Principali (Opzionale, max 5)</Label>
            <Input
              id="keywords"
              placeholder="bonsai, cura piante, principianti..."
              {...form.register("keywords")}
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">Separa le keywords con virgole</p>
            {form.formState.errors.keywords && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.keywords.message}</p>
            )}
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Salvataggio..." : "SALVA PROFILO"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
