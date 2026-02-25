"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Send,
  Search,
  Video,
  Phone,
  Calendar,
  X,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function MessagingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isCallMode, setIsCallMode] = useState(false);
  const [isSchedulingCall, setIsSchedulingCall] = useState(false);
  const [callScheduleData, setCallScheduleData] = useState({
    date: "",
    time: "",
    duration: "30",
    type: "video" as "video" | "audio",
    topic: "",
  });

  // Check if we're in call scheduling mode
  useEffect(() => {
    const action = searchParams.get("action");
    const clientId = searchParams.get("clientId");
    const proId = searchParams.get("proId");

    const timer = setTimeout(() => {
      if (action === "schedule-call" && (clientId || proId)) {
        setIsSchedulingCall(true);
        setIsCallMode(true);
        // Set selected conversation based on who we're contacting
        if (clientId) {
          setSelectedConversation(clientId);
        } else if (proId) {
          setSelectedConversation(proId);
        }
      } else if (clientId || proId) {
        setSelectedConversation(clientId || proId || null);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Mock conversations
  const conversations = [
    { id: "1", name: "John Client", lastMessage: "Thanks for the update!", time: "2h ago", unread: 2 },
    { id: "2", name: "Sarah Marketing", lastMessage: "Can we schedule a call?", time: "1d ago", unread: 0 },
    { id: "3", name: "Mike Agency", lastMessage: "The report looks great!", time: "3d ago", unread: 1 },
    { id: "client-123", name: "Local Business Hub", lastMessage: "Social Media Strategy project", time: "1d ago", unread: 0 },
  ];

  const handleScheduleCall = () => {
    if (!callScheduleData.date || !callScheduleData.time) {
      alert("Please select date and time");
      return;
    }
    // TODO: Implement API call to schedule call
    console.log("Scheduling call:", callScheduleData);
    alert("Call scheduled successfully!");
    setIsSchedulingCall(false);
    setIsCallMode(false);
  };

  const currentConversation = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Call Scheduling UI */}
      {isSchedulingCall && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-2 border-[#0a9396]/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-[#0a9396]" />
                  Schedule Call
                </CardTitle>
                <button
                  onClick={() => {
                    setIsSchedulingCall(false);
                    setIsCallMode(false);
                    router.push("/messaging");
                  }}
                  className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <X className="h-4 w-4 text-gray-600 cursor-pointer" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Date</label>
                  <Input
                    type="date"
                    value={callScheduleData.date}
                    onChange={(e) => setCallScheduleData({ ...callScheduleData, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Time</label>
                  <Input
                    type="time"
                    value={callScheduleData.time}
                    onChange={(e) => setCallScheduleData({ ...callScheduleData, time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Duration (minutes)</label>
                  <select
                    value={callScheduleData.duration}
                    onChange={(e) => setCallScheduleData({ ...callScheduleData, duration: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Call Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCallScheduleData({ ...callScheduleData, type: "video" })}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                        callScheduleData.type === "video"
                          ? "border-[#0a9396] bg-[#0a9396]/10 text-[#0a9396]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Video className="h-4 w-4 mx-auto mb-1 cursor-pointer" />
                      <span className="text-xs">Video Call</span>
                    </button>
                    <button
                      onClick={() => setCallScheduleData({ ...callScheduleData, type: "audio" })}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                        callScheduleData.type === "audio"
                          ? "border-[#0a9396] bg-[#0a9396]/10 text-[#0a9396]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Phone className="h-4 w-4 mx-auto mb-1 cursor-pointer" />
                      <span className="text-xs">Audio Call</span>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Topic/Agenda (Optional)</label>
                <Input
                  placeholder="e.g., Discuss project requirements and timeline"
                  value={callScheduleData.topic}
                  onChange={(e) => setCallScheduleData({ ...callScheduleData, topic: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleScheduleCall}
                  className="flex-1 bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer"
                >
                  <Calendar className="mr-2 h-4 w-4 cursor-pointer" />
                  Schedule Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSchedulingCall(false);
                    setIsCallMode(false);
                    router.push("/messaging");
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Call UI */}
      {isCallMode && !isSchedulingCall && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Card className="border-2 border-[#0a9396] bg-gradient-to-br from-[#0a9396]/10 to-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#0a9396] to-[#94d2bd] mx-auto flex items-center justify-center text-3xl font-bold text-white">
                  {currentConversation?.name.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {currentConversation?.name || "Call"}
                  </h3>
                  <p className="text-sm text-gray-600">Call in progress</p>
                </div>
                <div className="flex items-center justify-center gap-6 pt-4">
                  <button className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all cursor-pointer">
                    <Phone className="h-6 w-6 rotate-135 cursor-pointer" />
                  </button>
                  <button className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all cursor-pointer">
                    <Video className="h-6 w-6 cursor-pointer" />
                  </button>
                  <button className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all cursor-pointer">
                    <X className="h-6 w-6 cursor-pointer" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Conversations List */}
        <div className="w-80 flex-shrink-0">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="flex-1"
                />
              </div>
              <CardTitle className="text-xl">Messages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv.id);
                      setIsCallMode(false);
                      setIsSchedulingCall(false);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedConversation === conv.id ? "bg-[#0a9396]/5 border-l-4 border-[#0a9396]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0a9396] to-[#94d2bd] flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {conv.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 truncate">{conv.name}</p>
                          {conv.unread > 0 && (
                            <Badge variant="primary" size="sm">
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">{conv.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col min-h-0">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0a9396] to-[#94d2bd] flex items-center justify-center text-white font-semibold">
                      {currentConversation?.name.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {currentConversation?.name || "Conversation"}
                      </h3>
                      <p className="text-xs text-gray-600">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsSchedulingCall(true);
                        setIsCallMode(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Calendar className="mr-2 h-4 w-4 cursor-pointer" />
                      Schedule Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCallMode(true);
                        setIsSchedulingCall(false);
                      }}
                      className="cursor-pointer"
                    >
                      {callScheduleData.type === "video" ? (
                        <Video className="h-4 w-4 cursor-pointer" />
                      ) : (
                        <Phone className="h-4 w-4 cursor-pointer" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Messages would go here */}
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      className="flex-1"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && message.trim()) {
                          // TODO: Send message
                          setMessage("");
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (message.trim()) {
                          // TODO: Send message
                          setMessage("");
                        }
                      }}
                      className="bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer"
                    >
                      <Send className="h-4 w-4 cursor-pointer" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
