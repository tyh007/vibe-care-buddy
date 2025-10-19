import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Heart, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MoodTimeline } from "@/components/MoodTimeline";
import { AddEventDialog } from "@/components/AddEventDialog";
import { SuggestionEngine } from "@/components/SuggestionEngine";
import { CalendarDropZone } from "@/components/CalendarDropZone";
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
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');
  
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
    
    setEvents([...events, event].sort((a, b) => a.start.localeCompare(b.start)));
    
    toast({
      title: "Event Added! 🎉",
      description: `${event.title} has been added to your schedule.`,
    });
  };

  const handleAcceptSuggestion = (suggestion: any) => {
    // Find the next available free slot
    const sortedEvents = [...events].sort((a, b) => a.start.localeCompare(b.start));
    let suggestedStart = "14:00"; // Default afternoon slot
    
    // Try to find a gap after study sessions
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];
      
      if (current.category === 'study' || current.category === 'class') {
        const [endHour, endMin] = current.end.split(':').map(Number);
        const [nextHour, nextMin] = next.start.split(':').map(Number);
        const gapMinutes = (nextHour * 60 + nextMin) - (endHour * 60 + endMin);
        
        if (gapMinutes >= suggestion.duration) {
          suggestedStart = current.end;
          break;
        }
      }
    }
    
    const [startHour, startMin] = suggestedStart.split(':').map(Number);
    const endMinutes = startHour * 60 + startMin + suggestion.duration;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    const suggestedEnd = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: suggestion.title,
      start: suggestedStart,
      end: suggestedEnd,
      category: 'wellness',
      notes: suggestion.description,
    };
    
    setEvents([...events, newEvent].sort((a, b) => a.start.localeCompare(b.start)));
    
    toast({
      title: "Wellness Activity Scheduled! 🌟",
      description: `${suggestion.title} added at ${suggestedStart}`,
    });
  };

  const handleDropSuggestion = (suggestionData: any, slotStart: string) => {
    // This would be called when dragging a suggestion to a specific time slot
    toast({
      title: "Drop to Schedule",
      description: "Drag and drop feature - click 'Quick Add' to schedule instantly!",
    });
  };

  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setCalendarView(view);
    const viewMessages = {
      day: "Showing today's schedule",
      week: "Week view - Full weekly calendar coming soon!",
      month: "Month view - Full monthly calendar coming soon!"
    };
    
    toast({
      title: `${view.charAt(0).toUpperCase() + view.slice(1)} View`,
      description: viewMessages[view],
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
          {/* Left Column: Mood Check & Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Mood Check-In */}
            <Card className="p-6 space-y-4 bg-card shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-card-foreground">Quick Mood Check</h3>
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              
              <div className="flex justify-between gap-2">
                {['😢', '😕', '😐', '🙂', '😊'].map((emoji, idx) => (
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

            {/* Smart Suggestion Engine */}
            <SuggestionEngine 
              events={events}
              onAcceptSuggestion={handleAcceptSuggestion}
            />

            {/* Interactive Mood Timeline */}
            <MoodTimeline data={moodHistory} />
          </div>

          {/* Right Column: Calendar with Drop Zones */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-end mb-4">
              <Button variant="hero" size="sm" onClick={handleAddEvent}>
                <Calendar className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
            
            <CalendarDropZone 
              events={events}
              onDropSuggestion={handleDropSuggestion}
            />

            {/* View Controls */}
            <div className="flex gap-2 justify-center">
              <Button 
                variant={calendarView === 'day' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleViewChange('day')}
              >
                Day
              </Button>
              <Button 
                variant={calendarView === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleViewChange('week')}
              >
                Week
              </Button>
              <Button 
                variant={calendarView === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleViewChange('month')}
              >
                Month
              </Button>
            </div>
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
