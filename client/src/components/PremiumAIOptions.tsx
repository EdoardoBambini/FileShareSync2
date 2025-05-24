import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Brain, Target, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface PremiumAIOptionsProps {
  isPremium: boolean;
  onOptionsChange: (options: any) => void;
  defaultOptions?: any;
}

export default function PremiumAIOptions({ isPremium, onOptionsChange, defaultOptions = {} }: PremiumAIOptionsProps) {
  const { t } = useLanguage();
  const [options, setOptions] = useState({
    model: 'gpt-4o',
    creativity: 'balanced',
    writingStyle: 'professional',
    emotionalTone: 'neutral',
    targetLength: 'medium',
    seoOptimization: false,
    sentimentAnalysis: false,
    includeHashtagSuggestions: false,
    includeCallToAction: false,
    generateVariants: 1,
    ...defaultOptions
  });

  const updateOption = (key: string, value: any) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  if (!isPremium) {
    return (
      <Card className="border-2 border-gradient-to-r from-yellow-200 to-yellow-300">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Crown className="w-5 h-5 mr-2 text-yellow-600" />
            {t('premium.aiModels')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 mb-3">
                {t('premium.upgradeForAdvanced')}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-yellow-700">
                  <Brain className="w-4 h-4 mr-2" />
                  <span>Modelli AI Avanzati (GPT-4o, GPT-4 Turbo)</span>
                </div>
                <div className="flex items-center text-sm text-yellow-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Personalizzazione creatività e stile</span>
                </div>
                <div className="flex items-center text-sm text-yellow-700">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Ottimizzazione SEO automatica</span>
                </div>
                <div className="flex items-center text-sm text-yellow-700">
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Generazione varianti multiple</span>
                </div>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
              onClick={() => window.location.href = '/subscribe'}
            >
              <Crown className="w-4 h-4 mr-2" />
              {t('premium.upgrade')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Crown className="w-5 h-5 mr-2 text-blue-600" />
          {t('premium.aiModels')}
          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
            Premium Attivo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Model Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Modello AI
          </Label>
          <Select value={options.model} onValueChange={(value) => updateOption('model', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">
                <div className="flex items-center">
                  <Crown className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>GPT-4o (Più Avanzato)</span>
                </div>
              </SelectItem>
              <SelectItem value="gpt-4-turbo">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-blue-600" />
                  <span>GPT-4 Turbo (Veloce)</span>
                </div>
              </SelectItem>
              <SelectItem value="gpt-4o-mini">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-green-600" />
                  <span>GPT-4o Mini (Bilanciato)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Creativity Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Livello Creatività
          </Label>
          <Select value={options.creativity} onValueChange={(value) => updateOption('creativity', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservativo (Sicuro)</SelectItem>
              <SelectItem value="balanced">Bilanciato (Consigliato)</SelectItem>
              <SelectItem value="creative">Creativo (Originale)</SelectItem>
              <SelectItem value="experimental">Sperimentale (Audace)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Writing Style */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Stile di Scrittura</Label>
          <Select value={options.writingStyle} onValueChange={(value) => updateOption('writingStyle', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professionale</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="humorous">Divertente</SelectItem>
              <SelectItem value="persuasive">Persuasivo</SelectItem>
              <SelectItem value="emotional">Emotivo</SelectItem>
              <SelectItem value="technical">Tecnico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Emotional Tone */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tono Emotivo</Label>
          <Select value={options.emotionalTone} onValueChange={(value) => updateOption('emotionalTone', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutrale</SelectItem>
              <SelectItem value="enthusiastic">Entusiasta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
              <SelectItem value="inspirational">Ispirazionale</SelectItem>
              <SelectItem value="empathetic">Empatico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Target Length */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Lunghezza Target</Label>
          <Select value={options.targetLength} onValueChange={(value) => updateOption('targetLength', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Breve (Conciso)</SelectItem>
              <SelectItem value="medium">Medio (Bilanciato)</SelectItem>
              <SelectItem value="long">Lungo (Dettagliato)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4 border-t pt-4">
          <Label className="text-sm font-medium">Opzioni Avanzate</Label>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Ottimizzazione SEO</Label>
              <p className="text-xs text-slate-500">Include parole chiave naturalmente</p>
            </div>
            <Switch 
              checked={options.seoOptimization} 
              onCheckedChange={(checked) => updateOption('seoOptimization', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Suggerimenti Hashtag</Label>
              <p className="text-xs text-slate-500">Hashtag rilevanti e trending</p>
            </div>
            <Switch 
              checked={options.includeHashtagSuggestions} 
              onCheckedChange={(checked) => updateOption('includeHashtagSuggestions', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Call-to-Action</Label>
              <p className="text-xs text-slate-500">Includi CTA persuasiva</p>
            </div>
            <Switch 
              checked={options.includeCallToAction} 
              onCheckedChange={(checked) => updateOption('includeCallToAction', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Analisi Sentiment</Label>
              <p className="text-xs text-slate-500">Analizza tono emotivo</p>
            </div>
            <Switch 
              checked={options.sentimentAnalysis} 
              onCheckedChange={(checked) => updateOption('sentimentAnalysis', checked)} 
            />
          </div>
        </div>

        {/* Generate Variants */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Varianti da Generare</Label>
          <Select value={options.generateVariants.toString()} onValueChange={(value) => updateOption('generateVariants', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Variante</SelectItem>
              <SelectItem value="2">2 Varianti</SelectItem>
              <SelectItem value="3">3 Varianti</SelectItem>
              <SelectItem value="5">5 Varianti (Premium)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}