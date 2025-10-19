import { ChatInterface } from "@/components/ChatInterface";
import { Heart } from "lucide-react";

const Chat = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Therapeutic Header */}
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Your Wellness Companion</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Active and listening
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>

      {/* Crisis Support Footer */}
      <div className="border-t border-border bg-muted/30 px-6 py-3">
        <p className="text-xs text-muted-foreground text-center">
          🆘 <strong>In crisis?</strong> Call 988 (Suicide & Crisis Lifeline) or text "HELLO" to 741741 (Crisis Text Line)
        </p>
      </div>
    </div>
  );
};

export default Chat;
