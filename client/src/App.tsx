import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import NotFound from "@/pages/not-found";

// Page Imports
import Home from "@/pages/Home";
import Publications from "@/pages/Publications";
import Projects from "@/pages/Projects";
import CV from "@/pages/CV";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/publications" component={Publications} />
      <Route path="/projects" component={Projects} />
      <Route path="/cv" component={CV} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background font-sans text-foreground">
          <Sidebar />
          
          <main className="md:pl-72 min-h-screen transition-all duration-300 ease-in-out">
            <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12 lg:px-8 animate-in fade-in duration-500">
              <Router />
            </div>
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
