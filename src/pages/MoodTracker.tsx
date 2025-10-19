import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/components/MoodSelector";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

interface MoodEntry {
  mood: number;
  reasons?: string[];
  note: string;
  timestamp: string;
}

const moodEmojis: { [key: number]: string } = {
  5: "😊",
  4: "🙂",
  3: "😐",
  2: "😔",
  1: "😢",
};

const MoodTracker = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const loadEntries = () => {
      const savedEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
      setEntries(savedEntries);
    };

    loadEntries();
    
    // Refresh entries every second to catch updates
    const interval = setInterval(loadEntries, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-forest">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-card/75 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Mood Tracker</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <p className="text-lg text-muted-foreground animate-fade-in">
            Track your emotional journey and patterns
          </p>
        </div>

        <MoodSelector />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Entries</h2>
          <div className="space-y-3">
            {entries.length === 0 ? (
              <Card className="p-8 text-center bg-card/75 backdrop-blur-sm">
                <p className="text-muted-foreground">No mood entries yet. Start tracking!</p>
              </Card>
            ) : (
              entries.map((entry, index) => (
                <Card
                  key={index}
                  className="p-4 animate-fade-in hover-scale bg-card/75 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{moodEmojis[entry.mood]}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {format(new Date(entry.timestamp), "MMM d, yyyy")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(entry.timestamp), "h:mm a")}
                        </span>
                      </div>
                      {entry.reasons && entry.reasons.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {entry.reasons.map((reason, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {entry.note && (
                        <p className="text-sm text-muted-foreground">{entry.note}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
