import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <PenTool className="text-primary-foreground text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">NicheScribe AI</h1>
          <p className="text-slate-600">AI-Powered Content Generation</p>
        </div>

        {/* Welcome Card */}
        <Card className="shadow-lg">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {t('landing.title')}
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t('landing.subtitle')}
              </p>
              
              <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-lg py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold">
                <a href="/api/login">
                  {t('auth.login')}
                </a>
              </Button>
              
              <p className="text-xs text-slate-500 mt-6 leading-relaxed px-4">
                {t('auth.secure')}
              </p>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">{t('landing.featuresTitle')}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <div className="flex-1 leading-relaxed">
                      <span className="font-semibold">{t('landing.feature.freeGenerations')}</span>
                      <span className="text-slate-500 ml-1">{t('landing.feature.toStart')}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    <div className="flex-1 leading-relaxed">{t('landing.feature.aiSuggestions')}</div>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                    <div className="flex-1 leading-relaxed">{t('landing.feature.multiPlatform')}</div>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                    <div className="flex-1 leading-relaxed">{t('landing.feature.multiProject')}</div>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                    <div className="flex-1 leading-relaxed">
                      <span className="font-semibold">{t('landing.feature.premium')}</span>
                      <span className="text-slate-500 ml-1">{t('landing.feature.unlimited')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer legale */}
        <div className="mt-8 text-center text-xs text-slate-400 space-x-4">
          <a href="/privacy" className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-slate-600 transition-colors">
            Termini di Servizio
          </a>
          <span>•</span>
          <span>© 2025 NicheScribe AI</span>
        </div>
      </div>
    </div>
  );
}
