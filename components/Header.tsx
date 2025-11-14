import React, { useState, useEffect } from 'react';
import { SearchIcon, LogoIcon, ShareIcon, EditIcon, CheckIcon, CloseIcon } from './Icons';

interface HeaderProps {
  isGenZMode: boolean;
  onToggleGenZMode: () => void;
  activeChatTitle: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onShareChat: () => void;
  activeChatId: string | null;
  onUpdateChatTitle: (id: string, newTitle: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ isGenZMode, onToggleGenZMode, activeChatTitle, searchTerm, onSearchChange, onShareChat, activeChatId, onUpdateChatTitle }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activeChatTitle);

  useEffect(() => {
    setEditedTitle(activeChatTitle);
    setIsEditingTitle(false);
  }, [activeChatTitle, activeChatId]);

  const handleSaveTitle = () => {
    if (activeChatId && editedTitle.trim()) {
        onUpdateChatTitle(activeChatId, editedTitle.trim());
    }
    setIsEditingTitle(false);
  }

  const handleCancelEdit = () => {
    setEditedTitle(activeChatTitle);
    setIsEditingTitle(false);
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-3 flex-shrink-0">
          <LogoIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-white hidden sm:block">
            ChatBae
          </h1>
        </div>
        <div className="flex items-center gap-2 group min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEdit();
              }}
              className="bg-gray-700 text-lg font-semibold text-gray-200 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
              autoFocus
            />
          ) : (
            <h2 className="text-lg font-semibold text-gray-300 truncate">{activeChatTitle}</h2>
          )}
          {activeChatId && (
            isEditingTitle ? (
              <>
                <button onClick={handleSaveTitle} className="p-1 text-green-400 hover:text-green-300 flex-shrink-0">
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button onClick={handleCancelEdit} className="p-1 text-red-400 hover:text-red-300 flex-shrink-0">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-gray-700 hover:text-white transition-opacity flex-shrink-0"
                aria-label="Edit chat title"
              >
                <EditIcon className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative w-full max-w-xs hidden md:block">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
        </div>
        
        <button
          onClick={onShareChat}
          disabled={!activeChatId}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Share chat"
          title="Share chat"
        >
          <ShareIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-4">
            <span className={`font-semibold transition-colors whitespace-nowrap ${isGenZMode ? 'text-pink-400' : 'text-gray-400'}`}>
            Gen Z Mode
            </span>
            <button
            onClick={onToggleGenZMode}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 ${
                isGenZMode ? 'bg-pink-600' : 'bg-gray-600'
            }`}
            >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                isGenZMode ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
        </div>
      </div>
    </div>
  );
};