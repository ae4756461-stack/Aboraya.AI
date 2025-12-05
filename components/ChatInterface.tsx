import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { Loader2, Bot, Lightbulb, Code, PenTool, Compass } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const suggestions = [
    {
      icon: <Lightbulb size={20} />,
      label: "أفكار جديدة",
      text: "اقترح عليا فكرة مشروع صغير ومربح من البيت"
    },
    {
      icon: <Code size={20} />,
      label: "تصحيح كود",
      text: "عندي كود React مش شغال، ممكن تساعدني أكتشف الغلطة؟"
    },
    {
      icon: <PenTool size={20} />,
      label: "كتابة إيميل",
      text: "اكتب إيميل رسمي لمديري بطلب فيه إجازة يومين"
    },
    {
      icon: <Compass size={20} />,
      label: "نصيحة عامة",
      text: "إزاي أقدر أنظم وقتي وأزود إنتاجيتي في الشغل؟"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 relative">
      <div className="max-w-3xl mx-auto space-y-6 pb-4 min-h-full flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow py-10 text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">منور يا غالي!</h2>
            <p className="text-slate-500 max-w-md text-lg mb-8">
              أنا "أبورية"، مساعدك الشخصي. جاهز أساعدك في أي حاجة، سواء شغل، برمجة، أو حتى دردشة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-2">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSendMessage(item.text)}
                  className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-md hover:bg-emerald-50/30 transition-all text-right group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex-shrink-0 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-slate-700 text-sm group-hover:text-emerald-700 transition-colors">{item.label}</span>
                    <span className="text-slate-500 text-xs mt-1 text-right line-clamp-1">{item.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex w-full justify-end">
                 <div className="flex max-w-[85%] flex-row-reverse gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Bot size={18} />
                    </div>
                    <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600 ml-2" />
                      <span className="text-slate-500 text-sm">أبورية بيفكر...</span>
                    </div>
                 </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};