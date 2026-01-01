import { useProfile } from "@/hooks/use-data";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Download, GraduationCap, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CV() {
  const { data: profile } = useProfile();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SectionHeader 
        title="Curriculum Vitae" 
        subtitle="Professional and academic history."
        action={
          profile?.cvUrl ? (
            <Button className="gap-2 shadow-lg hover:shadow-xl transition-all" asChild>
              <a href={profile.cvUrl} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </Button>
          ) : (
            <Button disabled className="gap-2 opacity-50 cursor-not-allowed">
              <Download className="h-4 w-4" /> CV Not Available
            </Button>
          )
        }
      />

      <div className="grid gap-8">
        {/* Education Section - Hardcoded example structure since schema doesn't have Education table yet */}
        {/* In a real app, this would come from a `education` table */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-bold">Education</h2>
          </div>
          
          <div className="space-y-6 border-l-2 border-border ml-5 pl-8 py-2">
            <div className="relative">
              <div className="absolute -left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background" />
              <h3 className="font-bold text-lg">Ph.D. in Computer Science</h3>
              <p className="text-primary font-medium">Stanford University</p>
              <p className="text-sm text-muted-foreground mt-1">2020 - Present</p>
              <p className="mt-2 text-muted-foreground">Advisor: Prof. Jane Doe</p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-border bg-background" />
              <h3 className="font-bold text-lg">B.S. in Computer Science</h3>
              <p className="text-primary font-medium">MIT</p>
              <p className="text-sm text-muted-foreground mt-1">2016 - 2020</p>
              <p className="mt-2 text-muted-foreground">GPA: 4.0/4.0</p>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-bold">Experience</h2>
          </div>
          
          <div className="space-y-8 border-l-2 border-border ml-5 pl-8 py-2">
            <div className="relative">
              <div className="absolute -left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background" />
              <h3 className="font-bold text-lg">Research Intern</h3>
              <p className="text-primary font-medium">Google DeepMind</p>
              <p className="text-sm text-muted-foreground mt-1">Summer 2023</p>
              <ul className="mt-3 list-disc list-outside ml-4 space-y-1 text-muted-foreground">
                <li>Developed novel reinforcement learning algorithms for robotics.</li>
                <li>Published findings in ICRA 2024.</li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-border bg-background" />
              <h3 className="font-bold text-lg">Software Engineer Intern</h3>
              <p className="text-primary font-medium">Meta AI</p>
              <p className="text-sm text-muted-foreground mt-1">Summer 2022</p>
              <ul className="mt-3 list-disc list-outside ml-4 space-y-1 text-muted-foreground">
                <li>Optimized PyTorch distributed training infrastructure.</li>
                <li>Reduced model training time by 15%.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Card className="bg-secondary/20 border-border/60 mt-12">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            This is a summary. Please download the full CV for detailed information on skills, awards, and coursework.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
