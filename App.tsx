import React, { useState, useCallback } from 'react';
import { geminiService } from './services/geminiService';
import { ChatInterface } from './components/ChatInterface';
import { InputArea } from './components/InputArea';
import { Message } from './types';
import { Bot, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center text-white shadow-md">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-tight">أبورية</h1>
            <p className="text-xs text-slate-500 font-medium">مساعدك الذكي المخلص</p>
          </div>
        </div>
        
        <button 
          onClick={handleReset}
          className={`p-2 rounded-full transition-all tooltip ${
            messages.length > 0 
              ? 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="محادثة جديدة"
          disabled={messages.length === 0}
        >
          <RefreshCw size={20} />
        </button>
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