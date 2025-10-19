import { HealthLogger } from "@/components/HealthLogger";
import { ScreenTimeLogger } from "@/components/ScreenTimeLogger";

const Tracking = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 animate-fade-in">Daily Tracking</h1>
          <p className="text-lg text-muted-foreground animate-fade-in">
            Log your health metrics and screen time to find patterns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthLogger />
          <ScreenTimeLogger />
        </div>
      </div>
    </div>
  );
};

export default Tracking;
