import { StatsCards } from "@/components/StatsCards";
import { MoodSelector } from "@/components/MoodSelector";
import { MoodChart } from "@/components/MoodChart";
import { PatternsAnalysis } from "@/components/PatternsAnalysis";
import { DataControls } from "@/components/DataControls";
import { LocationChart } from "@/components/LocationChart";
import { MoodMap } from "@/components/MoodMap";
import { PixelAvatar } from "@/components/PixelAvatar";
import heroBackground from "@/assets/hero-background.jpg";
import { useEffect, useState } from "react";
import { initializeMockData } from "@/utils/mockData";

const Dashboard = () => {
  const [locationData, setLocationData] = useState<any[]>([]);
  const [mapLocationData, setMapLocationData] = useState<any[]>([]);

  useEffect(() => {
    initializeMockData();

    // Calculate location statistics
    const moodEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const screenTimeEntries = JSON.parse(localStorage.getItem("screenTimeEntries") || "[]");

    const locationStats = new Map();
    
    // Aggregate mood data by location
    moodEntries.forEach((entry: any) => {
      if (entry.location) {
        if (!locationStats.has(entry.location)) {
          locationStats.set(entry.location, { moods: [], screenTimes: [], count: 0 });
        }
        locationStats.get(entry.location).moods.push(entry.mood);
        locationStats.get(entry.location).count++;
      }
    });

    // Aggregate screen time by location
    screenTimeEntries.forEach((entry: any) => {
      if (entry.location && locationStats.has(entry.location)) {
        locationStats.get(entry.location).screenTimes.push(entry.totalMinutes);
      }
    });

    // Mock coordinates for locations (San Francisco area)
    const locationCoordinates: Record<string, [number, number]> = {
      home: [-122.4194, 37.7749],
      work: [-122.4000, 37.7849],
      gym: [-122.4100, 37.7700],
      school: [-122.3950, 37.7650],
      cafe_a: [-122.4250, 37.7800],
      cafe_b: [-122.4150, 37.7750],
      cafe_c: [-122.4050, 37.7820],
      park: [-122.4300, 37.7700],
      library: [-122.4080, 37.7780],
    };

    // Calculate averages for chart
    const chartData = Array.from(locationStats.entries()).map(([location, stats]: [string, any]) => {
      const avgMood = stats.moods.length > 0 
        ? stats.moods.reduce((a: number, b: number) => a + b, 0) / stats.moods.length 
        : 0;
      const avgScreenTime = stats.screenTimes.length > 0
        ? stats.screenTimes.reduce((a: number, b: number) => a + b, 0) / stats.screenTimes.length / 60
        : 0;
      
      const timeSpent = stats.count * 2;
      
      return {
        location,
        timeSpent: Math.round(timeSpent),
        avgMood: Number(avgMood.toFixed(1)),
        avgScreenTime: Number(avgScreenTime.toFixed(1)),
      };
    });

    // Calculate data for map
    const mapData = Array.from(locationStats.entries())
      .filter(([location]) => locationCoordinates[location])
      .map(([location, stats]: [string, any]) => {
        const avgMood = stats.moods.length > 0 
          ? stats.moods.reduce((a: number, b: number) => a + b, 0) / stats.moods.length 
          : 0;
        
        return {
          name: location.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          coordinates: locationCoordinates[location],
          avgMood: Number(avgMood.toFixed(1)),
          visits: stats.count,
        };
      });

    setLocationData(chartData);
    setMapLocationData(mapData);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in">
            How are you feeling today?
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        <DataControls />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PixelAvatar size="medium" />
          </div>
          <div className="lg:col-span-2">
            <StatsCards />
          </div>
        </div>

        <PatternsAnalysis />

        {mapLocationData.length > 0 && <MoodMap locationData={mapLocationData} />}

        {locationData.length > 0 && <LocationChart data={locationData} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoodSelector />
          <MoodChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
