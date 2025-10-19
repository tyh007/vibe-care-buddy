import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Star, Heart, Settings } from "lucide-react";
import { VibePartnerDialog } from "./VibePartnerDialog";

interface VibePartnerProps {
  points: number;
  level: number;
  name: string;
  mood?: number;
  onCustomize: () => void;
}

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1700];

const getMascotExpression = (mood?: number, level?: number) => {
  if (!mood) return "😊";
  if (mood <= 2) return "🤗"; // Comforting
  if (mood === 3) return "😌"; // Calm
  if (mood >= 4) return "✨"; // Celebratory
  return "😊";
};

const getMoodMessage = (mood?: number, name?: string) => {
  if (!mood) return `Hi! I'm ${name || 'your Vibe Partner'}. Let's take care of ourselves together! 💙`;
  
  if (mood === 1) return "I see you're struggling. That's okay - you're doing your best, and I'm here with you. 🤗";
  if (mood === 2) return "Some days are harder than others. Let's take it one step at a time, together. 💙";
  if (mood === 3) return "You're doing okay! Remember, progress isn't always linear. 😌";
  if (mood === 4) return "You're feeling good today! Let's keep this positive energy going! 🌟";
  if (mood === 5) return "Wow, you're glowing! I'm so proud of your progress! ✨";
  
  return "Every small step counts. You've got this! 💪";
};

export const VibePartner = ({ points, level, name, mood, onCustomize }: VibePartnerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const currentThreshold = LEVEL_THRESHOLDS[level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level + 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progressInLevel = points - currentThreshold;
  const pointsNeededForNext = nextThreshold - currentThreshold;
  const progressPercent = (progressInLevel / pointsNeededForNext) * 100;
  
  const expression = getMascotExpression(mood, level);
  const message = getMoodMessage(mood, name);
  
  useEffect(() => {
    // Check if level just increased
    const lastLevel = parseInt(localStorage.getItem('lastVibeLevel') || '0');
    if (level > lastLevel) {
      setShowCelebration(true);
      localStorage.setItem('lastVibeLevel', level.toString());
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [level]);

  return (
    <>
      <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 border-primary/20 shadow-soft relative overflow-hidden">
        {/* Celebration effect */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 animate-fade-in z-10">
            <div className="text-center space-y-2">
              <div className="text-4xl animate-scale-in">🎉</div>
              <p className="font-bold text-lg text-primary">Level Up!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Your Vibe Partner</h3>
            </div>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
            className="h-8 w-8"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Mascot Display */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <div className="text-6xl mb-2 animate-bounce-slow">
              {expression}
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>Lv {level}</span>
              </div>
            </div>
          </div>
          
          {/* Message bubble */}
          <div className="relative bg-card border border-primary/20 rounded-2xl p-3 max-w-[250px] shadow-sm">
            <p className="text-xs text-foreground text-center leading-relaxed">
              {message}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card" />
          </div>
        </div>

        {/* Energy Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              Vibe Energy
            </span>
            <span className="font-medium text-foreground">
              {progressInLevel} / {pointsNeededForNext}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{points} total points</span>
            {level < LEVEL_THRESHOLDS.length - 1 && (
              <span className="text-primary font-medium">
                {pointsNeededForNext - progressInLevel} to next level
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-card/50 rounded-lg p-2">
            <div className="text-xl mb-1">🏆</div>
            <div className="text-xs text-muted-foreground">Level {level}</div>
          </div>
          <div className="bg-card/50 rounded-lg p-2">
            <div className="text-xl mb-1">⭐</div>
            <div className="text-xs text-muted-foreground">{points} pts</div>
          </div>
          <div className="bg-card/50 rounded-lg p-2">
            <div className="text-xl mb-1">{expression}</div>
            <div className="text-xs text-muted-foreground">Mood</div>
          </div>
        </div>
      </Card>

      <VibePartnerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentName={name}
        level={level}
        points={points}
        onCustomize={onCustomize}
      />
    </>
  );
};
