import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Key, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(() => 
    localStorage.getItem('elevenlabs_api_key') || ''
  );

  const handleSaveApiKey = () => {
    localStorage.setItem('elevenlabs_api_key', apiKey);
    toast({
      title: "API Key Saved! 🔑",
      description: "You can now use voice conversations with your Vibe Partner.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure your VibeCare experience</p>
          </div>

          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">ElevenLabs API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Required for voice conversations with your Vibe Partner
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk_..."
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from{' '}
                  <a 
                    href="https://elevenlabs.io/app/settings/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    elevenlabs.io
                  </a>
                </p>
              </div>

              <Button onClick={handleSaveApiKey} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save API Key
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5">
            <h4 className="font-medium mb-3">💡 About Voice Conversations</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Your Vibe Partner uses AI to provide warm, supportive guidance</li>
              <li>• Trained in CBT (Cognitive Behavioral Therapy) techniques</li>
              <li>• All conversations are private and not stored permanently</li>
              <li>• Microphone access is required for voice chat</li>
              <li>• Your partner adapts responses based on your mood and progress</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
