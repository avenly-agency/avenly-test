"use client";

import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { MessageCircle, X, Send, History, ArrowLeft, Clock, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import logoImg from "@/app/icon.png";
import { getServiceTheme } from "@/lib/service-theme";
import { localeFromPathname, type Locale } from "@/lib/i18n/locale";
import { MarkdownMessage } from "./MarkdownMessage";

// Wygląd okna i bąbla (2026-09-24, nowa odsłona): klasy .cb-* w app/globals.css - ciemne
// szkło z granatowym charakterem w kolorze podstrony (--cb-accent; niebieski na stronie
// głównej): poświata u góry, akcent w obwódkach, dymkach i przycisku wysyłania. Logika bez zmian.

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
  // Opcjonalne pola EN (zarządzane z CRM w chatbot_config). Na /en QR bez label_en
  // jest ukrywany - lepiej brak przycisku niż polski tekst na angielskiej stronie.
  label_en?: string;
  message_en?: string;
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

/** ease-out-expo - standard ruchu strony. */
const EASE = [0.16, 1, 0.3, 1] as const;

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Polska odmiana: 1 pytanie, 2-4 pytania (poza 12-14), 5+ pytań. */
function questionsPl(n: number) {
  if (n === 1) return "1 pytanie";
  const d = n % 10, h = n % 100;
  return `${n} ${d >= 2 && d <= 4 && (h < 12 || h > 14) ? "pytania" : "pytań"}`;
}

// UI chatbota per locale. Wyjątek od reguły "słowniki przez props" - Chatbot to
// globalny widget (DeferredClientWidgets), locale bierze z pathname; oba języki
// w bundlu to kilkaset bajtów.
const CHAT_UI: Record<Locale, {
  welcome: string;
  errorGeneric: string;
  errorConnection: string;
  emptySession: string;
  history: string;
  newChat: string;
  noHistory: string;
  clearHistory: string;
  placeholder: string;
  status: string;
  dialog: string;
  close: string;
  send: string;
  typing: string;
  questions: (n: number) => string;
  bubbleOpen: string;
  bubbleClose: string;
  dateLocale: string;
}> = {
  pl: {
    welcome: "Cześć! Jestem asystentem AI Avenly. W czym mogę Ci pomóc?",
    errorGeneric: "Przepraszam, coś poszło nie tak.",
    errorConnection: "Przepraszam, wystąpił błąd połączenia. Spróbuj ponownie.",
    emptySession: "Pusta sesja",
    history: "Historia czatów",
    newChat: "Nowy czat",
    noHistory: "Brak poprzednich czatów",
    clearHistory: "Wyczyść historię",
    placeholder: "Napisz wiadomość...",
    status: "Asystent AI",
    dialog: "Czat z asystentem AI Avenly",
    close: "Zamknij czat",
    send: "Wyślij wiadomość",
    typing: "Asystent pisze",
    questions: questionsPl,
    bubbleOpen: "Otwórz czat z asystentem AI Avenly",
    bubbleClose: "Zamknij czat z asystentem AI Avenly",
    dateLocale: "pl-PL",
  },
  en: {
    welcome: "Hi! I'm the Avenly AI assistant. How can I help you?",
    errorGeneric: "Sorry, something went wrong.",
    errorConnection: "Sorry, there was a connection error. Please try again.",
    emptySession: "Empty session",
    history: "Chat history",
    newChat: "New chat",
    noHistory: "No previous chats",
    clearHistory: "Clear history",
    placeholder: "Type a message...",
    status: "AI assistant",
    dialog: "Chat with the Avenly AI assistant",
    close: "Close chat",
    send: "Send message",
    typing: "The assistant is typing",
    questions: (n) => `${n} ${n === 1 ? "question" : "questions"}`,
    bubbleOpen: "Open chat with the Avenly AI assistant",
    bubbleClose: "Close chat with the Avenly AI assistant",
    dateLocale: "en-US",
  },
};

function welcome(content: string): Message {
  return { role: "assistant", content, timestamp: Date.now() };
}

function fmtDate(ts: number, dateLocale = "pl-PL") {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString(dateLocale, { day: "2-digit", month: "2-digit", year: "numeric" });
}

function AssistantAvatar() {
  return <Image src={logoImg} alt="" width={24} height={24} className="cb-avatar" />;
}

export function Chatbot() {
  // Kolor podstrony (blue/emerald/rose/amber/sky/orange) - "charakter" okna i bąbla
  // (przydymiony akcent w szkle, obwódkach, dymkach); na stronie głównej niebieski.
  const pathname = usePathname();
  const theme = getServiceTheme(pathname);
  const accent = theme.rgb.replace(/,\s*/g, " "); // "59 130 246" - do rgb(var(--cb-accent) / a)

  // Locale z pathname (/en/* = en). Zmiana języka = pełny reload (osobne root
  // layouty), więc locale jest stałe przez cały lifecycle instancji widgetu.
  const locale = localeFromPathname(pathname);
  const ui = CHAT_UI[locale];

  const [isOpen,        setIsOpen]        = useState(false);
  const [view,          setView]          = useState<"chat" | "history">("chat");
  const [messages,      setMessages]      = useState<Message[]>(() => [welcome(ui.welcome)]);
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

        // Wiadomość powitalna z DB jest po polsku - aktualizuj tylko na PL i tylko
        // gdy sesja świeża (brak wiadomości użytkownika). Na /en zostaje EN fallback.
        if (configMap["welcome_message"] && locale === "pl") {
          setMessages(prev => {
            const hasUser = prev.some(m => m.role === "user");
            if (hasUser) return prev;
            return [welcome(configMap["welcome_message"])];
          });
        }

        // Quick replies. Na /en: tylko wpisy z label_en (zmapowane na EN);
        // reszta ukryta - polski przycisk na angielskiej stronie to gorsze UX niż brak.
        if (configMap["quick_replies"]) {
          const parsed: QuickReply[] = JSON.parse(configMap["quick_replies"]);
          const localized = locale === "en"
            ? parsed
                .filter(r => r.label_en)
                .map(r => ({ ...r, label: r.label_en as string, message: r.message_en ?? r.message }))
            : parsed;
          setAllQuickReplies(localized);
          setContextQuickReplies(localized.filter(r => hasTrigger(r, "start")));
        }
      })
      .catch(() => {});
  }, [locale]);

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

  // Auto-resize textarea. Pomiar przez height:auto (nie stałą wartość) + floor 44px
  // (= wysokość przycisku wysyłania) i +2px na border (box-sizing: border-box,
  // scrollHeight nie zawiera bordera). UWAGA: textarea NIE może mieć transition na
  // height - scrollHeight mierzyłby starą, wciąż animowaną wysokość i input "topniał"
  // po znaku zamiast zresetować się po wysłaniu (.cb-input animuje tylko kolory).
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const contentHeight = el.scrollHeight + 2;
    const newHeight = Math.max(44, Math.min(contentHeight, 96));
    el.style.height = newHeight + "px";
    el.style.overflowY = contentHeight > 96 ? "auto" : "hidden";
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
    setMessages([welcome(ui.welcome)]);
    setSessionId(newId());
    setContextQuickReplies(allQuickReplies.filter(r => hasTrigger(r, "start")));
    sessionStorage.removeItem(CURRENT_KEY);
    setView("chat");
  }, [messages, sessionId, saveToHistory, allQuickReplies, ui.welcome]);

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
        // language: hint dla n8n - workflow przełącza system prompt na EN dla stron /en
        body: JSON.stringify({ message: userMsg.content, history: historyForApi, sessionId, language: locale }),
      });
      const data = await res.json();
      const botResponse: string = data.response ?? ui.errorGeneric;
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
        // Sekwencyjnie - user musi mieć wcześniejszy created_at niż bot
        save("user", userMsg.content).then(() => save("assistant", botResponse)).catch(() => {});
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: ui.errorConnection,
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, sessionId, isOpen, allQuickReplies, locale, ui]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const firstUserMsg = (msgs: Message[]) =>
    msgs.find(m => m.role === "user")?.content ?? ui.emptySession;

  const alwaysReplies = allQuickReplies.filter(r => hasTrigger(r, "always"));

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label={ui.dialog}
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: EASE } }}
            exit={{ opacity: 0, y: 10, scale: 0.985, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            className="cb fixed bottom-24 right-4 sm:right-6 z-30 w-[calc(100vw-32px)] sm:w-96 flex flex-col overflow-hidden"
            style={{
              "--cb-accent": accent,
              transformOrigin: "bottom right",
              height: "min(36rem, calc(100dvh - 7.5rem))",
              maxHeight: "calc(100dvh - 7.5rem)",
            } as CSSProperties}
          >
            {/* Nagłówek */}
            <div className="cb-head">
              {view === "history" ? (
                <>
                  <button type="button" className="cb-back" onClick={() => setView("chat")}>
                    <ArrowLeft size={16} aria-hidden="true" />
                    <span>{ui.history}</span>
                  </button>
                  <div className="cb-actions">
                    {sessions.length > 0 && (
                      <button type="button" className="cb-icon cb-icon-danger" onClick={clearHistory} aria-label={ui.clearHistory} title={ui.clearHistory}>
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    )}
                    <button type="button" className="cb-icon" onClick={handleClose} aria-label={ui.close} title={ui.close}>
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="cb-brand">
                    <span className="cb-word">AVENLY<span className="cb-word-dot">.</span></span>
                    <span className="cb-status">
                      <span className="cb-status-dot" aria-hidden="true" />
                      {ui.status}
                    </span>
                  </div>
                  <div className="cb-actions">
                    <button type="button" className="cb-icon" onClick={() => setView("history")} aria-label={ui.history} title={ui.history}>
                      <History size={16} aria-hidden="true" />
                    </button>
                    <button type="button" className="cb-icon" onClick={handleClose} aria-label={ui.close} title={ui.close}>
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Widoki */}
            <AnimatePresence mode="wait" initial={false}>
              {view === "history" ? (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.24, ease: EASE }}
                  className="cb-history chat-scrollbar"
                  data-lenis-prevent
                >
                  <button type="button" className="cb-new" onClick={startNewChat}>
                    <span className="cb-new-icon" aria-hidden="true"><Plus size={15} /></span>
                    {ui.newChat}
                  </button>

                  {sessions.length === 0 ? (
                    <div className="cb-empty">
                      <Clock size={26} aria-hidden="true" />
                      <p>{ui.noHistory}</p>
                    </div>
                  ) : (
                    <ul className="cb-sessions">
                      {sessions.map(session => (
                        <li key={session.id}>
                          <button type="button" className="cb-sess" onClick={() => loadSession(session)}>
                            <span className="cb-sess-title">{firstUserMsg(session.messages)}</span>
                            <span className="cb-sess-meta">
                              {fmtDate(session.startedAt, ui.dateLocale)} · {ui.questions(session.messages.filter(m => m.role === "user").length)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.24, ease: EASE }}
                  className="relative flex flex-col flex-1 min-h-0"
                >
                  {/* Rozmowa */}
                  <div className="cb-log chat-scrollbar" role="log" aria-live="polite" data-lenis-prevent>
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, ease: EASE }}
                        >
                          <div className={msg.role === "user" ? "cb-row cb-row-user" : "cb-row"}>
                            {msg.role === "assistant" && <AssistantAvatar />}
                            <div className={msg.role === "user" ? "cb-msg cb-msg-user" : "cb-msg cb-msg-bot"}>
                              {msg.role === "assistant" ? <MarkdownMessage content={msg.content} /> : msg.content}
                            </div>
                          </div>

                          {/* Szybkie odpowiedzi po ostatniej wiadomości asystenta */}
                          {msg.role === "assistant" && i === messages.length - 1 && contextQuickReplies.length > 0 && !isLoading && (
                            <div className="cb-chips">
                              {contextQuickReplies.map((qr, qi) => (
                                <motion.button
                                  key={qr.id}
                                  type="button"
                                  className="cb-chip"
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.28, ease: EASE, delay: 0.08 + qi * 0.05 }}
                                  onClick={() => sendMessage(qr.message || qr.label)}
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
                      <motion.div
                        className="cb-row"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                      >
                        <AssistantAvatar />
                        <div className="cb-msg cb-msg-bot cb-typing" role="status" aria-label={ui.typing}>
                          <span /><span /><span />
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Pole wiadomości */}
                  <div className="cb-foot">
                    {alwaysReplies.length > 0 && (
                      <div className="cb-chips cb-chips-always">
                        {alwaysReplies.map(qr => (
                          <button
                            key={qr.id}
                            type="button"
                            className="cb-chip"
                            onClick={() => sendMessage(qr.message || qr.label)}
                            disabled={isLoading}
                          >
                            {qr.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="cb-compose">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={ui.placeholder}
                        aria-label={ui.placeholder}
                        rows={1}
                        className="cb-input chat-scrollbar"
                      />
                      <button
                        type="button"
                        className="cb-send"
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        aria-label={ui.send}
                      >
                        <Send size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble - z-30 żeby nie nachodził na mobilne menu (z-40).
          Intro animation: spring bounce (scale + opacity) gdy Chatbot się mountuje
          (~500ms po hydration przez DeferredClientWidgets). */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.9 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        aria-label={isOpen ? ui.bubbleClose : ui.bubbleOpen}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
        // Granatowe szkło z poświatą akcentu (.cb-bubble w globals.css) - ten sam język co okno.
        className="cb-bubble fixed bottom-6 right-4 sm:right-6 z-30 w-14 h-14 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300"
        style={{ "--cb-accent": accent } as CSSProperties}
      >
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0a0a0c] animate-pulse" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}>
              <X size={21} aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.16 }}>
              <MessageCircle size={21} aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </MotionConfig>
  );
}
