import { 
  profile, publications, projects, news,
  type Profile, type Publication, type Project, type NewsItem,
  type InsertProfile, type InsertPublication, type InsertProject, type InsertNews,
  type UpdateProfile, type UpdatePublication, type UpdateProject, type UpdateNews
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Profile
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: InsertProfile): Promise<Profile>; // Upsert

  // Publications
  getPublications(): Promise<Publication[]>;
  createPublication(pub: InsertPublication): Promise<Publication>;
  updatePublication(id: number, pub: UpdatePublication): Promise<Publication>;
  deletePublication(id: number): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  createProject(proj: InsertProject): Promise<Project>;
  updateProject(id: number, proj: UpdateProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // News
  getNews(): Promise<NewsItem[]>;
  createNews(news: InsertNews): Promise<NewsItem>;
  deleteNews(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Profile
  async getProfile(): Promise<Profile | undefined> {
    const [p] = await db.select().from(profile).limit(1);
    return p;
  }

  async updateProfile(insertProfile: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    if (existing) {
      const [updated] = await db.update(profile).set(insertProfile).where(eq(profile.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(profile).values(insertProfile).returning();
      return created;
    }
  }

  // Publications
  async getPublications(): Promise<Publication[]> {
    return await db.select().from(publications).orderBy(desc(publications.year));
  }
  
  async createPublication(pub: InsertPublication): Promise<Publication> {
    const [created] = await db.insert(publications).values(pub).returning();
    return created;
  }

  async updatePublication(id: number, pub: UpdatePublication): Promise<Publication> {
    const [updated] = await db.update(publications).set(pub).where(eq(publications.id, id)).returning();
    return updated;
  }

  async deletePublication(id: number): Promise<void> {
    await db.delete(publications).where(eq(publications.id, id));
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(proj: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(proj).returning();
    return created;
  }

  async updateProject(id: number, proj: UpdateProject): Promise<Project> {
    const [updated] = await db.update(projects).set(proj).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // News
  async getNews(): Promise<NewsItem[]> {
    return await db.select().from(news).orderBy(desc(news.date));
  }

  async createNews(n: InsertNews): Promise<NewsItem> {
    const [created] = await db.insert(news).values(n).returning();
    return created;
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }
}

export const storage = new DatabaseStorage();
