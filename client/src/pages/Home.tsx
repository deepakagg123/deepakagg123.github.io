import { useProfile, useNews, usePublications, useCreateNews, useDeleteNews, useUpdateProfile } from "@/hooks/use-data";
import { Github, Linkedin, Mail, Twitter, Globe, Trash2, Edit2, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNewsSchema, insertProfileSchema, type InsertNews, type InsertProfile } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";

export default function Home() {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: news, isLoading: loadingNews } = useNews();
  const { data: publications, isLoading: loadingPubs } = usePublications();
  
  const selectedPubs = publications?.filter(p => p.isSelected) || [];

  if (loadingProfile || loadingNews || loadingPubs) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-24 w-24 bg-secondary rounded-full mx-auto mb-4" />
          <div className="h-4 w-48 bg-secondary rounded mx-auto" />
          <div className="h-3 w-32 bg-secondary rounded mx-auto" />
        </div>
      </div>
    );
  }

  // If no profile data at all, prompt to create one (simple fallback)
  const displayProfile = profile || {
    name: "New User",
    title: "Researcher",
    institution: "University Name",
    bio: "Welcome to your new portfolio. Click the edit button to set up your profile.",
    email: "email@example.com"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Hero / Bio Section */}
      <section className="relative">
        <div className="flex justify-between items-start gap-8">
          <div className="space-y-6 flex-1">
            <div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary mb-2">
                {displayProfile.name}
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                {displayProfile.title} at <span className="text-foreground font-medium">{displayProfile.institution}</span>
              </p>
            </div>
            
            <p className="text-lg leading-relaxed text-muted-foreground/90 max-w-2xl text-balance">
              {displayProfile.bio}
            </p>

            <div className="flex flex-wrap gap-3">
              {displayProfile.email && (
                <Button variant="outline" size="sm" asChild className="rounded-full gap-2">
                  <a href={`mailto:${displayProfile.email}`}>
                    <Mail className="w-4 h-4" /> Email
                  </a>
                </Button>
              )}
              {displayProfile.githubUrl && (
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-secondary">
                  <a href={displayProfile.githubUrl} target="_blank" rel="noreferrer">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {displayProfile.twitterUrl && (
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-secondary">
                  <a href={displayProfile.twitterUrl} target="_blank" rel="noreferrer">
                    <Twitter className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {displayProfile.scholarUrl && (
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-secondary">
                  <a href={displayProfile.scholarUrl} target="_blank" rel="noreferrer">
                    <Globe className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {displayProfile.linkedinUrl && (
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-secondary">
                  <a href={displayProfile.linkedinUrl} target="_blank" rel="noreferrer">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <EditProfileDialog profile={displayProfile} />
        </div>
      </section>

      {/* News Section */}
      <section>
        <SectionHeader 
          title="Recent News" 
          action={<AddNewsDialog />}
        />
        <div className="space-y-4">
          {news && news.length > 0 ? (
            news.map((item) => (
              <NewsItem key={item.id} item={item} />
            ))
          ) : (
            <p className="text-muted-foreground italic">No news updates yet.</p>
          )}
        </div>
      </section>

      {/* Selected Publications Section */}
      <section>
        <SectionHeader 
          title="Selected Publications" 
          subtitle="Highlighting key research contributions."
        />
        <div className="space-y-6">
          {selectedPubs.length > 0 ? (
            selectedPubs.map((pub) => (
              <motion.div 
                key={pub.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative pl-4 border-l-2 border-border hover:border-primary transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {pub.title}
                </h3>
                <p className="text-muted-foreground mt-1">{pub.authors}</p>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="font-medium text-foreground">{pub.venue}</span>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-muted-foreground">{pub.year}</span>
                </div>
                <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {pub.pdfUrl && (
                    <a href={pub.pdfUrl} className="text-xs font-medium text-primary hover:underline">PDF</a>
                  )}
                  {pub.codeUrl && (
                    <a href={pub.codeUrl} className="text-xs font-medium text-primary hover:underline">Code</a>
                  )}
                  {pub.projectUrl && (
                    <a href={pub.projectUrl} className="text-xs font-medium text-primary hover:underline">Project Page</a>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground italic">
              No selected publications. Go to the Publications page to add and select some.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function NewsItem({ item }: { item: any }) {
  const { mutate: deleteNews } = useDeleteNews();

  return (
    <div className="flex gap-6 items-start group relative py-2">
      <div className="w-32 flex-shrink-0 text-sm font-medium text-muted-foreground pt-1">
        {format(new Date(item.date), "MMM d, yyyy")}
      </div>
      <div className="flex-1 text-foreground/90 leading-relaxed">
        {item.content}
        {item.link && (
          <a href={item.link} className="ml-2 text-primary hover:underline text-sm font-medium">
            Read more →
          </a>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => deleteNews(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function AddNewsDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createNews, isPending } = useCreateNews();
  
  const form = useForm<InsertNews>({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      content: "",
      link: ""
    }
  });

  const onSubmit = (data: InsertNews) => {
    createNews(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit2 className="h-3.5 w-3.5" /> Manage News
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add News Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="New paper accepted at..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Adding..." : "Add News"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditProfileDialog({ profile }: { profile: any }) {
  const [open, setOpen] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  
  const form = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      name: profile.name,
      title: profile.title,
      institution: profile.institution,
      bio: profile.bio,
      email: profile.email,
      githubUrl: profile.githubUrl || "",
      scholarUrl: profile.scholarUrl || "",
      twitterUrl: profile.twitterUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
      cvUrl: profile.cvUrl || "",
      imageUrl: profile.imageUrl || "",
    }
  });

  const onSubmit = (data: InsertProfile) => {
    updateProfile(data, {
      onSuccess: () => setOpen(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 rounded-full hover:bg-secondary">
          <Edit2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl><Textarea className="h-32" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <h4 className="font-medium text-sm text-muted-foreground">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl><Input placeholder="https://github.com/..." {...field} value={field.value || ''} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scholarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Scholar</FormLabel>
                      <FormControl><Input placeholder="https://scholar.google.com/..." {...field} value={field.value || ''} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter/X</FormLabel>
                      <FormControl><Input placeholder="https://twitter.com/..." {...field} value={field.value || ''} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} value={field.value || ''} /></FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
