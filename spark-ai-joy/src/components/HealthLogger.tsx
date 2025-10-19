import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, Moon, Dumbbell, Droplets, Coffee, Utensils } from "lucide-react";

export const HealthLogger = () => {
  const [healthData, setHealthData] = useState({
    sleep: "",
    exercise: "",
    water: "",
    caffeine: "",
    meals: "",
  });
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setHealthData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const entry = {
      ...healthData,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
    };

    const existingEntries = JSON.parse(localStorage.getItem("healthEntries") || "[]");
    localStorage.setItem("healthEntries", JSON.stringify([entry, ...existingEntries]));

    toast({
      title: "Health data saved!",
      description: "Your daily health metrics have been recorded.",
    });

    setHealthData({
      sleep: "",
      exercise: "",
      water: "",
      caffeine: "",
      meals: "",
    });
  };

  const metrics = [
    { icon: Moon, label: "Sleep (hours)", field: "sleep", placeholder: "7.5" },
    { icon: Dumbbell, label: "Exercise (minutes)", field: "exercise", placeholder: "30" },
    { icon: Droplets, label: "Water (glasses)", field: "water", placeholder: "8" },
    { icon: Coffee, label: "Caffeine (cups)", field: "caffeine", placeholder: "2" },
    { icon: Utensils, label: "Meals eaten", field: "meals", placeholder: "3" },
  ];

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold">Today's Health Metrics</h3>
      </div>

      <div className="space-y-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.field} className="space-y-2">
            <Label className="flex items-center gap-2">
              <metric.icon className="w-4 h-4 text-muted-foreground" />
              {metric.label}
            </Label>
            <Input
              type="number"
              placeholder={metric.placeholder}
              value={healthData[metric.field as keyof typeof healthData]}
              onChange={(e) => handleChange(metric.field, e.target.value)}
              step="0.5"
              min="0"
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Health Data
      </Button>
    </Card>
  );
};
