"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, History, ArrowLeft, Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import logoImg from "@/app/icon.png";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface QuickReply {
  id: string;
  label: string;
  message: string;
  triggers?: ("start" | "always" | "keyword")[];
  trigger?: string; // backward compat
  keywords?: string[];
}

function hasTrigger(r: QuickReply, t: string): boolean {
  if (r.triggers?.length) return r.triggers.includes(t as never);
  return (r.trigger ?? "start") === t;
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

const DEFAULT_WELCOME = "Cześć! Jestem asystentem AI Avenly. W czym mogę Ci pomóc?";

function welcome(content = DEFAULT_WELCOME): Message {
  return { role: "assistant", content, timestamp: Date.now() };
}

function fmtDate(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function AssistantAvatar() {
  return (
    <Image
      src={logoImg}
      alt="Avenly"
      width={26}
      height={26}
      className="rounded-full shrink-0 mb-0.5 ring-1 ring-blue-500/30 shadow-sm shadow-blue-500/20"
    />
  );
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

  const [allQuickReplies,     setAllQuickReplies]     = useState<QuickReply[]>([]);
  const [contextQuickReplies, setContextQuickReplies] = useState<QuickReply[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(SESSIONS_KEY);
      if (savedSessions) setSessions(JSON.parse(savedSessions));

      const current = sessionStorage.getItem(CURRENT_KEY);
      if (current) {
        const { id, msgs } = JSON.parse(current);
        setSessionId(id);
        setMessages(msgs);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    if (!SUPA_URL || !SUPA_KEY) return;
    fetch(`${SUPA_URL}/rest/v1/chatbot_config?key=in.(quick_replies,welcome_message)&select=key,value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    })
      .then(r => r.json())
      .then((data: { key: string; value: string }[]) => {
        if (!Array.isArray(data)) return;

        const configMap: Record<string, string> = {};
        for (const row of data) configMap[row.key] = row.value;

        // Wiadomość powitalna — aktualizuj tylko gdy sesja świeża (brak wiadomości użytkownika)
        if (configMap["welcome_message"]) {
          setMessages(prev => {
            const hasUser = prev.some(m => m.role === "user");
            if (hasUser) return prev;
            return [welcome(configMap["welcome_message"])];
          });
        }

        // Quick replies
        if (configMap["quick_replies"]) {
          const parsed: QuickReply[] = JSON.parse(configMap["quick_replies"]);
          setAllQuickReplies(parsed);
          setContextQuickReplies(parsed.filter(r => hasTrigger(r, "start")));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => { setIsOpen(true); setView("chat"); };
    window.addEventListener("avenly:open-chat", handler);
    return () => window.removeEventListener("avenly:open-chat", handler);
  }, []);

  useEffect(() => {
    const hasUser = messages.some(m => m.role === "user");
    if (hasUser) {
      sessionStorage.setItem(CURRENT_KEY, JSON.stringify({ id: sessionId, msgs: messages }));
    }
  }, [messages, sessionId]);

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

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "40px";
    const newHeight = Math.min(el.scrollHeight, 96);
    el.style.height = newHeight + "px";
    el.style.overflowY = newHeight >= 96 ? "auto" : "hidden";
  }, [input]);

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
  }, []);

  const handleClose = useCallback(() => {
    saveToHistory(messages, sessionId);
    setIsOpen(false);
    setView("chat");
  }, [messages, sessionId, saveToHistory]);

  const startNewChat = useCallback(() => {
    saveToHistory(messages, sessionId);
    setMessages([welcome()]);
    setSessionId(newId());
    setContextQuickReplies(allQuickReplies.filter(r => hasTrigger(r, "start")));
    sessionStorage.removeItem(CURRENT_KEY);
    setView("chat");
  }, [messages, sessionId, saveToHistory, allQuickReplies]);

  const clearHistory = useCallback(() => {
    setSessions([]);
    localStorage.removeItem(SESSIONS_KEY);
  }, []);

  const loadSession = useCallback((session: ChatSession) => {
    setSessionId(session.id);
    setMessages(session.messages);
    setView("chat");
    sessionStorage.setItem(CURRENT_KEY, JSON.stringify({ id: session.id, msgs: session.messages }));
  }, []);

  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text, timestamp: Date.now() };
    const historyForApi = messages.map(({ role, content }) => ({ role, content }));

    setMessages(prev => [...prev, userMsg]);
    if (!overrideText) setInput("");
    setContextQuickReplies([]);
    setIsLoading(true);

    const N8N_URL = process.env.NEXT_PUBLIC_N8N_CHATBOT_URL ?? "";
    const SECRET  = process.env.NEXT_PUBLIC_CHATBOT_SECRET ?? "avenly-chatbot-2026";

    try {
      if (!N8N_URL) throw new Error("no_url");
      const res = await fetch(N8N_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-chatbot-secret": SECRET },
        body: JSON.stringify({ message: userMsg.content, history: historyForApi, sessionId }),
      });
      const data = await res.json();
      const botResponse: string = data.response ?? "Przepraszam, coś poszło nie tak.";
      setMessages(prev => [...prev, { role: "assistant", content: botResponse, timestamp: Date.now() }]);
      if (!isOpen) setHasNewMessage(true);

      // Pokaż quick replies pasujące do odpowiedzi bota (keyword trigger)
      const lowerResponse = botResponse.toLowerCase();
      const keywordMatches = allQuickReplies.filter(
        r => hasTrigger(r, "keyword") && r.keywords?.some(kw => lowerResponse.includes(kw.toLowerCase().trim()))
      );
      if (keywordMatches.length > 0) setContextQuickReplies(keywordMatches);

      const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
      if (SUPA_URL && SUPA_KEY) {
        const h = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" };
        const save = (role: string, content: string) =>
          fetch(`${SUPA_URL}/rest/v1/chat_messages`, { method: "POST", headers: h, body: JSON.stringify({ session_id: sessionId, role, content }) });
        // Sekwencyjnie — user musi mieć wcześniejszy created_at niż bot
        save("user", userMsg.content).then(() => save("assistant", botResponse)).catch(() => {});
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
  }, [input, isLoading, messages, sessionId, isOpen, allQuickReplies]);

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
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-4 sm:right-6 z-30 w-[calc(100vw-32px)] sm:w-92.5 h-140 flex flex-col rounded-3xl overflow-hidden"
            style={{
              background: "rgba(4, 8, 24, 0.82)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(59, 130, 246, 0.18)",
              boxShadow: "0 8px 64px -8px rgba(0,0,0,0.9), 0 0 0 1px rgba(59,130,246,0.08), 0 0 80px -20px rgba(59,130,246,0.15)",
            }}
          >
            {/* Subtelny gradient w tle okienka */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 70%)",
              }}
            />

            {/* Header */}
            <div
              className="relative flex items-center justify-between px-5 py-3.5 shrink-0"
              style={{
                background: "rgba(59, 130, 246, 0.06)",
                borderBottom: "1px solid rgba(59, 130, 246, 0.12)",
                backdropFilter: "blur(20px)",
              }}
            >
              {view === "history" ? (
                <>
                  <button
                    onClick={() => setView("chat")}
                    className="flex items-center gap-2 text-blue-300/70 hover:text-blue-200 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={15} />
                    <span className="text-sm font-medium">Historia czatów</span>
                  </button>
                  <div className="flex items-center gap-1">
                    {sessions.length > 0 && (
                      <button
                        onClick={clearHistory}
                        title="Wyczyść historię"
                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-blue-400/40 hover:text-red-400 transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-blue-500/10 text-blue-400/50 hover:text-blue-300 transition-all cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg font-bold tracking-tighter text-white leading-none">
                      AVENLY<span className="text-blue-400">.</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-[11px] text-blue-300/50 leading-none">AI · Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setView("history")}
                      title="Historia czatów"
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-blue-500/10 text-blue-400/50 hover:text-blue-300 transition-all cursor-pointer"
                    >
                      <History size={15} />
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-blue-500/10 text-blue-400/50 hover:text-blue-300 transition-all cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Widoki */}
            <AnimatePresence mode="wait">
              {view === "history" ? (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex-1 overflow-y-auto px-4 py-3 space-y-2 chat-scrollbar"
                  data-lenis-prevent
                >
                  <button
                    onClick={startNewChat}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left cursor-pointer transition-all"
                    style={{
                      background: "rgba(59,130,246,0.07)",
                      border: "1px solid rgba(59,130,246,0.22)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.13)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.07)"; }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                      <MessageCircle size={13} className="text-white" />
                    </div>
                    <span className="text-sm text-blue-300 font-medium">Nowy czat</span>
                  </button>

                  {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                      <Clock className="w-8 h-8 text-blue-500/20" />
                      <p className="text-xs text-blue-400/30">Brak poprzednich czatów</p>
                    </div>
                  ) : sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className="w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left cursor-pointer transition-all"
                      style={{ border: "1px solid rgba(59,130,246,0.1)", background: "transparent" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.06)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.25)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.1)";
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.15)" }}>
                        <MessageCircle size={12} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 truncate">{firstUserMsg(session.messages)}</p>
                        <p className="text-[11px] text-blue-400/40 mt-0.5">
                          {fmtDate(session.startedAt)} · {session.messages.filter(m => m.role === "user").length} pytań
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex flex-col flex-1 min-h-0"
                >
                  {/* Obszar wiadomości */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 chat-scrollbar" data-lenis-prevent>
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: "easeOut" }}>
                          <div className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && <AssistantAvatar />}
                            <div
                              className="max-w-[82%] px-4 py-2.5 text-sm leading-relaxed"
                              style={msg.role === "user" ? {
                                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                color: "#fff",
                                borderRadius: "1.25rem 1.25rem 0.375rem 1.25rem",
                                boxShadow: "0 4px 20px -4px rgba(59,130,246,0.4)",
                              } : {
                                background: "rgba(59,130,246,0.09)",
                                border: "1px solid rgba(59,130,246,0.15)",
                                color: "#e2e8f0",
                                borderRadius: "1.25rem 1.25rem 1.25rem 0.375rem",
                              }}
                            >
                              {msg.content}
                            </div>
                          </div>

                          {/* Quick replies po ostatniej wiadomości bota */}
                          {msg.role === "assistant" && i === messages.length - 1 && contextQuickReplies.length > 0 && !isLoading && (
                            <div className="flex flex-wrap gap-2 mt-2.5 pl-8">
                              {contextQuickReplies.map((qr, qi) => (
                                <motion.button
                                  key={qr.id}
                                  initial={{ opacity: 0, y: 6, scale: 0.94 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ duration: 0.2, delay: qi * 0.06 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => sendMessage(qr.message || qr.label)}
                                  className="cursor-pointer select-none"
                                  style={{
                                    padding: "0.375rem 0.875rem",
                                    borderRadius: "2rem",
                                    fontSize: "0.72rem",
                                    fontWeight: 600,
                                    lineHeight: 1.4,
                                    letterSpacing: "0.01em",
                                    background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
                                    border: "1px solid rgba(99,102,241,0.35)",
                                    color: "#a5b4fc",
                                    backdropFilter: "blur(8px)",
                                    boxShadow: "0 2px 10px -2px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                                    transition: "all 0.15s ease",
                                  }}
                                  onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.background = "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.25))";
                                    el.style.borderColor = "rgba(99,102,241,0.65)";
                                    el.style.color = "#c7d2fe";
                                    el.style.boxShadow = "0 4px 16px -2px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.06)";
                                  }}
                                  onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.background = "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))";
                                    el.style.borderColor = "rgba(99,102,241,0.35)";
                                    el.style.color = "#a5b4fc";
                                    el.style.boxShadow = "0 2px 10px -2px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.04)";
                                  }}
                                >
                                  {qr.label}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isLoading && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2 justify-start">
                        <AssistantAvatar />
                        <div
                          className="px-4 py-3 flex gap-1.5 items-center"
                          style={{
                            background: "rgba(59,130,246,0.09)",
                            border: "1px solid rgba(59,130,246,0.15)",
                            borderRadius: "1.25rem 1.25rem 1.25rem 0.375rem",
                          }}
                        >
                          {[0, 1, 2].map(i => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div
                    className="px-4 py-3.5 shrink-0"
                    style={{
                      background: "rgba(59,130,246,0.05)",
                      borderTop: "1px solid rgba(59,130,246,0.12)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {/* Przyciski "zawsze widoczne" */}
                    {allQuickReplies.some(r => hasTrigger(r, "always")) && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {allQuickReplies.filter(r => hasTrigger(r, "always")).map(qr => (
                          <button
                            key={qr.id}
                            onClick={() => sendMessage(qr.message || qr.label)}
                            disabled={isLoading}
                            className="cursor-pointer select-none disabled:opacity-40"
                            style={{
                              padding: "0.3rem 0.75rem",
                              borderRadius: "2rem",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              letterSpacing: "0.01em",
                              background: "rgba(59,130,246,0.08)",
                              border: "1px solid rgba(59,130,246,0.2)",
                              color: "rgba(147,197,253,0.75)",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={e => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = "rgba(59,130,246,0.18)";
                              el.style.borderColor = "rgba(59,130,246,0.45)";
                              el.style.color = "#93c5fd";
                            }}
                            onMouseLeave={e => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = "rgba(59,130,246,0.08)";
                              el.style.borderColor = "rgba(59,130,246,0.2)";
                              el.style.color = "rgba(147,197,253,0.75)";
                            }}
                          >
                            {qr.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Napisz wiadomość..."
                        rows={1}
                        className="flex-1 text-white text-sm resize-none outline-none leading-relaxed chat-scrollbar transition-all placeholder-blue-400/30"
                        style={{
                          minHeight: "40px",
                          maxHeight: "96px",
                          overflowY: "hidden",
                          background: "rgba(59,130,246,0.07)",
                          border: "1px solid rgba(59,130,246,0.18)",
                          borderRadius: "0.75rem",
                          padding: "0.625rem 0.875rem",
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.45)"; e.currentTarget.style.background = "rgba(59,130,246,0.11)"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.18)"; e.currentTarget.style.background = "rgba(59,130,246,0.07)"; }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer text-white transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                          boxShadow: "0 4px 16px -4px rgba(59,130,246,0.5)",
                        }}
                      >
                        <Send size={15} />
                      </motion.button>
                    </div>
                    <p className="text-[10px] mt-2 text-center select-none" style={{ color: "rgba(96,165,250,0.3)" }}>
                      Enter · wyślij &nbsp;·&nbsp; Shift+Enter · nowa linia
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble — z-30 żeby nie nachodził na mobilne menu (z-40) */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-4 sm:right-6 z-30 w-14 h-14 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300"
        style={{
          background: "rgba(4, 8, 24, 0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(59,130,246,0.35)",
          boxShadow: "0 4px 32px -4px rgba(59,130,246,0.35), 0 0 0 1px rgba(59,130,246,0.1)",
        }}
      >
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#040818] animate-pulse" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}>
              <X size={21} className="text-blue-300" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.16 }}>
              <MessageCircle size={21} className="text-blue-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
