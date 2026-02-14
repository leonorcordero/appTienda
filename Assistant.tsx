
import React, { useState, useRef, useEffect } from 'react';
import { StockItem, Sale } from '../types';
import { analyzeStoreData } from '../services/geminiService';
import { ICONS } from '../constants';

interface AssistantProps {
  stock: StockItem[];
  sales: Sale[];
}

const Assistant: React.FC<AssistantProps> = ({ stock, sales }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: '¡Bienvenida a Se Libre! ✨ Soy tu guía de Luz Interna. ¿En qué puedo iluminar tu negocio hoy?' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    const aiResponse = await analyzeStoreData(stock, sales, userText);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-5 px-1 py-4 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-tr-none shadow-lg shadow-emerald-50 font-medium' 
                : 'bg-white border border-emerald-50 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-emerald-50/50 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {['Ventas de hoy', 'Stock por reponer', 'Resumen general'].map(hint => (
            <button 
              key={hint}
              onClick={() => setQuery(hint)}
              className="text-[10px] font-black bg-white text-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors border border-emerald-50 shadow-sm uppercase tracking-widest"
            >
              {hint}
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} className="relative group">
          <input 
            type="text" 
            placeholder="Escribe tu consulta..." 
            className="w-full pl-5 pr-14 py-4 bg-white border border-emerald-100 rounded-[1.8rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 text-sm transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-500 text-white rounded-2xl active:scale-90 transition-all shadow-md shadow-emerald-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
