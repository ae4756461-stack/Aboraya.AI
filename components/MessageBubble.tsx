import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] ${isUser ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
        
        {/* Avatar */}
        {isUser ? (
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <User size={18} />
             </div>
        ) : (
             <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-800">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                    <path d="M30 80 L50 20 L70 80 M40 60 H60" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
            </div>
        )}

        {/* Bubble Content */}
        <div 
          className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden
            ${isUser 
              ? 'bg-blue-600 text-white rounded-tr-none whitespace-pre-wrap' 
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none rtl:prose-p:text-right rtl:prose-headings:text-right'
            }
            ${message.isError ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' : ''}
          `}
        >
          {isUser ? (
            <div>{message.content}</div>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};