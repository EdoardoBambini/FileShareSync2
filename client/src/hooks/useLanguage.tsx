import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'it' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traduzioni complete per tutte le lingue
const translations: Record<Language, Record<string, string>> = {
  it: {
    // Landing Page
    'landing.title': 'Crea Contenuti AI per il Tuo Business',
    'landing.subtitle': 'Genera post Facebook, Instagram, descrizioni prodotti e contenuti marketing in pochi secondi con l\'intelligenza artificiale',
    'landing.cta': 'Inizia Gratis',
    'landing.feature1.title': 'Intelligenza Artificiale Avanzata',
    'landing.feature1.desc': 'Genera contenuti di qualità professionale usando GPT-4',
    'landing.feature2.title': 'Multi-Piattaforma',
    'landing.feature2.desc': 'Contenuti ottimizzati per Facebook, Instagram, blog e e-commerce',
    'landing.feature3.title': 'Risparmia Tempo',
    'landing.feature3.desc': 'Crea settimane di contenuti in pochi minuti',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.account': 'Account',
    'nav.logout': 'Logout',
    'nav.subscribe': 'Diventa Premium',
    
    // Dashboard
    'dashboard.title': 'I Miei Progetti',
    'dashboard.subtitle': 'Gestisci i tuoi progetti di content marketing',
    'dashboard.newProject': 'Nuovo Progetto',
    'dashboard.noProjects': 'Nessun progetto ancora',
    'dashboard.createFirst': 'Crea il tuo primo progetto per iniziare a generare contenuti',
    'dashboard.edit': 'Modifica',
    'dashboard.generate': 'Genera Contenuto',
    
    // Content Types
    'content.facebook': 'Post Facebook',
    'content.instagram': 'Post Instagram',
    'content.product': 'Descrizione Prodotto',
    'content.blog': 'Idea Articolo Blog',
    'content.video': 'Script Breve Video',
    'content.whatToday': 'Cosa vuoi creare oggi?',
    'content.chooseType': 'Scegli il tipo di contenuto che desideri generare con l\'intelligenza artificiale',
    
    // Credits
    'credits.remaining': 'Crediti rimanenti',
    'credits.premium': 'Premium',
    'credits.upgrade': 'Passa a Premium',
    'credits.weeklyReset': 'Reset settimanale',
    
    // Common
    'common.back': 'Indietro',
    'common.next': 'Avanti',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.generate': 'Genera',
    'common.copy': 'Copia',
    'common.download': 'Scarica',
    'common.loading': 'Caricamento...',
  },
  
  en: {
    // Landing Page
    'landing.title': 'Create AI Content for Your Business',
    'landing.subtitle': 'Generate Facebook posts, Instagram content, product descriptions and marketing copy in seconds with artificial intelligence',
    'landing.cta': 'Start Free',
    'landing.feature1.title': 'Advanced AI',
    'landing.feature1.desc': 'Generate professional-quality content using GPT-4',
    'landing.feature2.title': 'Multi-Platform',
    'landing.feature2.desc': 'Content optimized for Facebook, Instagram, blogs and e-commerce',
    'landing.feature3.title': 'Save Time',
    'landing.feature3.desc': 'Create weeks of content in minutes',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.account': 'Account',
    'nav.logout': 'Logout',
    'nav.subscribe': 'Go Premium',
    
    // Dashboard
    'dashboard.title': 'My Projects',
    'dashboard.subtitle': 'Manage your content marketing projects',
    'dashboard.newProject': 'New Project',
    'dashboard.noProjects': 'No projects yet',
    'dashboard.createFirst': 'Create your first project to start generating content',
    'dashboard.edit': 'Edit',
    'dashboard.generate': 'Generate Content',
    
    // Content Types
    'content.facebook': 'Facebook Post',
    'content.instagram': 'Instagram Post',
    'content.product': 'Product Description',
    'content.blog': 'Blog Article Idea',
    'content.video': 'Short Video Script',
    'content.whatToday': 'What do you want to create today?',
    'content.chooseType': 'Choose the type of content you want to generate with artificial intelligence',
    
    // Credits
    'credits.remaining': 'Credits remaining',
    'credits.premium': 'Premium',
    'credits.upgrade': 'Upgrade to Premium',
    'credits.weeklyReset': 'Weekly reset',
    
    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.generate': 'Generate',
    'common.copy': 'Copy',
    'common.download': 'Download',
    'common.loading': 'Loading...',
  },
  
  es: {
    // Landing Page
    'landing.title': 'Crea Contenido AI para tu Negocio',
    'landing.subtitle': 'Genera posts de Facebook, contenido de Instagram, descripciones de productos y textos de marketing en segundos con inteligencia artificial',
    'landing.cta': 'Empezar Gratis',
    'landing.feature1.title': 'IA Avanzada',
    'landing.feature1.desc': 'Genera contenido de calidad profesional usando GPT-4',
    'landing.feature2.title': 'Multi-Plataforma',
    'landing.feature2.desc': 'Contenido optimizado para Facebook, Instagram, blogs y e-commerce',
    'landing.feature3.title': 'Ahorra Tiempo',
    'landing.feature3.desc': 'Crea semanas de contenido en minutos',
    
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.account': 'Cuenta',
    'nav.logout': 'Cerrar Sesión',
    'nav.subscribe': 'Hazte Premium',
    
    // Dashboard
    'dashboard.title': 'Mis Proyectos',
    'dashboard.subtitle': 'Gestiona tus proyectos de marketing de contenidos',
    'dashboard.newProject': 'Nuevo Proyecto',
    'dashboard.noProjects': 'Aún no hay proyectos',
    'dashboard.createFirst': 'Crea tu primer proyecto para empezar a generar contenido',
    'dashboard.edit': 'Editar',
    'dashboard.generate': 'Generar Contenido',
    
    // Content Types
    'content.facebook': 'Post de Facebook',
    'content.instagram': 'Post de Instagram',
    'content.product': 'Descripción de Producto',
    'content.blog': 'Idea de Artículo de Blog',
    'content.video': 'Guión de Video Corto',
    'content.whatToday': '¿Qué quieres crear hoy?',
    'content.chooseType': 'Elige el tipo de contenido que deseas generar con inteligencia artificial',
    
    // Credits
    'credits.remaining': 'Créditos restantes',
    'credits.premium': 'Premium',
    'credits.upgrade': 'Actualizar a Premium',
    'credits.weeklyReset': 'Reinicio semanal',
    
    // Common
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.generate': 'Generar',
    'common.copy': 'Copiar',
    'common.download': 'Descargar',
    'common.loading': 'Cargando...',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved && ['it', 'en', 'es'].includes(saved)) {
      return saved as Language;
    }
    // Auto-detect browser language
    const browserLang = navigator.language.slice(0, 2);
    if (['it', 'en', 'es'].includes(browserLang)) {
      return browserLang as Language;
    }
    return 'it'; // Default fallback
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}