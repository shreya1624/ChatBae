import React, { useState, useEffect } from 'react';
import type { Message, UserProfile } from '../types';
import { UserAvatar, BotIcon, EditIcon, CopyIcon, RegenerateIcon } from './Icons';

interface MessageProps {
  message: Message;
  messageIndex: number;
  isEditing: boolean;
  onStartEditing: (index: number) => void;
  onSaveEdit: (newContent: string) => void;
  onCancelEditing: () => void;
  isLoading?: boolean;
  userProfile: UserProfile;
  isLastUserMessage: boolean;
  onRegenerate: () => void;
  onCopyMessage: () => void;
}

const formatTimestamp = (timestamp: number): string => {
  const messageDate = new Date(timestamp);
  const now = new Date();

  const timeString = messageDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Today
  if (messageDate.toDateString() === now.toDateString()) {
    return `Today at ${timeString}`;
  }

  // Yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${timeString}`;
  }

  // This week (within last 7 days)
  const diffTime = Math.abs(now.getTime() - messageDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) {
     return `${messageDate.toLocaleDateString('en-US', { weekday: 'long' })} at ${timeString}`;
  }

  // Older than a week
  return messageDate.toLocaleDateString('en-US');
};

export const ChatMessage: React.FC<MessageProps> = ({ message, messageIndex, isEditing, onStartEditing, onSaveEdit, onCancelEditing, isLoading, userProfile, isLastUserMessage, onRegenerate, onCopyMessage }) => {
  const isUser = message.role === 'user';
  const [editedContent, setEditedContent] = useState(message.content);

  useEffect(() => {
    if (isEditing) {
      setEditedContent(message.content);
    }
  }, [isEditing, message.content]);

  const handleSave = () => {
    if (editedContent.trim() && editedContent.trim() !== message.content) {
      onSaveEdit(editedContent.trim());
    } else {
      onCancelEditing(); // Cancel if content is empty or unchanged
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
    }
    if (e.key === 'Escape') {
        onCancelEditing();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-800 w-full">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
          <UserAvatar iconId={userProfile.iconId} className="w-5 h-5 text-white" />
        </div>
        <div className="flex-grow">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={Math.max(2, editedContent.split('\n').length)}
            autoFocus
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button onClick={onCancelEditing} className="px-3 py-1 text-sm text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-3 py-1 text-sm text-white bg-pink-600 hover:bg-pink-700 rounded-md transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (message.role === 'model' && isLoading && !message.content.trim()) {
    return (
      <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-700/50">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-pink-600">
          <BotIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2 pt-1.5">
            <span className="text-gray-400 italic">ChatBae is typing</span>
            <div className="flex items-center space-x-1 dot-bounce">
                <div className="w-2 h-2 bg-pink-400 rounded-full dot-1"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full dot-2"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full dot-3"></div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-start gap-4 p-4 rounded-lg ${isUser ? 'bg-gray-800' : 'bg-gray-700/50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : 'bg-pink-600'}`}>
        {isUser ? <UserAvatar iconId={userProfile.iconId} className="w-5 h-5 text-white" /> : <BotIcon className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-grow min-w-0">
        <div className="font-semibold text-gray-100 mb-1">
            {isUser ? userProfile.name : "ChatBae"}
        </div>
        <div className="whitespace-pre-wrap text-gray-200">
          {message.content}
        </div>
        <div className="flex items-center justify-between mt-2 h-5">
            {message.timestamp && (
                <time dateTime={new Date(message.timestamp).toISOString()} className="text-xs text-gray-400">
                    {formatTimestamp(message.timestamp)}
                </time>
            )}
            {isUser && (
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isLastUserMessage && (
                        <>
                            <button
                                onClick={onCopyMessage}
                                className="p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white"
                                aria-label="Copy message"
                                title="Copy message"
                            >
                                <CopyIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onRegenerate}
                                className="p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white"
                                aria-label="Regenerate response"
                                title="Regenerate response"
                            >
                                <RegenerateIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => onStartEditing(messageIndex)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white"
                        aria-label="Edit message"
                        title="Edit message"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};