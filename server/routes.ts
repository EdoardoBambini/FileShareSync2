import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateContent, generateContentVariation } from "./openai";
import { insertNicheProfileSchema, updateNicheProfileSchema, insertGeneratedContentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
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

  // Content generation routes
  app.post('/api/generate-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { nicheProfileId, contentType, inputData } = req.body;
      
      // Get niche profile
      const nicheProfile = await storage.getNicheProfile(nicheProfileId);
      if (!nicheProfile || nicheProfile.userId !== userId) {
        return res.status(404).json({ message: "Niche profile not found" });
      }
      
      // Generate content using OpenAI
      const generatedText = await generateContent({
        nicheProfile,
        contentType,
        inputData,
      });
      
      // Save generated content
      const contentData = insertGeneratedContentSchema.parse({
        userId,
        nicheProfileId,
        contentType,
        inputData,
        generatedText,
      });
      
      const savedContent = await storage.saveGeneratedContent(contentData);
      res.json(savedContent);
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

  const httpServer = createServer(app);
  return httpServer;
}
