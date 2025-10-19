import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Heart, Settings, LogOut, CalendarDays, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MoodTimeline } from "@/components/MoodTimeline";
import { AddEventDialog } from "@/components/AddEventDialog";
import { SuggestionEngine } from "@/components/SuggestionEngine";
import { CalendarWeekView } from "@/components/calendar/CalendarWeekView";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { NotesEditorSidebar } from "@/components/calendar/NotesEditorSidebar";
import { VibePartner } from "@/components/mascot/VibePartner";
import { useRewardSystem } from "@/hooks/useRewardSystem";
import { format, subDays, parseISO } from "date-fns";

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
  date: string; // YYYY-MM-DD format
  category: string;
  notes?: string;
  color?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  
  // Reward system
  const rewardSystem = useRewardSystem();
  const [partnerName, setPartnerName] = useState(() => 
    localStorage.getItem('vibePartnerName') || 'Vibe Buddy'
  );
  
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

  // Calendar events with ISO timestamps for week view
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Introduction to Psychology',
      start: '09:00',
      end: '10:00',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'class',
      notes: 'Review chapters 3-4',
      color: '#8b5cf6'
    },
    {
      id: '2',
      title: 'Study Group - Statistics',
      start: '11:00',
      end: '13:00',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'study',
      notes: 'Bring practice problems',
      color: '#ec4899'
    },
    {
      id: '3',
      title: 'Computer Science Lab',
      start: '15:30',
      end: '17:00',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'class',
      color: '#8b5cf6'
    },
    {
      id: '4',
      title: 'Yoga Class',
      start: '18:00',
      end: '19:00',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'wellness',
      notes: 'Bring yoga mat',
      color: '#10b981'
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
    
    // Award points for mood check-in
    rewardSystem.rewardMoodCheckIn();
  };

  const handleAddEvent = () => {
    setIsAddEventOpen(true);
  };

  const handleEventCreate = (newEvent: Omit<CalendarEvent, 'id'> & { date?: Date }) => {
    const eventDate = newEvent.date || new Date();
    
    const event: CalendarEvent = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      date: format(eventDate, 'yyyy-MM-dd'),
      category: newEvent.category,
      notes: newEvent.notes,
      color: newEvent.color,
      id: Date.now().toString(),
    };
    
    setEvents([...events, event].sort((a, b) => {
      // Sort by date first, then by time
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.start.localeCompare(b.start);
    }));
    
    // Award points for event creation
    rewardSystem.rewardEventCreation();
  };

  const handleEventUpdate = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, ...updates } : e
    ));
    
    toast({
      title: "Event Updated! ✏️",
      description: "Your changes have been saved.",
    });
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    
    toast({
      title: "Event Deleted! 🗑️",
      description: "The event has been removed from your calendar.",
    });
  };

  const handleAcceptSuggestion = (suggestion: any) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Find the next available free slot
    const todayEvents = events.filter(e => e.date === today);
    const sortedEvents = todayEvents.sort((a, b) => a.start.localeCompare(b.start));
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
      date: today,
      category: 'wellness',
      notes: suggestion.description,
    };
    
    setEvents([...events, newEvent].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.start.localeCompare(b.start);
    }));
    
    // Award points for completing activity
    rewardSystem.rewardActivityCompletion();
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
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsNotesOpen(true);
  };
  
  const handleTimeSlotClick = (date: Date, time: string) => {
    // Open add event dialog with pre-filled time
    setIsAddEventOpen(true);
  };
  
  const handleDateClick = (date: Date) => {
    setCalendarDate(date);
    setCalendarView('week');
  };
  
  const handleSaveNotes = (eventId: string, notes: string) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, notes } : e
    ));
    
    // Award points for taking notes
    rewardSystem.rewardNotesTaken();
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
          {/* Left Column: Mood Check, Vibe Partner & Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vibe Partner */}
            <VibePartner
              points={rewardSystem.points}
              level={rewardSystem.level}
              name={partnerName}
              mood={moodHistory[moodHistory.length - 1]?.mood}
              onCustomize={() => setPartnerName(localStorage.getItem('vibePartnerName') || 'Vibe Buddy')}
            />

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

          {/* Right Column: Calendar Views */}
          <div className="lg:col-span-2 space-y-6">
            {/* View controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={calendarView === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('week')}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Week
                </Button>
                <Button
                  variant={calendarView === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('month')}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Month
                </Button>
              </div>
              <Button variant="hero" size="sm" onClick={handleAddEvent}>
                <Calendar className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>

            {/* Calendar view */}
            {calendarView === 'week' ? (
              <CalendarWeekView
                events={events}
                moods={moodHistory}
                currentDate={calendarDate}
                onDateChange={setCalendarDate}
                onEventClick={handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            ) : (
              <CalendarMonthView
                events={events}
                moods={moodHistory}
                currentDate={calendarDate}
                onDateChange={setCalendarDate}
                onDateClick={handleDateClick}
              />
            )}

            {/* Course legend */}
            <Card className="p-4 bg-card/50">
              <h4 className="font-semibold text-sm mb-3">Course Legend</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8b5cf6' }} />
                  <span>Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ec4899' }} />
                  <span>Study</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }} />
                  <span>Wellness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
                  <span>Social</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Notes Editor Sidebar */}
      <NotesEditorSidebar
        event={selectedEvent}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        onSave={handleSaveNotes}
        onUpdate={handleEventUpdate}
        onDelete={handleEventDelete}
      />

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
