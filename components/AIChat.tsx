
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
        contents: userMsg,
        