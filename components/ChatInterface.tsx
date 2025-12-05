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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 relative scroll-smooth transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6 pb-4 min-h-full flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow py-10 text-center animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 animate-pulse-slow">
               {/* Large Logo */}
               <svg viewBox="0 0 100 100" className="w-14 h-14 text-emerald-600 dark:text-emerald-400" fill="currentColor">
                    <path d="M30 80 L50 20 L70 80 M40 60 H60" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M50 20 H70 C85 20 85 50 70 50 H50 M60 50 L80 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3 font-cairo">منور يا غالي!</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg mb-8">
              أنا "أبورية" (ABORAYA)، مساعدك الشخصي. جاهز أساعدك في أي حاجة، سواء شغل، برمجة، أو حتى دردشة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-2">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSendMessage(item.text)}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md hover:bg-emerald-50/30 dark:hover:bg-slate-800 transition-all text-right group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{item.label}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs mt-1 text-right line-clamp-1">{item.text}</span>
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
              <div className="flex w-full justify-end animate-fade-in">
                 <div className="flex max-w-[85%] flex-row-reverse gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-800">
                        <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                             <path d="M30 80 L50 20 L70 80 M40 60 H60" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                    </div>
                    <div className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600 dark:text-emerald-500 ml-2" />
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">أبورية بيكتب...</span>
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