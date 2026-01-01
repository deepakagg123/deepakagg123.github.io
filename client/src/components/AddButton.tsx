import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddButtonProps {
  label: string;
  onClick: () => void;
}

export function AddButton({ label, onClick }: AddButtonProps) {
  return (
    <Button 
      onClick={onClick}
      size="sm" 
      variant="outline" 
      className="gap-2 bg-background hover:bg-secondary/50 transition-colors"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
