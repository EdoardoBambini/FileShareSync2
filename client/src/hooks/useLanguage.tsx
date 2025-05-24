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
    'landing.featuresTitle': 'Funzionalità principali',
    'landing.feature.freeGenerations': '3 generazioni gratuite',
    'landing.feature.toStart': 'per iniziare',
    'landing.feature.aiSuggestions': 'Suggerimenti AI intelligenti',
    'landing.feature.multiPlatform': 'Post Facebook, Instagram, blog e prodotti',
    'landing.feature.multiProject': 'Gestione progetti multipli',
    'landing.feature.premium': 'Premium €4.99/mese',
    'landing.feature.unlimited': '- contenuti illimitati',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.account': 'Account',
    'nav.logout': 'Logout',
    'nav.subscribe': 'Diventa Premium',
    
    // Account
    'account.subtitle': 'Gestisci le tue informazioni e monitora l\'attività del tuo account',
    
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
    
    // Auth
    'auth.login': 'ACCEDI CON REPLIT',
    'auth.secure': 'Login sicuro: Verrai reindirizzato al sistema di autenticazione Replit. I tuoi dati sono protetti con crittografia avanzata.',
    
    // Content Input & Output
    'input.topic': 'Argomento',
    'input.cta': 'Call to Action',
    'input.hashtags': 'Hashtag',
    'input.productName': 'Nome Prodotto',
    'input.features': 'Caratteristiche',
    'input.benefits': 'Benefici',
    'input.angle': 'Angolatura',
    'input.platform': 'Piattaforma',
    'output.title': 'Contenuto Generato',
    'output.edit': 'Modifica',
    'output.regenerate': 'Rigenera',
    'output.variation': 'Crea Variazione',
    'output.rating': 'Valuta questo contenuto',
    'output.backToDashboard': 'Torna alla Dashboard',
    'output.contentGenerated': 'Contenuto generato dall\'AI - Modifica e personalizza come preferisci',
    'output.copied': 'Copiato!',
    'output.copiedDesc': 'Il contenuto è stato copiato negli appunti.',
    'output.downloadSuccess': 'Download completato!',
    'output.downloadDesc': 'Il file è stato scaricato con successo.',
    'output.saved': 'Salvato!',
    'output.savedDesc': 'Le modifiche sono state salvate.',
    'output.feedbackThanks': 'Feedback registrato!',
    'output.feedbackDesc': 'Grazie per il tuo feedback, ci aiuta a migliorare.',
    
    // Profile Forms
    'profile.name': 'Nome Progetto',
    'profile.targetAudience': 'Pubblico Target',
    'profile.contentGoal': 'Obiettivo del Contenuto',
    'profile.toneOfVoice': 'Tono di Voce',
    'profile.keywords': 'Keywords (opzionale)',
    'profile.create': 'Crea Progetto',
    'profile.update': 'Aggiorna Progetto',
    'profile.creating': 'Creazione in corso...',
    'profile.updating': 'Aggiornamento in corso...',
    'profile.success': 'Progetto salvato con successo!',
    'profile.error': 'Errore nel salvare il progetto.',
    
    // Subscription & Premium
    'premium.title': 'Passa a Premium',
    'premium.subtitle': 'Sblocca tutte le funzionalità avanzate',
    'premium.price': '€4.99/mese',
    'premium.unlimited': 'Generazioni illimitate',
    'premium.fullContent': 'Contenuto completo',
    'premium.noAds': 'Nessuna pubblicità',
    'premium.photoVideo': 'Suggerimenti foto/video esclusivi',
    'premium.support': 'Supporto prioritario',
    'premium.upgrade': 'Attiva Premium',
    'premium.limitedContent': 'Contenuto Limitato - Versione Gratuita',
    'premium.limitedDesc': 'Stai visualizzando solo un\'anteprima del contenuto generato.',
    'premium.creditsExhausted': 'Crediti Esauriti!',
    'premium.creditsDesc': 'Passa al Premium per generazioni illimitate!',
    'premium.aiModels': 'Modelli AI Avanzati',
    'premium.upgradeForAdvanced': 'Passa a Premium per sbloccare modelli AI avanzati e opzioni di personalizzazione',
    
    // Errors & Messages
    'error.general': 'Si è verificato un errore.',
    'error.network': 'Errore di connessione.',
    'error.contentGeneration': 'Errore durante la generazione del contenuto.',
    'error.profileNotFound': 'Progetto non trovato.',
    'error.unauthorized': 'Accesso non autorizzato.',
    'loading.generating': 'Generazione contenuto in corso...',
    'loading.general': 'Caricamento...',
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
    'landing.featuresTitle': 'Key Features',
    'landing.feature.freeGenerations': '3 free generations',
    'landing.feature.toStart': 'to get started',
    'landing.feature.aiSuggestions': 'Smart AI suggestions',
    'landing.feature.multiPlatform': 'Facebook, Instagram, blog and product posts',
    'landing.feature.multiProject': 'Multiple project management',
    'landing.feature.premium': 'Premium €4.99/month',
    'landing.feature.unlimited': '- unlimited content',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.account': 'Account',
    'nav.logout': 'Logout',
    'nav.subscribe': 'Go Premium',
    
    // Account
    'account.subtitle': 'Manage your information and monitor your account activity',
    
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
    
    // Auth
    'auth.login': 'LOGIN WITH REPLIT',
    'auth.secure': 'Secure login: You will be redirected to Replit authentication system. Your data is protected with advanced encryption.',
    
    // Content Input & Output
    'input.topic': 'Topic',
    'input.cta': 'Call to Action',
    'input.hashtags': 'Hashtags',
    'input.productName': 'Product Name',
    'input.features': 'Features',
    'input.benefits': 'Benefits',
    'input.angle': 'Angle',
    'input.platform': 'Platform',
    'output.title': 'Generated Content',
    'output.edit': 'Edit',
    'output.regenerate': 'Regenerate',
    'output.variation': 'Create Variation',
    'output.rating': 'Rate this content',
    'output.backToDashboard': 'Back to Dashboard',
    'output.contentGenerated': 'AI-generated content - Edit and customize as you prefer',
    'output.copied': 'Copied!',
    'output.copiedDesc': 'Content has been copied to clipboard.',
    'output.downloadSuccess': 'Download completed!',
    'output.downloadDesc': 'File has been downloaded successfully.',
    'output.saved': 'Saved!',
    'output.savedDesc': 'Changes have been saved.',
    'output.feedbackThanks': 'Feedback recorded!',
    'output.feedbackDesc': 'Thank you for your feedback, it helps us improve.',
    
    // Profile Forms
    'profile.name': 'Project Name',
    'profile.targetAudience': 'Target Audience',
    'profile.contentGoal': 'Content Goal',
    'profile.toneOfVoice': 'Tone of Voice',
    'profile.keywords': 'Keywords (optional)',
    'profile.create': 'Create Project',
    'profile.update': 'Update Project',
    'profile.creating': 'Creating...',
    'profile.updating': 'Updating...',
    'profile.success': 'Project saved successfully!',
    'profile.error': 'Error saving project.',
    
    // Subscription & Premium
    'premium.title': 'Upgrade to Premium',
    'premium.subtitle': 'Unlock all advanced features',
    'premium.price': '€4.99/month',
    'premium.unlimited': 'Unlimited generations',
    'premium.fullContent': 'Full content',
    'premium.noAds': 'No ads',
    'premium.photoVideo': 'Exclusive photo/video suggestions',
    'premium.support': 'Priority support',
    'premium.upgrade': 'Activate Premium',
    'premium.limitedContent': 'Limited Content - Free Version',
    'premium.limitedDesc': 'You are viewing only a preview of the generated content.',
    'premium.creditsExhausted': 'Credits Exhausted!',
    'premium.creditsDesc': 'Upgrade to Premium for unlimited generations!',
    'premium.aiModels': 'Advanced AI Models',
    'premium.upgradeForAdvanced': 'Upgrade to Premium to unlock advanced AI models and customization options',
    
    // Errors & Messages
    'error.general': 'An error occurred.',
    'error.network': 'Connection error.',
    'error.contentGeneration': 'Error during content generation.',
    'error.profileNotFound': 'Project not found.',
    'error.unauthorized': 'Unauthorized access.',
    'loading.generating': 'Generating content...',
    'loading.general': 'Loading...',
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
    'landing.featuresTitle': 'Características Clave',
    'landing.feature.freeGenerations': '3 generaciones gratuitas',
    'landing.feature.toStart': 'para empezar',
    'landing.feature.aiSuggestions': 'Sugerencias inteligentes de IA',
    'landing.feature.multiPlatform': 'Posts de Facebook, Instagram, blog y productos',
    'landing.feature.multiProject': 'Gestión de múltiples proyectos',
    'landing.feature.premium': 'Premium €4.99/mes',
    'landing.feature.unlimited': '- contenido ilimitado',
    
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.account': 'Cuenta',
    'nav.logout': 'Cerrar Sesión',
    'nav.subscribe': 'Hazte Premium',
    
    // Account
    'account.subtitle': 'Gestiona tu información y monitorea la actividad de tu cuenta',
    
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
    
    // Auth
    'auth.login': 'INICIAR CON REPLIT',
    'auth.secure': 'Inicio seguro: Serás redirigido al sistema de autenticación de Replit. Tus datos están protegidos con cifrado avanzado.',
    
    // Content Input & Output
    'input.topic': 'Tema',
    'input.cta': 'Call to Action',
    'input.hashtags': 'Hashtags',
    'input.productName': 'Nombre del Producto',
    'input.features': 'Características',
    'input.benefits': 'Beneficios',
    'input.angle': 'Enfoque',
    'input.platform': 'Plataforma',
    'output.title': 'Contenido Generado',
    'output.edit': 'Editar',
    'output.regenerate': 'Regenerar',
    'output.variation': 'Crear Variación',
    'output.rating': 'Califica este contenido',
    'output.backToDashboard': 'Volver al Panel',
    'output.contentGenerated': 'Contenido generado por IA - Edita y personaliza como prefieras',
    'output.copied': '¡Copiado!',
    'output.copiedDesc': 'El contenido ha sido copiado al portapapeles.',
    'output.downloadSuccess': '¡Descarga completada!',
    'output.downloadDesc': 'El archivo se ha descargado exitosamente.',
    'output.saved': '¡Guardado!',
    'output.savedDesc': 'Los cambios han sido guardados.',
    'output.feedbackThanks': '¡Feedback registrado!',
    'output.feedbackDesc': 'Gracias por tu feedback, nos ayuda a mejorar.',
    
    // Profile Forms
    'profile.name': 'Nombre del Proyecto',
    'profile.targetAudience': 'Audiencia Objetivo',
    'profile.contentGoal': 'Objetivo del Contenido',
    'profile.toneOfVoice': 'Tono de Voz',
    'profile.keywords': 'Palabras Clave (opcional)',
    'profile.create': 'Crear Proyecto',
    'profile.update': 'Actualizar Proyecto',
    'profile.creating': 'Creando...',
    'profile.updating': 'Actualizando...',
    'profile.success': '¡Proyecto guardado exitosamente!',
    'profile.error': 'Error al guardar el proyecto.',
    
    // Subscription & Premium
    'premium.title': 'Actualizar a Premium',
    'premium.subtitle': 'Desbloquea todas las funciones avanzadas',
    'premium.price': '€4.99/mes',
    'premium.unlimited': 'Generaciones ilimitadas',
    'premium.fullContent': 'Contenido completo',
    'premium.noAds': 'Sin anuncios',
    'premium.photoVideo': 'Sugerencias exclusivas de fotos/videos',
    'premium.support': 'Soporte prioritario',
    'premium.upgrade': 'Activar Premium',
    'premium.limitedContent': 'Contenido Limitado - Versión Gratuita',
    'premium.limitedDesc': 'Estás viendo solo una vista previa del contenido generado.',
    'premium.creditsExhausted': '¡Créditos Agotados!',
    'premium.creditsDesc': '¡Actualiza a Premium para generaciones ilimitadas!',
    'premium.aiModels': 'Modelos de IA Avanzados',
    'premium.upgradeForAdvanced': 'Actualiza a Premium para desbloquear modelos de IA avanzados y opciones de personalización',
    
    // Errors & Messages
    'error.general': 'Ha ocurrido un error.',
    'error.network': 'Error de conexión.',
    'error.contentGeneration': 'Error durante la generación de contenido.',
    'error.profileNotFound': 'Proyecto no encontrado.',
    'error.unauthorized': 'Acceso no autorizado.',
    'loading.generating': 'Generando contenido...',
    'loading.general': 'Cargando...',
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