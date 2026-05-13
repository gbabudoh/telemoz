"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { 
  Inbox, 
  Send, 
  Archive, 
  Trash2, 
  Plus, 
  Search, 
  MoreVertical, 
  RotateCw,
  Clock,
  Paperclip,
  AlertCircle,
  Loader2,
  Mail,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: { name: string; image: string; email: string };
  receiver: { name: string; image: string; email: string };
}

interface Thread {
  id: string;
  subject: string;
  updatedAt: string;
  messages: Message[];
  participants: { id: true; name: string; image: string; email: string; userType: string }[];
}

export default function InboxPage() {
  const { data: session } = useSession();
  const [activeFolder, setActiveFolder] = useState<string>("inbox");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchThreads = useCallback(async (folder = activeFolder) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/emails?folder=${folder}`);
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error("Failed to fetch threads", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeFolder]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchThreads();
  };

  const handleSelectThread = async (thread: Thread) => {
    setSelectedThread(thread);
    // Mark as read in UI
    setThreads(prev => prev.map(t => 
      t.id === thread.id 
        ? { ...t, messages: [{ ...t.messages[0], isRead: true }] } 
        : t
    ));
    // Sync with server
    try {
      await fetch(`/api/emails/thread/${thread.id}`, { method: "GET" });
    } catch (error) {
      console.error("Failed to mark thread as read", error);
    }
  };

  const handleFolderChange = (folder: string) => {
    setActiveFolder(folder);
    setSelectedThread(null);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: composeTo, // We'll need a searchable user list eventually
          subject: composeSubject,
          content: composeContent,
        }),
      });
      if (res.ok) {
        setIsComposeOpen(false);
        setComposeContent("");
        setComposeSubject("");
        fetchThreads();
      }
    } catch (error) {
      console.error("Failed to send email", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleArchiveThread = async (id: string) => {
    try {
      await fetch(`/api/emails/thread/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isThread: true, isArchived: true }),
      });
      setThreads(prev => prev.filter(t => t.id !== id));
      if (selectedThread?.id === id) setSelectedThread(null);
    } catch (error) {
      console.error("Failed to archive thread", error);
    }
  };

  const handleDeleteThread = async (id: string) => {
    try {
      await fetch(`/api/emails/thread/${id}`, { method: "DELETE" });
      setThreads(prev => prev.filter(t => t.id !== id));
      if (selectedThread?.id === id) setSelectedThread(null);
    } catch (error) {
      console.error("Failed to delete thread", error);
    }
  };

  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = async () => {
    if (!selectedThread || !replyContent.trim()) return;
    setIsReplying(true);
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedThread.id,
          content: replyContent,
        }),
      });
      if (res.ok) {
        setReplyContent("");
        // Reload thread
        const updatedRes = await fetch(`/api/emails/thread/${selectedThread.id}`);
        const updatedData = await updatedRes.json();
        setSelectedThread(updatedData.thread);
        fetchThreads();
      }
    } catch (error) {
      console.error("Failed to send reply", error);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50/30">
      {/* Sidebar - Folders */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-6">
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#0a9396] hover:bg-[#087a7c] text-white h-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Compose
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            { id: "inbox", label: "Inbox", icon: Inbox, count: threads.filter(t => !t.messages[0].isRead).length },
            { id: "sent", label: "Sent", icon: Send },
            { id: "archive", label: "Archived", icon: Archive },
            { id: "trash", label: "Trash", icon: Trash2 },
          ].map((folder) => (
            <button
              key={folder.id}
              onClick={() => handleFolderChange(folder.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                activeFolder === folder.id 
                  ? "bg-[#0a9396]/5 text-[#0a9396]" 
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <folder.icon className={cn("h-5 w-5", activeFolder === folder.id ? "text-[#0a9396]" : "text-gray-400")} />
                <span className="text-sm font-black uppercase tracking-wider">{folder.label}</span>
              </div>
              {folder.count ? (
                <Badge className="bg-[#0a9396] text-white border-none text-[10px] px-1.5 min-w-[1.25rem] h-5">
                  {folder.count}
                </Badge>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
           <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="h-8 w-8 bg-[#0a9396]/10 rounded-full flex items-center justify-center">
                 <Zap className="h-4 w-4 text-[#0a9396]" />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internal Engine</span>
           </div>
        </div>
      </div>

      {/* Thread List */}
      <div className="w-[400px] border-r border-gray-100 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-gray-50 border-none rounded-xl text-xs font-medium"
            />
          </div>
          <button 
            onClick={handleRefresh}
            className={cn("p-2 hover:bg-gray-50 rounded-xl transition-all", isRefreshing && "animate-spin")}
          >
            <RotateCw className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#0a9396]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Mailbox...</p>
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-20 px-10">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Mail className="h-8 w-8 text-gray-200" />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Your inbox is clear</h3>
              <p className="text-xs text-gray-400 font-bold leading-relaxed">No messages in this folder. Enjoy the productivity!</p>
            </div>
          ) : (
            threads.map((thread) => {
              const lastMessage = thread.messages[0];
              const isUnread = !lastMessage.isRead && lastMessage.receiver.email === session?.user?.email;

              return (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread)}
                  className={cn(
                    "w-full p-4 text-left border-b border-gray-50 transition-all relative overflow-hidden group",
                    selectedThread?.id === thread.id ? "bg-[#0a9396]/5" : "hover:bg-gray-50"
                  )}
                >
                  {isUnread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0a9396]" />
                  )}
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                       <span className={cn("text-xs font-black uppercase tracking-wider", isUnread ? "text-gray-900" : "text-gray-500")}>
                          {lastMessage.sender.name}
                       </span>
                       {thread.messages.length > 1 && (
                         <Badge variant="outline" className="text-[9px] px-1 h-4 font-bold border-gray-200 text-gray-400">
                           {thread.messages.length}
                         </Badge>
                       )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {formatDistanceToNow(new Date(thread.updatedAt))} ago
                    </span>
                  </div>
                  <h4 className={cn("text-sm mb-1 truncate", isUnread ? "font-black text-gray-900" : "font-bold text-gray-700")}>
                    {thread.subject}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-1 font-medium italic">
                    {lastMessage.content}
                  </p>
                  
                  {/* Quick Actions on Hover */}
                  <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={(e) => { e.stopPropagation(); handleArchiveThread(thread.id); }} className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-[#0a9396]">
                        <Archive className="h-3.5 w-3.5" />
                     </button>
                     <button onClick={(e) => { e.stopPropagation(); handleDeleteThread(thread.id); }} className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                     </button>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Thread Content */}
      <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
        {selectedThread ? (
          <>
            <div className="h-16 px-8 border-b border-gray-100 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-4">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-widest">{selectedThread.subject}</h2>
                  <Badge variant="outline" className="bg-gray-50 border-gray-100 text-gray-400 font-bold uppercase tracking-tighter text-[9px]">
                    Internal Thread
                  </Badge>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={() => handleArchiveThread(selectedThread.id)} className="p-2.5 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all" title="Archive">
                     <Archive className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDeleteThread(selectedThread.id)} className="p-2.5 hover:bg-rose-50 rounded-2xl text-gray-400 hover:text-rose-500 transition-all" title="Delete">
                     <Trash2 className="h-5 w-5" />
                  </button>
                  <div className="w-px h-6 bg-gray-100 mx-2" />
                  <button className="p-2.5 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all">
                     <MoreVertical className="h-5 w-5" />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {selectedThread.messages.map((msg, idx) => (
                <div key={msg.id} className={cn(
                  "flex gap-6 relative",
                  idx !== selectedThread.messages.length - 1 && "pb-8 border-b border-gray-50"
                )}>
                  <div className="shrink-0">
                    <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-lg font-black text-gray-400 uppercase">
                       {msg.sender.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-4">
                       <div>
                          <span className="text-sm font-black text-gray-900 mr-2">{msg.sender.name}</span>
                          <span className="text-xs text-gray-400 font-bold tracking-tight">&lt;{msg.sender.email}&gt;</span>
                       </div>
                       <span className="text-[10px] font-black text-gray-300 uppercase">
                          {new Date(msg.createdAt).toLocaleString()}
                       </span>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                       {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Reply Box */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 shrink-0">
               <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm focus-within:shadow-xl focus-within:border-[#0a9396]/30 transition-all">
                  <textarea 
                    placeholder="Type your reply here..." 
                    className="w-full resize-none bg-transparent outline-none text-sm font-medium h-24 p-2"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex items-center justify-between mt-4">
                     <div className="flex gap-1">
                        <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-all"><Paperclip className="h-4 w-4" /></button>
                        <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-all"><Clock className="h-4 w-4" /></button>
                     </div>
                     <button 
                       onClick={handleReply}
                       disabled={isReplying || !replyContent.trim()}
                       className="flex items-center gap-2 bg-gray-900 text-white h-10 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                     >
                        {isReplying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        Send Reply
                     </button>
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
             <div className="h-48 w-48 bg-gray-50 rounded-[3rem] flex items-center justify-center relative mb-8">
                <Mail className="h-20 w-20 text-gray-200" />
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 h-16 w-16 bg-[#0a9396]/10 rounded-3xl flex items-center justify-center"
                >
                   <Zap className="h-8 w-8 text-[#0a9396]" />
                </motion.div>
             </div>
             <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Secure Inbox</h2>
             <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
               Select a conversation from the sidebar to view full details. All internal communication is end-to-end encrypted.
             </p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white"
             >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#0a9396]/10 rounded-2xl flex items-center justify-center text-[#0a9396]">
                         <Plus className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">New Internal Message</h2>
                   </div>
                   <button onClick={() => setIsComposeOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <AlertCircle className="h-6 w-6 text-gray-400 rotate-45" />
                   </button>
                </div>
                
                <form onSubmit={handleSendEmail} className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">To</span>
                         <Input 
                           value={composeTo} 
                           onChange={(e) => setComposeTo(e.target.value)}
                           className="pl-12 h-14 bg-gray-50 border-none rounded-2xl text-sm font-bold" 
                           placeholder="Recipient ID or Email"
                         />
                      </div>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sub</span>
                         <Input 
                           value={composeSubject} 
                           onChange={(e) => setComposeSubject(e.target.value)}
                           className="pl-12 h-14 bg-gray-50 border-none rounded-2xl text-sm font-bold" 
                           placeholder="Message Subject"
                         />
                      </div>
                      <textarea 
                        value={composeContent}
                        onChange={(e) => setComposeContent(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full h-48 bg-gray-50 border-none rounded-[2rem] p-6 text-sm font-medium resize-none outline-none focus:ring-4 focus:ring-[#0a9396]/10 transition-all"
                      />
                   </div>

                   <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button 
                        type="button"
                        onClick={() => setIsComposeOpen(false)}
                        className="px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] text-gray-500 hover:bg-gray-50 transition-all"
                      >
                        Discard
                      </button>
                      <button 
                        type="submit"
                        disabled={isSending}
                        className="px-10 h-14 bg-[#0a9396] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#0a9396]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                      >
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Dispatch Email
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
