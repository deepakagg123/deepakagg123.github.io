import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Profile
  app.get(api.profile.get.path, async (req, res) => {
    const profile = await storage.getProfile();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  });

  app.post(api.profile.update.path, async (req, res) => {
    try {
      const input = api.profile.update.input.parse(req.body);
      const updated = await storage.updateProfile(input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
         res.status(400).json({ message: err.errors[0].message });
         return;
      }
      throw err;
    }
  });

  // Publications
  app.get(api.publications.list.path, async (req, res) => {
    const list = await storage.getPublications();
    res.json(list);
  });

  app.post(api.publications.create.path, async (req, res) => {
    try {
      const input = api.publications.create.input.parse(req.body);
      const created = await storage.createPublication(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  // Projects
  app.get(api.projects.list.path, async (req, res) => {
    const list = await storage.getProjects();
    res.json(list);
  });

  // News
  app.get(api.news.list.path, async (req, res) => {
    const list = await storage.getNews();
    res.json(list);
  });

  // Initialize Seed Data
  await seed();

  return httpServer;
}

async function seed() {
  const existing = await storage.getProfile();
  if (existing) return;

  await storage.updateProfile({
    name: "Alex Researcher",
    title: "PhD Candidate in Computer Science",
    institution: "University of Technology",
    bio: "I am a PhD candidate researching AI and Human-Computer Interaction. My work focuses on making generative models more controllable and interpretable.",
    email: "alex@example.edu",
    githubUrl: "https://github.com",
    scholarUrl: "https://scholar.google.com",
    twitterUrl: "https://twitter.com",
    linkedinUrl: "https://linkedin.com",
    cvUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", 
  });

  await storage.createPublication({
    title: "Generative Models for Creative Workflows",
    authors: "A. Researcher, B. Advisor",
    venue: "NeurIPS 2024",
    year: 2024,
    abstract: "We propose a new framework for integrating generative models into creative tools...",
    isSelected: true,
  });

  await storage.createPublication({
    title: "Understanding User Intent in AI Assistants",
    authors: "A. Researcher, C. Colleague",
    venue: "CHI 2023",
    year: 2023,
    abstract: "A study on how users formulate prompts...",
    isSelected: true,
  });

  await storage.createProject({
    title: "OpenGen",
    description: "An open-source library for generative art.",
    technologies: "Python, PyTorch",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    link: "https://github.com",
  });

  await storage.createNews({
    date: "2024-01-15",
    content: "Paper accepted to NeurIPS 2024!",
  });
}
