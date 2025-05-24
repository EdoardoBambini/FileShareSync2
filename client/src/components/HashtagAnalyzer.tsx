import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Hash, TrendingUp, BarChart3, Lightbulb } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface HashtagAnalysis {
  hashtag: string;
  difficulty: 'low' | 'medium' | 'high';
  opportunity: number;
  volume: string;
  recommendation: string;
}

interface HashtagAnalyzerProps {
  niche: string;
  onHashtagsAnalyzed?: (hashtags: HashtagAnalysis[]) => void;
}

export default function HashtagAnalyzer({ niche, onHashtagsAnalyzed }: HashtagAnalyzerProps) {
  const [hashtags, setHashtags] = useState('');
  const [analysis, setAnalysis] = useState<HashtagAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const analyzeHashtags = async () => {
    if (!hashtags.trim()) {
      toast({
        title: t('Errore'),
        description: t('Inserisci almeno un hashtag da analizzare'),
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const hashtagList = hashtags.split(',').map(h => h.trim().replace('#', '')).filter(h => h);
      
      const response = await apiRequest('POST', '/api/analyze-hashtags', {
        hashtags: hashtagList,
        niche,
        language
      });

      const result = await response.json();
      setAnalysis(result.analysis);
      onHashtagsAnalyzed?.(result.analysis);

      toast({
        title: t('Analisi completata'),
        description: t(`Analizzati ${result.analysis.length} hashtag con successo`),
      });
    } catch (error: any) {
      console.error('Error analyzing hashtags:', error);
      toast({
        title: t('Errore nell\'analisi'),
        description: error.message || t('Errore durante l\'analisi degli hashtag'),
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return t('Bassa');
      case 'medium': return t('Media');
      case 'high': return t('Alta');
      default: return difficulty;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            {t('Hashtag Intelligence')}
          </CardTitle>
          <CardDescription>
            {t('Analizza la difficoltà competitiva e le opportunità di engagement per i tuoi hashtag')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('Hashtag da analizzare')} 
              <span className="text-gray-500 ml-1">({t('separati da virgola')})</span>
            </label>
            <Input
              placeholder={t('es: marketing, socialmedia, business')}
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={analyzeHashtags} 
            disabled={isAnalyzing || !hashtags.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Analizzando...')}
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                {t('Analizza Hashtag')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('Risultati Analisi')}</h3>
          <div className="grid gap-4">
            {analysis.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg">#{item.hashtag}</span>
                      <Badge 
                        variant="secondary" 
                        className={`${getDifficultyColor(item.difficulty)} text-white`}
                      >
                        {getDifficultyText(item.difficulty)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>{t('Opportunità')}: {item.opportunity}/100</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('Volume')}: {item.volume}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{item.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}