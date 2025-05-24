import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Heart, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/hooks/useLanguage';

interface HolidayPreset {
  id: string;
  name: string;
  date: string;
  country: string;
  contentSuggestions: string[];
  hashtags: string[];
  toneRecommendations: string[];
}

interface HolidayPresetsProps {
  onPresetSelected?: (preset: HolidayPreset) => void;
}

export default function HolidayPresets({ onPresetSelected }: HolidayPresetsProps) {
  const [presets, setPresets] = useState<HolidayPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    loadPresets();
  }, [language]);

  const loadPresets = async () => {
    try {
      const country = language === 'it' ? 'IT' : language === 'en' ? 'EN' : 'ES';
      const response = await apiRequest('GET', `/api/holiday-presets?country=${country}&language=${language}`);
      const data = await response.json();
      setPresets(data.presets);
    } catch (error) {
      console.error('Error loading holiday presets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHolidayIcon = (name: string) => {
    if (name.toLowerCase().includes('natale') || name.toLowerCase().includes('christmas') || name.toLowerCase().includes('navidad')) {
      return <Gift className="h-5 w-5 text-red-500" />;
    }
    if (name.toLowerCase().includes('valentin')) {
      return <Heart className="h-5 w-5 text-pink-500" />;
    }
    return <Sparkles className="h-5 w-5 text-purple-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'it' ? 'it-IT' : language === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('Preset Festività')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('Preset Festività Nazionali')}
          </CardTitle>
          <CardDescription>
            {t('Template ottimizzati per le principali festività e ricorrenze del tuo paese')}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {presets.map((preset) => (
          <Card key={preset.id} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getHolidayIcon(preset.name)}
                  <CardTitle className="text-lg">{preset.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatDate(preset.date)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">{t('Suggerimenti Contenuto')}:</h4>
                <div className="space-y-1">
                  {preset.contentSuggestions.slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">{t('Hashtag Suggeriti')}:</h4>
                <div className="flex flex-wrap gap-1">
                  {preset.hashtags.slice(0, 3).map((hashtag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {hashtag}
                    </Badge>
                  ))}
                  {preset.hashtags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{preset.hashtags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">{t('Toni Consigliati')}:</h4>
                <div className="text-sm text-gray-600">
                  {preset.toneRecommendations.slice(0, 2).join(', ')}
                </div>
              </div>

              <Button 
                onClick={() => onPresetSelected?.(preset)}
                className="w-full"
                size="sm"
              >
                {t('Usa Questo Preset')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {presets.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('Nessun preset disponibile per questa regione')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}