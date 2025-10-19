import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Heart, Plus, Settings, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement actual logout
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-foreground">VibeCare</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground">Here's your wellness dashboard for today</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Quick Stats & Mood */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Mood Check-In */}
            <Card className="p-6 space-y-4 bg-card shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-card-foreground">Quick Mood Check</h3>
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              
              <div className="flex justify-between gap-2">
                {['😊', '🙂', '😐', '😕', '😢'].map((emoji, idx) => (
                  <button
                    key={idx}
                    className="w-12 h-12 rounded-full bg-muted hover:bg-primary/10 hover:scale-110 transition-all text-2xl flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground text-center">How are you feeling right now?</p>
            </Card>

            {/* Today's Suggestions */}
            <Card className="p-6 space-y-4 bg-card shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-card-foreground">Suggested for You</h3>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm font-medium text-foreground">5-min breathing exercise</p>
                  <p className="text-xs text-muted-foreground mt-1">Free at 2:30 PM</p>
                </div>
                
                <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                  <p className="text-sm font-medium text-foreground">Take a short walk</p>
                  <p className="text-xs text-muted-foreground mt-1">Free at 4:00 PM</p>
                </div>
                
                <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                  <p className="text-sm font-medium text-foreground">Review class notes</p>
                  <p className="text-xs text-muted-foreground mt-1">Free at 6:00 PM</p>
                </div>
              </div>
            </Card>

            {/* Mood Timeline Preview */}
            <Card className="p-6 space-y-4 bg-card shadow-soft">
              <h3 className="font-semibold text-lg text-card-foreground">This Week's Mood</h3>
              
              <div className="h-32 flex items-end justify-between gap-2">
                {[60, 75, 55, 80, 70, 85, 90].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-primary rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                    </span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                Trending upward! 📈
              </p>
            </Card>
          </div>

          {/* Right Column: Calendar View */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-card-foreground">Today's Schedule</h2>
                </div>
                <Button variant="hero" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>

              {/* Calendar Placeholder */}
              <div className="space-y-4">
                {/* Time slot 1 */}
                <div className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">9:00</p>
                    <p className="text-xs text-muted-foreground">AM</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <p className="font-medium text-foreground">Introduction to Psychology</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Room 204 • 1 hour</p>
                    <p className="text-sm text-muted-foreground italic">Notes: Review chapters 3-4</p>
                  </div>
                </div>

                {/* Time slot 2 */}
                <div className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">11:00</p>
                    <p className="text-xs text-muted-foreground">AM</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary" />
                      <p className="font-medium text-foreground">Study Group - Statistics</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Library • 2 hours</p>
                    <p className="text-sm text-muted-foreground italic">Notes: Bring practice problems</p>
                  </div>
                </div>

                {/* Free time slot */}
                <div className="flex gap-4 p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">2:00</p>
                    <p className="text-xs text-muted-foreground">PM</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-success" />
                      <p className="font-medium text-success">Free Time</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Perfect for a wellness activity!</p>
                  </div>
                </div>

                {/* Time slot 3 */}
                <div className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">3:30</p>
                    <p className="text-xs text-muted-foreground">PM</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      <p className="font-medium text-foreground">Computer Science Lab</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Tech Building • 1.5 hours</p>
                  </div>
                </div>
              </div>

              {/* View Controls */}
              <div className="mt-6 flex gap-2 justify-center">
                <Button variant="outline" size="sm">Day</Button>
                <Button variant="outline" size="sm">Week</Button>
                <Button variant="outline" size="sm">Month</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
