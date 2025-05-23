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
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
}

export const storage = new DatabaseStorage();
