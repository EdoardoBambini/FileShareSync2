import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateContent, generateContentVariation, suggestContentTypes } from "./openai";
import { insertNicheProfileSchema, updateNicheProfileSchema, insertGeneratedContentSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Controlla e resetta i crediti settimanali se necessario
      const user = await storage.checkAndResetWeeklyCredits(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName, company } = req.body;
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        email: req.user.claims.email,
        firstName,
        lastName,
        company,
        profileImageUrl: req.user.claims.profile_image_url,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Niche profile routes
  app.get('/api/niche-profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profiles = await storage.getUserNicheProfiles(userId);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching niche profiles:", error);
      res.status(500).json({ message: "Failed to fetch niche profiles" });
    }
  });

  app.post('/api/niche-profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertNicheProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      const profile = await storage.createNicheProfile(validatedData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error creating niche profile:", error);
      res.status(500).json({ message: "Failed to create niche profile" });
    }
  });

  app.get('/api/niche-profiles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.getNicheProfile(id);
      
      if (!profile) {
        return res.status(404).json({ message: "Niche profile not found" });
      }
      
      // Check if user owns this profile
      if (profile.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching niche profile:", error);
      res.status(500).json({ message: "Failed to fetch niche profile" });
    }
  });

  app.put('/api/niche-profiles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if profile exists and user owns it
      const existingProfile = await storage.getNicheProfile(id);
      if (!existingProfile || existingProfile.userId !== userId) {
        return res.status(404).json({ message: "Niche profile not found" });
      }
      
      const validatedData = updateNicheProfileSchema.parse({
        ...req.body,
        id,
        userId,
      });
      
      const updatedProfile = await storage.updateNicheProfile(validatedData);
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error updating niche profile:", error);
      res.status(500).json({ message: "Failed to update niche profile" });
    }
  });

  app.delete('/api/niche-profiles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      await storage.deleteNicheProfile(id, userId);
      res.json({ message: "Niche profile deleted successfully" });
    } catch (error) {
      console.error("Error deleting niche profile:", error);
      res.status(500).json({ message: "Failed to delete niche profile" });
    }
  });

  // Content suggestion route
  app.post('/api/suggest-content-types', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { nicheProfileId, objective } = req.body;
      
      // Get user info to check if Premium
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      
      // Get niche profile
      const nicheProfile = await storage.getNicheProfile(nicheProfileId);
      if (!nicheProfile || nicheProfile.userId !== userId) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }
      
      // Get AI suggestions with Premium flag
      const isPremium = user.subscriptionPlan === 'premium';
      const suggestions = await suggestContentTypes(objective, nicheProfile, isPremium);
      
      res.json(suggestions);
    } catch (error) {
      console.error("Error getting content suggestions:", error);
      res.status(500).json({ message: "Failed to get suggestions: " + (error as Error).message });
    }
  });

  // Content generation routes
  app.post('/api/generate-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { nicheProfileId, contentType, inputData, language = 'it' } = req.body;
      
      // Get user info to check subscription and credits
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      
      // Check credits for free users
      if (user.subscriptionPlan === 'free') {
        if (user.creditsRemaining <= 0) {
          return res.status(402).json({ 
            message: "Crediti esauriti! Passa al Premium per generazioni illimitate.", 
            type: "credits_exhausted",
            upgradeRequired: true 
          });
        }
        // Decrease credits for free users
        await storage.decreaseUserCredits(userId);
      }
      
      // Get niche profile
      const nicheProfile = await storage.getNicheProfile(nicheProfileId);
      if (!nicheProfile || nicheProfile.userId !== userId) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }
      
      // Generate content using OpenAI with selected language
      const generatedText = await generateContent({
        nicheProfile: {
          name: nicheProfile.name,
          targetAudience: nicheProfile.targetAudience,
          contentGoal: nicheProfile.contentGoal,
          toneOfVoice: nicheProfile.toneOfVoice,
          keywords: nicheProfile.keywords || undefined,
        },
        contentType,
        inputData,
        language, // Pass the selected language
      });
      
      // For free users, limit content length and add upgrade prompt
      let finalContent = generatedText;
      let isContentLimited = false;
      let upgradeMessage = null;
      
      if (user.subscriptionPlan === 'free' && generatedText.length > 450) {
        finalContent = generatedText.substring(0, 450) + "...";
        isContentLimited = true;
        upgradeMessage = "🚀 Passa al Premium per vedere il contenuto completo, suggerimenti foto/video e generazioni illimitate!";
      }
      
      // Save generated content (full content for premium, limited for free)
      const contentData = insertGeneratedContentSchema.parse({
        userId,
        nicheProfileId,
        contentType,
        inputData,
        generatedText: finalContent,
      });
      
      const savedContent = await storage.saveGeneratedContent(contentData);
      
      // Add premium upgrade info to response
      const response = {
        ...savedContent,
        isContentLimited,
        fullContentPreview: isContentLimited ? generatedText.substring(0, 400) + "..." : null,
        upgradeMessage,
        creditsRemaining: user.creditsRemaining - (user.subscriptionPlan === 'free' ? 1 : 0),
        subscriptionPlan: user.subscriptionPlan
      };
      
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error generating content:", error);
      res.status(500).json({ message: "Failed to generate content: " + (error as Error).message });
    }
  });

  app.post('/api/generate-content-variation', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { contentId } = req.body;
      
      // Get original content
      const originalContent = await storage.getGeneratedContent(contentId);
      if (!originalContent || originalContent.userId !== userId) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Get niche profile
      const nicheProfile = await storage.getNicheProfile(originalContent.nicheProfileId);
      if (!nicheProfile) {
        return res.status(404).json({ message: "Niche profile not found" });
      }
      
      // Generate variation
      const generatedText = await generateContentVariation(originalContent.generatedText, nicheProfile);
      
      // Save as new content
      const contentData = insertGeneratedContentSchema.parse({
        userId,
        nicheProfileId: originalContent.nicheProfileId,
        contentType: originalContent.contentType,
        inputData: originalContent.inputData,
        generatedText,
      });
      
      const savedContent = await storage.saveGeneratedContent(contentData);
      res.json(savedContent);
    } catch (error) {
      console.error("Error generating content variation:", error);
      res.status(500).json({ message: "Failed to generate content variation: " + (error as Error).message });
    }
  });

  // Content rating
  app.patch('/api/generated-content/:id/rating', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { rating } = req.body;
      
      // Check if content exists and user owns it
      const content = await storage.getGeneratedContent(id);
      if (!content || content.userId !== userId) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      await storage.updateContentRating(id, rating);
      res.json({ message: "Rating updated successfully" });
    } catch (error) {
      console.error("Error updating content rating:", error);
      res.status(500).json({ message: "Failed to update rating" });
    }
  });

  // Get user's generated content
  app.get('/api/generated-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const content = await storage.getUserGeneratedContent(userId);
      res.json(content);
    } catch (error) {
      console.error("Error fetching generated content:", error);
      res.status(500).json({ message: "Failed to fetch generated content" });
    }
  });

  // Stripe Premium Subscription Routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.email) {
        return res.status(400).json({ message: "Utente non trovato o email mancante" });
      }

      // Check if user already has a subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        if (subscription.status === 'active') {
          return res.json({ 
            message: "Abbonamento già attivo",
            subscriptionId: subscription.id,
            status: subscription.status 
          });
        }
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });
        customerId = customer.id;
        await storage.updateUserSubscription(userId, user.subscriptionPlan || 'free', customerId);
      }

      // Create a simple payment intent for subscription setup
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 499, // €4.99
        currency: 'eur',
        customer: customerId,
        setup_future_usage: 'off_session',
        description: 'NicheScribe AI Premium - Abbonamento Mensile',
        metadata: {
          userId: userId,
          type: 'subscription'
        }
      });

      // Update user subscription info (we'll activate after payment)
      await storage.updateUserSubscription(userId, 'premium', customerId, `temp_${paymentIntent.id}`);

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: 'requires_payment'
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Errore nella creazione dell'abbonamento: " + error.message });
    }
  });

  // Check user subscription status
  app.get('/api/subscription-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      let subscriptionStatus = 'free';
      let creditsRemaining = user.creditsRemaining || 0;

      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          subscriptionStatus = subscription.status === 'active' ? 'premium' : 'free';
          
          // Update user if subscription status changed
          if (subscriptionStatus !== user.subscriptionPlan) {
            await storage.updateUserSubscription(userId, subscriptionStatus);
          }
        } catch (error) {
          console.error("Error checking Stripe subscription:", error);
        }
      }

      res.json({
        subscriptionPlan: subscriptionStatus,
        creditsRemaining,
        isUpgradeRequired: subscriptionStatus === 'free' && creditsRemaining <= 0,
      });
    } catch (error: any) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Errore nel controllo dell'abbonamento: " + error.message });
    }
  });

  // Confirm payment and activate premium
  app.post('/api/confirm-payment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { paymentIntentId } = req.body;

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Activate premium subscription
        await storage.updateUserSubscription(userId, 'premium', paymentIntent.customer as string, paymentIntentId);
        
        res.json({ 
          message: "Pagamento confermato! Benvenuto in Premium!",
          subscriptionPlan: 'premium'
        });
      } else {
        res.status(400).json({ message: "Pagamento non completato" });
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Errore nella conferma del pagamento: " + error.message });
    }
  });

  // Cancel subscription
  app.post('/api/cancel-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeSubscriptionId) {
        return res.status(400).json({ message: "Nessun abbonamento attivo trovato" });
      }

      await storage.updateUserSubscription(userId, 'free');
      res.json({ message: "Abbonamento cancellato con successo" });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ message: "Errore nella cancellazione dell'abbonamento: " + error.message });
    }
  });

  // Advanced USP features endpoints
  app.post("/api/analyze-hashtags", isAuthenticated, async (req, res) => {
    try {
      const { hashtags, niche, language } = req.body;
      const { analyzeHashtags } = await import("./openai");
      const analysis = await analyzeHashtags(hashtags, niche, language);
      res.json({ analysis });
    } catch (error: any) {
      console.error("Error analyzing hashtags:", error);
      res.status(500).json({ message: "Errore durante l'analisi degli hashtag: " + error.message });
    }
  });

  app.post("/api/generate-seo", isAuthenticated, async (req, res) => {
    try {
      const { content, contentType, keywords, language } = req.body;
      const { generateSEOSnippets } = await import("./openai");
      const seoData = await generateSEOSnippets(content, contentType, keywords, language);
      res.json(seoData);
    } catch (error: any) {
      console.error("Error generating SEO snippets:", error);
      res.status(500).json({ message: "Errore durante la generazione SEO: " + error.message });
    }
  });

  app.post("/api/predict-ctr", isAuthenticated, async (req, res) => {
    try {
      const { content, platform } = req.body;
      const { predictCTR } = await import("./openai");
      const prediction = await predictCTR(content, platform);
      res.json(prediction);
    } catch (error: any) {
      console.error("Error predicting CTR:", error);
      res.status(500).json({ message: "Errore durante la predizione CTR: " + error.message });
    }
  });

  app.get("/api/holiday-presets", async (req, res) => {
    try {
      const { country = 'IT', language = 'it' } = req.query;
      const { getHolidayPresets } = await import("./openai");
      const presets = getHolidayPresets(country as string, language as string);
      res.json({ presets });
    } catch (error: any) {
      console.error("Error getting holiday presets:", error);
      res.status(500).json({ message: "Errore durante il caricamento dei preset: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
