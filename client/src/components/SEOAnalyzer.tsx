import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, TrendingUp, BarChart3, Globe, Copy } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface SEOData {
  title: string;
  metaDescription: string;
  schema: any;
  suggestedUrl: string;
}

interface CTRPrediction {
  ctr: number;
  engagement: number;
  suggestions: string[];
}

interface SEOAnalyzerProps {
  content: string;
  contentType: string;
  keywords: string[];
  platform?: string;
}

export default function SEOAnalyzer({ content, contentType, keywords, platform = 'facebook' }: SEOAnalyzerProps) {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [ctrPrediction, setCtrPrediction] = useState<CTRPrediction | null>(null);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isPredictingCTR, setIsPredictingCTR] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const generateSEO = async () => {
    if (!content.trim()) {
      toast({
        title: t('Errore'),
        description: t('Contenuto richiesto per generare SEO'),
        variant: 'destructive'
      });
      return;
    }

    setIsGeneratingSEO(true);
    try {
      const response = await apiRequest('POST', '/api/generate-seo', {
        content,
        contentType,
        keywords,
        language
      });

      const result = await response.json();
      setSeoData(result);

      toast({
        title: t('SEO generato'),
        description: t('Snippet SEO ottimizzati generati con successo'),
      });
    } catch (error: any) {
      console.error('Error generating SEO:', error);
      toast({
        title: t('Errore SEO'),
        description: error.message || t('Errore durante la generazione SEO'),
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const predictCTR = async () => {
    if (!content.trim()) {
      toast({
        title: t('Errore'),
        description: t('Contenuto richiesto per predire CTR'),
        variant: 'destructive'
      });
      return;
    }

    setIsPredictingCTR(true);
    try {
      const response = await apiRequest('POST', '/api/predict-ctr', {
        content,
        platform
      });

      const result = await response.json();
      setCtrPrediction(result);

      toast({
        title: t('Predizione completata'),
        description: t('Analisi performance generata con successo'),
      });
    } catch (error: any) {
      console.error('Error predicting CTR:', error);
      toast({
        title: t('Errore predizione'),
        description: error.message || t('Errore durante la predizione CTR'),
        variant: 'destructive'
      });
    } finally {
      setIsPredictingCTR(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('Copiato!'),
      description: t('Testo copiato negli appunti'),
    });
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('Snippet SEO')}
            </CardTitle>
            <CardDescription>
              {t('Genera titoli e descrizioni ottimizzati per i motori di ricerca')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateSEO} 
              disabled={isGeneratingSEO || !content.trim()}
              className="w-full"
            >
              {isGeneratingSEO ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Generando...')}
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  {t('Genera SEO')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('Predizione CTR')}
            </CardTitle>
            <CardDescription>
              {t('Analizza le performance previste del tuo contenuto')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={predictCTR} 
              disabled={isPredictingCTR || !content.trim()}
              className="w-full"
            >
              {isPredictingCTR ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Analizzando...')}
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {t('Predici Performance')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {seoData && (
        <Card>
          <CardHeader>
            <CardTitle>{t('Snippet SEO Ottimizzati')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">{t('Titolo SEO')} ({seoData.title.length}/60)</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(seoData.title)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm">{seoData.title}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">{t('Meta Description')} ({seoData.metaDescription.length}/160)</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(seoData.metaDescription)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm">{seoData.metaDescription}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">{t('URL Suggerito')}</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(seoData.suggestedUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm font-mono">{seoData.suggestedUrl}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {ctrPrediction && (
        <Card>
          <CardHeader>
            <CardTitle>{t('Analisi Performance Prevista')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-center p-4 rounded-lg border">
                <div className={`text-2xl font-bold ${getPerformanceColor(ctrPrediction.ctr)}`}>
                  {ctrPrediction.ctr.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-1">{t('CTR Previsto')}</p>
              </div>
              
              <div className="text-center p-4 rounded-lg border">
                <div className={`text-2xl font-bold ${getPerformanceColor(ctrPrediction.engagement)}`}>
                  {ctrPrediction.engagement}/100
                </div>
                <p className="text-sm text-gray-600 mt-1">{t('Engagement Score')}</p>
              </div>
            </div>

            {ctrPrediction.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">{t('Suggerimenti per Migliorare')}:</h4>
                <div className="space-y-2">
                  {ctrPrediction.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <Badge variant="secondary" className="mt-0.5">
                        {index + 1}
                      </Badge>
                      <p className="text-sm text-blue-800">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}