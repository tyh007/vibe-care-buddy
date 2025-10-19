import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Trash2 } from "lucide-react";
import { clearMockData, initializeMockData } from "@/utils/mockData";
import { useToast } from "@/hooks/use-toast";

export const DataControls = () => {
  const { toast } = useToast();

  const handleRefresh = () => {
    clearMockData();
    initializeMockData();
    window.location.reload();
  };

  const handleClear = () => {
    clearMockData();
    toast({
      title: "Data cleared",
      description: "All mock data has been removed. Refresh to regenerate.",
    });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Card className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">Mock Data Controls</p>
        <p className="text-xs text-muted-foreground">
          Demo mode - sample data is loaded
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
    </Card>
  );
};
