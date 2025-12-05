import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        {/* Bubble Content */}
        <div 
          className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden
            ${isUser 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }
            ${message.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}
          `}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className="prose prose-sm md:prose-base prose-slate max-w-none rtl:prose-p:text-right rtl:prose-headings:text-right">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};