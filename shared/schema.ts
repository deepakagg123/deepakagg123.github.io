import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  institution: text("institution").notNull(),
  bio: text("bio").notNull(),
  email: text("email").notNull(),
  githubUrl: text("github_url"),
  scholarUrl: text("scholar_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  cvUrl: text("cv_url"),
  imageUrl: text("image_url"),
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  venue: text("venue").notNull(), // e.g., "CVPR 2024"
  year: integer("year").notNull(),
  abstract: text("abstract"),
  pdfUrl: text("pdf_url"),
  codeUrl: text("code_url"),
  projectUrl: text("project_url"),
  isSelected: boolean("is_selected").default(false), // For "Selected Publications" on home
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  link: text("link"),
  technologies: text("technologies"), // e.g., "Python, PyTorch"
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // ISO date string YYYY-MM-DD
  content: text("content").notNull(),
  link: text("link"),
});

// === SCHEMAS ===

export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });
export const insertPublicationSchema = createInsertSchema(publications).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertNewsSchema = createInsertSchema(news).omit({ id: true });

// === TYPES ===

export type Profile = typeof profile.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type NewsItem = typeof news.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertNews = z.infer<typeof insertNewsSchema>;

// Update types (Partial)
export type UpdateProfile = Partial<InsertProfile>;
export type UpdatePublication = Partial<InsertPublication>;
export type UpdateProject = Partial<InsertProject>;
export type UpdateNews = Partial<InsertNews>;
