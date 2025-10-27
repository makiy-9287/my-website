import React from 'react';
import { Message, Sender } from '../types';
import { CheckIcon } from './icons';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 rounded-lg shadow ${
          isUser
            ? 'bg-emerald-900 text-gray-200 rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        {message.image && (
            <img src={message.image} alt="user upload" className="rounded-lg mb-2 max-w-full h-auto" />
        )}
        {message.audio && (
            <audio controls src={message.audio} className="w-full h-10"></audio>
        )}
        {message.text && <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>}
        
        <div className="text-right text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
            {message.timestamp}
            {isUser && <CheckIcon className="w-4 h-4 text-blue-500" />}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;