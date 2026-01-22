import { useEffect, useState } from "react";
import { chatApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        loadMessages();
        // Poll for new messages every 5 seconds
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadMessages = async () => {
        try {
            const messagesData = await chatApi.getAll();
            setMessages(messagesData || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading messages:", error);
            setLoading(false);
        }
    };

    const sendAdminReply = async (senderId: string) => {
        if (!replyMessage.trim()) return;
        try {
            await chatApi.send(replyMessage, senderId, true);
            toast({ title: "Success", description: "Reply sent!" });
            setReplyMessage("");
            setReplyingTo(null);
            await loadMessages();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    if (loading) {
        return <div>Loading messages...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
                <p className="text-slate-600 mt-2">Customer support messages</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer Messages ({messages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                        {messages.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No messages yet</p>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <Card key={msg.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-semibold">{msg.full_name || msg.profiles?.full_name || "User"}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(msg.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="text-muted-foreground mb-3">{msg.message}</p>
                                            {msg.is_from_admin && (
                                                <span className="inline-block mb-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Admin Reply</span>
                                            )}
                                            {!msg.is_from_admin && replyingTo !== msg.id && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setReplyingTo(msg.id)}
                                                    className="mt-2"
                                                >
                                                    Reply
                                                </Button>
                                            )}
                                            {replyingTo === msg.id && (
                                                <div className="mt-3 space-y-2">
                                                    <Textarea
                                                        placeholder="Type your reply..."
                                                        value={replyMessage}
                                                        onChange={(e) => setReplyMessage(e.target.value)}
                                                        rows={3}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => sendAdminReply(msg.sender_id)}
                                                        >
                                                            Send Reply
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setReplyingTo(null);
                                                                setReplyMessage("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
