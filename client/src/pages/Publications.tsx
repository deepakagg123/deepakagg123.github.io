import { usePublications, useCreatePublication, useDeletePublication } from "@/hooks/use-data";
import { SectionHeader } from "@/components/SectionHeader";
import { AddButton } from "@/components/AddButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPublicationSchema, type InsertPublication } from "@shared/schema";
import { Search, Trash2, FileText, Code, Link2 } from "lucide-react";

export default function Publications() {
  const { data: publications, isLoading } = usePublications();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Group by year
  const groupedPubs = useMemo(() => {
    if (!publications) return {};
    
    const filtered = publications.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped: Record<number, typeof publications> = {};
    filtered.forEach(pub => {
      if (!grouped[pub.year]) grouped[pub.year] = [];
      grouped[pub.year].push(pub);
    });

    return grouped;
  }, [publications, searchTerm]);

  const years = Object.keys(groupedPubs).map(Number).sort((a, b) => b - a);

  if (isLoading) {
    return <div className="text-center py-20 text-muted-foreground">Loading publications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader 
        title="Publications" 
        subtitle="A comprehensive list of research papers and articles."
        action={<AddButton label="Add Paper" onClick={() => setIsAddOpen(true)} />}
      />

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search by title, venue, or author..." 
          className="pl-9 bg-secondary/30 border-border/60 focus:bg-background transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-10">
        {years.length > 0 ? (
          years.map(year => (
            <div key={year} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-display font-bold text-primary/80 mb-6 border-b border-border/50 pb-2">
                {year}
              </h3>
              <div className="space-y-6">
                {groupedPubs[year].map(pub => (
                  <PublicationItem key={pub.id} publication={pub} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg bg-secondary/10 border-dashed">
            <p className="text-muted-foreground">No publications found.</p>
          </div>
        )}
      </div>

      <AddPublicationDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}

function PublicationItem({ publication }: { publication: any }) {
  const { mutate: deletePub } = useDeletePublication();

  return (
    <div className="group relative pl-4 border-l-2 border-border hover:border-primary transition-colors duration-200">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-foreground leading-tight">
            {publication.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {publication.authors}
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-primary/80">
            <span className="bg-primary/5 px-2 py-0.5 rounded text-xs">{publication.venue}</span>
            {publication.isSelected && (
              <span className="bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded text-xs border border-yellow-500/20">Selected</span>
            )}
          </div>
          
          {publication.abstract && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed mt-2 line-clamp-2 group-hover:line-clamp-none transition-all">
              {publication.abstract}
            </p>
          )}

          <div className="flex gap-4 pt-1">
            {publication.pdfUrl && (
              <a href={publication.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                <FileText className="w-3.5 h-3.5" /> PDF
              </a>
            )}
            {publication.codeUrl && (
              <a href={publication.codeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                <Code className="w-3.5 h-3.5" /> Code
              </a>
            )}
            {publication.projectUrl && (
              <a href={publication.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                <Link2 className="w-3.5 h-3.5" /> Project
              </a>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => deletePub(publication.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function AddPublicationDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate: createPub, isPending } = useCreatePublication();
  
  const form = useForm<InsertPublication>({
    resolver: zodResolver(insertPublicationSchema),
    defaultValues: {
      title: "",
      authors: "",
      venue: "",
      year: new Date().getFullYear(),
      abstract: "",
      pdfUrl: "",
      codeUrl: "",
      projectUrl: "",
      isSelected: false
    }
  });

  const onSubmit = (data: InsertPublication) => {
    createPub(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Publication</DialogTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Venue (e.g. CVPR 2024)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authors</FormLabel>
                  <FormControl><Input placeholder="Comma separated..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract (Optional)</FormLabel>
                  <FormControl><textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pdfUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDF URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isSelected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Selected Publication</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Feature this on the home page.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Adding..." : "Add Publication"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
