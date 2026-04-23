"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, History, ArrowLeft, Clock } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  startedAt: number;
  messages: Message[];
}

const CURRENT_KEY  = "avenly_chat_current";
const SESSIONS_KEY = "avenly_chat_sessions";
const MAX_SESSIONS = 15;

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function welcome(): Message {
  return { role: "assistant", content: "Cześć! Jestem asystentem AI Avenly. W czym mogę Ci pomóc?", timestamp: Date.now() };
}

function fmtDate(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function Chatbot() {
  const [isOpen,        setIsOpen]        = useState(false);
  const [view,          setView]          = useState<"chat" | "history">("chat");
  const [messages,      setMessages]      = useState<Message[]>([welcome()]);
  const [sessionId,     setSessionId]     = useState(() => newId());
  const [sessions,      setSessions]      = useState<ChatSession[]>([]);
  const [input,         setInput]         = useState("");
  const [isLoading,     setIsLoading]     = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  // Wczytaj historię i bieżącą sesję
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(SESSIONS_KEY);
      if (savedSessions) setSessions(JSON.parse(savedSessions));

      const current = localStorage.getItem(CURRENT_KEY);
      if (current) {
        const { id, msgs } = JSON.parse(current);
        setSessionId(id);
        setMessages(msgs);
      }
    } catch {}
  }, []);

  // Zapisuj bieżącą sesję do localStorage w trakcie rozmowy
  useEffect(() => {
    const hasUser = messages.some(m => m.role === "user");
    if (hasUser) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify({ id: sessionId, msgs: messages }));
    }
  }, [messages, sessionId]);

  // Scroll na dół
  useEffect(() => {
    if (isOpen && view === "chat") {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [messages, isOpen, view]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      if (view === "chat") {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "instant" }), 80);
        setTimeout(() => textareaRef.current?.focus(), 200);
      }
    }
  }, [isOpen, view]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "40px";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  }, [input]);

  // Zapisz bieżącą sesję do historii (tylko jeśli ma wiadomości usera)
  const saveToHistory = useCallback((msgs: Message[], sid: string) => {
    const hasUser = msgs.some(m => m.role === "user");
    if (!hasUser) return;

    const session: ChatSession = {
      id: sid,
      startedAt: msgs.find(m => m.role === "user")?.timestamp ?? Date.now(),
      messages: msgs,
    };

    setSessions(prev => {
      const updated = [session, ...prev.filter(s => s.id !== sid)].slice(0, MAX_SESSIONS);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
      return updated;
    });

    localStorage.removeItem(CURRENT_KEY);
  }, []);

  // Zamknij czat → zapisz do historii, zacznij świeżo
  const handleClose = useCallback(() => {
    saveToHistory(messages, sessionId);
    setIsOpen(false);
    // Reset do nowej sesji (widoczne dopiero przy następnym otwarciu)
    setMessages([welcome()]);
    setSessionId(newId());
    setView("chat");
  }, [messages, sessionId, saveToHistory]);

  // Nowy czat z poziomu historii
  const startNewChat = useCallback(() => {
    saveToHistory(messages, sessionId);
    setMessages([welcome()]);
    setSessionId(newId());
    setView("chat");
  }, [messages, sessionId, saveToHistory]);

  // Wczytaj sesję z historii
  const loadSession = useCallback((session: ChatSession) => {
    setSessionId(session.id);
    setMessages(session.messages);
    setView("chat");
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ id: session.id, msgs: session.messages }));
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim(), timestamp: Date.now() };
    const historyForApi = messages.map(({ role, content }) => ({ role, content }));

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const N8N_URL = process.env.NEXT_PUBLIC_N8N_CHATBOT_URL ?? "";
    const SECRET  = process.env.NEXT_PUBLIC_CHATBOT_SECRET ?? "avenly-chatbot-2026";

    try {
      if (!N8N_URL) throw new Error("no_url");

      const res = await fetch(N8N_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-chatbot-secret": SECRET },
        body: JSON.stringify({ message: userMsg.content, history: historyForApi }),
      });
      const data = await res.json();
      const botResponse: string = data.response ?? "Przepraszam, coś poszło nie tak.";

      setMessages(prev => [...prev, { role: "assistant", content: botResponse, timestamp: Date.now() }]);
      if (!isOpen) setHasNewMessage(true);

      // Zapis do Supabase (fire-and-forget)
      const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
      if (SUPA_URL && SUPA_KEY) {
        const h = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" };
        const save = (role: string, content: string) =>
          fetch(`${SUPA_URL}/rest/v1/chat_messages`, { method: "POST", headers: h, body: JSON.stringify({ session_id: sessionId, role, content }) });
        Promise.all([save("user", userMsg.content), save("assistant", botResponse)]).catch(() => {});
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Przepraszam, wystąpił błąd połączenia. Spróbuj ponownie.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, sessionId, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const firstUserMsg = (msgs: Message[]) =>
    msgs.find(m => m.role === "user")?.content ?? "Pusta sesja";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[520px] flex flex-col
                       bg-[#080808]/85 backdrop-blur-3xl border border-white/12 rounded-3xl overflow-hidden
                       shadow-[0_8px_64px_-12px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.07)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-white/3 backdrop-blur-xl shrink-0">
              {view === "history" ? (
                <>
                  <button
                    onClick={() => setView("chat")}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={15} />
                    <span className="text-sm font-medium">Historia czatów</span>
                  </button>
                  <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all cursor-pointer">
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg font-bold tracking-tighter text-white leading-none">
                      AVENLY<span className="text-blue-500">.</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-[11px] text-slate-500 leading-none">AI · Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setView("history")}
                      title="Historia czatów"
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                    >
                      <History size={15} />
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Widok historii */}
            <AnimatePresence mode="wait">
              {view === "history" ? (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
                  data-lenis-prevent
                >
                  <button
                    onClick={startNewChat}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                      <MessageCircle size={13} className="text-white" />
                    </div>
                    <span className="text-sm text-blue-400 font-medium">Nowy czat</span>
                  </button>

                  {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                      <Clock className="w-8 h-8 text-slate-700" />
                      <p className="text-xs text-slate-600">Brak poprzednich czatów</p>
                    </div>
                  ) : sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className="w-full flex items-start gap-3 px-4 py-3 rounded-xl border border-white/7 hover:border-white/20 hover:bg-white/3 transition-all text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MessageCircle size={12} className="text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 truncate">{firstUserMsg(session.messages)}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {fmtDate(session.startedAt)} · {session.messages.filter(m => m.role === "user").length} pytań
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              ) : (
                /* Widok czatu */
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" data-lenis-prevent>
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.role === "assistant" && (
                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mb-0.5 shadow-sm shadow-blue-500/30">
                              <span className="text-[9px] font-bold text-white leading-none">A</span>
                            </div>
                          )}
                          <div className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-md shadow-md shadow-blue-500/20"
                              : "bg-white/6 border border-white/8 text-slate-200 rounded-2xl rounded-bl-md"
                          }`}>
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isLoading && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2 justify-start">
                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mb-0.5 shadow-sm shadow-blue-500/30">
                          <span className="text-[9px] font-bold text-white leading-none">A</span>
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/6 border border-white/8 flex gap-1.5 items-center">
                          {[0, 1, 2].map(i => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="px-4 py-3.5 border-t border-white/8 bg-white/3 backdrop-blur-xl shrink-0">
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Napisz wiadomość..."
                        rows={1}
                        className="flex-1 bg-white/5 border border-white/8 text-white placeholder-slate-600
                                   rounded-xl px-3.5 py-2.5 text-sm resize-none outline-none
                                   focus:border-blue-500/40 focus:bg-white/8 transition-all
                                   scrollbar-none leading-relaxed"
                        style={{ minHeight: "40px", maxHeight: "96px" }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white transition-all shrink-0 shadow-md shadow-blue-500/25"
                      >
                        <Send size={15} />
                      </motion.button>
                    </div>
                    <p className="text-[10px] text-slate-700 mt-2 text-center select-none">
                      Enter · wyślij &nbsp;·&nbsp; Shift+Enter · nowa linia
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full cursor-pointer
                   bg-linear-to-br from-blue-500 to-indigo-600
                   flex items-center justify-center
                   shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow duration-300"
      >
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#050505] animate-pulse" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.16 }}>
              <MessageCircle size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
