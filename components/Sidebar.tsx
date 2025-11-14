import React, { useState } from 'react';
import type { Chat } from '../types';
import { NewChatIcon, EditIcon, CheckIcon, CloseIcon } from './Icons';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onUpdateChatTitle: (id: string, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onNewChat, onSelectChat, onUpdateChatTitle }) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartEditing = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleCancelEditing = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };

  const handleSaveEditing = () => {
    if (editingChatId && editingTitle.trim()) {
      onUpdateChatTitle(editingChatId, editingTitle.trim());
    }
    handleCancelEditing();
  };


  return (
    <div className="bg-gray-800 w-full md:w-80 flex flex-col h-screen p-4 border-r border-gray-700">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg text-white font-semibold transition-colors mb-4 shadow-md"
      >
        <NewChatIcon className="w-6 h-6" />
        New Chat
      </button>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <ul className="space-y-2">
          {chats.map(chat => (
            <li key={chat.id}>
              {editingChatId === chat.id ? (
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEditing();
                        if (e.key === 'Escape') handleCancelEditing();
                    }}
                    className="flex-grow bg-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    autoFocus
                  />
                  <button onClick={handleSaveEditing} className="p-1 text-green-400 hover:text-green-300 flex-shrink-0">
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button onClick={handleCancelEditing} className="p-1 text-red-400 hover:text-red-300 flex-shrink-0">
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="group flex items-center justify-between gap-2">
                    <button
                        onClick={() => onSelectChat(chat.id)}
                        className={`flex-grow text-left px-4 py-2 rounded-lg truncate transition-colors ${
                        activeChatId === chat.id 
                            ? 'bg-gray-700 text-white' 
                            : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                    >
                        {chat.title}
                    </button>
                    <button 
                        onClick={() => handleStartEditing(chat)}
                        className="p-2 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-gray-700 hover:text-white transition-opacity flex-shrink-0"
                        aria-label="Edit chat title"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};