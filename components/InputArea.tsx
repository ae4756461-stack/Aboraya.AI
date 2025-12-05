import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex-shrink-0 transition-colors duration-300 z-20">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-100 dark:bg-slate-800 rounded-3xl p-2 border border-slate-300 dark:border-slate-700 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك لأبورية هنا..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 max-h-[150px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-none leading-relaxed"
            disabled={isLoading}
            dir="auto"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full flex-shrink-0 transition-colors ${
              !input.trim() || isLoading
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
            }`}
          >
            <SendHorizonal size={20} className={isLoading ? 'opacity-0' : ''} />
          </button>
        </form>
        <div className="text-center mt-2 text-xs text-slate-400 dark:text-slate-500">
          أبورية ممكن يغلط، راجع المعلومات المهمة.
        </div>
      </div>
    </div>
  );
};