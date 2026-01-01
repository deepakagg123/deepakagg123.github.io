import { useProjects, useCreateProject, useDeleteProject } from "@/hooks/use-data";
import { SectionHeader } from "@/components/SectionHeader";
import { AddButton } from "@/components/AddButton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center py-20 text-muted-foreground">Loading projects...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader 
        title="Projects" 
        subtitle="Showcase of open source contributions and experiments."
        action={<AddButton label="Add Project" onClick={() => setIsAddOpen(true)} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects && projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 border rounded-lg bg-secondary/10 border-dashed">
            <p className="text-muted-foreground">No projects added yet.</p>
          </div>
        )}
      </div>

      <AddProjectDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const { mutate: deleteProject } = useDeleteProject();

  const tags = project.technologies 
    ? project.technologies.split(",").map((t: string) => t.trim()) 
    : [];

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/60 bg-card">
      <div className="aspect-video w-full overflow-hidden bg-secondary/20 relative">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground/30 text-4xl font-display font-bold">
            {project.title[0]}
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8 rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              deleteProject(project.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <span className="font-display font-bold text-xl">{project.title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      {project.link && (
        <CardFooter className="pt-0 pb-4">
          <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-primary hover:text-primary-foreground" asChild>
            <a href={project.link} target="_blank" rel="noreferrer">
              View Project <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function AddProjectDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate: createProject, isPending } = useCreateProject();
  
  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      link: "",
      technologies: ""
    }
  });

  const onSubmit = (data: InsertProject) => {
    createProject(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies (comma separated)</FormLabel>
                  <FormControl><Input placeholder="React, TypeScript, Python..." {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link (Optional)</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Adding..." : "Add Project"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
