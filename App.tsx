import React, { useState, useCallback, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { ChatInterface } from './components/ChatInterface';
import { InputArea } from './components/InputArea';
import { Message } from './types';
import { RefreshCw, Moon, Sun } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Dark Mode based on system preference or local storage
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create a placeholder for the bot response
    const botMessageId = uuidv4();
    const initialBotMessage: Message = {
      id: botMessageId,
      role: 'model',
      content: '', // Start empty
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, initialBotMessage]);

    try {
      let accumulatedText = '';
      const stream = geminiService.sendMessageStream(content);

      for await (const chunk of stream) {
        accumulatedText += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, content: accumulatedText }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to generate response", error);
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, content: "عذراً يا صاحبي، حصلت مشكلة صغيرة. جرب تاني بعد شوية.", isError: true }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    if (messages.length > 0 && window.confirm("تحب نبدأ صفحة جديدة؟")) {
      geminiService.resetChat();
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* ABORAYA Logo */}
          <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 p-2" fill="currentColor">
                  <path d="M30 80 L50 20 L70 80 M40 60 H60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M50 20 H70 C85 20 85 50 70 50 H50 M60 50 L80 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800 dark:text-white leading-tight tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>ABORAYA</h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-cairo tracking-wider">مساعدك الذكي</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={toggleTheme}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                title={isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
                onClick={handleReset}
                className={`p-2.5 rounded-full transition-all tooltip ${
                    messages.length > 0 
                    ? 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer' 
                    : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
                title="محادثة جديدة"
                disabled={messages.length === 0}
            >
                <RefreshCw size={20} />
            </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <ChatInterface 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={handleSendMessage}
        />
      </main>

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;