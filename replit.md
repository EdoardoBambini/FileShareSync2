# NicheScribe AI

## Overview

NicheScribe AI is an AI-powered content generation platform designed for freelancers and small businesses. The app helps users create professional marketing content for social media (Facebook, Instagram), e-commerce product descriptions, and blog posts. Users create "niche profiles" that define their target audience, tone of voice, and content goals, then generate tailored content using OpenAI's GPT models.

The platform includes a freemium monetization model with 3 free content generations per week for free users and unlimited access for premium subscribers at €4.99/month via Stripe. The app supports multiple languages (Italian, English, Spanish) and is configured for mobile deployment via Capacitor/PWA.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui components (New York style)
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom path aliases (@/, @shared/, @assets/)

The frontend follows a page-based architecture in `client/src/pages/` with shared components in `client/src/components/`. Key user flows include dashboard → content suggestion → content type selection → content input → content output.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful JSON APIs under `/api/` prefix
- **Authentication**: Replit Auth via OpenID Connect with Passport.js
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **AI Integration**: OpenAI GPT-4o for content generation

Routes are registered in `server/routes.ts` with authentication middleware. The storage layer (`server/storage.ts`) implements a clean interface pattern for database operations.

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL (Neon serverless)
- **Schema Location**: `shared/schema.ts`
- **Key Tables**:
  - `users`: Account data, subscription status, credits remaining
  - `sessions`: Required for Replit Auth
  - `niche_profiles`: User-created content profiles with audience/tone settings
  - `generated_content`: Saved AI-generated content with ratings

The schema uses Drizzle-Zod for automatic validation schema generation.

### Monetization System
- **Free Tier**: 3 content generations per week (credits reset weekly)
- **Premium Tier**: €4.99/month unlimited access via Stripe subscriptions
- **Ads**: Google AdSense for web, AdMob configured for mobile apps
- Cookie consent and age verification components handle GDPR compliance

### Mobile Deployment
Configured for PWA and native app conversion:
- Capacitor config for iOS/Android builds
- Service worker for offline support
- Expo/EAS configuration for React Native path
- AdMob unit IDs configured for both platforms

## External Dependencies

### Third-Party Services
- **OpenAI API**: GPT-4o model for content generation (requires OPENAI_API_KEY)
- **Stripe**: Payment processing for premium subscriptions (requires STRIPE_SECRET_KEY, VITE_STRIPE_PUBLIC_KEY)
- **Replit Auth**: User authentication via OpenID Connect (requires REPLIT_DOMAINS, SESSION_SECRET)
- **Google AdSense/AdMob**: Advertising for free tier users (pub-8922429945740746)

### Database
- **Neon PostgreSQL**: Serverless Postgres database (requires DATABASE_URL)
- Database migrations managed via Drizzle Kit (`npm run db:push`)

### Key npm Packages
- `@neondatabase/serverless`: Neon database driver
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `openai`: OpenAI API client
- `stripe` / `@stripe/react-stripe-js`: Payment integration
- `@radix-ui/*`: Accessible UI primitives for shadcn/ui
- `@capacitor/*`: Mobile app bridge for iOS/Android