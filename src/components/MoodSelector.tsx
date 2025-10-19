import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const moods = [
  { 
    emoji: "😊", 
    label: "Great", 
    value: 5, 
    color: "bg-green-500",
    prompts: [
      "I accomplished something today",
      "I spent time with loved ones",
      "I took care of myself",
      "Something positive happened",
      "I feel energized and motivated"
    ]
  },
  { 
    emoji: "🙂", 
    label: "Good", 
    value: 4, 
    color: "bg-green-400",
    prompts: [
      "Things are going well",
      "I had a productive day",
      "I'm feeling content",
      "I made progress on my goals",
      "I had pleasant interactions"
    ]
  },
  { 
    emoji: "😐", 
    label: "Okay", 
    value: 3, 
    color: "bg-yellow-400",
    prompts: [
      "It's just another day",
      "Nothing special happened",
      "Feeling neutral about things",
      "Some ups and downs",
      "Just going through the motions"
    ]
  },
  { 
    emoji: "😔", 
    label: "Down", 
    value: 2, 
    color: "bg-orange-400",
    prompts: [
      "Feeling a bit overwhelmed",
      "Something didn't go as planned",
      "I'm tired or stressed",
      "Missing someone or something",
      "Feeling uncertain about things"
    ]
  },
  { 
    emoji: "😢", 
    label: "Sad", 
    value: 1, 
    color: "bg-red-400",
    prompts: [
      "I'm going through a difficult time",
      "Feeling lonely or isolated",
      "Something painful happened",
      "I'm worried about something",
      "Struggling with negative thoughts"
    ]
  },
];

export const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const selectedMoodData = moods.find(m => m.value === selectedMood);

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSave = async () => {
    if (selectedMood === null) {
      toast({
        title: "Please select a mood",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save to localStorage for demo compatibility
      const moodEntry = {
        mood: selectedMood,
        reasons: selectedReasons,
        note,
        timestamp: new Date().toISOString(),
      };

      const existingEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
      localStorage.setItem("moodEntries", JSON.stringify([moodEntry, ...existingEntries]));

      // Award coins if user is logged in
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("coins, last_check_in, current_streak, longest_streak, total_check_ins")
          .eq("id", user.id)
          .single();

        if (profile) {
          const today = new Date().toDateString();
          const lastCheckIn = profile.last_check_in ? new Date(profile.last_check_in).toDateString() : null;
          
          let coinsEarned = 10; // Base reward
          let newStreak = profile.current_streak || 0;
          
          // Check if this is a new day
          if (lastCheckIn !== today) {
            // Update streak
            if (lastCheckIn === new Date(Date.now() - 86400000).toDateString()) {
              newStreak += 1;
            } else if (lastCheckIn !== null) {
              newStreak = 1;
            } else {
              newStreak = 1;
            }
            
            // Bonus coins for streak
            coinsEarned += Math.floor(newStreak / 7) * 5;

            await supabase
              .from("profiles")
              .update({
                coins: (profile.coins || 0) + coinsEarned,
                last_check_in: new Date().toISOString().split('T')[0],
                current_streak: newStreak,
                longest_streak: Math.max(newStreak, profile.longest_streak || 0),
                total_check_ins: (profile.total_check_ins || 0) + 1
              })
              .eq("id", user.id);

            toast({
              title: "Mood saved! 🎉",
              description: `You earned ${coinsEarned} coins! Streak: ${newStreak} days`,
            });
          } else {
            toast({
              title: "Mood updated!",
              description: "You've already checked in today.",
            });
          }
        }
      } else {
        toast({
          title: "Mood saved!",
          description: "Your mood has been recorded.",
        });
      }

      setSelectedMood(null);
      setSelectedReasons([]);
      setNote("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">How are you feeling?</h3>
      
      <div className="grid grid-cols-5 gap-3 mb-6">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
              ${
                selectedMood === mood.value
                  ? "border-primary bg-primary/10 scale-110"
                  : "border-border hover:border-primary/50 hover:scale-105"
              }
            `}
          >
            <span className="text-4xl">{mood.emoji}</span>
            <span className="text-sm font-medium">{mood.label}</span>
          </button>
        ))}
      </div>

      {selectedMoodData && (
        <div className="mb-6 animate-fade-in">
          <h4 className="font-medium mb-3">Why are you feeling {selectedMoodData.label.toLowerCase()}?</h4>
          <div className="flex flex-wrap gap-2">
            {selectedMoodData.prompts.map((prompt) => (
              <Badge
                key={prompt}
                variant={selectedReasons.includes(prompt) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleReason(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Textarea
        placeholder="Add any additional notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mb-4 min-h-[100px]"
      />

      <Button onClick={handleSave} className="w-full">
        Save Mood Entry
      </Button>
    </Card>
  );
};
