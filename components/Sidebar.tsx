
import React, { useState, useEffect, useRef } from 'react';
import type { Chat, UserProfile } from '../types';
import { NewChatIcon, EditIcon, CheckIcon, CloseIcon, ThreeDotsIcon, PinIcon, TrashIcon, UserAvatar } from './Icons';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onUpdateChatTitle: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onTogglePinChat: (id: string) => void;
  isNewChatDisabled: boolean;
  userProfile: UserProfile;
  onOpenProfile: () => void;
}

const ChatListItem: React.FC<{
    chat: Chat;
    isActive: boolean;
    isEditing: boolean;
    editingTitle: string;
    onSelect: () => void;
    onStartEditing: () => void;
    onCancelEditing: () => void;
    onSaveEditing: () => void;
    setEditingTitle: (title: string) => void;
    onMenuToggle: () => void;
}> = ({ chat, isActive, isEditing, editingTitle, onSelect, onStartEditing, onCancelEditing, onSaveEditing, setEditingTitle, onMenuToggle }) => {
    
    if (isEditing) {
        return (
            <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-md">
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onSaveEditing();
                    if (e.key === 'Escape') onCancelEditing();
                }}
                className="flex-grow bg-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                autoFocus
              />
              <button onClick={onSaveEditing} className="p-1 text-green-400 hover:text-green-300 flex-shrink-0">
                <CheckIcon className="w-5 h-5" />
              </button>
              <button onClick={onCancelEditing} className="p-1 text-red-400 hover:text-red-300 flex-shrink-0">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
        )
    }

    return (
        <div className="group flex items-center justify-between gap-1">
            <button
                onClick={onSelect}
                className={`flex items-center gap-3 flex-grow text-left pr-3 py-2.5 rounded-md truncate transition-colors w-full ${
                isActive 
                    ? 'pl-2.5 border-l-2 border-pink-500 bg-gray-700/80 text-white font-medium' 
                    : 'pl-3 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
                {chat.isPinned && <PinIcon className="w-4 h-4 text-pink-400 flex-shrink-0" />}
                <span className="truncate text-sm">{chat.title}</span>
            </button>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button 
                    onClick={onMenuToggle}
                    className="p-1.5 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-gray-700/50 hover:text-white focus:opacity-100 transition-opacity flex-shrink-0"
                    aria-label="Chat options"
                >
                    <ThreeDotsIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onNewChat, onSelectChat, onUpdateChatTitle, onDeleteChat, onTogglePinChat, isNewChatDisabled, userProfile, onOpenProfile }) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStartEditing = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
    setOpenMenuId(null);
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

  const handleMenuAction = (action: () => void) => {
    action();
    setOpenMenuId(null);
  };

  const renderChatList = (chatList: Chat[]) => (
    <ul className="space-y-1">
        {chatList.map(chat => (
        <li key={chat.id} className="relative">
            <ChatListItem
                chat={chat}
                isActive={activeChatId === chat.id}
                isEditing={editingChatId === chat.id}
                editingTitle={editingTitle}
                onSelect={() => onSelectChat(chat.id)}
                onStartEditing={() => handleStartEditing(chat)}
                onCancelEditing={handleCancelEditing}
                onSaveEditing={handleSaveEditing}
                setEditingTitle={setEditingTitle}
                onMenuToggle={() => setOpenMenuId(openMenuId === chat.id ? null : chat.id)}
            />
            {openMenuId === chat.id && (
            <div ref={menuRef} className="absolute right-0 top-11 z-20 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1.5">
                <button onClick={() => handleMenuAction(() => handleStartEditing(chat))} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800">
                <EditIcon className="w-4 h-4" />
                Rename
                </button>
                <button onClick={() => handleMenuAction(() => onTogglePinChat(chat.id))} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800">
                <PinIcon className="w-4 h-4" />
                {chat.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <div className="h-px bg-gray-700 my-1"></div>
                <button onClick={() => handleMenuAction(() => onDeleteChat(chat.id))} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300">
                <TrashIcon className="w-4 h-4" />
                Delete
                </button>
            </div>
            )}
        </li>
        ))}
    </ul>
  );

  return (
    <div className="bg-gray-900/70 backdrop-blur-lg w-full md:w-80 flex flex-col h-screen p-3 border-r border-gray-700/50">
      <button
        onClick={onNewChat}
        disabled={isNewChatDisabled}
        className="flex items-center justify-center gap-2.5 w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-white font-semibold transition-all duration-200 mb-4 shadow-lg shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 transform hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <NewChatIcon className="w-5 h-5" />
        New Chat
      </button>

      <div className="flex-grow overflow-y-auto custom-scrollbar -mr-2 pr-2">
        {chats.length === 0 ? (
            <div className="text-center text-gray-500 text-sm mt-8 px-4">
                <p>No chats yet.</p>
                <p className="mt-1">Start a conversation to begin!</p>
            </div>
        ) : (
            renderChatList(chats)
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <button 
            onClick={onOpenProfile}
            className="flex items-center gap-3 w-full p-2 rounded-lg text-left text-white hover:bg-gray-800 transition-colors"
        >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 flex-shrink-0">
                <UserAvatar iconId={userProfile.iconId} className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold truncate">{userProfile.name}</span>
        </button>
      </div>
    </div>
  );
};
