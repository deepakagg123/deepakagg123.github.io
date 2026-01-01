import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertProfile, type InsertPublication, type InsertProject, type InsertNews } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// === PROFILE HOOKS ===
export function useProfile() {
  return useQuery({
    queryKey: [api.profile.get.path],
    queryFn: async () => {
      const res = await fetch(api.profile.get.path);
      if (res.status === 404) return null; // Handle not found gracefully for initial setup
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profile.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertProfile) => {
      const res = await fetch(api.profile.update.path, {
        method: api.profile.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return api.profile.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.profile.get.path] });
      toast({ title: "Success", description: "Profile updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  });
}

// === PUBLICATIONS HOOKS ===
export function usePublications() {
  return useQuery({
    queryKey: [api.publications.list.path],
    queryFn: async () => {
      const res = await fetch(api.publications.list.path);
      if (!res.ok) throw new Error("Failed to fetch publications");
      return api.publications.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePublication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertPublication) => {
      // Ensure year is a number
      const payload = { ...data, year: Number(data.year) };
      const res = await fetch(api.publications.create.path, {
        method: api.publications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create publication");
      return api.publications.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.publications.list.path] });
      toast({ title: "Success", description: "Publication added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add publication", variant: "destructive" });
    }
  });
}

export function useDeletePublication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.publications.delete.path, { id });
      const res = await fetch(url, { method: api.publications.delete.method });
      if (!res.ok) throw new Error("Failed to delete publication");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.publications.list.path] });
      toast({ title: "Success", description: "Publication deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete publication", variant: "destructive" });
    }
  });
}

// === PROJECTS HOOKS ===
export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      const res = await fetch(api.projects.list.path);
      if (!res.ok) throw new Error("Failed to fetch projects");
      return api.projects.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertProject) => {
      const res = await fetch(api.projects.create.path, {
        method: api.projects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return api.projects.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
      toast({ title: "Success", description: "Project added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add project", variant: "destructive" });
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.projects.delete.path, { id });
      const res = await fetch(url, { method: api.projects.delete.method });
      if (!res.ok) throw new Error("Failed to delete project");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
      toast({ title: "Success", description: "Project deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    }
  });
}

// === NEWS HOOKS ===
export function useNews() {
  return useQuery({
    queryKey: [api.news.list.path],
    queryFn: async () => {
      const res = await fetch(api.news.list.path);
      if (!res.ok) throw new Error("Failed to fetch news");
      return api.news.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertNews) => {
      const res = await fetch(api.news.create.path, {
        method: api.news.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create news item");
      return api.news.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.news.list.path] });
      toast({ title: "Success", description: "News item added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add news item", variant: "destructive" });
    }
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.news.delete.path, { id });
      const res = await fetch(url, { method: api.news.delete.method });
      if (!res.ok) throw new Error("Failed to delete news item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.news.list.path] });
      toast({ title: "Success", description: "News item deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete news item", variant: "destructive" });
    }
  });
}
