import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const RefoAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Refo AI. I can help you with offers, payouts, verification, and affiliate questions. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOpen) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simple rule-based responses
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = "I'm unable to answer this kind of question.";

      if (
        lowerInput.includes("offer") ||
        lowerInput.includes("task") ||
        lowerInput.includes("reward")
      ) {
        response = "You can find available offers in the Dashboard. Complete tasks to earn rewards!";
      } else if (
        lowerInput.includes("payout") ||
        lowerInput.includes("withdraw") ||
        lowerInput.includes("payment")
      ) {
        response = "Check your Wallet to see your balance and request payouts. Minimum payout is usually $5.";
      } else if (
        lowerInput.includes("verify") ||
        lowerInput.includes("verification") ||
        lowerInput.includes("proof")
      ) {
        response = "Submit proof of task completion in the Dashboard. Our team reviews submissions within 24-48 hours.";
      } else if (
        lowerInput.includes("affiliate") ||
        lowerInput.includes("referral") ||
        lowerInput.includes("invite")
      ) {
        response = "Share your unique affiliate link from the Profile page to earn commissions on referrals!";
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        ref={buttonRef}
        className={cn(
          "fixed z-50 cursor-pointer transition-transform duration-150",
          isDragging ? "scale-95" : "hover:scale-105"
        )}
        style={{
          bottom: position.y === 0 ? "6rem" : "auto",
          right: position.x === 0 ? "1.5rem" : "auto",
          transform:
            position.x !== 0 || position.y !== 0
              ? `translate(${position.x}px, ${position.y}px)`
              : "none",
        }}
        onClick={() => !isDragging && setIsOpen(true)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end md:pr-6 md:pb-6 p-4">
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setIsOpen(false)}
          />
          <Card className="relative w-full max-w-md bg-background shadow-2xl rounded-3xl overflow-hidden transition-all duration-200" style={{ maxHeight: "60vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold">Refo AI</h3>
                  <p className="text-xs text-muted-foreground">Your assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto p-4 space-y-3" style={{ height: "calc(60vh - 140px)" }}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2 rounded-2xl text-sm transition-all duration-150",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about offers, payouts..."
                  className="flex-1 rounded-full"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="rounded-full bg-primary hover:bg-primary/90"
                  size="icon"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default RefoAI;
