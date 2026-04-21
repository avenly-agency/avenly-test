"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const SESSION_KEY = "avenly_chat_session_id";
const HISTORY_KEY = "avenly_chat_history";

function generateSessionId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateSessionId();
      localStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);

    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    } else {
      setMessages([{
        role: "assistant",
        content: "Cześć! Jestem asystentem AI Avenly. W czym mogę Ci pomóc?",
        timestamp: Date.now(),
      }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-30)));
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant") setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "instant" }), 80);
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "40px";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  }, [input]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim(), timestamp: Date.now() };
    const historyForApi = messages.map(({ role, content }) => ({ role, content }));

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history: historyForApi, sessionId }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response ?? "Przepraszam, coś poszło nie tak.",
        timestamp: Date.now(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Przepraszam, wystąpił błąd połączenia. Spróbuj ponownie.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
                       bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden
                       shadow-[0_8px_64px_-12px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07] bg-[#111]/70 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Bot size={16} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-none mb-1">Avenly AI</p>
                  <p className="text-[11px] text-slate-500 leading-none">Dostępny teraz</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all duration-200"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              data-lenis-prevent
            >
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
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mb-0.5">
                        <Bot size={11} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                          : "bg-white/[0.06] border border-white/[0.08] text-slate-200 rounded-2xl rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2 justify-start"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mb-0.5">
                    <Bot size={11} className="text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.08] flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3.5 border-t border-white/[0.07] bg-[#111]/70 shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Napisz wiadomość..."
                  rows={1}
                  className="flex-1 bg-white/[0.05] border border-white/[0.08] text-white placeholder-slate-600
                             rounded-xl px-3.5 py-2.5 text-sm resize-none outline-none
                             focus:border-blue-500/40 focus:bg-white/[0.08] transition-all
                             scrollbar-none leading-relaxed"
                  style={{ minHeight: "40px", maxHeight: "96px" }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 flex items-center justify-center rounded-xl
                             bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed
                             text-white transition-colors shrink-0"
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

      {/* Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                   bg-gradient-to-br from-blue-500 to-indigo-600
                   flex items-center justify-center
                   shadow-lg shadow-blue-500/30
                   hover:shadow-blue-500/50 transition-shadow duration-300"
      >
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#050505] animate-pulse" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <MessageCircle size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
