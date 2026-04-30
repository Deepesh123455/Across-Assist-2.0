import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Zap, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../lib/groq';
import { getSessionToken } from '../../lib/session';
import { api } from '../../lib/axios';
import PageTransition from '../../components/PageTransition';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';

const WELCOME: ChatMessage = {
  role: 'assistant',
  content: "Hi! I'm the Across Assist AI advisor. I can help you find the right gadget protection bundle, explain our commission model, or calculate your revenue opportunity. What would you like to know?",
};

function TypingDots() {
  return (
    <div className="flex gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-slate-300"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function Typewriter({ text, speed = 15, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span>{displayed}</span>;
}

function AIRecommendationCard({ data }: { data: any }) {
  return (
    <div className="space-y-4 w-full">
      <div className="bg-gradient-to-br from-[#1A56DB] to-[#1e40af] p-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/10 border border-blue-400/20">
        <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Recommended Bundle</div>
        <h3 className="text-2xl font-black mb-4 tracking-tight">{data.bundleName}</h3>
        <div className="flex flex-wrap gap-2">
          {data.products?.map((p: string) => (
            <span key={p} className="px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold backdrop-blur-md border border-white/10">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
          <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Est. Annual Revenue</div>
          <div className="text-2xl font-black text-emerald-700 tracking-tight">
            ₹{(data.projectedAnnualRevenue / 10000000).toFixed(1)} Cr
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
          <div className="text-[10px] font-black text-[#1A56DB] uppercase tracking-widest mb-1">Similar Clients</div>
          <div className="text-sm font-bold text-blue-800 leading-snug">
            {data.similarClients?.join(', ')}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 p-6 rounded-[2rem] space-y-4 shadow-sm">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Value Props</div>
        <ul className="space-y-3">
          {data.reasons?.map((r: string, i: number) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed">
              <Zap className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem]">
        <div className="text-[10px] font-black text-[#F97316] uppercase tracking-widest mb-2">Handling Objections</div>
        <p className="text-sm text-orange-900 italic font-medium leading-relaxed">"{data.objectionHandle}"</p>
      </div>
    </div>
  );
}

function MessageBubble({ msg, isNew = false }: { msg: ChatMessage & { ts?: string }; isNew?: boolean }) {
  const isUser = msg.role === 'user';
  let jsonData = null;

  if (!isUser) {
    try {
      const match = msg.content.match(/\{[\s\S]*\}/);
      if (match) {
        jsonData = JSON.parse(match[0]);
      }
    } catch (e) {
      // Not JSON
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#F97316] flex items-center justify-center text-[10px] text-white font-black flex-shrink-0 mr-4 mt-1 shadow-lg">AA</div>
      )}
      <div className={`max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-5 py-4 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm ${
            isUser
              ? 'bg-[#1A56DB] text-white rounded-br-none'
              : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
          }`}
        >
          {isUser ? (
            msg.content
          ) : jsonData ? (
            <AIRecommendationCard data={jsonData} />
          ) : isNew ? (
            <Typewriter text={msg.content} />
          ) : (
            msg.content
          )}
        </div>
        {msg.ts && <span className="text-[10px] text-slate-400 mt-2 px-1 font-bold uppercase tracking-widest opacity-60">{msg.ts}</span>}
      </div>
    </motion.div>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();

  const [messages, setMessages] = useState<(ChatMessage & { ts?: string; isNew?: boolean })[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const token = getSessionToken();
      if (!token) {
        setMessages([{
          ...WELCOME,
          ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        setHistoryLoaded(true);
        return;
      }
      try {
        const res = await api.get(`/chat/${token}/history`);
        const { messages: dbMessages, count } = res.data.data;
        if (count === 0) {
          setMessages([{
            ...WELCOME,
            ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }]);
        } else {
          setMessages(dbMessages.map((m: any) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
            ts: m.ts,
            isNew: false,
          })));
        }
      } catch {
        setMessages([{
          ...WELCOME,
          ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      } finally {
        setHistoryLoaded(true);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const token = getSessionToken();
    if (!token) {
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((p) => [...p, {
        role: 'assistant' as const,
        content: 'Please complete the bundle recommendation form first so I can personalise my responses for you.',
        ts,
      }]);
      return;
    }

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((p) => [...p, { role: 'user' as const, content: trimmed, ts }]);
    setInput('');
    setTyping(true);

    try {
      const res = await api.post('/chat/message', { sessionToken: token, message: trimmed });
      const { message: reply } = res.data.data;
      setMessages((p) => [...p, {
        role: 'assistant' as const,
        content: reply,
        ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true,
      }]);
    } catch (err: any) {
      const errorContent =
        err?.response?.data?.error ?? "I'm having trouble connecting. Please try again in a moment.";
      setMessages((p) => [...p, {
        role: 'assistant' as const,
        content: errorContent,
        ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const handleLogout = async () => {
    await authService.logout();
    authLogout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <PageTransition>
      <div className="h-screen flex bg-zinc-50 font-inter overflow-hidden">
        {authUser && (
          <DashboardSidebar 
            userName={authUser.name}
            companyName={authUser.companyName || 'Corporate Partner'}
            initials={getInitials(authUser.name)}
            onLogout={handleLogout}
          />
        )}

        <main className={`flex-1 ${authUser ? 'lg:ml-72' : ''} flex flex-col h-screen relative`}>
          {/* Header */}
          <header className="px-8 py-6 border-b border-slate-200 bg-white flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1A56DB]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-zinc-900 tracking-tight">AI Strategic Advisor</h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">Connected to Enterprise Brain</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Session Status</span>
                <span className="text-xs font-black text-emerald-600 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              </div>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 custom-scrollbar bg-slate-50/50">
            <div className="max-w-4xl mx-auto">
              {!historyLoaded && (
                <div className="flex justify-center py-20">
                  <TypingDots />
                </div>
              )}
              {historyLoaded && (
                <div className="space-y-4">
                  {messages.map((msg, i) => <MessageBubble key={i} msg={msg} isNew={msg.isNew} />)}
                </div>
              )}
              {typing && (
                <div className="flex justify-start mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#F97316] flex items-center justify-center text-[10px] text-white font-black flex-shrink-0 mr-4 mt-1 shadow-lg opacity-60">AA</div>
                  <div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-bl-none shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 lg:p-10 bg-white border-t border-slate-200">
            <div className="max-w-4xl mx-auto relative group">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about strategy, revenue, or bundle specifics..."
                rows={1}
                className="w-full pl-6 pr-16 py-5 rounded-[1.5rem] border border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 outline-none focus:bg-white focus:border-[#1A56DB] focus:ring-4 focus:ring-blue-500/5 transition-all resize-none shadow-inner"
                style={{ minHeight: '64px', maxHeight: '200px' }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                className={`absolute right-3 top-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  input.trim() && !typing 
                    ? 'bg-[#1A56DB] text-white shadow-xl shadow-blue-500/20' 
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="max-w-4xl mx-auto mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-1 h-1 rounded-full bg-slate-300" /> Stored securely
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-1 h-1 rounded-full bg-slate-300" /> Enter to send
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
