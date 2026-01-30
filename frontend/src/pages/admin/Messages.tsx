import { useEffect, useState, useMemo } from "react";
import TypingIndicator from "@/components/TypingIndicator";
import { Link } from "react-router-dom";
import { chatApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Search, Send, MoreVertical, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string | null;
    message: string;
    created_at: string;
    is_from_admin: boolean;
    is_read: boolean;
    full_name?: string;
    profiles?: { full_name: string };
}

interface Conversation {
    userId: string;
    userName: string;
    messages: Message[];
    lastMessage: Message;
    unreadCount: number;
}

export default function Messages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isTypingMap, setIsTypingMap] = useState<Record<string, boolean>>({});
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 3000);

        // Initialize WebSocket
        const token = localStorage.getItem('auth_token');
        if (token) {
            const ws = new WebSocket(`ws://localhost:3001/ws?token=${token}`);

            ws.onopen = () => console.log('Connected to WS');

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'typing') {
                        setIsTypingMap(prev => ({ ...prev, [data.senderId]: data.isTyping }));
                    }
                } catch (e) {
                    console.error('WS message error', e);
                }
            };
            setSocket(ws);
            return () => {
                clearInterval(interval);
                ws.close();
            }
        }
        return () => clearInterval(interval);
    }, []);

    const loadMessages = async () => {
        try {
            const data = await chatApi.getAll();
            setMessages(data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };

    const handleSelectUser = async (userId: string) => {
        setSelectedUserId(userId);
        // Mark as read immediately when opening chat
        try {
            await chatApi.markAsRead(userId);
            // Optimistically update UI to clear unread count
            setMessages(prev => prev.map(m =>
                (m.sender_id === userId && !m.is_from_admin)
                    ? { ...m, is_read: true }
                    : m
            ));
        } catch (error) {
            console.error("Error marking read:", error);
        }
    };

    const conversations = useMemo(() => {
        const groups: Record<string, Message[]> = {};

        messages.forEach(msg => {
            const partnerId = msg.is_from_admin ? msg.receiver_id : msg.sender_id;
            if (!partnerId) return;
            if (!groups[partnerId]) groups[partnerId] = [];
            groups[partnerId].push(msg);
        });

        const convos: Conversation[] = Object.entries(groups).map(([userId, msgs]) => {
            const userMsg = msgs.find(m => !m.is_from_admin);
            const userName = userMsg?.full_name || userMsg?.profiles?.full_name || "Unknown User";
            const sortedMsgs = msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            const lastMsg = sortedMsgs[sortedMsgs.length - 1];

            // Count unread (user sent, is_read=false, is_from_admin=false)
            const userSentCount = msgs.filter(m => !m.is_from_admin && !m.is_read).length;

            return {
                userId,
                userName,
                messages: sortedMsgs,
                lastMessage: lastMsg,
                unreadCount: userSentCount
            };
        });

        return convos.sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());
    }, [messages]);

    const filteredConversations = conversations.filter(c =>
        c.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const handleSendMessage = async () => {
        if (!replyMessage.trim() || !selectedUserId) return;

        try {
            const newMessage = await chatApi.send(replyMessage, selectedUserId, true);
            setMessages((prev) => [...prev, newMessage]);
            setReplyMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
        }
    };

    const selectedConversation = selectedUserId ? conversations.find(c => c.userId === selectedUserId) : null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReplyMessage(e.target.value);

        // Emit typing status
        if (socket && socket.readyState === WebSocket.OPEN && selectedUserId) {
            socket.send(JSON.stringify({
                type: 'typing',
                receiverId: selectedUserId,
                isTyping: true
            }));

            // Debounce stop typing (very basic)
            // In a real app, use a proper debounce function
            const timeoutId = setTimeout(() => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: 'typing',
                        receiverId: selectedUserId,
                        isTyping: false
                    }));
                }
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading messages...</div>;

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* Sidebar (Left) - Whatsapp Style, Blue Theme */}
            <div className={`w-full md:w-1/3 min-w-[320px] border-r flex-col bg-[#0F172A] ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
                {/* Sidebar Header */}
                <div className="p-4 bg-[#0F172A] border-b border-slate-800 flex justify-between items-center h-16 shrink-0 text-white">
                    <div className="flex items-center gap-2">
                        <Link to="/admin">
                            <Button variant="ghost" size="icon" className="hover:bg-blue-700 text-white rounded-full" title="Back to Dashboard">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Avatar className="h-10 w-10 cursor-pointer border-2 border-white/20">
                            <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Admin" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-lg">Chats</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700 rounded-full"><MoreVertical className="h-5 w-5" /></Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-2 border-b border-slate-800 bg-[#0F172A]">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search or start new chat"
                            className="pl-10 bg-[#1E293B] border-none rounded-lg focus-visible:ring-0 text-white placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <ScrollArea className="flex-1 bg-[#0F172A]">
                    <div className="divide-y divide-slate-800">
                        {filteredConversations.map((convo) => (
                            <div
                                key={convo.userId}
                                onClick={() => handleSelectUser(convo.userId)}
                                className={`px-4 py-3 cursor-pointer hover:bg-[#1E293B] transition-colors flex items-center gap-3 ${selectedUserId === convo.userId ? 'bg-[#1E293B]' : ''}`}
                            >
                                <Avatar className="h-12 w-12 border border-slate-700">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${convo.userName}`} />
                                    <AvatarFallback>{convo.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-medium text-white truncate">{convo.userName}</h3>
                                        <span className={`text-xs whitespace-nowrap ${convo.unreadCount > 0 ? 'text-green-500 font-medium' : 'text-slate-400'}`}>
                                            {format(new Date(convo.lastMessage.created_at), 'HH:mm')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-slate-400 truncate w-[85%] h-5">
                                            {isTypingMap[convo.userId] ? (
                                                <span className="text-green-500 font-medium italic animate-pulse">typing...</span>
                                            ) : (
                                                <>
                                                    {convo.lastMessage.is_from_admin && <span className="text-blue-500 mr-1">✓</span>}
                                                    {convo.lastMessage.message}
                                                </>
                                            )}
                                        </div>
                                        {convo.unreadCount > 0 && (
                                            <div className="bg-green-500 text-white text-[10px] font-bold h-5 min-w-[1.25rem] px-1 rounded-full flex items-center justify-center scale-100 transition-transform">
                                                {convo.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Chat Area (Right) */}
            <div className={`flex-1 flex-col bg-[#efeae2] relative ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                {/* Chat Background Pattern */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
                    style={{ backgroundImage: "url('https://repo.sourcelink.com/whatsapp-bg.png')" }}></div>

                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 bg-slate-100 border-b flex justify-between items-center h-16 shrink-0 z-10">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden -ml-2 text-slate-600"
                                    onClick={() => setSelectedUserId(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversation.userName}`} />
                                    <AvatarFallback>{selectedConversation.userName.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium text-slate-900">{selectedConversation.userName}</h3>
                                    <p className="text-xs text-slate-500">
                                        {isTypingMap[selectedConversation.userId] ? (
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                typing<span className="animate-pulse">...</span>
                                            </span>
                                        ) : (
                                            "last seen today at 12:00"
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 px-2">
                                <Search className="h-5 w-5 text-slate-600 cursor-pointer" />
                                <MoreVertical className="h-5 w-5 text-slate-600 cursor-pointer" />
                            </div>
                        </div>

                        {/* Messages Scroll View */}
                        <ScrollArea className="flex-1 p-4 z-10">
                            <div className="space-y-2 max-w-4xl mx-auto flex flex-col">
                                {selectedConversation.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex w-full ${msg.is_from_admin ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm relative text-[14.2px] leading-[19px] ${msg.is_from_admin
                                                ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' // WhatsApp Green
                                                : 'bg-white text-slate-900 rounded-tl-none'     // WhatsApp White
                                                }`}
                                        >
                                            <span className="break-words">{msg.message}</span>
                                            <span className="float-right ml-2 mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                                                {format(new Date(msg.created_at), 'HH:mm')}
                                                {msg.is_from_admin && (
                                                    <span className={msg.is_read ? "text-blue-500" : "text-slate-400"}>✓✓</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isTypingMap[selectedConversation.userId] && (
                                    <div className="flex w-full justify-start">
                                        <div className="bg-white px-4 py-2 rounded-lg rounded-tl-none shadow-sm">
                                            <TypingIndicator />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-3 bg-slate-100 shrink-0 z-10">
                            <div className="flex items-center gap-2 max-w-4xl mx-auto">
                                <Input
                                    placeholder="Type a message"
                                    className="flex-1 bg-white border-none rounded-lg h-10 px-4 focus-visible:ring-0"
                                    value={replyMessage}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    size="icon"
                                    className="h-10 w-10 shrink-0 bg-transparent hover:bg-transparent shadow-none"
                                >
                                    <Send className={`h-6 w-6 ${replyMessage.trim() ? "text-green-600" : "text-slate-400"}`} />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center z-10">
                        <h2 className="text-3xl font-light text-slate-600 mb-4">Tech Nexus Admin</h2>
                        <p className="text-slate-500">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
