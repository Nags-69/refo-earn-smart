import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Bot, User as UserIcon } from "lucide-react";

type Chat = {
  chat_id: string;
  user_id: string;
  active_responder: string;
  last_updated: string;
  user_email?: string;
  message_count?: number;
};

type ChatMessage = {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
};

const ChatControl = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data: chatsData, error } = await supabase
        .from("chats")
        .select("*")
        .order("last_updated", { ascending: false });

      if (error) {
        toast({ title: "Error loading chats", variant: "destructive" });
        return;
      }

      if (chatsData) {
        const chatsWithDetails = await Promise.all(
          chatsData.map(async (chat) => {
            let userEmail = "Demo User";
            
            // Try to get profile email, fallback to demo user
            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("email")
                .eq("id", chat.user_id)
                .maybeSingle();
              
              if (profile?.email) {
                userEmail = profile.email;
              }
            } catch (error) {
              console.log("Could not fetch profile for", chat.user_id);
            }

            const { count } = await supabase
              .from("chat_messages")
              .select("*", { count: "exact", head: true })
              .eq("chat_id", chat.chat_id);

            return {
              ...chat,
              user_email: userEmail,
              message_count: count || 0,
            };
          })
        );

        setChats(chatsWithDetails);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({ title: "Connection error", variant: "destructive" });
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("timestamp", { ascending: true });

      if (error) {
        toast({ title: "Error loading messages", variant: "destructive" });
        return;
      }

      setMessages(messagesData || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({ title: "Connection error", variant: "destructive" });
    }
  };

  const handleViewChat = (chat: Chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.chat_id);
    setIsDialogOpen(true);
  };

  const toggleResponder = async (chat: Chat) => {
    const newMode = chat.active_responder === "AI" ? "ADMIN" : "AI";

    try {
      const { error } = await supabase
        .from("chats")
        .update({ active_responder: newMode })
        .eq("chat_id", chat.chat_id);

      if (error) {
        toast({ title: "Update failed", variant: "destructive" });
      } else {
        toast({
          title: `Chat mode: ${newMode === "AI" ? "AI Resumed" : "Admin Takeover"}`,
        });
        fetchChats();
        if (selectedChat?.chat_id === chat.chat_id) {
          setSelectedChat({ ...chat, active_responder: newMode });
        }
      }
    } catch (error) {
      console.error("Error toggling responder:", error);
      toast({ title: "Connection error", variant: "destructive" });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        chat_id: selectedChat.chat_id,
        user_id: selectedChat.user_id,
        sender: "admin",
        message: newMessage.trim(),
        responder_mode: "ADMIN",
      });

      if (error) {
        toast({ title: "Send failed", variant: "destructive" });
        return;
      }

      // Update chat to ADMIN mode
      await supabase
        .from("chats")
        .update({ active_responder: "ADMIN", last_updated: new Date().toISOString() })
        .eq("chat_id", selectedChat.chat_id);

      setNewMessage("");
      fetchMessages(selectedChat.chat_id);
      fetchChats();

      toast({ title: "Message sent as Refo Assistant" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({ title: "Connection error", variant: "destructive" });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Chat Control</h2>
      <Card>
        <CardHeader>
          <CardTitle>User Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chats.map((chat) => (
                  <TableRow key={chat.chat_id}>
                    <TableCell className="font-medium">{chat.user_email}</TableCell>
                    <TableCell>{chat.message_count}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                          chat.active_responder === "AI"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {chat.active_responder === "AI" ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <UserIcon className="h-3 w-3" />
                        )}
                        {chat.active_responder}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(chat.last_updated).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => handleViewChat(chat)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant={chat.active_responder === "AI" ? "default" : "outline"}
                        onClick={() => toggleResponder(chat)}
                      >
                        {chat.active_responder === "AI" ? "Take Over" : "Resume AI"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Chat with {selectedChat?.user_email} - Mode:{" "}
              {selectedChat?.active_responder}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[60vh]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {msg.sender === "user" ? "User" : "Refo Assistant"}
                      </p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatControl;
