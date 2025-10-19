import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Sparkles } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestedResponses?: string[];
}

const conversationStarters = [
  "I'm feeling overwhelmed today",
  "I need someone to talk to",
  "Something's been bothering me",
  "I want to talk about my anxiety",
  "I had a rough day",
  "I'm feeling grateful today",
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there. I'm here to listen without judgment. This is a safe space for you to share whatever's on your mind. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setShowStarters(false);
    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Show typing indicator
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke("wellness-chat", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;

      // Simulate more natural typing delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      setIsTyping(false);

      const assistantContent = data.choices[0].message.content;
      
      // Generate contextual suggested responses
      const suggestedResponses = generateSuggestedResponses(assistantContent, messageText);

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantContent,
        suggestedResponses,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setIsTyping(false);
      console.error("Error:", error);
      toast({
        title: "Connection issue",
        description: "I'm having trouble responding right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate contextual quick replies based on the conversation
  const generateSuggestedResponses = (aiMessage: string, userMessage: string): string[] => {
    const lowerAI = aiMessage.toLowerCase();
    const lowerUser = userMessage.toLowerCase();

    // When AI asks what's weighing on them or making them feel a certain way
    if (lowerAI.includes("weighing") || lowerAI.includes("making you feel") || lowerAI.includes("what's causing")) {
      return [
        "Work/school stress",
        "Relationship issues",
        "Everything at once",
        "I'm not sure exactly",
      ];
    }

    // When AI asks how they're feeling or doing
    if ((lowerAI.includes("how") || lowerAI.includes("are you")) && (lowerAI.includes("feeling") || lowerAI.includes("doing"))) {
      return [
        "Not great today",
        "A bit better",
        "Still struggling",
        "Hard to describe",
      ];
    }

    // When AI asks to share more or elaborate
    if (lowerAI.includes("tell me more") || lowerAI.includes("can you share") || lowerAI.includes("elaborate")) {
      return [
        "It started recently",
        "It's been ongoing",
        "I'd rather not go into detail",
        "Let me try to explain",
      ];
    }

    // When AI asks what comes to mind or what's one thing
    if (lowerAI.includes("comes to mind") || lowerAI.includes("one thing")) {
      return [
        "My responsibilities",
        "Financial worries",
        "Relationship stress",
        "I can't pinpoint it",
      ];
    }

    // When AI asks about coping or what helps
    if (lowerAI.includes("cope") || lowerAI.includes("help") || lowerAI.includes("tried")) {
      return [
        "Nothing's working",
        "I haven't tried much",
        "Some things help a little",
        "I need new ideas",
      ];
    }

    // When AI asks about support system
    if (lowerAI.includes("support") || lowerAI.includes("talk to") || lowerAI.includes("reach out")) {
      return [
        "I have some support",
        "I feel alone",
        "Not ready to tell anyone",
        "I've talked to a few people",
      ];
    }

    // When user mentioned feeling bad/sad/depressed
    if (lowerUser.includes("bad") || lowerUser.includes("sad") || lowerUser.includes("depressed") || lowerUser.includes("down")) {
      return [
        "I don't know what to do",
        "It's affecting everything",
        "I'm trying my best",
        "I need help",
      ];
    }

    // When user mentioned anxiety/stress/worry
    if (lowerUser.includes("anxious") || lowerUser.includes("worried") || lowerUser.includes("stressed") || lowerUser.includes("overwhelmed")) {
      return [
        "I can't stop thinking about it",
        "It's constant",
        "It comes and goes",
        "I need to calm down",
      ];
    }

    // Default contextual responses for general conversation
    return [
      "I agree",
      "Can you help me with this?",
      "I'm not sure how to answer",
      "That makes sense",
    ];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Welcome message */}
        {messages.length === 1 && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Your Safe Space</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              I'm here to provide support and listen to whatever you'd like to share. 
              Everything you say is confidential and judgment-free.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage role={message.role} content={message.content} />
            
            {/* Show suggested responses only for the most recent assistant message */}
            {message.role === "assistant" && 
             index === messages.length - 1 && 
             !isLoading && 
             !isTyping &&
             message.suggestedResponses && (
              <div className="flex flex-wrap gap-2 ml-11 mt-2 mb-4 animate-fade-in">
                {message.suggestedResponses.map((response, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-all px-3 py-2 text-xs"
                    onClick={() => sendMessage(response)}
                  >
                    {response}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Listening and thinking...</span>
            </div>
          </div>
        )}

        {/* Conversation starters */}
        {showStarters && messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-center mt-8 animate-fade-in">
            {conversationStarters.map((starter, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-all px-4 py-2"
                onClick={() => sendMessage(starter)}
              >
                {starter}
              </Badge>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area with breathing reminder */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm">
        {messages.length > 3 && Math.random() > 0.7 && (
          <div className="px-4 py-2 text-center text-sm text-muted-foreground animate-fade-in">
            💙 Remember to take a deep breath
          </div>
        )}
        <div className="p-4">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind... I'm listening."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px] shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
