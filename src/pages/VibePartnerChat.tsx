import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InteractiveVibePartner } from "@/components/mascot/InteractiveVibePartner";
import { useRewardSystem } from "@/hooks/useRewardSystem";
import { useState, useEffect } from "react";

const VibePartnerChat = () => {
  const navigate = useNavigate();
  const rewardSystem = useRewardSystem();
  
  const [partnerName, setPartnerName] = useState(() => 
    localStorage.getItem('vibePartnerName') || 'Vibe Buddy'
  );
  const [partnerType, setPartnerType] = useState<'cat' | 'dog' | 'panda'>(() => 
    (localStorage.getItem('vibePartnerType') as 'cat' | 'dog' | 'panda') || 'cat'
  );
  
  // Get latest mood from localStorage
  const [currentMood, setCurrentMood] = useState<number | undefined>(() => {
    const moods = localStorage.getItem('vc_moods');
    if (moods) {
      try {
        const parsed = JSON.parse(moods);
        return parsed[parsed.length - 1]?.mood;
      } catch {}
    }
    return undefined;
  });

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Centered partner */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Talk with Your Vibe Partner</h1>
            <p className="text-lg text-muted-foreground">
              Share your feelings, get support, and receive personalized wellness guidance
            </p>
          </div>

          <InteractiveVibePartner
            points={rewardSystem.points}
            level={rewardSystem.level}
            name={partnerName}
            mood={currentMood}
            type={partnerType}
            onCustomize={() => {
              setPartnerName(localStorage.getItem('vibePartnerName') || 'Vibe Buddy');
              setPartnerType((localStorage.getItem('vibePartnerType') as 'cat' | 'dog' | 'panda') || 'cat');
            }}
          />

          {/* Help text */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              💡 Your Vibe Partner uses AI to provide empathetic support and CBT-based guidance
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div>✨ Trained in CBT techniques</div>
              <div>🤗 Non-judgmental listening</div>
              <div>🎯 Personalized suggestions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibePartnerChat;
