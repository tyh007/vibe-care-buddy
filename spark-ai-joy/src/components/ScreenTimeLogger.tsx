import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Plus, X } from "lucide-react";

interface AppUsage {
  app: string;
  minutes: string;
}

export const ScreenTimeLogger = () => {
  const [apps, setApps] = useState<AppUsage[]>([{ app: "", minutes: "" }]);
  const { toast } = useToast();

  const addApp = () => {
    setApps([...apps, { app: "", minutes: "" }]);
  };

  const removeApp = (index: number) => {
    setApps(apps.filter((_, i) => i !== index));
  };

  const updateApp = (index: number, field: keyof AppUsage, value: string) => {
    const newApps = [...apps];
    newApps[index][field] = value;
    setApps(newApps);
  };

  const handleSave = () => {
    const validApps = apps.filter((app) => app.app && app.minutes);
    
    if (validApps.length === 0) {
      toast({
        title: "Please add at least one app",
        variant: "destructive",
      });
      return;
    }

    const entry = {
      apps: validApps,
      totalMinutes: validApps.reduce((sum, app) => sum + Number(app.minutes), 0),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
    };

    const existingEntries = JSON.parse(localStorage.getItem("screenTimeEntries") || "[]");
    localStorage.setItem("screenTimeEntries", JSON.stringify([entry, ...existingEntries]));

    toast({
      title: "Screen time saved!",
      description: `${validApps.length} app(s) logged for today.`,
    });

    setApps([{ app: "", minutes: "" }]);
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Smartphone className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold">Today's Screen Time</h3>
      </div>

      <div className="space-y-4 mb-4">
        {apps.map((app, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label>App Name</Label>
              <Input
                placeholder="Instagram, Twitter, etc."
                value={app.app}
                onChange={(e) => updateApp(index, "app", e.target.value)}
              />
            </div>
            <div className="w-32 space-y-2">
              <Label>Minutes</Label>
              <Input
                type="number"
                placeholder="30"
                value={app.minutes}
                onChange={(e) => updateApp(index, "minutes", e.target.value)}
                min="0"
              />
            </div>
            {apps.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeApp(index)}
                className="self-end"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addApp} className="w-full mb-4">
        <Plus className="w-4 h-4 mr-2" />
        Add Another App
      </Button>

      <Button onClick={handleSave} className="w-full">
        Save Screen Time
      </Button>
    </Card>
  );
};
