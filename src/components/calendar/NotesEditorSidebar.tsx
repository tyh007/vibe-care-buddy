import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  category: string;
  notes?: string;
}

interface NotesEditorSidebarProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventId: string, notes: string) => void;
}

export const NotesEditorSidebar = ({
  event,
  isOpen,
  onClose,
  onSave,
}: NotesEditorSidebarProps) => {
  const [notes, setNotes] = useState("");
  
  useEffect(() => {
    if (event) {
      setNotes(event.notes || "");
    }
  }, [event]);
  
  const handleSave = () => {
    if (event) {
      onSave(event.id, notes);
      onClose();
    }
  };
  
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-card border-l border-border shadow-xl z-50 animate-slide-in-right overflow-y-auto">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {event.start} - {event.end}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Notes editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Notes for this event
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes, reminders, or reflections about this event..."
            className="min-h-[300px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Notes are private and help you track your progress and feelings about each activity.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Notes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        {/* Tips */}
        <Card className="p-4 bg-muted/50">
          <h4 className="font-medium text-sm mb-2">💡 Note-taking tips:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Record how you felt during the event</li>
            <li>• Note what went well or what was challenging</li>
            <li>• Track patterns in your mood and productivity</li>
            <li>• Set reminders for follow-up actions</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
