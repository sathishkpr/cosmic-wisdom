
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { HoroscopeData, Language } from '../types';

interface AIChatProps {
  horoscope: HoroscopeData;
  language: Language;
}

const AIChat: React.FC<AIChatProps> = ({ horoscope, language }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'dummy_key' });
      const context = `
        User Horoscope Context:
        Name: ${horoscope.name}
        Lagna: ${horoscope.lagna.signName_ta}
        Rasi: ${horoscope.panchang.tithi}
        Nakshatra: ${horoscope.panchang.nakshatra}
        Yogas: ${horoscope.yogas.map(y => y.name).join(', ')}
        Doshas: ${horoscope.doshas.map(d => d.name).join(', ')}
      `;

      // Use systemInstruction in the config for better persona control
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            {
                role: 'user',
                parts: [{ text: context + "\n\n" + userMsg }]
            }
        ]
      });

      const reply = response.response.text();
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process your request." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border-2 border-amber-100 p-6 shadow-sm h-[500px] flex flex-col">
      <h3 className="text-xs font-black text-red-950 border-b border-amber-100 pb-4 uppercase tracking-[0.4em] text-center mb-4">
        ✨ AI Astrologer
      </h3>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-amber-900/40 text-sm mt-20">
            <p>Ask me anything about this horoscope...</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-red-900 text-white rounded-br-none'
                : 'bg-amber-50 text-amber-900 rounded-bl-none border border-amber-100'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-amber-50 text-amber-900 p-4 rounded-2xl rounded-bl-none border border-amber-100 flex gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl outline-none focus:border-red-500 text-sm text-amber-900 placeholder-amber-900/30 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 py-3 bg-red-900 text-white rounded-xl hover:bg-red-800 disabled:opacity-50 transition-colors"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default AIChat;
