import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Heart, Plus, Settings, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MoodTimeline } from "@/components/MoodTimeline";
import { AddEventDialog } from "@/components/AddEventDialog";
import { format, subDays } from "date-fns";

interface MoodEntry {
  date: string;
  mood: number;
  events: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  category: string;
  notes?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  
  // Sample mood data with dates and events (last 7 days)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([
    { date: format(subDays(new Date(), 6), 'yyyy-MM-dd'), mood: 3, events: ['CS101 Lecture', 'Study Group'] },
    { date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), mood: 4, events: ['Gym', 'Coffee with friends'] },
    { date: format(subDays(new Date(), 4), 'yyyy-MM-dd'), mood: 3, events: ['Statistics Exam', 'Library Session'] },
    { date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), mood: 4, events: ['CS Lab', 'Meditation'] },
    { date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), mood: 4, events: ['Group Project', 'Yoga Class'] },
    { date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), mood: 5, events: ['Volunteer Work', 'Movie Night'] },
    { date: format(new Date(), 'yyyy-MM-dd'), mood: 5, events: ['Morning Walk', 'Productive Study Session'] },
  ]);

  // Calendar events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Introduction to Psychology',
      start: '09:00',
      end: '10:00',
      category: 'class',
      notes: 'Review chapters 3-4'
    },
    {
      id: '2',
      title: 'Study Group - Statistics',
      start: '11:00',
      end: '13:00',
      category: 'study',
      notes: 'Bring practice problems'
    },
    {
      id: '3',
      title: 'Computer Science Lab',
      start: '15:30',
      end: '17:00',
      category: 'class',
    }
  ]);

  const handleLogout = () => {
    // TODO: Implement actual logout
    navigate('/');
  };

  const handleMoodSelect = (moodIndex: number) => {
    setSelectedMood(moodIndex);
    const mood = moodIndex + 1; // Convert 0-4 index to 1-5 scale
    
    // Get today's events from the schedule (simplified - in real app would come from calendar)
    const todayEvents = ['Morning Walk', 'Productive Study Session'];
    
    // Update mood history - replace today's entry or add new one
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEntry: MoodEntry = { date: today, mood, events: todayEvents };
    
    setMoodHistory(prev => {
      const existingIndex = prev.findIndex(entry => entry.date === today);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated;
      }
      return [...prev.slice(1), newEntry];
    });
    
    // Show feedback toast
    const moodLabels = ['struggling today', 'not feeling great', 'doing okay', 'feeling good', 'feeling great'];
    const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
    
    toast({
      title: `Mood recorded ${moodEmojis[moodIndex]}`,
      description: `Thanks for checking in! You're ${moodLabels[moodIndex]}.`,
    });

    // TODO: Save to database when backend is connected
  };

  const handleAddEvent = () => {
    setIsAddEventOpen(true);
  };

  const handleEventCreate = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
    };
    
    setEvents([...events, event]);
    
    toast({
      title: "Event Added! 🎉",
      description: `${event.title} has been added to your schedule.`,
    });
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
                    onClick={() => handleMoodSelect(idx)}
                    className={`w-12 h-12 rounded-full transition-all text-2xl flex items-center justify-center ${
                      selectedMood === idx 
                        ? 'bg-primary text-primary-foreground shadow-medium scale-110' 
                        : 'bg-muted hover:bg-primary/10 hover:scale-110'
                    }`}
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

            {/* Interactive Mood Timeline */}
            <MoodTimeline data={moodHistory} />
          </div>

          {/* Right Column: Calendar View */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-card-foreground">Today's Schedule</h2>
                </div>
                <Button variant="hero" size="sm" onClick={handleAddEvent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>

              {/* Calendar Events */}
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No events scheduled yet.</p>
                    <p className="text-sm">Click "Add Event" to get started!</p>
                  </div>
                ) : (
                  events.map((event) => {
                    const categoryColors: Record<string, string> = {
                      class: 'bg-primary',
                      study: 'bg-secondary',
                      wellness: 'bg-success',
                      social: 'bg-accent',
                      other: 'bg-muted-foreground',
                    };

                    return (
                      <div
                        key={event.id}
                        className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="text-center min-w-[60px]">
                          <p className="text-sm font-semibold text-foreground">{event.start}</p>
                          <p className="text-xs text-muted-foreground">to</p>
                          <p className="text-sm font-semibold text-foreground">{event.end}</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${categoryColors[event.category]}`} />
                            <p className="font-medium text-foreground">{event.title}</p>
                          </div>
                          {event.notes && (
                            <p className="text-sm text-muted-foreground italic">Notes: {event.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
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

      {/* Add Event Dialog */}
      <AddEventDialog
        open={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        onAddEvent={handleEventCreate}
      />
    </div>
  );
};

export default Dashboard;
