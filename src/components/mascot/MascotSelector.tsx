import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MascotSelectorProps {
  selected: 'cat' | 'panda';
  onSelect: (type: 'cat' | 'panda') => void;
}

export const MascotSelector = ({ selected, onSelect }: MascotSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onSelect('cat')}
        className={`relative transition-all ${
          selected === 'cat' ? 'scale-105' : 'hover:scale-102'
        }`}
      >
        <Card className={`p-6 text-center space-y-2 ${
          selected === 'cat' 
            ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary shadow-lg' 
            : 'bg-card hover:bg-muted/50'
        }`}>
          <div className="text-5xl">😺</div>
          <p className="font-semibold text-sm">Kitty</p>
          <p className="text-xs text-muted-foreground">Playful & Purr-sistent</p>
          {selected === 'cat' && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </Card>
      </button>

      <button
        onClick={() => onSelect('panda')}
        className={`relative transition-all ${
          selected === 'panda' ? 'scale-105' : 'hover:scale-102'
        }`}
      >
        <Card className={`p-6 text-center space-y-2 ${
          selected === 'panda' 
            ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary shadow-lg' 
            : 'bg-card hover:bg-muted/50'
        }`}>
          <div className="text-5xl">🐼</div>
          <p className="font-semibold text-sm">Panda</p>
          <p className="text-xs text-muted-foreground">Calm & Caring</p>
          {selected === 'panda' && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </Card>
      </button>
    </div>
  );
};
