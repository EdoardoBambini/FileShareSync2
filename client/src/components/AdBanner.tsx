import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AdBannerProps {
  size?: "banner" | "square" | "leaderboard";
  position?: "top" | "bottom" | "sidebar";
}

// AdMob Configuration
const ADMOB_CONFIG = {
  iOS: {
    appId: "ca-app-pub-8922429945740746~9060532520",
    banners: {
      primary: "ca-app-pub-8922429945740746/2754737371",
      secondary: "ca-app-pub-8922429945740746/4870006078", 
      tertiary: "ca-app-pub-8922429945740746/5403508485"
    },
    interstitial: "ca-app-pub-8922429945740746/4090426816"
  },
  android: {
    appId: "ca-app-pub-8922429945740746~7815492368",
    banners: {
      primary: "ca-app-pub-8922429945740746/6502410696",
      secondary: "ca-app-pub-8922429945740746/2563165686",
      tertiary: "ca-app-pub-8922429945740746/2777345143"
    },
    interstitial: "ca-app-pub-8922429945740746/6437997362"
  }
};

// Detect platform
const getPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'iOS';
  if (userAgent.includes('android')) return 'android';
  return 'web';
};

// Get banner ID based on position and platform
const getBannerId = (position: string) => {
  const platform = getPlatform();
  if (platform === 'web') return null; // Web fallback
  
  const config = ADMOB_CONFIG[platform as keyof typeof ADMOB_CONFIG];
  
  switch (position) {
    case 'top': return config.banners.primary;
    case 'bottom': return config.banners.secondary;
    case 'sidebar': return config.banners.tertiary;
    default: return config.banners.primary;
  }
};

export default function AdBanner({ size = "banner", position = "top" }: AdBannerProps) {
  const { user } = useAuth();
  const adRef = useRef<HTMLDivElement>(null);
  
  // Don't show ads to premium users
  if (user?.subscriptionPlan === 'premium') {
    return null;
  }
  
  const bannerId = getBannerId(position);
  
  useEffect(() => {
    // For web version, show placeholder for now
    if (!bannerId && adRef.current) {
      adRef.current.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          font-family: 'Montserrat', sans-serif;
        ">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
            🚀 Passa a Premium
          </div>
          <div style="font-size: 14px; opacity: 0.9;">
            Rimuovi le pubblicità e sblocca tutte le funzionalità
          </div>
        </div>
      `;
      return;
    }
    
    // For mobile apps, this will be handled by the native AdMob SDK
    if (bannerId && window.admob) {
      window.admob.createBanner({
        adId: bannerId,
        position: position === 'bottom' ? window.admob.AD_POSITION.BOTTOM_CENTER : window.admob.AD_POSITION.TOP_CENTER,
        autoShow: true
      });
    }
  }, [bannerId, position]);
  
  // Size classes for different banner types
  const sizeClasses = {
    banner: "h-[50px] w-full max-w-[320px]", // Mobile banner
    leaderboard: "h-[90px] w-full max-w-[728px]", // Desktop banner
    square: "h-[250px] w-full max-w-[300px]" // Medium rectangle
  };
  
  return (
    <div className={`${sizeClasses[size]} mx-auto my-4 flex items-center justify-center`}>
      <div 
        ref={adRef}
        className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center"
      >
        {!bannerId && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Pubblicità
          </span>
        )}
      </div>
    </div>
  );
}

// Interstitial Ad Function
export const showInterstitialAd = () => {
  const platform = getPlatform();
  if (platform === 'web') return; // Skip for web
  
  const config = ADMOB_CONFIG[platform as keyof typeof ADMOB_CONFIG];
  
  if (window.admob) {
    window.admob.prepareInterstitial({
      adId: config.interstitial,
      autoShow: true
    });
  }
};

// Global type for AdMob
declare global {
  interface Window {
    admob: any;
  }
}