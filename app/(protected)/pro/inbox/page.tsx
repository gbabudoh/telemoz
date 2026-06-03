"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Inbox,
  Send,
  Archive,
  Trash2,
  Plus,
  Search,
  RotateCw,
  Clock,
  Paperclip,
  Loader2,
  Mail,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface EmailMessage {
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
  messages: EmailMessage[];
  participants: { id: string; name: string; image: string; email: string; userType: string }[];
}

interface ConnectedUser {
  id: string;
  name: string;
  email: string;
  userType: string;
}

export default function ProInboxPage() {
  const { data: session } = useSession();
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // Recipient picker state
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<ConnectedUser | null>(null);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const recipientRef = useRef<HTMLDivElement>(null);

  const fetchThreads = useCallback(async (folder = activeFolder) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/emails?folder=${folder}`);
      const data = await res.json();
      setThreads(data.threads || []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeFolder]);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  useEffect(() => {
    fetch("/api/users/connected")
      .then((r) => r.json())
      .then((d) => setConnectedUsers(d.users || []));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (recipientRef.current && !recipientRef.current.contains(e.target as Node)) {
        setShowRecipientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchThreads();
  };

  const handleSelectThread = async (thread: Thread) => {
    setSelectedThread(thread);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === thread.id
          ? { ...t, messages: t.messages.map((m) => ({ ...m, isRead: true })) }
          : t
      )
    );
    try {
      const res = await fetch(`/api/emails/thread/${thread.id}`);
      const data = await res.json();
      if (data.thread) setSelectedThread(data.thread);
    } catch { /* silent */ }
  };

  const handleFolderChange = (folder: string) => {
    setActiveFolder(folder);
    setSelectedThread(null);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !composeSubject.trim() || !composeContent.trim()) return;
    setSendError("");
    setIsSending(true);
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedRecipient.id,
          subject: composeSubject,
          content: composeContent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendError(data.error || "Failed to send message");
        return;
      }
      setIsComposeOpen(false);
      setComposeContent("");
      setComposeSubject("");
      setSelectedRecipient(null);
      setRecipientQuery("");
      fetchThreads("sent");
      setActiveFolder("sent");
    } catch {
      setSendError("Failed to send message. Please try again.");
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
      setThreads((prev) => prev.filter((t) => t.id !== id));
      if (selectedThread?.id === id) setSelectedThread(null);
    } catch { /* silent */ }
  };

  const handleDeleteThread = async (id: string) => {
    try {
      await fetch(`/api/emails/thread/${id}`, { method: "DELETE" });
      setThreads((prev) => prev.filter((t) => t.id !== id));
      if (selectedThread?.id === id) setSelectedThread(null);
    } catch { /* silent */ }
  };

  const handleReply = async () => {
    if (!selectedThread || !replyContent.trim()) return;
    setIsReplying(true);
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedThread.id, content: replyContent }),
      });
      if (res.ok) {
        setReplyContent("");
        const updatedRes = await fetch(`/api/emails/thread/${selectedThread.id}`);
        const updatedData = await updatedRes.json();
        if (updatedData.thread) setSelectedThread(updatedData.thread);
        fetchThreads();
      }
    } catch { /* silent */ }
    finally { setIsReplying(false); }
  };

  const filteredUsers = connectedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(recipientQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(recipientQuery.toLowerCase())
  );

  const unreadCount = threads.filter(
    (t) => t.messages.length > 0 && !t.messages[0].isRead &&
      t.messages[0].receiver?.email === session?.user?.email
  ).length;

  const filteredThreads = threads.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.subject.toLowerCase().includes(q) ||
      (t.messages[0]?.sender?.name || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-full overflow-hidden bg-gray-50/30">
      {/* Folder sidebar */}
      <div className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#0a9396] hover:bg-[#087a7c] text-white h-11 rounded-xl font-bold text-xs shadow-lg shadow-[#0a9396]/20 transition-all hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            Compose
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-0.5">
          {[
            { id: "inbox", label: "Inbox", icon: Inbox, count: unreadCount },
            { id: "sent", label: "Sent", icon: Send },
            { id: "archive", label: "Archived", icon: Archive },
            { id: "trash", label: "Trash", icon: Trash2 },
          ].map((folder) => (
            <button
              key={folder.id}
              onClick={() => handleFolderChange(folder.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all",
                activeFolder === folder.id
                  ? "bg-[#0a9396]/8 text-[#0a9396]"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-2.5">
                <folder.icon className={cn("h-4 w-4", activeFolder === folder.id ? "text-[#0a9396]" : "text-gray-400")} />
                <span className="text-sm font-semibold">{folder.label}</span>
              </div>
              {folder.count ? (
                <Badge className="bg-[#0a9396] text-white border-none text-[10px] px-1.5 min-w-5 h-4">
                  {folder.count}
                </Badge>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      {/* Thread list */}
      <div className="w-80 border-r border-gray-100 bg-white flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-100 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 bg-gray-50 border-none rounded-lg text-xs"
            />
          </div>
          <button
            onClick={handleRefresh}
            className={cn("p-2 hover:bg-gray-50 rounded-lg transition-all text-gray-400", isRefreshing && "animate-spin")}
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-[#0a9396]" />
              <p className="text-xs text-gray-400">Loading...</p>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-gray-200" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                {activeFolder === "inbox" ? "Your inbox is empty" : `No ${activeFolder} messages`}
              </p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const lastMsg = thread.messages[0];
              const isUnread =
                lastMsg && !lastMsg.isRead && lastMsg.receiver?.email === session?.user?.email;
              return (
                <div
                  key={thread.id}
                  onClick={() => handleSelectThread(thread)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSelectThread(thread)}
                  className={cn(
                    "w-full p-4 text-left border-b border-gray-50 transition-all relative group cursor-pointer",
                    selectedThread?.id === thread.id ? "bg-[#0a9396]/5" : "hover:bg-gray-50"
                  )}
                >
                  {isUnread && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0a9396]" />}
                  <div className="flex items-start justify-between mb-1">
                    <span className={cn("text-xs font-semibold truncate max-w-[60%]", isUnread ? "text-gray-900 font-bold" : "text-gray-600")}>
                      {lastMsg?.sender?.name || "Unknown"}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {formatDistanceToNow(new Date(thread.updatedAt))} ago
                    </span>
                  </div>
                  <p className={cn("text-sm truncate mb-1", isUnread ? "font-semibold text-gray-900" : "text-gray-700")}>
                    {thread.subject}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{lastMsg?.content || ""}</p>

                  <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleArchiveThread(thread.id); }}
                      className="p-1 hover:bg-white rounded text-gray-400 hover:text-[#0a9396]"
                    >
                      <Archive className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteThread(thread.id); }}
                      className="p-1 hover:bg-white rounded text-gray-400 hover:text-rose-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Thread content */}
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {selectedThread ? (
          <>
            <div className="h-14 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{selectedThread.subject}</h2>
                <Badge variant="outline" className="shrink-0 text-[9px] text-gray-400 border-gray-200">
                  {selectedThread.messages.length} message{selectedThread.messages.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleArchiveThread(selectedThread.id)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-all" title="Archive">
                  <Archive className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteThread(selectedThread.id)} className="p-2 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-500 transition-all" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {selectedThread.messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={cn("flex gap-4", idx !== selectedThread.messages.length - 1 && "pb-6 border-b border-gray-50")}
                >
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 uppercase shrink-0">
                    {msg.sender.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-gray-900">{msg.sender.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{"<"}{msg.sender.email}{">"}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
              <div className="bg-white border border-gray-200 rounded-2xl p-3 focus-within:border-[#0a9396]/30 focus-within:shadow-lg transition-all">
                <textarea
                  placeholder="Type your reply..."
                  className="w-full resize-none bg-transparent outline-none text-sm h-20 p-1"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleReply(); }}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><Paperclip className="h-3.5 w-3.5" /></button>
                    <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><Clock className="h-3.5 w-3.5" /></button>
                  </div>
                  <button
                    onClick={handleReply}
                    disabled={isReplying || !replyContent.trim()}
                    className="flex items-center gap-2 bg-gray-900 text-white h-9 px-5 rounded-xl font-semibold text-xs hover:bg-black transition-all disabled:opacity-40"
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
            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-5">
              <Mail className="h-8 w-8 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Select a message</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              Choose a conversation from the list to read it, or compose a new message to one of your clients.
            </p>
            <button
              onClick={() => setIsComposeOpen(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-[#0a9396] text-white rounded-xl font-semibold text-sm hover:bg-[#087a7c] transition-all"
            >
              <Plus className="h-4 w-4" />
              New Message
            </button>
          </div>
        )}
      </div>

      {/* Compose modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-visible border border-gray-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">New Message</h2>
                <button onClick={() => { setIsComposeOpen(false); setSendError(""); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSendEmail} className="p-5 space-y-4">
                {/* Recipient picker */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">To</label>
                  <div ref={recipientRef} className="relative">
                    {selectedRecipient ? (
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0a9396]/5 border border-[#0a9396]/20 rounded-xl">
                        <div className="h-6 w-6 rounded-full bg-[#0a9396] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {selectedRecipient.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 flex-1">{selectedRecipient.name}</span>
                        <span className="text-xs text-gray-400">{selectedRecipient.email}</span>
                        <button type="button" onClick={() => { setSelectedRecipient(null); setRecipientQuery(""); }} className="p-0.5 hover:text-gray-700 text-gray-400">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          value={recipientQuery}
                          onChange={(e) => { setRecipientQuery(e.target.value); setShowRecipientDropdown(true); }}
                          onFocus={() => setShowRecipientDropdown(true)}
                          placeholder={connectedUsers.length > 0 ? "Search your contacts..." : "No contacts yet — need an active inquiry first"}
                          className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0a9396]/40 transition-all"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    )}

                    {/* Dropdown */}
                    {showRecipientDropdown && !selectedRecipient && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                          <div className="p-4 text-center text-xs text-gray-400">
                            {connectedUsers.length === 0
                              ? "You need an active inquiry with a professional before you can message them."
                              : "No matches found"}
                          </div>
                        ) : (
                          filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => { setSelectedRecipient(user); setRecipientQuery(""); setShowRecipientDropdown(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                            >
                              <div className="h-8 w-8 rounded-full bg-[#0a9396]/10 text-[#0a9396] flex items-center justify-center text-xs font-bold shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                              <span className="text-[10px] text-gray-300 capitalize">{user.userType}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject</label>
                  <Input
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="Message subject"
                    className="h-10 bg-gray-50 border-gray-200 rounded-xl text-sm"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Message</label>
                  <textarea
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full h-36 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm resize-none outline-none focus:border-[#0a9396]/40 transition-all"
                  />
                </div>

                {sendError && (
                  <p className="text-xs text-red-500 font-semibold">{sendError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => { setIsComposeOpen(false); setSendError(""); }}
                    className="px-4 h-10 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending || !selectedRecipient || !composeSubject.trim() || !composeContent.trim()}
                    className="flex items-center gap-2 px-5 h-10 bg-[#0a9396] text-white rounded-xl font-semibold text-sm shadow-md shadow-[#0a9396]/20 hover:bg-[#087a7c] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 10px; }
        .bg-\\[\\#0a9396\\]\\/8 { background-color: rgba(10,147,150,0.08); }
      `}</style>
    </div>
  );
}
