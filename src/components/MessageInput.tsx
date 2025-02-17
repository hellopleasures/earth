'use client';

import { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input flex gap-2 p-2 ">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 text-sm py-2 border border-zinc-800 rounded-[20px] focus:outline-none focus:border-pink-500"
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="px-4 py-2 bg-blue-500 text-sm text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
