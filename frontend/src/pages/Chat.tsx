import { useEffect, useState } from "react";
import { chatApi, authApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    loadMessages();
    
    // Poll for new messages every 2 seconds (simple real-time)
    const interval = setInterval(loadMessages, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const checkUser = async () => {
    try {
      const data = await authApi.getCurrentUser();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await chatApi.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    try {
      await chatApi.send(newMessage);
      setNewMessage("");
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[600px] flex flex-col">
          <CardHeader><CardTitle>Chat with Seller</CardTitle></CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <p className="text-sm font-semibold mb-1">{msg.profiles?.full_name || "Seller"}</p>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} 
                onKeyPress={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." />
              <Button onClick={sendMessage}><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;