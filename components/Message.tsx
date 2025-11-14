import React, { useState, useEffect } from 'react';
import type { Message } from '../types';
import { UserIcon, BotIcon, EditIcon } from './Icons';

interface MessageProps {
  message: Message;
  messageIndex: number;
  isEditing: boolean;
  onStartEditing: (index: number) => void;
  onSaveEdit: (newContent: string) => void;
  onCancelEditing: () => void;
}

export const ChatMessage: React.FC<MessageProps> = ({ message, messageIndex, isEditing, onStartEditing, onSaveEdit, onCancelEditing }) => {
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
          <UserIcon className="w-5 h-5 text-white" />
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

  return (
    <div className={`group flex items-start gap-4 p-4 rounded-lg ${isUser ? 'bg-gray-800' : 'bg-gray-700/50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : 'bg-pink-600'}`}>
        {isUser ? <UserIcon className="w-5 h-5 text-white" /> : <BotIcon className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-grow pt-1 whitespace-pre-wrap text-gray-200 min-w-0">
        {message.content}
      </div>
      {isUser && (
        <div className="flex-shrink-0">
            <button
                onClick={() => onStartEditing(messageIndex)}
                className="p-1 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-gray-700 hover:text-white transition-opacity"
                aria-label="Edit message"
            >
                <EditIcon className="w-4 h-4" />
            </button>
        </div>
      )}
    </div>
  );
};
