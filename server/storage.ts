import {
  users,
  nicheProfiles,
  generatedContent,
  type User,
  type UpsertUser,
  type NicheProfile,
  type InsertNicheProfile,
  type UpdateNicheProfile,
  type GeneratedContent,
  type InsertGeneratedContent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  decreaseUserCredits(userId: string): Promise<void>;
  checkAndResetWeeklyCredits(userId: string): Promise<User>;
  updateUserSubscription(userId: string, plan: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<User>;
  
  // Niche profile operations
  createNicheProfile(profile: InsertNicheProfile): Promise<NicheProfile>;
  getUserNicheProfiles(userId: string): Promise<NicheProfile[]>;
  getNicheProfile(id: number): Promise<NicheProfile | undefined>;
  updateNicheProfile(profile: UpdateNicheProfile): Promise<NicheProfile>;
  deleteNicheProfile(id: number, userId: string): Promise<void>;
  
  // Generated content operations
  saveGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent>;
  getUserGeneratedContent(userId: string): Promise<GeneratedContent[]>;
  getGeneratedContent(id: number): Promise<GeneratedContent | undefined>;
  updateContentRating(id: number, rating: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Niche profile operations
  async createNicheProfile(profile: InsertNicheProfile): Promise<NicheProfile> {
    const [newProfile] = await db
      .insert(nicheProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async getUserNicheProfiles(userId: string): Promise<NicheProfile[]> {
    return await db
      .select()
      .from(nicheProfiles)
      .where(eq(nicheProfiles.userId, userId))
      .orderBy(desc(nicheProfiles.createdAt));
  }

  async getNicheProfile(id: number): Promise<NicheProfile | undefined> {
    const [profile] = await db
      .select()
      .from(nicheProfiles)
      .where(eq(nicheProfiles.id, id));
    return profile;
  }

  async updateNicheProfile(profile: UpdateNicheProfile): Promise<NicheProfile> {
    const [updatedProfile] = await db
      .update(nicheProfiles)
      .set({
        ...profile,
        updatedAt: new Date(),
      })
      .where(eq(nicheProfiles.id, profile.id))
      .returning();
    return updatedProfile;
  }

  async deleteNicheProfile(id: number, userId: string): Promise<void> {
    await db
      .delete(nicheProfiles)
      .where(and(eq(nicheProfiles.id, id), eq(nicheProfiles.userId, userId)));
  }

  // Generated content operations
  async saveGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent> {
    const [newContent] = await db
      .insert(generatedContent)
      .values(content)
      .returning();
    return newContent;
  }

  async getUserGeneratedContent(userId: string): Promise<GeneratedContent[]> {
    return await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.userId, userId))
      .orderBy(desc(generatedContent.createdAt));
  }

  async getGeneratedContent(id: number): Promise<GeneratedContent | undefined> {
    const [content] = await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.id, id));
    return content;
  }

  async updateContentRating(id: number, rating: number): Promise<void> {
    await db
      .update(generatedContent)
      .set({ rating })
      .where(eq(generatedContent.id, id));
  }

  async decreaseUserCredits(userId: string): Promise<void> {
    // Atomic decrement with check to prevent going below 0
    await db
      .update(users)
      .set({
        creditsRemaining: sql`GREATEST(${users.creditsRemaining} - 1, 0)`,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(users.id, userId),
          sql`${users.creditsRemaining} > 0`
        )
      );
  }

  async checkAndResetWeeklyCredits(userId: string): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      throw new Error("User not found");
    }

    // Se è utente premium, non gestire i crediti
    if (user.subscriptionPlan === 'premium') {
      return user;
    }

    const now = new Date();
    const lastReset = user.lastCreditsReset ? new Date(user.lastCreditsReset) : new Date(user.createdAt!);
    
    // Calcola lunedì della settimana corrente
    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() - now.getDay() + 1);
    currentMonday.setHours(0, 0, 0, 0);
    
    // Calcola lunedì della settimana dell'ultimo reset
    const lastResetMonday = new Date(lastReset);
    lastResetMonday.setDate(lastReset.getDate() - lastReset.getDay() + 1);
    lastResetMonday.setHours(0, 0, 0, 0);
    
    // Se è una nuova settimana, resetta i crediti
    if (currentMonday.getTime() > lastResetMonday.getTime()) {
      const [updatedUser] = await db
        .update(users)
        .set({
          creditsRemaining: 3,
          lastCreditsReset: now,
          updatedAt: now,
        })
        .where(eq(users.id, userId))
        .returning();
      
      return updatedUser;
    }
    
    return user;
  }

  async updateUserSubscription(userId: string, plan: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionPlan: plan,
        stripeCustomerId,
        stripeSubscriptionId,
        creditsRemaining: plan === 'premium' ? 999 : 3,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
