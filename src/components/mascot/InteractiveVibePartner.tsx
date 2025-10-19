import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Star, Heart, Settings, Mic, MicOff, Volume2 } from "lucide-react";
import { VibePartnerDialog } from "./VibePartnerDialog";
import { useConversation } from "@11labs/react";

interface InteractiveVibePartnerProps {
  points: number;
  level: number;
  name: string;
  mood?: number;
  type?: 'cat' | 'dog' | 'panda';
  onCustomize: () => void;
}

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1700];

const MASCOT_TYPES = {
  cat: {
    happy: "😺",
    excited: "😸",
    loving: "😻",
    calm: "😽",
    comforting: "😿",
    default: "😺",
    voice: "meow"
  },
  dog: {
    happy: "🐕",
    excited: "🐶",
    loving: "🐕‍🦺",
    calm: "🐕",
    comforting: "🐶",
    default: "🐶",
    voice: "woof"
  },
  panda: {
    happy: "🐼",
    excited: "🐼✨",
    loving: "🐼💝",
    calm: "🐼😌",
    comforting: "🐼🤗",
    default: "🐼",
    voice: "bamboo"
  }
};

const getMascotExpression = (mood?: number, type: 'cat' | 'dog' | 'panda' = 'cat', isSpeaking?: boolean) => {
  const mascot = MASCOT_TYPES[type];
  
  if (isSpeaking) return mascot.excited;
  if (!mood) return mascot.default;
  if (mood === 1) return mascot.comforting;
  if (mood === 2) return mascot.calm;
  if (mood === 3) return mascot.happy;
  if (mood === 4) return mascot.loving;
  if (mood === 5) return mascot.excited;
  return mascot.default;
};

const getGreeting = (type: 'cat' | 'dog' | 'panda', name: string) => {
  const greetings = {
    cat: `*purr* Hi! I'm ${name}! Let's chat about how you're feeling today~ 💙`,
    dog: `*wag wag* Hey there! I'm ${name}! I'm so excited to support you today! 💙`,
    panda: `*munch munch* Hello! I'm ${name}! Let's talk and grow together! 💙`
  };
  return greetings[type];
};

export const InteractiveVibePartner = ({ 
  points, 
  level, 
  name, 
  mood, 
  type = 'cat', 
  onCustomize 
}: InteractiveVibePartnerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to voice conversation");
    },
    onDisconnect: () => {
      console.log("Disconnected from voice conversation");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
    }
  });
  
  const currentThreshold = LEVEL_THRESHOLDS[level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level + 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progressInLevel = points - currentThreshold;
  const pointsNeededForNext = nextThreshold - currentThreshold;
  const progressPercent = (progressInLevel / pointsNeededForNext) * 100;
  
  const expression = getMascotExpression(mood, type, conversation.isSpeaking);
  const greeting = getGreeting(type, name);
  const isConnected = conversation.status === "connected";

  const handleStartConversation = async () => {
    try {
      setIsConnecting(true);
      
      // Get API key from localStorage
      const apiKey = localStorage.getItem('elevenlabs_api_key');
      if (!apiKey) {
        alert('Please add your ElevenLabs API key first! Go to Settings to add it.');
        setIsConnecting(false);
        return;
      }

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // TODO: Replace with your ElevenLabs agent ID
      const agentId = "your-agent-id-here";
      
      // Generate signed URL (in production, this should be done server-side)
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        {
          method: "GET",
          headers: {
            "xi-api-key": apiKey,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get conversation URL');
      }

      const data = await response.json();
      await conversation.startSession({ 
        signedUrl: data.signed_url,
        overrides: {
          agent: {
            prompt: {
              prompt: `You are ${name}, a caring ${type} companion helping a college student with their mental wellness. You understand CBT principles and provide warm, supportive guidance. Keep responses brief and conversational.`
            },
            firstMessage: greeting,
          }
        }
      });
      
      setIsConnecting(false);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please check your API key and try again.');
      setIsConnecting(false);
    }
  };

  const handleEndConversation = async () => {
    await conversation.endSession();
  };

  return (
    <>
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 border-primary/20 shadow-xl">
        {/* Celebration effect */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 animate-fade-in z-10">
            <div className="text-center space-y-2">
              <div className="text-6xl animate-scale-in">🎉</div>
              <p className="font-bold text-2xl text-primary">Level Up!</p>
            </div>
          </div>
        )}

        <div className="p-8 space-y-6">
          {/* Header with settings */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-6 h-6 text-primary" />
                <h2 className="font-bold text-2xl text-foreground">Your Vibe Partner</h2>
              </div>
              <p className="text-lg text-muted-foreground">{name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(true)}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Large mascot display */}
          <div className="flex flex-col items-center py-8">
            <div className="relative mb-6">
              {/* Main mascot with animations */}
              <div className="relative">
                <div className={`text-9xl transition-all duration-300 ${
                  conversation.isSpeaking ? 'animate-pulse scale-110' : 'animate-bounce-slow'
                }`}>
                  {expression}
                </div>
                
                {/* Speaking indicator */}
                {conversation.isSpeaking && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                
                {/* Level badge */}
                <div className="absolute -top-4 -right-4">
                  <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4" />
                    <span>Lv {level}</span>
                  </div>
                </div>
                
                {/* Sparkle effects */}
                {level >= 3 && (
                  <>
                    <div className="absolute -top-6 -left-6 text-3xl animate-pulse">✨</div>
                    <div className="absolute -bottom-6 -right-6 text-3xl animate-pulse delay-75">💫</div>
                  </>
                )}
              </div>
            </div>
            
            {/* Message bubble */}
            <div className="relative bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 rounded-3xl p-6 max-w-md shadow-lg">
              <p className="text-center leading-relaxed font-medium text-foreground">
                {greeting}
              </p>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-12 border-r-12 border-t-12 border-l-transparent border-r-transparent border-t-card drop-shadow-md" />
            </div>
          </div>

          {/* Voice controls */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-4">
              {!isConnected ? (
                <Button
                  size="lg"
                  onClick={handleStartConversation}
                  disabled={isConnecting}
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <Mic className="w-6 h-6 mr-3" />
                  {isConnecting ? 'Connecting...' : 'Start Talking'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleEndConversation}
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <MicOff className="w-6 h-6 mr-3" />
                  End Conversation
                </Button>
              )}
            </div>
            
            {isConnected && (
              <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                <span>Listening... speak naturally!</span>
              </div>
            )}
          </div>

          {/* Energy Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Vibe Energy
              </span>
              <span className="font-bold text-foreground">
                {progressInLevel} / {pointsNeededForNext}
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{points} total points</span>
              {level < LEVEL_THRESHOLDS.length - 1 && (
                <span className="text-primary font-semibold">
                  {pointsNeededForNext - progressInLevel} to next level
                </span>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-xs text-muted-foreground font-medium">Level {level}</div>
            </div>
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 border border-secondary/20 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-xs text-muted-foreground font-medium">{points} pts</div>
            </div>
            <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-4 border border-success/20 text-center">
              <div className="text-3xl mb-2">{type === 'cat' ? '🐱' : type === 'dog' ? '🐶' : '🐼'}</div>
              <div className="text-xs text-muted-foreground font-medium">
                {type === 'cat' ? 'Purr-fect' : type === 'dog' ? 'Paw-some' : 'Bam-amazing'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <VibePartnerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentName={name}
        currentType={type}
        level={level}
        points={points}
        onCustomize={onCustomize}
      />
    </>
  );
};
